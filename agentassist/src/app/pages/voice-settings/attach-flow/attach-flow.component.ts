import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-attach-flow',
  templateUrl: './attach-flow.component.html',
  styleUrls: ['./attach-flow.component.scss']
})
export class AttachFlowComponent implements OnInit {
  @Input() isUpdate;
  @Input() voiceContactDetails;
  @Input() callFlowVoiceList;
  @Output() closed = new EventEmitter();
  @Output() emitUpdate = new EventEmitter();
  selectedFlow;
  saveInProgress: boolean;
  constructor(
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private workflowService: workflowService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    console.log(this.isUpdate);
    for (let info of this.callFlowVoiceList) {
      const callFlowDetails = this.voiceContactDetails.data.callFlowDetails?.find(f => f.didNumber === this.voiceContactDetails.data.selectedDIDNumber);
      if(info._id === this.voiceContactDetails.selectedFlow){
        info['isChecked'] = true;
      }else{
        info['isChecked'] = false;
      }
      if (info._id === callFlowDetails?._id) {
        this.selectedFlow = info;
      }
    }
    
    console.log(this.callFlowVoiceList);
  }

  attachSelectedFlow(flowData) {
    this.selectedFlow = flowData;
  }

  close(data?: boolean) {
    this.closed.emit(data);
  }

  attachFlow() {
    console.log(this.voiceContactDetails);
    const qParams = {
      streamId: this.workflowService.getCurrentBt()._id,
      callflowId: this.selectedFlow._id
    }

    const params = {
      // "phoneNumber": this.voiceContactDetails?.type === 'SIP' ? (this.voiceContactDetails?.data?.selectedDIDNumber || this.voiceContactDetails?.data?.didNumber[0]) : this.voiceContactDetails?.data?.phoneNumber,
      "phoneNumber": this.voiceContactDetails?.type === 'SIP' ? (this.voiceContactDetails?.data?.selectedDIDNumber) : (this.voiceContactDetails?.data?.phoneNumber),
      "countryCode": this.voiceContactDetails?.data?.countryCode
    }


    this.saveInProgress = true;
    if(this.isUpdate) {
      this.service.invoke('update.flows.attachPh', qParams, params)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        this.notificationService.notify('Updated The Flow Attachment Successfully!', 'success');
        this.close(this.voiceContactDetails);
        this.emitUpdate.emit(false);
      }, err => {
        this.notificationService.showError(err);
      })
    } else {
      this.service.invoke('post.flows.attachPh', qParams, params)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        this.notificationService.notify('Flow Attached Successfully!', 'success');
        this.close(this.voiceContactDetails);
      }, err => {
        this.notificationService.showError(err);
      })
    }
    // this.service.invoke('post.flows.attachPh', qParams, params)
    //   .pipe(finalize(() => this.saveInProgress = false))
    //   .subscribe(res => {
    //     this.notificationService.notify('Flow Attached Successfully!', 'success');
    //     this.close(this.voiceContactDetails);
    //   }, err => {
    //     this.notificationService.showError(err);
    //   })
  }

  navigateToNewFlowSlider(){
   // this.usecasesMainService.isInFlowComponent = true;
    this.router.navigate(['/config/flows'], { queryParams: { options: 'flow'}, skipLocationChange:true});
  }

}
