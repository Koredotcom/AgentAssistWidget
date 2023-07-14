import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { COACHINGCNST } from '../coaching.cnst';
import { CoachingService } from '../coaching.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoachingConfirmationComponent } from '../coaching-confirmation/coaching-confirmation.component';
import { finalize } from 'rxjs/operators';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
  @ViewChild('newRuleModal', { static: true }) newRuleModal;
  loading = false;
  ruleForm: FormGroup;
  // ruleBasic: FormGroup;
  modalRef : any;
  formTouched : boolean = false;
  selAcc = this.local.getSelectedAccount();

  coachingCnst : any = COACHINGCNST
  triggerClick : boolean = false;
  modalFlowCreateRef:any;
  name = '';
  description = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  allTriggers = [
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
  allActions = [
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
  ]

  // triggerFormControlsArray : any = [];

  constructor(
    private fb: FormBuilder, 
    private coachingService : CoachingService, 
    private cd: ChangeDetectorRef,
    private workflowService : workflowService, 
    private service : ServiceInvokerService, 
    private modalService : NgbModal, 
    private auth: AuthService, 
    private local: LocalStoreService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

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
      setTimeout(() => {
        this.newRule(this.newRuleModal);
      }, 1000);
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
    }else if(element.type == this.coachingCnst.EMAIL_MANAGER){
      return this.fb.group(this.coachingService.setEmailManagerForm(element));
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
    
    // this.ruleBasic = new FormGroup({

    // });

    this.ruleForm = new FormGroup(
      {
        "name": new FormControl('',[Validators.required]),
        "description": new FormControl(''),
        "tags": this.fb.array([]),
        "channels": this.fb.array([]),
        "botId": new FormControl(this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id, [Validators.required]),
        "triggers": this.fb.array([]),
        "actions": this.fb.array([]),
        "assignees": this.fb.array([]),
        "deleteTriggers": new FormControl([]),
        "deleteActions": new FormControl([]),
      }
    );
  }

  closeRule(rule?) {
    this.onCloseRule.emit(rule);
  }
 
  saveRule(){
    if((this.ruleForm.controls.name.value as string).trim() === ''){
      this.notificationService.showError({}, this.translate.instant('VALID.NAME'));
      return;
    }
    this.loading = true;
    let payload : any = this.ruleForm.value;
    payload["addToGroup"] = true;
    payload["groupId"] = this.groupDetails._id;
    let methodName = this.createOrEdit == COACHINGCNST.CREATE ? "post.agentcoachingrule" : "put.agentcoachingrule"
    this.service.invoke(methodName, {addToGroup : true, groupId : this.groupDetails._id, ruleId : this.currentRule?.ruleId}, payload)
    .pipe(finalize(()=>{
      this.loading = false;
    }))
    .subscribe(data => {
      if (data && (data._id || data.id)) {
        data._id = data.id ? data.id : data._id;
        data.ruleId = data._id;
        data.isActive = true;
        this.closeRule(data);
        this.notificationService.notify(this.translate.instant("RULE.SUCCESS"), 'success');
      }
    },
    (err)=>{
      this.notificationService.showError(err, this.translate.instant("QUOTA_EXCEEDED"));
    });
  }

  selectTriggerClick(clickType){
    if(clickType == this.coachingCnst.UTTERANCE){
      (<FormArray>this.ruleForm.controls["triggers"])
      .push(this.fb.group(this.coachingService.getUtteranceFormControlObject()))
    }else if(clickType == this.coachingCnst.SPEECH_ANALYSIS){
      (<FormArray>this.ruleForm.controls["triggers"])
      .push(this.fb.group(this.coachingService.getSpeechAnalysisFormControlObject()))
    }/* else if(clickType == this.coachingCnst.VARIABLE){
      (<FormArray>this.ruleForm.controls["triggers"])
      .push(this.fb.group(this.coachingService.getVariableFormControlObject()))
    }else if(clickType == this.coachingCnst.DIALOG){
      (<FormArray>this.ruleForm.controls["triggers"])
      .push(this.fb.group(this.coachingService.getDialogFormControlObject()))
    } */
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ruleForm.controls['triggers']['controls'], event.previousIndex, event.currentIndex);
    if(event.previousIndex != event.currentIndex){
      this.formTouched = true;
    }
  }
    
  selectActionClick(clickType){
    if(clickType == this.coachingCnst.NUDGE_AGENT) {
      (<FormArray>this.ruleForm.controls["actions"])
      .push(this.fb.group(this.coachingService.getNudgeFromObj()))
    } else if(clickType == this.coachingCnst.HINT_AGENT){
      (<FormArray>this.ruleForm.controls["actions"])
      .push(this.fb.group(this.coachingService.getHintFromObj()))
    } else if(clickType == this.coachingCnst.EMAIL_MANAGER){
        (<FormArray>this.ruleForm.controls["actions"])
        .push(this.fb.group(this.coachingService.getEmailManagerFromObj()))
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
    if(this.createOrEdit === COACHINGCNST.EDIT){
      let id = (<FormArray>this.ruleForm.controls["triggers"]).at(index)?.value?._id;
      // (<FormArray>this.ruleForm.controls["deleteTriggers"]).push(id);
      this.ruleForm.controls["deleteTriggers"].value.push(id);
    }
    (<FormArray>this.ruleForm.controls["triggers"]).removeAt(index);
  }

  deleteAction(index){
    if(this.createOrEdit === COACHINGCNST.EDIT){
      let id = (<FormArray>this.ruleForm.controls["actions"]).at(index)?.value?._id;
      this.ruleForm.controls["deleteActions"].value.push(id);
    }
    (<FormArray>this.ruleForm.controls["actions"]).removeAt(index);
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

  newRule(newRuleModal: any) {
    this.modalFlowCreateRef = this.modalService.open(newRuleModal, {
      windowClass: 'modal-ngb-wrapper-window',
      centered: true,
      backdrop: 'static',
    });
  }
  isSettings = false;
  closeBasicRule(){
    if(this.createOrEdit == COACHINGCNST.CREATE && !this.isSettings){
      this.modalFlowCreateRef.close();
      this.closeRule();
    }else{
      this.modalFlowCreateRef.close();
      this.isSettings = false;
    }
  }

  submitForm(){
    this.ruleForm.controls['name'].patchValue(this.name);
    this.ruleForm.controls['description'].patchValue(this.description);
    console.log("description", this.ruleForm.value)
    this.modalFlowCreateRef.close();
  }
  
  openSettings(){
    this.isSettings = true;
    this.newRule(this.newRuleModal);
    this.name = this.ruleForm.value?.name;
    this.description = this.ruleForm.value?.description;
  }

  OnDidNumberUpdated(e){

  }
  didNumbers: any[] = ["abc", "def"];
  onDIDNumberRemove(e){

  }
  filteredFruits = ["abc", "def"]
  onDidNumberFocus(e){

  }
  selected($event){
    
  }
}
