import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COACHINGCNST } from '../coaching.cnst';
import { CoachingService } from '../coaching.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-coaching-rule-create',
  templateUrl: './coaching-rule-create.component.html',
  styleUrls: ['./coaching-rule-create.component.scss']
})
export class CoachingRuleCreateComponent implements OnInit {

  coachingCnst : any = COACHINGCNST
  triggerClick : boolean = false;
  allTriggers = [
    {
      type: this.coachingCnst.UTTERANCE,
      title: "Utterance",
      desc: "Agent/Customer utterances",
    },    {
      type: this.coachingCnst.SPEECH_ANALYSIS,
      title: "Speech Analysis",
      desc: "Agent speech patterns",
    },    {
      type: this.coachingCnst.VARIABLE,
      title: "Variable",
      desc: "Monitor context variable",
    },    {
      type: this.coachingCnst.DIALOG,
      title: "Dialog",
      desc: "Monitor dialog execution",
    }
  ];
  // triggerFormControlsArray : any = [];

  constructor(private fb: FormBuilder, private coachingService : CoachingService, private cd: ChangeDetectorRef) { }
  ruleForm :FormGroup;
  @Output() onCloseRule = new EventEmitter();

  ngOnInit(): void {
    this.ruleForm = this.fb.group(
      {
        "triggers" : this.fb.array([]),
        "actions" : this.fb.array([]),
        "assignees" : this.fb.array([]),
      }
    )
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
      (<FormArray>this.ruleForm.controls["triggers"])
      .push(this.fb.group(this.coachingService.getUtteranceFormControlObject()))
    }else if(clickType == this.coachingCnst.SPEECH_ANALYSIS){
      (<FormArray>this.ruleForm.controls["triggers"])
      .push(this.fb.group(this.coachingService.getSpeechAnalysisFormControlObject()))
    }else if(clickType == this.coachingCnst.VARIABLE){
      (<FormArray>this.ruleForm.controls["triggers"])
      .push(this.fb.group(this.coachingService.getVariableFormControlObject()))
    }else if(clickType == this.coachingCnst.DIALOG){
      (<FormArray>this.ruleForm.controls["triggers"])
      .push(this.fb.group(this.coachingService.getDialogFormControlObject()))
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ruleForm.controls['triggers']['controls'], event.previousIndex, event.currentIndex);
  }
    
}
