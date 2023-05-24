import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COACHINGCNST } from '../coaching.cnst';
import { CoachingService } from '../coaching.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-coaching-rule-create',
  templateUrl: './coaching-rule-create.component.html',
  styleUrls: ['./coaching-rule-create.component.scss']
})
export class CoachingRuleCreateComponent implements OnInit {

  @Input() groupDetails : any;
  @Input() groupIndex : number;
  @Output() onCloseRule = new EventEmitter();

  coachingCnst : any = COACHINGCNST
  triggerClick : boolean = false;
  allTriggers = [
    {
      type: this.coachingCnst.UTTERANCE,
      title: "Utterance",
      desc: "Agent/Customer utterances",
      icon: "icon-sa-chat"
    },    {
      type: this.coachingCnst.SPEECH_ANALYSIS,
      title: "Speech Analysis",
      desc: "Agent speech patterns",
      icon: "icon-sa-chat"
    },    {
      type: this.coachingCnst.VARIABLE,
      title: "Variable",
      desc: "Monitor context variable",
      icon: "icon-sa-chat"
    },    {
      type: this.coachingCnst.DIALOG,
      title: "Dialog",
      desc: "Monitor dialog execution",
      icon: "icon-sa-chat"
    }
  ];
  allActions = [
    {
      type: this.coachingCnst.NUDGE_AGENT,
      title: "Nudge Agent",
      desc: "A simple toast message",
      icon: "icon-sa-chat"
    },    {
      type: this.coachingCnst.HINT_AGENT,
      title: "Hint Agent",
      desc: "A hint notification box",
      icon: "icon-sa-chat"
    },    {
      type: this.coachingCnst.ALERT_MANAGER,
      title: "Alert Manager",
      desc: "Push notification to Manager",
      icon: "icon-sa-chat"
    },    {
      type: this.coachingCnst.EMAIL_MANAGER,
      title: "Email Manager",
      desc: "Send email to manager",
      icon: "icon-sa-chat"
    },{
      type: this.coachingCnst.DIALOG,
      title: "Dialog",
      desc: "Trigger dialog for agent",
      icon: "icon-sa-chat"
    },    {
      type: this.coachingCnst.FAQ,
      title: "FAQ",
      desc: "Trigger FAQ for agent",
      icon: "icon-sa-chat"
    }
  ]
  // triggerFormControlsArray : any = [];

  constructor(private fb: FormBuilder, private coachingService : CoachingService, private cd: ChangeDetectorRef,
    private workflowService : workflowService, private service : ServiceInvokerService) { }
  ruleForm :FormGroup;
 

  ngOnInit(): void {
    this.ruleForm = this.fb.group(
      {
        "botId" : this.fb.control(this.workflowService.getCurrentBt(true)._id),
        "name" : this.fb.control('', Validators.required),
        "triggers" : this.fb.array([]),
        "actions" : this.fb.array([]),
        "assignees" : this.fb.array([]),
      }
    )
  }

  closeRule(rule?) {
    this.onCloseRule.emit(rule);
  }

  saveRule(){
    console.log("save rule", this.ruleForm);
    let payload : any = this.ruleForm.value;
    payload["addToGroup"] = true;
    payload["groupId"] = this.groupDetails._id;
    this.service.invoke('post.agentcoachingrule', {addToGroup : true, groupId : this.groupDetails._id}, payload).subscribe(data => {
      if (data) {
        console.log(data, 'data inside rule creation');
        this.closeRule(data);
      }
    });
  }

  selectTriggerClick(clickType){
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
    
  selectActionClick(clickType){
    if(clickType == this.coachingCnst.NUDGE_AGENT) {
      (<FormArray>this.ruleForm.controls["actions"])
      .push(this.fb.group(this.coachingService.getNudgeFromObj()))
    } else if(clickType == this.coachingCnst.HINT_AGENT){
      (<FormArray>this.ruleForm.controls["actions"])
      .push(this.fb.group(this.coachingService.getHintFromObj()))
    }
    
    // else if(clickType == this.coachingCnst.ALERT_MANAGER){
    //   (<FormArray>this.ruleForm.controls["actions"])
    //   .push(this.fb.group(this.coachingService.getVariableFormControlObject()))
    // }else if(clickType == this.coachingCnst.EMAIL_MANAGER){
    //   (<FormArray>this.ruleForm.controls["actions"])
    //   .push(this.fb.group(this.coachingService.getDialogFormControlObject()))
    // }else if(clickType == this.coachingCnst.DIALOG){
    //   (<FormArray>this.ruleForm.controls["actions"])
    //   .push(this.fb.group(this.coachingService.getDialogFormControlObject()))
    // }else if(clickType == this.coachingCnst.FAQ){
    //   (<FormArray>this.ruleForm.controls["actions"])
    //   .push(this.fb.group(this.coachingService.getDialogFormControlObject()))
    // }

  }

  deleteTrigger(index){
    console.log(index, "index");
    
    if(index != null && index != undefined){
      (<FormArray>this.ruleForm.controls["triggers"]).removeAt(index);
    }
  }
}
