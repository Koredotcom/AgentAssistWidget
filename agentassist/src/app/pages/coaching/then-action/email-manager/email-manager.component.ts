import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-email-manager',
  templateUrl: './email-manager.component.html',
  styleUrls: ['./email-manager.component.scss']
})
export class EmailManagerComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() index : number;
  @Input() length : number;
  @Input() createOrEdit: string = '';
  @Output() deleteAction = new EventEmitter();

  coachingCnst : any = COACHINGCNST;
  whenTypeList = COACHINGCNST.WHEN_TYPE;
  title: string = '';
  bodyMsg: string = '';
  selWhenType: string = '';
  emailTitle : string = '';
  emailBody : string = '';
  emailList : any = [];
  emailListString : string;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes : any){
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      const formVal = this.form.value;
      this.title = formVal.message.title;
      this.bodyMsg = formVal.message.body;
      this.selWhenType = formVal.when;
      this.emailList = formVal.emails;      
      this.emailListString = (formVal.emails?.length) ? (formVal.emails?.join(',')) : '';      
    }else if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      const formVal = this.form.value;
    }
  }

  submitEmails(){
    let emailList = this.emailListString?.trim()?.split(',');
    this.emailList = [];
    emailList.forEach(email =>{
      if(email && email.trim()){
        this.emailList.push(email.trim());
      }
    });
    this.form.controls?.emails.setValue(this.emailList);
  }

  selectWhenType(type){
    this.selWhenType = type;
    this.form.controls.when.setValue(type);
  }

  submitTitle(){
    this.title = this.emailTitle;
    (this.form.controls.message as FormGroup).controls.title.setValue(this.title);
  }

  submitBody(){
    this.bodyMsg = this.emailBody;
    (this.form.controls.message as FormGroup).controls.body.setValue(this.bodyMsg);
  }

  deleteActionRule(){
    this.deleteAction.emit(this.index-1);
  }

}
