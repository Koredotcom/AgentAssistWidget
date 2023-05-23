import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { CoachingGroupRuleDeleteComponent } from '../coaching-group-rule-delete/coaching-group-rule-delete.component';
import { COACHINGCNST } from '../coaching.cnst';

@Component({
  selector: 'app-coaching-group-create',
  templateUrl: './coaching-group-create.component.html',
  styleUrls: ['./coaching-group-create.component.scss']
})
export class CoachingGroupCreateComponent implements OnInit {
  
  @Input() type : any;
  @Input() groupData : any;
  @Output() onClose = new EventEmitter();
  @Output() updateGroup = new EventEmitter();

  modalRef:any;

  
  createGroupForm : FormGroup;
  coachingConst : any = COACHINGCNST;
  constructor(private modalService: NgbModal, private workflowService : workflowService, private service : ServiceInvokerService) { }
  

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
      'description' : new FormControl(data?.description || '',[Validators.required])
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
      "botId": this.workflowService.getCurrentBt(true)._id
    }
    let updateGroupObj : any = {
        type : this.type
    }
    this.service.invoke(serviceName, {groupId : this.groupData._id}, payload).subscribe(data => {
      if (data) {
        updateGroupObj.data = data;
        this.updateGroup.emit(updateGroupObj); 
        this.closeGroup();
      }
    });
  }


  openDeleteGroup() {
    this.closeGroup();
		this.modalRef = this.modalService.open(CoachingGroupRuleDeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = {
      title : "Delete Rule",
      desc : "Are you sure you want to delete group " + this.createGroupForm.controls.name.value + " all rules under the group will be deleted.",
      type : "Group",
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
        });
      }
      
    });
	}

}
