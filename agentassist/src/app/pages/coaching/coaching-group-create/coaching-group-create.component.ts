import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
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

  
  createGroupForm : FormGroup;
  coachingConst : any = COACHINGCNST;
  constructor() { }
  

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

}
