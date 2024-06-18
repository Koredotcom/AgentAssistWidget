import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-openai-config',
  templateUrl: './openai-config.component.html',
  styleUrls: ['./openai-config.component.scss']
})
export class OpenaiConfigComponent implements OnInit, OnChanges {

  @Input() integrations: any = {};
  @Output() closeEvent = new EventEmitter();
  @Output() saveSuccess = new EventEmitter();
  apiKey = new UntypedFormControl('', Validators.required);
  mode = 'create';
  constructor(
    private authService: AuthService,
    private service: ServiceInvokerService,
    private workflowService: workflowService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.patchForm();
  }
  ngOnInit(): void {
    this.patchForm()  
  }

  patchForm(){
    if(this.integrations.apiKey){
      this.mode = 'edit';
      this.apiKey.patchValue(this.integrations.apiKey);
    }
  }

  saveApi(){
    let params : any = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id
    };
    let payload = {
      "config": {
          "openai": {
              "apiKey": this.apiKey.value,
              "Guidelines": true
          }
      }
    };
    this.service.invoke('post.openApi', params, payload)
      .subscribe(res => {
        this.notificationService.notify(this.translate.instant('SUCCESSFULLY.UPDATED'), 'success');
        if(this.mode !== 'edit'){
          this.saveSuccess.emit(res)
        }
        this.closeEvent.emit(true);
      }, err => {
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
      });
  }
}
