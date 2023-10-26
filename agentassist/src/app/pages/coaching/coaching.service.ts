import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { COACHINGCNST } from './coaching.cnst';
import { v4 as uuid } from 'uuid';
import { AuthService } from '@kore.services/auth.service';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Injectable({
  providedIn: 'root'
})
export class CoachingService {
  metaForUtternace:any = {};
  coachingCnst : any = COACHINGCNST;
  allactionList : any = {
    [COACHINGCNST.ADHERENCE_DATA] : [
      {
        type: this.coachingCnst.ACKNOWLEDGE_PRESSED,
        title: "Acknowledge Pressed",
        desc: "Hint's button pressed",
        icon: "assets/icons/coaching/coaching--acknowledge-search.svg",
        disable : {
          'nudge': true,
        }
      },{
        type: this.coachingCnst.UTTERANCE,
        title: "Utterance",
        desc: "Checks Agent's utterances",
        icon: "assets/icons/coaching/coaching--message-check-square.svg",
      },    {
        type: this.coachingCnst.FAQ_USED,
        title: "FAQ Used",
        desc: "Checks for the use of an FAQ",
        icon: "assets/icons/coaching/coaching--trigger-variable.svg",
        disable : {
          'nudge': true,
          'hint': true
        }
      },    {
        type: this.coachingCnst.DIALOG_RUN,
        title: "Dialog Run",
        desc: "Checks for a Dialog run",
        icon: "assets/icons/coaching/coaching--trigger-dialog.svg",
        disable : {
          'nudge': true,
          'hint': true
        }
      }
    ]
  }
  createRuleTriggerList : any = [
    {
      type: this.coachingCnst.UTTERANCE,
      title: "Utterance",
      desc: "Agent/Customer utterances",
      icon: "assets/icons/coaching/coaching--message-check-square.svg",
      disable : false
    },    {
      type: this.coachingCnst.SPEECH_ANALYSIS,
      title: "Speech Analysis",
      desc: "Agent speech patterns",
      icon: "assets/icons/coaching/coaching--trigger-speech.svg",
      disable : false
    },    {
      type: this.coachingCnst.VARIABLE,
      title: "Variable",
      desc: "Monitor context variable",
      icon: "assets/icons/coaching/coaching--trigger-variable.svg",
      disable : true
    },    {
      type: this.coachingCnst.DIALOG,
      title: "Dialog",
      desc: "Monitor dialog execution",
      icon: "assets/icons/coaching/coaching--trigger-dialog.svg",
      disable : true
    }
  ];

  createRuleActionList : any = [
    {
      type: this.coachingCnst.NUDGE_AGENT,
      title: "Nudge Agent",
      desc: "A simple toast message",
      icon: "assets/icons/coaching/coaching--nudge-agent.svg"
    },    {
      type: this.coachingCnst.HINT_AGENT,
      title: "Hint Agent",
      desc: "A hint notification box",
      icon: "assets/icons/coaching/coaching--hint-agent.svg"
    },    {
      type: this.coachingCnst.ALERT_MANAGER,
      title: "Alert Manager",
      desc: "Push notification to Manager",
      icon: "assets/icons/coaching/coaching--aleart-manager.svg",
      disable : true
    },    {
      type: this.coachingCnst.EMAIL_MANAGER,
      title: "Email Manager",
      desc: "Send email to manager",
      icon: "assets/icons/coaching/coaching--email-manager.svg"
    },{
      type: this.coachingCnst.DIALOG,
      title: "Dialog",
      desc: "Trigger dialog for agent",
      icon: "assets/icons/coaching/coaching--trigger-dialog.svg",
      disable : true
    },    {
      type: this.coachingCnst.FAQ,
      title: "FAQ",
      desc: "Trigger FAQ for agent",
      icon: "assets/icons/coaching/coaching--faq.svg",
      disable : true
    }
  ];
  ruleDesc = '';
  
  constructor(private fb: UntypedFormBuilder,
    private auth : AuthService,
    private workflowService : workflowService,
    private service : ServiceInvokerService) { }

  updateLockOnRule(flag, currentRule, selAcc){
    if(currentRule && currentRule._id){
      let botId = this.workflowService.getCurrentBtSmt(true)._id;
      let params : any = {
        botId,
        ruleId : currentRule._id,
        userId : this.auth.getUserId()
      }
      this.service.invoke('post.checkLock', params, {actions : {isLocked : flag}}).subscribe(data => {
        console.log(data, "data inside check lock screen");
      })
    }
  }

  getUtteranceFormControlObject(){
    return {
      _id: ['aat-'+uuid(), [Validators.required]],
      type: [this.coachingCnst.UTTERANCE, [Validators.required]],
      by: ['', [Validators.required]],
      operator : ['and', [Validators.required]],
      when : this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
        utteranceCount: ['', [Validators.required]]
      }),
      frequency: this.fb.group({
        nOccurrences: [1, Validators.required],
        duration : ['', [Validators.required]]
      })
    }
  }

  setUtteranceForm(obj, rule){
    let utteranceObj : any =  {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.UTTERANCE,
      by: [obj.by, [Validators.required]],
      operator : [obj.operator, [Validators.required]],
      when : this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
        utteranceCount: [obj.when?.utteranceCount, rule?.default ? '' : [Validators.required]]
      }),
      frequency: this.fb.group({
        nOccurrences: [obj.frequency?.nOccurrences, Validators.required]
      })
    } 

    if(obj.frequency){

      if(obj.frequency?.duration){
        (<UntypedFormGroup> utteranceObj.frequency).addControl('duration', new UntypedFormControl(obj.frequency?.duration))
      }
      if(obj.frequency?.period){
        (<UntypedFormGroup> utteranceObj.frequency).addControl('period', new UntypedFormControl(obj.frequency?.period))
      }
      if(obj.frequency?.nSeconds){
        (<UntypedFormGroup> utteranceObj.frequency).addControl('nSeconds', new UntypedFormControl(obj.frequency?.nSeconds))
      }
      if(obj.frequency?.nMessages){
        (<UntypedFormGroup> utteranceObj.frequency).addControl('nMessages', new UntypedFormControl(obj.frequency?.nMessages))
      }
      if(obj?.default){
        utteranceObj['default'] = [obj.default];
      }
    }
    return utteranceObj;
  }

  getSpeechAnalysisFormControlObject(){
    return {
      _id: ['aat-'+uuid(), [Validators.required]],
      type: [this.coachingCnst.SPEECH_ANALYSIS, [Validators.required]],
      subType: ['', [Validators.required]],
      operator : ['and', [Validators.required]],
      frequency: this.fb.group({
        nOccurrences: [1, Validators.required],
        duration : ['', [Validators.required]]
      })
    };
  }

  setSpeechAnalysisForm(obj){
    let objC : any = {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.SPEECH_ANALYSIS,
      subType: [obj.subType, [Validators.required]],
      operator : [obj.operator, [Validators.required]],
      frequency: this.fb.group({
        nOccurrences: [obj.frequency?.nOccurrences],
      })
    };

    if(obj.by) {
      objC.by = [obj.by, [Validators.required]]
    }

    if(obj.conditions && obj.subType == COACHINGCNST.TALKRATIO){
      objC.conditions = this.fb.group({
        operator : [obj.conditions.operator, [Validators.required]],
        value : [obj.conditions.value, [Validators.required]]
      })
    }

    if(obj.frequency){

      if(obj.frequency?.nWords){
        (<UntypedFormGroup> objC.frequency).addControl('nWords', new UntypedFormControl(obj.frequency?.nWords))
      }
      if(obj.frequency?.timeTaken){
        (<UntypedFormGroup> objC.frequency).addControl('timeTaken', new UntypedFormControl(obj.frequency?.timeTaken))
      }

      if(obj.frequency?.duration){
        (<UntypedFormGroup> objC.frequency).addControl('duration', new UntypedFormControl(obj.frequency?.duration))
      }
      if(obj.frequency?.period){
        (<UntypedFormGroup> objC.frequency).addControl('period', new UntypedFormControl(obj.frequency?.period))
      }
      if(obj.frequency?.nSeconds){
        (<UntypedFormGroup> objC.frequency).addControl('nSeconds', new UntypedFormControl(obj.frequency?.nSeconds))
      }

      if(obj.frequency?.nMessages){
        (<UntypedFormGroup> objC.frequency).addControl('nMessages', new UntypedFormControl(obj.frequency?.nMessages))
      }
      
      // if(obj.frequency?.comparator){
      //   (<FormGroup> objC.frequency).addControl('comparator', new FormControl(obj.frequency?.comparator))
      // }

      // if(obj.frequency?.percentage){
      //   (<FormGroup> objC.frequency).addControl('percentage', new FormControl(obj.frequency?.percentage))
      // }
    }
    return objC;
  }

  getVariableFormControlObject(){
    return {
      type: this.coachingCnst.VARIABLE,
      by: [null, [Validators.required]],
      when : [[], [Validators.required]],
      streetType: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      nOccurrences: [null, [Validators.required]],
      every: [null, [Validators.required]],
      operator : [null, [Validators.required]]
    }
  }

  getDialogFormControlObject(){
    return {
      type: this.coachingCnst.DIALOG,
      by: [null, [Validators.required]],
      when : [[], [Validators.required]],
      streetType: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      nOccurrences: [null, [Validators.required]],
      every: [null, [Validators.required]],
      operator : [null, [Validators.required]]
    }
  }

  getNudgeFromObj(){
    return {
      _id: ['aat-'+uuid(), [Validators.required]],
      type: this.coachingCnst.NUDGE_AGENT,
      expression: ['', [Validators.required]],
      message : this.fb.group({
        title: ['', Validators.required]
      })
    }
  }

  setNudgeForm(obj){
    let nudgeForm : any = {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.NUDGE_AGENT,
      expression: [obj.expression, [Validators.required]],
      message : this.fb.group({
        title: [obj.message?.title, Validators.required]
      })
    }
    if(obj.adherence){

      nudgeForm.adherence = this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
      });

      if(obj.adherence?.adType){
        (<UntypedFormGroup> nudgeForm.adherence).addControl('adType', new UntypedFormControl(obj.adherence?.adType))
      }

      if(obj.adherence?.ackText){
        (<UntypedFormGroup>nudgeForm.adherence).addControl('ackText', new UntypedFormControl(obj.adherence?.ackText))
      }
  
      if(obj.adherence?.session){
        (<UntypedFormGroup> nudgeForm.adherence).addControl('session', new UntypedFormControl(obj.adherence?.session))
      }
      if(obj.adherence?.nMins){
        (<UntypedFormGroup> nudgeForm.adherence).addControl('nMins', new UntypedFormControl(obj.adherence?.nMins))
      }
      if(obj.adherence?.nMessages){
        (<UntypedFormGroup> nudgeForm.adherence).addControl('nMessages', new UntypedFormControl(obj.adherence?.nMessages))
      }
      if(obj.adherence?.utteranceCount){
        (<UntypedFormGroup> nudgeForm.adherence).addControl('utteranceCount', new UntypedFormControl(obj.adherence?.utteranceCount, Validators.required))
      }
    }

    return nudgeForm;
  }

  getHintFromObj(){
    return {
      _id: ['aat-'+uuid(), [Validators.required]],
      type: this.coachingCnst.HINT_AGENT,
      expression: ['', [Validators.required]],
      message : this.fb.group({
        title: ['', Validators.required],
        body : ['', Validators.required],
        postAction : ['', Validators.required],
      })
    }
  }

  getEmailManagerFromObj(){
    return {
      _id: ['aat-'+uuid(), [Validators.required]],
      type: this.coachingCnst.EMAIL_MANAGER,
      emails : [[],Validators.required],
      when: [this.coachingCnst.IMMEDIATELY, [Validators.required]],
      message : this.fb.group({
        title: ['', Validators.required],
        body : ['', Validators.required]
      })
    }
  }

  setEmailManagerForm(obj){
    return {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.EMAIL_MANAGER,
      emails : [obj.emails,Validators.required],
      when: [obj.when, [Validators.required]],
      message : this.fb.group({
        title: [obj.message?.title, Validators.required],
        body : [obj.message?.body, Validators.required]
      })
    }
  }

  setHintForm(obj){
    let hintForm : any =  {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.HINT_AGENT,
      expression: [obj.expression, [Validators.required]],
      message : this.fb.group({
        title: [obj.message?.title, Validators.required],
        body : [obj.message?.body, Validators.required],
        postAction : [obj.message?.postAction, Validators.required]
      }),
    }

    if(obj.message?.time){
      (<UntypedFormGroup> hintForm.message).addControl('time', new UntypedFormControl(obj.message?.time))
    }
  
    if (obj.adherence) {
      hintForm.adherence = this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
      });
      if (obj.adherence?.adType) {
        (<UntypedFormGroup>hintForm.adherence).addControl('adType', new UntypedFormControl(obj.adherence?.adType))
      }

      if(obj.adherence?.ackText){
        (<UntypedFormGroup>hintForm.adherence).addControl('ackText', new UntypedFormControl(obj.adherence?.ackText))
      }

      if (obj.adherence?.session) {
        (<UntypedFormGroup>hintForm.adherence).addControl('session', new UntypedFormControl(obj.adherence?.session))
      }
      if (obj.adherence?.nMins) {
        (<UntypedFormGroup>hintForm.adherence).addControl('nMins', new UntypedFormControl(obj.adherence?.nMins))
      }
      if (obj.adherence?.nMessages) {
        (<UntypedFormGroup>hintForm.adherence).addControl('nMessages', new UntypedFormControl(obj.adherence?.nMessages))
      }
      if (obj.adherence?.utteranceCount) {
        (<UntypedFormGroup>hintForm.adherence).addControl('utteranceCount', new UntypedFormControl(obj.adherence?.utteranceCount,Validators.required))
      }
    }

    return hintForm;
  }

  getAdherenceForm(type?){
    return {
      adType : [type ? type : '', [Validators.required]],
      addUtterances: [[]],
      deleteUtterances: [[]]
    }
  }

 
}
