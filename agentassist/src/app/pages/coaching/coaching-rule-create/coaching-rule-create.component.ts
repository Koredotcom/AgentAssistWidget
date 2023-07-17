import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { MatChipInputEvent } from '@angular/material/chips';
import { CreateRuleComponent } from './create-rule/create-rule.component';
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
  // @ViewChild('newRuleModal', { static: true }) newRuleModal;

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
  allTriggers = this.coachingService.createRuleTriggerList;
  allActions = this.coachingCnst.createRuleActionList;
  filteredTagsOriginal : any = ['Lemon', 'Lime', 'Apple'];

  

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
        this.newRule();
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
    // this.currentRule.channels = ['voice']
    setTimeout(() => {
      this.ruleForm.controls["name"].patchValue(this.currentRule?.name);  
      this.ruleForm.setControl('channels', this.fb.array(this.currentRule?.channels));
      this.ruleForm.setControl('tags', this.fb.array(this.currentRule?.tags));
  
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

  updateRule(rule){
    this.createOrEdit = COACHINGCNST.EDIT;
    this.currentRule = rule;
    this.updateRuleForm();
    setTimeout(() => {
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
        "isActive" : new FormControl(false, [Validators.required])
      }
    );
  }

  closeRule(rule?) {
    this.onCloseRule.emit(rule);
  }
 
  saveRule(closeRule = true){
    if((this.ruleForm.controls.name.value as string).trim() === ''){
      this.notificationService.showError({}, this.translate.instant('VALID.NAME'));
      return;
    }
    this.loading = true;
    let payload : any = this.ruleForm.value;
    // payload["addToGroup"] = true;
    // payload["groupId"] = this.groupDetails._id;
    let methodName = this.createOrEdit == COACHINGCNST.CREATE ? "post.agentcoachingrule" : "put.agentcoachingrule"
    this.service.invoke(methodName, {ruleId : this.currentRule?.ruleId}, payload)
    .pipe(finalize(()=>{
      this.loading = false;
    }))
    .subscribe(data => {
      if (data && (data._id || data.id)) {
        data._id = data.id ? data.id : data._id;
        data.ruleId = data._id;
        data.isActive = data.isActive;
        if(closeRule){
          this.closeRule(data);
        }else{
          this.updateRule(data);
        }
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

  newRule() {
    this.modalFlowCreateRef = this.modalService.open(CreateRuleComponent, {
      windowClass: 'modal-ngb-wrapper-window',
      centered: true,
      backdrop: 'static'
    });
    this.modalFlowCreateRef.componentInstance.ruleForm = this.ruleForm;
    this.modalFlowCreateRef.componentInstance.filteredTagsOriginal = this.filteredTagsOriginal; 
    this.modalFlowCreateRef.componentInstance.closeBasicRule.subscribe(value => {      
      if(value){
        this.closeBasicRule();
      }
    });

    this.modalFlowCreateRef.result.then((list)=> {
      // if(list && typeof list == 'object'){
      //   this.filteredTagsOriginal = list;
      //   console.log(this.filteredTagsOriginal, 'filtered tags origins');
        
      // }
      if(list){
        this.saveRule(false);
      }
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

 
  
  openSettings(){
    this.isSettings = true;
    this.newRule();
    // this.name = this.ruleForm.value?.name;
    this.description = this.ruleForm.value?.description;
  }

 
 
  
}
