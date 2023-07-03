import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { CoachingGroupRuleDeleteComponent } from '../coaching-group-rule-delete/coaching-group-rule-delete.component';
import { COACHINGCNST } from '../coaching.cnst';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-coaching-group-create',
  templateUrl: './coaching-group-create.component.html',
  styleUrls: ['./coaching-group-create.component.scss']
})
export class CoachingGroupCreateComponent implements OnInit, AfterViewInit {
  
  @Input() type : any;
  @Input() groupData : any;
  @Output() onClose = new EventEmitter();
  @Output() updateGroup = new EventEmitter();

  modalRef:any;


  createGroupForm : FormGroup;
  coachingConst : any = COACHINGCNST;
  selAcc = this.local.getSelectedAccount();

  constructor(private modalService: NgbModal, private workflowService : workflowService, private service : ServiceInvokerService,
    private notificationService : NotificationService, private translate: TranslateService, private auth: AuthService, private local: LocalStoreService) { }
  
  ngAfterViewInit(): void {

  }


  ngOnInit(): void {
    this.createFormGroup(null);
  }

  ngOnChanges(changes : SimpleChange) {
    if(this.groupData){
      this.createFormGroup(this.groupData);
    }
  }

  createFormGroup(data){
    this.createGroupForm = new FormGroup({
      'name' : new FormControl(data?.name || '',[Validators.required]),
      'description' : new FormControl(data?.description || '')
    }); 
  }

  closeGroup(group?) {
    this.onClose.emit(group);
  }

  onSubmit(){
    if(this.type == this.coachingConst.CREATE){
      this.createOrUpdateGroupApiCall("post.agentCoachingGroup");
    }else if(this.type == this.coachingConst.EDIT){
      this.createOrUpdateGroupApiCall("put.agentCoachingGroup");
    }
  }

  createOrUpdateGroupApiCall(serviceName){

    let payload : any = {
      "name": this.createGroupForm.controls.name.value,
      "description": this.createGroupForm.controls.description.value,
      "displayName": this.createGroupForm.controls.name.value,
      "botId": this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id
      // "botId": this.workflowService.getCurrentBt(true)._id
    }
    let updateGroupObj : any = {
        type : this.type
    }
    this.service.invoke(serviceName, {groupId : this.groupData._id}, payload).subscribe(data => {
      if (data) {
        updateGroupObj.data = data;
        this.updateGroup.emit(updateGroupObj); 
        this.closeGroup();
        let notificationName = (this.type == this.coachingConst.CREATE) ? "COACHING.GROUPCREATED_SUCCESS" : "COACHING.GROUPUPDATED_SUCCESS";
        this.notificationService.notify(this.translate.instant(notificationName), 'success');
      }
    },(error)=> {
      let notificationName = (this.type == this.coachingConst.CREATE) ? "COACHING.GROUPCREATED_FAILURE" : "COACHING.GROUPUPDATED_FAILURE";
      this.notificationService.showError(this.translate.instant(notificationName));
    });
  }


  openDeleteGroup() {
    this.closeGroup();
		this.modalRef = this.modalService.open(CoachingGroupRuleDeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = {
      title : "Delete Group",
      desc : "Are you sure you want to delete group '" + this.createGroupForm.controls.name.value + "'? All the rules under the group will be deleted.",
      type : COACHINGCNST.GROUP,
      groupId : this.groupData._id
    };
    this.modalRef.result.then(res => {
      if(res){
        this.service.invoke('delete.agentCoachingGroup', {groupId : res}).subscribe(data => {
          let updateGroupObj : any = {
            type : COACHINGCNST.DELETE,
            data : data
          }  
          this.updateGroup.emit(updateGroupObj);
          this.notificationService.notify(this.translate.instant("COACHING.GROUPDELETE_SUCCESS"), 'success');
        },(error)=>{
          this.notificationService.showError(this.translate.instant("COACHING.GROUPDELETE_FAILURE"));
        });
      }
      
    });
	}

}
