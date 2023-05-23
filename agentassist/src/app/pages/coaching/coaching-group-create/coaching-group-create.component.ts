import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Input() data : any;
  @Output() onClose = new EventEmitter();

  modalRef:any;

  
  createGroupForm : FormGroup;
  coachingConst : any = COACHINGCNST;
  constructor(private modalService: NgbModal) { }
  

  ngOnInit(): void {
    this.createFormGroup(null);
  }

  ngOnChanges(changes : SimpleChange) {
    if(this.data){
      this.createFormGroup(this.data);
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
    console.log("submit form", this.createGroupForm);
  }

  openDeleteGroup() {
    this.closeGroup();
		this.modalRef = this.modalService.open(CoachingGroupRuleDeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = {
      title : "Delete Rule",
      desc : "Are you sure you want to delete group " + this.createGroupForm.controls.name.value + " all rules under the group will be deleted.",
      type : "Group"
    };
    this.modalRef.componentInstance.emitDeleteService.subscribe((emitedValue) => {
      console.log(emitedValue);
      
    });
	}

}
