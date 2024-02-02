import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { IframeService } from '@kore.services/iframe.service';
import { IMAGE_PATHS } from '../../guided-checklist/checklist.const';
import { assetUrl } from 'src/single-spa/asset-url';


@Component({
  selector: 'app-coaching-rule-create',
  templateUrl: './coaching-rule-create.component.html',
  styleUrls: ['./coaching-rule-create.component.scss']
})
export class CoachingRuleCreateComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy{

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
  assetUrlProc = assetUrl;

  coachingCnst : any = COACHINGCNST
  triggerClick : boolean = false;
  modalFlowCreateRef:any;
  allTriggers = this.coachingService.createRuleTriggerList;
  allActions = this.coachingService.createRuleActionList;
  createdRule : any;
  filteredTagsOriginal : any = [];
  channelList : any = [];
  allTagList : any = [];
  isSettings = false;
  settingsList : any = ['name', 'description', 'tags', 'channels', 'botId'];
  settingsChange : boolean = false;

  coachingAssignImg = IMAGE_PATHS.COACHING_ASSIGN_IMG
  isUnifiedPlatform =false;
  unifiedPath = '';

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
    private translate: TranslateService,
    private iframeEvents: IframeService
  ) { }

  ngAfterViewInit(): void {

  }

    @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
      if(this.formTouched){
        event.returnValue = false;
      }else{
        this.coachingService.updateLockOnRule(false, this.currentRule, this.selAcc);
      }
   }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      this.coachingService.updateLockOnRule(true, this.currentRule,this.selAcc);
      this.createForm();
      this.updateRuleForm();
      this.getRuleTags();
    }
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      this.createForm();
      this.getRuleTags(true);
    };
    this.createdRule = null;
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
    this.isUnifiedPlatform = this.workflowService.isUnifiedPlatform();
    if(this.isUnifiedPlatform) {
      this.unifiedPath = window.location.origin + '/koreagentassist-xo-frame';

    }
      }

  ngOnDestroy(): void {
    this.coachingService.updateLockOnRule(false, this.currentRule, this.selAcc);
  }

  updateBasicRuleForm(){
    this.coachingService.ruleDesc = this.currentRule?.description;
    this.ruleForm.controls["name"].patchValue(this.currentRule?.name, {emitEvent : false});
    this.ruleForm.controls["description"].patchValue(this.currentRule?.description, {emitEvent : false});
    this.ruleForm.setControl('channels', this.fb.array(this.currentRule?.channels));
    this.ruleForm.setControl('tags', this.fb.array(this.currentRule?.tags));
    this.filteredTagsOriginal = this.currentRule?.tags;
    this.channelList = this.currentRule?.channels;
    this.formTouched = false;
  }

  updateRuleForm(){
    setTimeout(() => {
      this.coachingService.ruleDesc = this.currentRule?.description;
      this.ruleForm.controls["name"].patchValue(this.currentRule?.name);
      this.ruleForm.controls["description"].patchValue(this.currentRule?.description);
      this.ruleForm.controls['isActive'].patchValue(this.currentRule?.isActive);

      this.ruleForm.setControl('channels', this.fb.array(this.currentRule?.channels));
      this.ruleForm.setControl('tags', this.fb.array(this.currentRule?.tags));
      this.filteredTagsOriginal = this.currentRule?.tags;
      this.channelList = this.currentRule?.channels;
      (<FormArray>this.ruleForm?.controls["triggers"]).clear();
      (<FormArray>this.ruleForm?.controls["actions"]).clear();
      (this.currentRule?.triggers || []).forEach(element => {
        (<FormArray>this.ruleForm?.controls["triggers"])
        .push(this.getFormGroupObject(element, this.currentRule));
      });
      (this.currentRule?.actions || []).forEach(element => {
        (<FormArray>this.ruleForm?.controls["actions"])
        .push(this.getFormGroupObject(element, this.currentRule));
      });
      this.updateSpeechAnalysisTrigger();
      this.cd.detectChanges();
    });
  }

  getRuleTags(create=false){
    let botId = this.workflowService.getCurrentBtSmt(true)._id;
    let params : any = {
      botId
    }
    this.service.invoke('get.agentcoachingruletags',params, {
      botId,
    }).subscribe(data => {
      if (data && data.tags?.length > 0) {
        this.allTagList = data.tags;
      };
      if(create){
        this.newRule();
      }
    });
  }

  getFormGroupObject(element, rule){
    if(element.type == this.coachingCnst.UTTERANCE){
      return this.fb.group(this.coachingService.setUtteranceForm(element, rule))
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
    this.updateBasicRuleForm();
  }

  createForm(){
    this.ruleForm = new FormGroup(
      {
        "name": new FormControl('',[Validators.required]),
        "description": new FormControl('', [Validators.required]),
        "tags": this.fb.array([]),
        "channels": this.fb.array([], [Validators.required]),
        "botId": new FormControl(this.workflowService.getCurrentBtSmt(true)._id, [Validators.required]),
        "triggers": this.fb.array([]),
        "actions": this.fb.array([]),
        "assignees": this.fb.array([]),
        "deleteTriggers": new FormControl([]),
        "deleteActions": new FormControl([]),
        "isActive" : new FormControl(true, [Validators.required])
      }
    );
  }

  closeRule(rule?) {
    let sendRule = (this.createdRule ||this.settingsChange || rule) ? true : false;
    this.onCloseRule.emit(sendRule);
  }

  formatRuleDataForEdit(data) {
    for (let key in this.ruleForm?.value) {
      if (this.settingsList.indexOf(key) == -1) {
        data[key] = this.ruleForm.value[key];
      }
    }
    return data;
  }

  saveSettings(payloadSettings) {

    if ((this.ruleForm.controls.name.value as string).trim() === '') {
      this.notificationService.showError({}, this.translate.instant('VALID.NAME'));
      return;
    }

    this.loading = true;
    let payload: any = payloadSettings && Object.keys(payloadSettings).length ? payloadSettings : this.ruleForm.value;

    if (this.createOrEdit == this.coachingCnst.CREATE) {
      payload.isActive = true;
    }

    let methodName = (this.createOrEdit == COACHINGCNST.CREATE) ? "post.agentcoachingrule" : "put.agentcoachingrule";

    this.service.invoke(methodName, { ruleId: this.currentRule?._id, userId : this.auth.getUserId() }, payload)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(data => {
        this.settingsChange = true;
        if (data && (data._id || data.id)) {
          data._id = data.id ? data.id : data._id;
          data.ruleId = data._id;
          data.tags = data.tags || [];
          data.channels = data.channels || [];
          if(this.createOrEdit == COACHINGCNST.CREATE){
            this.coachingService.updateLockOnRule(true, data,this.selAcc);
          }
          let notification = (this.createOrEdit == this.coachingCnst.CREATE) ? 'RULE.SUCCESS' : 'RULE.UPDATE_SUCCESS';
          this.notificationService.notify(this.translate.instant(notification), 'success');
          data = (this.createOrEdit == this.coachingCnst.EDIT) ? this.formatRuleDataForEdit(data) : data;
          // notification should be before updating createoredit variable.
          this.updateRule(data);
          this.closeBasicRule();
        }
      },
        (err) => {
          this.modalFlowCreateRef.componentInstance.disableApplyButton = false;
          this.notificationService.showError(err, this.translate.instant("QUOTA_EXCEEDED"));
        });
  }

  saveRule() {
    if ((this.ruleForm.controls.name.value as string).trim() === '') {
      this.notificationService.showError({}, this.translate.instant('VALID.NAME'));
      return;
    }
    this.loading = true;
    let payload: any = this.ruleForm.value;
    let methodName = this.createOrEdit == COACHINGCNST.CREATE ? "post.agentcoachingrule" : "put.agentcoachingrule";

    this.service.invoke(methodName, { ruleId: this.currentRule?._id, userId : this.auth.getUserId() }, payload)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(data => {
        if (data && (data._id || data.id)) {
          data._id = data.id ? data.id : data._id;
          data.ruleId = data._id;
          data.tags = data.tags || [];
          data.channels = data.channels || [];

          this.notificationService.notify(this.translate.instant('RULE.UPDATE_SUCCESS'), 'success');
          this.closeRule(data);
        }
      },
        (err) => {
          // this.modalFlowCreateRef.componentInstance.disableApplyButton = false;
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
    this.modalFlowCreateRef.componentInstance.filteredTagsOriginal= this.filteredTagsOriginal;
    this.modalFlowCreateRef.componentInstance.allTagList = this.allTagList;
    this.modalFlowCreateRef.componentInstance.createOrEdit = this.createOrEdit;
    this.modalFlowCreateRef.componentInstance.disableApplyButton = false;
    this.modalFlowCreateRef.componentInstance.default = this.currentRule?.default;
    this.iframeEvents.expand('#frameAgentAssistContainer');
    this.modalFlowCreateRef.componentInstance.submitRuleForm.subscribe(data => {
      if(data){
        let payload : any = {};
        if(this.createOrEdit == this.coachingCnst.EDIT){
          payload = (({name, description, tags, channels, botId}) => ({ name, description, tags, channels, botId }))(this.ruleForm.value);
        }
        this.saveSettings(payload);
      }
    })
    this.modalFlowCreateRef.componentInstance.closeBasicRule.subscribe(value => {
      if(value){
        this.closeBasicRule();
      }
    });

    // this.modalFlowCreateRef.result.then((list)=> {
    //   // if(list && typeof list == 'object'){
    //   //   this.filteredTagsOriginal = list;
    //   //   console.log(this.filteredTagsOriginal, 'filtered tags origins');

    //   // }
    //   if(list){
    //     this.saveRule(false);
    //   }
    // });

  }



  closeBasicRule(){
    if(this.createOrEdit == COACHINGCNST.CREATE && !this.isSettings){
      this.modalFlowCreateRef.close();
      this.closeRule();
    }else{
      this.modalFlowCreateRef.close();
      this.isSettings = false;
    }
    this.updateSpeechAnalysisTrigger();
  }



  openSettings(){
    this.isSettings = true;
    this.newRule();
  }


  updateSpeechAnalysisTrigger(){
    this.allTriggers[1].disable = false;
    if(this.ruleForm.value?.channels.indexOf('voice') == -1){
      this.allTriggers[1].disable = true;
    }
  }

}
