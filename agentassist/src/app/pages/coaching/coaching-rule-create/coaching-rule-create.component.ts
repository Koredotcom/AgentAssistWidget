import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { COACHINGCNST } from '../coaching.cnst';
import { CoachingService } from '../coaching.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoachingConfirmationComponent } from '../coaching-confirmation/coaching-confirmation.component';
@Component({
  selector: 'app-coaching-rule-create',
  templateUrl: './coaching-rule-create.component.html',
  styleUrls: ['./coaching-rule-create.component.scss']
})
export class CoachingRuleCreateComponent implements OnInit, OnChanges {

  @Input() groupDetails : any;
  @Input() groupIndex : number;
  @Output() onCloseRule = new EventEmitter();
  @Input() createOrEdit = '';
  @Input() currentRule:any;
  ruleForm :FormGroup;
  modalRef : any;
  formTouched : boolean = false;

  coachingCnst : any = COACHINGCNST
  triggerClick : boolean = false;
  allTriggers = [
    {
      type: this.coachingCnst.UTTERANCE,
      title: "Utterance",
      desc: "Agent/Customer utterances",
      icon: "icon-sa-chat",
      disable : false
    },    {
      type: this.coachingCnst.SPEECH_ANALYSIS,
      title: "Speech Analysis",
      desc: "Agent speech patterns",
      icon: "icon-sa-chat",
      disable : false
    },    {
      type: this.coachingCnst.VARIABLE,
      title: "Variable",
      desc: "Monitor context variable",
      icon: "icon-sa-chat",
      disable : true
    },    {
      type: this.coachingCnst.DIALOG,
      title: "Dialog",
      desc: "Monitor dialog execution",
      icon: "icon-sa-chat",
      disable : true
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
      icon: "icon-sa-chat",
      disable : true
    },    {
      type: this.coachingCnst.EMAIL_MANAGER,
      title: "Email Manager",
      desc: "Send email to manager",
      icon: "icon-sa-chat",
      disable : true
    },{
      type: this.coachingCnst.DIALOG,
      title: "Dialog",
      desc: "Trigger dialog for agent",
      icon: "icon-sa-chat",
      disable : true
    },    {
      type: this.coachingCnst.FAQ,
      title: "FAQ",
      desc: "Trigger FAQ for agent",
      icon: "icon-sa-chat",
      disable : true
    }
  ]
  
  // triggerFormControlsArray : any = [];

  constructor(private fb: FormBuilder, private coachingService : CoachingService, private cd: ChangeDetectorRef,
    private workflowService : workflowService, private service : ServiceInvokerService, private modalService : NgbModal) { }

    @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
      if(this.formTouched){
        event.returnValue = false;
      }
   }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      this.createForm();
      this.updateRuleForm();
    }
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      this.createForm();
      // this.subscribeValChanges();
    };
    setTimeout(() => {
      this.subscribeValChanges();
    }, 10);
  }

  subscribeValChanges(){
    this.ruleForm?.valueChanges.subscribe((_change)=>{
      this.formTouched = true;
    })
  }
  ngOnInit(): void {
  }

  updateRuleForm(){
    setTimeout(() => {
      this.ruleForm.controls["name"].patchValue(this.currentRule?.name);      
      (this.currentRule?.triggers || []).forEach(element => {
        (<FormArray>this.ruleForm?.controls["triggers"])
        .push(this.getFormGroupObject(element));
        // this.cd.detectChanges();
      });
      (this.currentRule?.actions || []).forEach(element => {
        (<FormArray>this.ruleForm?.controls["actions"])
        .push(this.getFormGroupObject(element));
        // this.cd.detectChanges();
      });
      this.cd.detectChanges();
    });
  }

  getFormGroupObject(element){
    if(element.type == this.coachingCnst.UTTERANCE){
      return this.fb.group(this.coachingService.setUtteranceForm(element))
    }else if(element.type == this.coachingCnst.SPEECH_ANALYSIS){
      return this.fb.group(this.coachingService.setSpeechAnalysisForm(element))
    }else if(element.type == this.coachingCnst.NUDGE_AGENT){
      return this.fb.group(this.coachingService.setNudgeForm(element))
    }else if(element.type == this.coachingCnst.HINT_AGENT){
      return this.fb.group(this.coachingService.setHintForm(element))
    }
  }

  changeRule(rule){
    this.currentRule = rule;
    this.createForm();
    this.updateRuleForm();
    setTimeout(() => {
      this.subscribeValChanges();
      this.formTouched = false;
    }, 10);
  }

  createForm(){
    this.ruleForm = new FormGroup(
      {
        "botId": new FormControl(this.workflowService.getCurrentBt(true)._id, [Validators.required]),
        "name": new FormControl('',[Validators.required]),
        // "description": new FormControl('',[Validators.required]),
        "triggers": this.fb.array([]),
        "actions": this.fb.array([]),
        "assignees": this.fb.array([]),
      }
    );
  }

  closeRule(rule?) {
    this.onCloseRule.emit(rule);
  }
 
  saveRule(){
    let payload : any = this.ruleForm.value;
    payload["addToGroup"] = true;
    payload["groupId"] = this.groupDetails._id;
    let methodName = this.createOrEdit == COACHINGCNST.CREATE ? "post.agentcoachingrule" : "put.agentcoachingrule"
    this.service.invoke(methodName, {addToGroup : true, groupId : this.groupDetails._id, ruleId : this.currentRule?.ruleId}, payload).subscribe(data => {
      if (data && (data._id || data.id)) {
        data._id = data.id ? data.id : data._id;
        data.ruleId = data._id;
        data.isActive = true;
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
    if(typeof index === "number"){
      (<FormArray>this.ruleForm.controls["triggers"]).removeAt(index);
    }
  }

  deleteAction(index){
    if(typeof index === "number"){
      (<FormArray>this.ruleForm.controls["actions"]).removeAt(index);
    }
  }

  closeRuleScreen(rule?) {        
    if(this.formTouched){
      this.modalRef = this.modalService.open(CoachingConfirmationComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
      this.modalRef.result.then(emitedValue => {
        if(emitedValue){
          let closeRule = rule ? this.changeRule(rule) : this.closeRule();
          this.formTouched = false;
        }
      });
    }else{
      let closeRule = rule ? this.changeRule(rule) : this.closeRule();
    }
  }

}
