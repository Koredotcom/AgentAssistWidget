import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { COACHINGCNST } from '../coaching.cnst';
import { CoachingService } from '../coaching.service';

@Component({
  selector: 'app-coaching-rule-create',
  templateUrl: './coaching-rule-create.component.html',
  styleUrls: ['./coaching-rule-create.component.scss']
})
export class CoachingRuleCreateComponent implements OnInit {

  coachingCnst : any = COACHINGCNST
  triggerClick : boolean = false;

  triggerFormControlsArray : any = [];

  constructor(private fb: FormBuilder, private coachingService : CoachingService) { }

  @Output() onCloseRule = new EventEmitter();

  ngOnInit(): void {
  }

  closeRule(rule?) {
    this.onCloseRule.emit(rule);
  }

  addTriggerClick(){
    this.triggerClick = true;
  }

  selectTriggerClick(clickType){
    this.triggerClick = false;
    if(clickType == this.coachingCnst.UTTERANCE){
      this.triggerFormControlsArray.push(this.getUtteranceFormControl());
    }else if(clickType == this.coachingCnst.SPEECH_ANALYSIS){
      this.triggerFormControlsArray.push(this.getSpeechAnalysisFormControl());
    }else if(clickType == this.coachingCnst.VARIABLE){
      this.triggerFormControlsArray.push(this.getVariableFormControl());
    }else if(clickType == this.coachingCnst.DIALOG){
      this.triggerFormControlsArray.push(this.getDialogFormControl());
    }
    console.log(this.triggerFormControlsArray, 'trigger form control array');
    
  }

  getUtteranceFormControl(){
    console.log(this.coachingService.getUtteranceFormControlObject);
    
    let utteranceFormControl = this.fb.group(this.coachingService.getUtteranceFormControlObject());
    console.log(utteranceFormControl, "utter form control");
    
    return utteranceFormControl;
  }

  getSpeechAnalysisFormControl(){
    let speechAnalysisFormControl = this.fb.group(this.coachingService.getSpeechAnalysisFormControlObject());
    return speechAnalysisFormControl;
  }

  getVariableFormControl(){
    let variableFormControl = this.fb.group(this.coachingService.getVariableFormControlObject());
    return variableFormControl;
  }

  getDialogFormControl(){
    let dialogFormControl = this.fb.group(this.coachingService.getDialogFormControlObject());
    return dialogFormControl;
  }

}
