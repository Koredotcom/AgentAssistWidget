import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';

import * as _ from 'underscore';
import { PALETTES } from '../../usecases/uc-main/uc-header/uc-header.model';
import { UsecasesMainService } from '../../usecases/uc-main/uc-main.service';
import { AgentAssistService } from '../agent-assist.service';
@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  styleUrls: ['./new-conversation.component.scss']
})
export class NewConversationComponent implements OnInit, OnDestroy {
  categoryList: any[] = [];
  streamId: string;
  filteredOptions: Observable<any[]>;
  selectedPallete: string;
  form: FormGroup;

  contextType: 'contacttoagent' | 'agenttocontact' = 'contacttoagent';

  subs = new SubSink();
  @Output() close = new EventEmitter();
  @ViewChild('aComp') autoC: ElementRef;
  @ViewChild('ucName') ucName: ElementRef;
  @ViewChild('autoCompleteInput') autoComplete: MatAutocompleteTrigger;
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public usecaseService: UsecasesMainService,
    private agentAssistService: AgentAssistService
  ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;

    this.form = new FormGroup({
      'usecaseName': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required)
    });
    const params = {
      streamId: this.streamId
    };
    this.subs.sink = this.service.invoke('get.categories', { streamId: this.streamId }, { isAgentAssistOnly: true })
      .subscribe(
        (res: any[]) => {
          res = res.filter(f => f.category?.toLowerCase() !== "no category");
          this.categoryList = res;
          this.filteredOptions = this.form.get('category').valueChanges.pipe(
            startWith(''),
            map((name: string) => name ? this._filter(name) : this.categoryList.slice())
          );
        },
        err => this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_FETCH_CATEGORIES")));
  }

  ngAfterViewInit() {
    fromEvent(this.autoC.nativeElement, 'blur')
      .pipe(
        distinctUntilChanged(),
        map((event: any) => event.target.value))
      .subscribe((value) => {
        if (this.doesCatExists(value.trim())) {
          this.onCategory(value);
          return;
        }
      });
    // this.ucName.nativeElement.focus();
  }

  doesCatExists(value: string) {
    return _.where(this.categoryList, { category: value }).length > 0
  }

  onCategory(selectedCategory: string) {
    if (selectedCategory) {
      this.selectedPallete = _.findWhere(this.categoryList, { category: selectedCategory }).colorCode;
    }
  }

  resetForm() {
    this.form.reset();
    this.selectedPallete = '';
  }

  getCPayload() {
    let payload = {
      category: this.form.value.category.trim(),
      colorCode: '',
    }
    if (this.categoryList.length > 23) {
      payload.colorCode = this.usecaseService.getRandomColor();
    } else {
      payload.colorCode = PALETTES[this.categoryList.length];
    }
    return payload;
  }

  createCategory(event: any, prior?: boolean) {
    if (!this.form.value.category) { return; }
    this.autoComplete.closePanel();
    if (_.where(this.categoryList, { category: this.form.value.category.trim() }).length > 0) {
      this.onCategory(this.form.value.category.trim());
      return;
    }
    let params = {
      streamId: this.streamId
    };
    let payload = this.getCPayload();

    this.service.invoke('post.createCategory', params, payload)
      .subscribe(res => {
        this.notificationService.notify('"' + payload.category + '"' + this.translate.instant("USECASES.CAT_CREATED_SUCCESSFULLY"), 'success');
        this.selectedPallete = payload.colorCode;
        this.categoryList.push(payload);
      }, err => {
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
      });
  }

  createConversation(keepWindow: boolean) {
    let params = { streamId: this.streamId };
    let ucPayload = {
      usecaseType: 'dialog',
      usecaseName: this.form.value.usecaseName.trim(),
      category: this.autoC.nativeElement.value,
      categoryColor: this.selectedPallete,
      isAgentAssistOnly: true
    }
    this.service.invoke('post.createUsecase', params, ucPayload).subscribe(res => {
      this.agentAssistService.addUsecase(res);
      this.notificationService.notify(this.translate.instant("USECASES.ADDED") + " " + ucPayload.usecaseName + this.translate.instant("USECASES.USECASE_SPACE") + " ", 'success');
      if (keepWindow) {
        this.resetForm();
        this.ucName.nativeElement.focus();
      } else {
        this.onClose();
      }
    }, err => {
      this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_UC"));
    });
  }


  onClose() {
    this.close.emit();
  }

  onSave(keepWindow: boolean) {
    if (!this.form.value.usecaseName.trim()) {
      this.notificationService.notify(this.translate.instant('USECASES_INVALID_NAME'), 'error');
      return;
    }
    if (this.doesCatExists(this.autoC.nativeElement.value.trim())) {
      this.createConversation(keepWindow);
    } else {
      let params = {
        streamId: this.streamId
      };
      let payload = this.getCPayload();
      this.service.invoke('post.createCategory', params, payload)
        .subscribe(res => {
          this.selectedPallete = payload.colorCode;
          this.categoryList.push(payload);
          this.createConversation(keepWindow);
        }, err => {
          this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
    }
    if (!keepWindow) this.onClose();
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.categoryList.filter(option => option.category.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
