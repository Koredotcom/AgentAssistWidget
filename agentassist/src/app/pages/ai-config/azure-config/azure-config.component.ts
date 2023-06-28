import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-azure-config',
  templateUrl: './azure-config.component.html',
  styleUrls: ['./azure-config.component.scss']
})
export class AzureConfigComponent implements OnInit, OnChanges {
  @Input() integrations: any = {};
  @Output() closeEvent = new EventEmitter();
  @Output() successAzureObj = new EventEmitter();
  azureForm : FormGroup;
  mode = 'create';
  constructor(
    private service: ServiceInvokerService,
    private authService: AuthService,
    private workflowService: workflowService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.patchForm();
  }

  ngOnInit(): void {
    this.azureForm = new FormGroup(
      {
        "config": new FormGroup({
          "azure" : new FormGroup({
            "apiKey": new FormControl('', Validators.required),
            "tenant": new FormControl('', Validators.required),
            "modelConfig": new FormGroup({
              "GPT-3": new FormControl('', Validators.required)
            }),
            "Guidelines": new FormControl(true, Validators.required),
          })
        }),
      }
    );
    setTimeout(() => {
      this.patchForm();
    },10);
  }

  patchForm(){
    if(this.integrations?.apiKey){
      this.mode = 'edit';
      ((this.azureForm?.controls['config'] as FormGroup)?.controls['azure'] as FormGroup)?.patchValue(this.integrations);
    }
  }

  get getAzureForm(): FormGroup{
    return ((this.azureForm.controls['config'] as FormGroup).controls['azure'] as FormGroup)
  }

  saveAzure(){
    let params: any = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id
    };
    let payload = this.azureForm.value;
    this.service.invoke('post.azure', params, payload)
      .subscribe(res => {
        this.successAzureObj.emit(res);
        this.notificationService.notify(this.translate.instant('SUCCESSFULLY.UPDATED'), 'success');
      }, err => {
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
    });
  }
}
