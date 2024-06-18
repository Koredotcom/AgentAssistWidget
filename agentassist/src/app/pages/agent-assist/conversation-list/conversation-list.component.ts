import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@kore.services/notification.service';
import { workflowService } from '@kore.services/workflow.service';
import { debounceTime, distinctUntilChanged, finalize, map, startWith } from 'rxjs/operators';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { AgentAssistService } from '../agent-assist.service';
import { fromEvent, Observable } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatMenuTrigger } from '@angular/material/menu';
import { SubSink } from 'subsink';
import { UntypedFormControl } from '@angular/forms';
import * as _ from 'underscore';
import { Category, UsecaseOb, UsecaseParams } from '../../usecases/uc-main/uc-table-main/uc-table-main.model';
import { PALETTES } from '../../usecases/uc-main/uc-header/uc-header.model';
import { UsecasesMainService } from '../../usecases/uc-main/uc-main.service';
@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ConversationListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading: boolean = false;
  loaded: boolean = false;
  streamId: any;
  usecases: any[] = [];
  categories: any[] = [];
  filteredCategories: Observable<any[]>;
  categorySearchControl = new UntypedFormControl('');
  selectedPallete: string = '';
  numbers = [];
  showConfigSlider: boolean = false;
  showUserUtterancesSlider: boolean = false;
  selectedUsecase: any;
  readonly USECASES_LIMIT = 50;
  isGrouped: boolean = false;
  groupBy: string = '';
  selectedGroup = this.translate.instant("USECASES.GROUP_BY");
  ucOffset = 0;

  isCategoriesLoading = false;
  isStateLoading = false;
  noResults = false;
  appStatesList: any[] = [];

  @ViewChild('configSlider', { static: true }) configSlider: SliderComponentComponent;
  @ViewChild('searchTerm') searchTerm: ElementRef<HTMLElement>;
  @ViewChild('autoCompleteInput') autoComplete: MatAutocompleteTrigger;
  @ViewChild('aComp') autoC: ElementRef;
  @ViewChildren('ucNameUpdateTrigger', { read: MatMenuTrigger }) ucNameUpdateTrigger: QueryList<MatMenuTrigger>;
  @ViewChild('userUtterancesSlider', { static: true }) userUtterancesSlider: SliderComponentComponent;
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dialog: MatDialog,
    public agentAssistService: AgentAssistService,
    private usecaseService: UsecasesMainService,
  ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.numbers = Array(20).fill(4);
    // this.getUsecases();
    this.agentAssistService.isUCGrouped = false;
    this.setAppStatusList();
    this.subs.sink = this.agentAssistService.usecases$.subscribe(usecases => {
      if (usecases === null) { this.getUsecases(); return }
      this.usecases = usecases;
    });
    this.subs.sink = this.agentAssistService.categories$.subscribe(categories => {
      if (categories === null) { this.getCategories(); return }
      this.categories = categories.map(e => {
        e['usecases'] = e['usecases'] || [];
        return e;
      })

    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      fromEvent(this.searchTerm.nativeElement, 'input')
        .pipe(
          map((event: any) => event.target.value),
          debounceTime(500),
          distinctUntilChanged())
        .subscribe((val) => {
          this.getUsecases(val);
        });
    }, 100);
    // this.iSearch.nativeElement.focus();
  }


  getUsecases(searchTerm?: string, pagination?: boolean) {
    this.ucOffset = pagination ? this.ucOffset + this.USECASES_LIMIT : 0;
    const params = {
      streamId: this.streamId,
      search: searchTerm || '',
      filterby: '',
      status: '',
      usecaseType: 'dialog',
      offset: this.ucOffset,
      limit: this.USECASES_LIMIT,
    }
    if (!this.loaded) this.isLoading = true;
    this.service.invoke('get.usecases', params, { isAgentAssistOnly: true })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loaded = true;
        }))
      .subscribe((res) => {
        if (pagination) {
          this.usecases = [...this.usecases, ...res.usecases];
        } else {
          this.usecases = res.usecases;
        }
        this.agentAssistService.usecases$.next(this.usecases);
        this.agentAssistService.moreUCAvailable = res.moreAvailable;
      }, err => {
        this.agentAssistService.moreUCAvailable = false;
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_FETCH_UC"));
      });
  }

  getCategories() {
    const params = {
      streamId: this.streamId
    };
    this.subs.sink = this.service.invoke('get.categories', { streamId: this.streamId }, { isAgentAssistOnly: true })
      .subscribe((res: any[]) => {
        res = res.filter(f => f.category?.toLowerCase() !== "no category");
        this.categories = res;
        this.agentAssistService.categories$.next(res);
        this.noResults = !_.reduce(_.pluck(this.categories, 'dialogCount'), (a, b) => a + b)
      },
        err => this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_FETCH_CATEGORIES"))
      );
  }

  updateQues(str: string, uc: any) {
    if (!str) {
      this.notificationService.notify(this.translate.instant("USECASES.PLS_ENTER"), 'error');
      return;
    } else {
      // const oPrimary = uc.utterances.primary;
      // uc.utterances.primary.text = str;
      const payload = JSON.parse(JSON.stringify(uc));
      payload.usecaseName = str;
      const params = {
        streamId: this.streamId,
        usecaseId: uc.taskRefId
      }
      this.service.invoke('post.editUsecase', params, payload).subscribe(res => {
        // this.ucTableService.ucUpdated$.next(res);
        uc.usecaseName = str;
        this.agentAssistService.updateUsecase(res);
        if (this.isGrouped) this.setAppStatusList();
        this.notificationService.notify(this.translate.instant("USECASES.UC_SUCCESS"), "success");
        // this.closeDD();
      }, err => {
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_UPDATE_UC"));
      });
    }
  }

  getCPayload() {
    let payload = {
      category: this.autoC.nativeElement.value.trim(),
      colorCode: ''
    }
    if (this.categories.length > 23) {
      payload.colorCode = this.usecaseService.getRandomColor();
    } else {
      payload.colorCode = PALETTES[this.categories.length];
    }
    return payload;
  }

  createCategory(event: any) {
    if (event.which == '13') {
      if (!this.autoC.nativeElement.value) {
        return;
      }
      this.autoComplete.closePanel();
      if (_.where(this.categories, { category: this.autoC.nativeElement.value.trim() }).length > 0) {
        this.onCategory(this.autoC.nativeElement.value.trim());
        return;
      }
      let params = {
        streamId: this.streamId,
        'isAgentAssist':true
      };
      let payload = <Category>this.getCPayload();
      this.service.invoke('post.createCategory', params, payload).subscribe(
        res => {
          this.notificationService.notify('"' + payload.category + ' "' + this.translate.instant("USECASES.CAT_CREATED_SUCCESSFULLY"), 'success');
          this.selectedPallete = payload.colorCode;
          this.categories.push(payload);
          this.agentAssistService.categories$.next(this.categories);
        }, err => {
          this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
    }
  }

  updateCategory(uc) {
    const self = this;
    const categoryVal = this.autoC.nativeElement.value.trim();
    function update() {
      let temp = JSON.parse(JSON.stringify(uc));
      temp.category = categoryVal;
      temp.categoryColor = _.findWhere(self.categories, { category: categoryVal }).colorCode;
      const params = {
        streamId: self.streamId,
        usecaseId: uc.taskRefId
      }
      self.service.invoke('post.editUsecase', params, temp).subscribe(res => {
        self.notificationService.notify(self.translate.instant("USECASES.UC_SUCCESS"), "success");
        uc.category = temp.category;
        uc.categoryColor = temp.categoryColor;
        self.agentAssistService.updateUsecase(res);
        if (self.isGrouped) this.setAppStatusList();
      }, err => {
        self.notificationService.showError(err, self.translate.instant("USECASES.FAILED_UPDATE_UC"));
      })
    }
    if (_.where(this.categories, { category: this.autoC.nativeElement.value }).length > 0) {
      update();
    } else {
      let params = {
        streamId: this.streamId,
        'isAgentAssist':true
      };
      let payload = this.getCPayload();
      this.service.invoke('post.createCategory', params, payload)
        .subscribe(res => {
          this.selectedPallete = payload.colorCode;
          this.categories.push(payload);
          update();
        }, err => {
          this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
    }
  }



  ucDelete(usecase: any) {
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '446px',
      panelClass: "delete-uc",
      data: {
        title: this.translate.instant("USECASES.DEL_UC"),
        text: this.translate.instant("USECASES.R_U_SURE_DEL") + " \"" + usecase.usecaseName + " " + this.translate.instant("USECASES.USECASE") + "\" ?",
        buttons: [{ key: 'yes', label: this.translate.instant("USECASES.YES"), type: 'danger' }, { key: 'no', label: this.translate.instant("USECASES.NO") }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const params = {
            streamId: this.streamId,
            usecaseId: usecase.taskRefId
          };
          const payload = {
            type: usecase.usecaseType,
            state: usecase.state
          };
          this.service.invoke('post.deleteUsecase', params, payload).subscribe((res: any) => {
            if (Array.isArray(res) || res.hasOwnProperty('isDeleted')) {
              this.agentAssistService.removeUsecase(res[0] || res);
            } else {
              this.agentAssistService.updateUsecase(res);
            }
            if (this.isGrouped) this.setAppStatusList();
            this.notificationService.notify(usecase.usecaseName + this.translate.instant("USECASES.HAS_DELETED"), 'success');
          }, err => {
            this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_UC"));
          });
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  onCategory(selectedCategory: string) {
    if (selectedCategory) {
      this.selectedPallete = _.findWhere(this.categories, { category: selectedCategory }).colorCode;
    }
  }

  closeConfigSlider($event) {
    this.showConfigSlider = false;
    this.configSlider.closeSlider("#configSlider");
  }
  openConfigSlider(usecase) {
    this.selectedUsecase = usecase;
    this.configSlider.openSlider("#configSlider", "width940");
    this.showConfigSlider = true;
  }

  openUserUtteranceslider() {
    this.userUtterancesSlider.openSlider("#userUtterances", "width940");
    this.showUserUtterancesSlider = true;
  }

  closeUserUtteranceSlider() {
    this.showUserUtterancesSlider = false;
    this.userUtterancesSlider.closeSlider("#userUtterances");
  }


  close(index) {
    // this.ucNameUpdateTrigger.toArray()[index]?.closeMenu();
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.categories.filter(option => option.category.toLowerCase().indexOf(filterValue) === 0);
  }

  updateUsecase(usecase, cb) {
    this.service.invoke('post.editUsecase', { streamId: this.streamId, usecaseId: usecase.taskRefId }, usecase).subscribe((res: UsecaseOb) => {
      if (res) {
        cb(res);
        // Check for any failed uttreances
        res.utterances.alternates = (res.utterances?.alternates || []).filter(e => e.status !== 'failed');
        this.notificationService.notify(this.translate.instant("USECASES.UC_UPDATED"), "success");
        this.agentAssistService.updateUsecase(res);
        if (this.isGrouped) this.setAppStatusList();
      } else {
        this.notificationService.notify(this.translate.instant("USECASES.UC_UNABLE"), "error");
        cb(false);
      }
    }, err => {
      this.notificationService.showError(err, this.translate.instant("USECASES.UC_FAILED"));
      cb(false);
    });
  }

  closeSlider($event) {
    let closeSliderMethod;
    switch ($event.type) {
      case "utterances":
        closeSliderMethod = "closeUserUtteranceSlider";
        break;
      case "faq":
        closeSliderMethod = "closeFaqConfigSlider";
        break;
      case "conversations":
        closeSliderMethod = "closeConfigSlider";
        break;
    }

    if ($event.saveOnClose) {
      this.updateUsecase($event.data, (isSuccess: UsecaseOb) => {
        if (isSuccess) {

          if (isSuccess.utterances && isSuccess.utterances.alternates.some(e => e.status === 'failed')) {
            return $event.cb(isSuccess);
          }

          $event.cb(true);
          this[closeSliderMethod]();
        } else {
          $event.cb(false);
        }
      })
    } else {
      this[closeSliderMethod]();
    }
  }

  openUserUtterance(usecase: UsecaseOb, index) {
    this.selectedUsecase = usecase;
    this.close(index);
    this.openUserUtteranceslider();
  }

  onReachEnd() {
    if (this.agentAssistService.moreUCAvailable) {
      this.getUsecases(null, true);
    }
  }

  selectGroup(s: string) {
    this.usecaseService.tabActive = 'dialog';
    if (s !== 'state') {
      if (s == 'category') {
        this.selectedGroup = this.translate.instant("USECASES.GROUP_BY") + " " + this.translate.instant('USECASES.CATEGORY');
      } else {
        this.selectedGroup = this.translate.instant("USECASES.GROUP_BY");
      }
    } else {
      this.selectedGroup = this.translate.instant("USECASES.GROUP_BY") + " " + this.translate.instant("USECASES.STATUS_SMALL");
    }
    this.isGrouped = true;
    this.agentAssistService.isUCGrouped = true;
    this.groupBy = s;
    if (s == "category") {
      // this.ucTableMainService.ucCategoriesUpdate$.next();
    }
  }


  expandCat(c?) {
    const params = new UsecaseParams(this.streamId, "", c.category, "", 'dialog', 0, 500, false);
    const qParmas = {
      isAgentAssistOnly: true
    }
    c.isLoading = true;
    this.service.invoke('get.usecases', params, qParmas)
      .pipe(finalize(() => {
        c.isLoading = false;
      }))
      .subscribe(res => {
        c.usecases = res.usecases;
      }, err => {
        this.notificationService.showError(err, "Failed to fetch usecases")
      });
  }

  expandState(c) {
    const params = new UsecaseParams(this.streamId, "", "", c.id, 'dialog', 0, 500, false);
    const qParmas = {
      isAgentAssistOnly: true
    }
    c.isLoading = true;
    this.service.invoke('get.usecases', params, qParmas)
      .pipe(finalize(() => {
        c.isLoading = false;
      }))
      .subscribe(res => {
        c.usecases = res.usecases;
      }, err => {
        this.notificationService.showError(err, "Failed to fetch usecases")
      });
  }

  setAppStatusList() {
    this.appStatesList = [{
      title: this.translate.instant("USECASES.IN_DEV"),
      id: 'configured',
      imgSrc: "assets/icons/status-clock.svg",
      usecases: []
    }, {
      title: this.translate.instant("USECASES.PUB"),
      id: 'published',
      imgSrc: "assets/icons/published.svg",
      usecases: []
    }];
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
