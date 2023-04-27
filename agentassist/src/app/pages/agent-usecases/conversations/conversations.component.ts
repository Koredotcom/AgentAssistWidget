import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { workflowService } from '@kore.services/workflow.service';
import { finalize } from 'rxjs/operators';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { SubSink } from 'subsink';
import { UsecaseParams } from '../../usecases/uc-main/uc-table-main/uc-table-main.model';
import * as _ from 'underscore';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnChanges, OnDestroy {
  streamId: any;
  showConversation: boolean = false;
  conversations: any[] = [];
  categories: any[] = [];
  readonly USECASES_LIMIT = 50;
  ucOffset: number = 0;
  isLoading: boolean = false;
  loaded: boolean = false;
  moreConvAvailable: boolean = false;
  currentConv: any;
  subs = new SubSink();
  groupBy: string;

  isCategoriesLoading = false;
  isStateLoading = false;
  noResults = false;
  appStatesList: any[] = [];
  defaultConfigs: any = {};

  tabActive: 'call' | 'chat' | '' = "";

  @Input() ucType: 'faq' | 'dialog' = 'faq';
  @Input() searchTerm: string = '';
  @Output() clearSearch = new EventEmitter();
  @ViewChild('newConvSlider', { static: true }) newConvSlider: SliderComponentComponent;
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt(true)._id;
    this.setAppStatusList();
    this.getUsecases();
    this.getCategories();
    this.workflowService.updateBotDetails$.subscribe((ele)=>{
      console.log(ele, "inside udpate use case");
      if(ele){
        this.getUsecases();
        this.getCategories();
      } 
    }) 
  }

  ngOnChanges() {
    this.streamId = this.workflowService.getCurrentBt(true)._id;
    this.getUsecases();
  }

  getUsecases(searchTerm?: string, pagination?: boolean) {
    this.searchTerm = searchTerm || '';
    this.ucOffset = pagination ? this.ucOffset + this.USECASES_LIMIT : 0;
    this.streamId = this.workflowService.getCurrentBt(true)._id;
    const params = {
      streamId: this.streamId,
      search: searchTerm || '',
      filterby: '',
      status: '',
      usecaseType: this.ucType,
      offset: this.ucOffset,
      limit: this.USECASES_LIMIT,
    }
    if (!this.loaded) this.isLoading = true;
    this.subs.sink = this.service.invoke('get.usecases', params, {})
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loaded = true;
        }))
      .subscribe((res) => {
        (res.usecases || []).forEach(uc => {
          uc.skills = uc?.triggerPoints?.skillMatchRules && this.bindSkills(uc.triggerPoints.skillMatchRules);
        });
        console.log(res.usecases)
        if (pagination) {
          this.conversations = [...this.conversations, ...res.usecases];
        } else {
          this.conversations = res.usecases;
        }
        this.moreConvAvailable = res.moreAvailable;
        this.defaultConfigs = res.defaultConfigs;
      }, err => {
        this.moreConvAvailable = false;
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_FETCH_UC"));
      });
  }

  getCategories() {
    const params = {
      streamId: this.streamId
    };
    this.subs.sink = this.service.invoke('get.categories', { streamId: this.streamId }, {})
      .subscribe((res: any[]) => {
        // res = res.filter(f => f.category?.toLowerCase() !== "no category");
        this.categories = res;
        this.noResults = !_.reduce(_.pluck(this.categories,  this.ucType === 'dialog' ? 'dialogCount' : 'faqCount'), (a, b) => a + b);
      },
        err => this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_FETCH_CATEGORIES"))
      );
  }

  deleteConversation(usecase: any) {
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
            if (Array.isArray(res) || res.hasOwnProperty('isDeleted') || this.ucType === 'faq') {
              this.removeConversation(res[0] || res);
            } else {
              this.updateConversation(res);
            }
            if (this.groupBy === 'category') {
              this.getCategories();
            } else if (this.groupBy === 'state') {
              this.setAppStatusList();
            }
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

  removeConversation(conv) {
    const index = this.conversations.findIndex(f => f['taskRefId'] === conv.taskRefId);
    if (index !== -1) {
      this.conversations.splice(index, 1);
    }
  }

  updateConversation(conv) {
    const index = this.conversations.findIndex(f => f['taskRefId'] === conv.taskRefId);
    if (index !== -1) {
      this.conversations.splice(index, 1, conv);
    }
  }


  openConversation(conv = null, tab: any = '') {
    this.showConversation = true;
    this.currentConv = conv;
    this.tabActive = tab;
    if (this.searchTerm) {
      this.clearSearch.emit();
      this.getUsecases();
      // this.getCategories();
    }
    this.newConvSlider.openSlider("#newConv", "width940");
  }

  closeConversation(conv) {
    this.newConvSlider.closeSlider('#newConv');
    this.showConversation = false;
    this.currentConv = null;

    if (conv) {

      if (conv.triggerPoints) {
        conv.skills = this.bindSkills(conv.triggerPoints.skillMatchRules);
      }
      const index = this.conversations.findIndex(f => f['taskRefId'] === conv.taskRefId);
      if (index === -1) {
        this.conversations.unshift(conv);
      } else {
        this.conversations.splice(index, 1, conv);
      }
      if (this.groupBy === 'category') {
        this.getCategories();
      } else if (this.groupBy === 'state') {
        this.setAppStatusList();
      }
    }

  }

  onReachEnd() {
    if (this.moreConvAvailable) {
      this.getUsecases(null, true);
    }
  }

  onGroupBy(s) {
    this.groupBy = s;
    if (this.groupBy === 'category') {
      this.getCategories();
      this.setAppStatusList();
    }
  }

  expandCat(c?) {
    const params = new UsecaseParams(this.streamId, "", c.category, "", this.ucType, 0, 500, false);
    const qParmas = {}
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
    const params = new UsecaseParams(this.streamId, "", "", c.id, this.ucType, 0, 500, false);
    const qParmas = {}
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

  bindSkills(skills) {
    let arr: any = _.pluck(skills, "steps");
    let arr2: any = _.flatten(_.pluck(_.flatten(arr, 2), "valueDetails"));
    let arr3: any = [];
    let groupedSkills = _.groupBy(arr2, "color");
    _.forEach(groupedSkills, function (list, key) {
      let obj: any = {};
      obj["color"] = list[0]?.color;
      obj["value"] = _.pluck(list, "name").join(" | ");
      arr3.push(obj);
    });
    return arr3;
  }


  ngOnDestroy() {
    this.subs.unsubscribe();

  }

}
