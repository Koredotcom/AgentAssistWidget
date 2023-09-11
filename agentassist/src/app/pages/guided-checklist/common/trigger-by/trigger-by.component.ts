import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { ChecklistService } from '../../checklist.service';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';

@Component({
  selector: 'app-trigger-by',
  templateUrl: './trigger-by.component.html',
  styleUrls: ['./trigger-by.component.scss']
})
export class TriggerByComponent implements OnInit, OnChanges {

  @Input() adherenceForm: FormGroup;
  @Input() isChecklist = false;
  @Input() basic: boolean;
  searchKey = new FormControl('');
  loaded = false;
  utterances = {};
  openAiUtteranceArray = [];
  selectAll = false;
  customUtt = false;
  addButtonClick = false;
  selectedNewUtterances = [];
  selectedUtterancesArray = [];
  deletedUIds:any = {};
  utterApiDone = false;
  selAcc = this.local.getSelectedAccount();
  currentBot:any = {};
  executeState:any = {
    'taskStart': 'Initiated',
    'taskEnd': 'Completed'
  };
  standardBotsOj:any = {};
  childBotId = '';
  isSm = window.location.href.includes('smartassist');
  botId = this.workflowService.getCurrentBtSmt(true)._id;
  constructor(
    private workflowService: workflowService,
    public clS: ChecklistService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private auth: AuthService,
    private local: LocalStoreService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    console.log("basic", changes);
    if(!changes?.basic?.currentValue && !this.utterApiDone){
      this.getAddedUtterances();
    }
  }

  getAddedUtterances() {
    let formVal = this.adherenceForm?.value;
    if(formVal.adherence?.type === 'utterance'){
      this.service.invoke("get.agentcoachingutteranceByRef",
        {
          refId: formVal._id,
        }).subscribe((data) => {
          this.utterApiDone = true;
          this.selectedUtterancesArray = [...data];
          (this.adherenceForm.controls['adherence'] as FormGroup)
          .controls['uttCount'].patchValue(this.selectedUtterancesArray.length);
        })
    }
  }

  ngOnInit(): void {
    /* search */
    this.searchKey.valueChanges
      .pipe(
        debounceTime(300),
        tap(()=>{
          this.utterances = {};
        })
      )
      .subscribe((val) => {
        this.loaded = false;
        this.formatUtterArray(this.searchKey.value?.trim());
      });
      /* Get the current bot in case of AgentAssist */
      this.currentBot = this.workflowService.getCurrentBt(true);
      /* Get the current bot in case of SmartAssist */
      if(this.isSm){
        let selAcc = this.local.getSelectedAccount();
        let smBotObj = selAcc['instanceBots'][0];
        let instanceBotId = smBotObj.instanceBotId;
        this.service.invoke("get.automationbots-sm", 
          {
            instanceBotId,
            includeInstanceBot: true,
            skipLinkCheck: true
          }
        )
        .subscribe((bots)=>{
          this.standardBots = bots;
          this.standardBotsOj = (bots || [])
          .reduce((acc, item)=>{
            acc[item._id] = item.botName;
            return acc;
          }, {});
        });
        this.selectSMBot({_id : this.onlyAdhreForm.value.botId});
      }else{
        if(this.currentBot.type === 'universalbot'){
          this.getLinkedBots();
          if(this.onlyAdhreForm.value.lBId){
            this.selectBot({_id : this.onlyAdhreForm.value.lBId});
          }
        }else{
          this.selectBot(this.currentBot);
        };
      }
  }

  formatUtterArray(text) {
    if(!this.clS.metaForUtternace?.enable){
      this.loaded = true;
      return;
    }
    let params: any = {
      streamId: this.botId
    };
    let body = {
      "intentName": text,
      "meta": {
          params: this.clS.metaForUtternace?.params,
          "integration": this.clS.metaForUtternace?.integration,
          "model": this.clS.metaForUtternace?.defaultModel
      }
    }
    this.service.invoke("get.utternaces", params, body)
    .pipe(finalize(()=>{
      this.customUtt = false;
      this.selectAll = false;
    }))
    .subscribe((data) => {
      this.loaded = true;
      this.openAiUtteranceArray = (data || []).map((item)=>{
        return {...item, enabled: false}
      });
    }, (err)=>{
      this.loaded = true;
      try{
        let type = JSON.parse(err.error?.errors[0]?.msg)?.type;
        if(type === 'insufficient_quota'){
          this.notificationService.showError({}, this.translate.instant("QUOTA_EXCEEDED"));
        }
      }catch(e){
        this.notificationService.showError(this.translate.instant("QUOTA_EXCEEDED"));
      }
    });
  }

  checkUtterActiveStatus() {
    // for(let utterences of this.openAiUtteranceArray) {
    //   if(!utterences.enabled) {
    //     return false;
    //   }
    // }
    // return true;
    return (this.openAiUtteranceArray.every((utterence)=>utterence.enabled) && this.customUtt);
  }

  changeUtterActiveStatus(utter) {
    utter.enabled = !utter.enabled;
    if (utter.enabled) {
      this.utterances[utter.sentence] = true;
      if(this.checkUtterActiveStatus()) {
        this.selectAll = true;
      }
    } else {
      if(this.selectAll) {
        this.selectAll = !this.selectAll;
      }
      delete this.utterances[utter.sentence];
    }
  }

  selectAllSearchUttereances(event) {
    if(event.target.checked) {
      this.customUtt = true;
      this.openAiUtteranceArray.forEach(utter => {
        utter.enabled = true;
        this.utterances[utter.sentence] = true;
        this.selectAll = true;
      })
    } else {
      this.customUtt = false;
      this.openAiUtteranceArray.forEach(utter => {
        utter.enabled = false
        this.selectAll = false;
        delete this.utterances[utter.sentence];
      })
    }
  }

  customUttChange(checked){
    this.customUtt = checked;
    if(checked){
      if(this.checkUtterActiveStatus()) {
        this.selectAll = true;
      }
    }else{
      this.selectAll = false;
    }
  }

  clearAIsuggestions(ref) {
    this.clearSeachVal();
    ref.close();
    this.customUtt = false;
    this.selectAll = false;
  }

  clearSeachVal() {
    this.searchKey.patchValue('', { emitEvent: false });
  }

  saveUtterances() {
    if(this.customUtt){
      this.utterances[this.searchKey?.value] = true;
    }
    Object.keys(this.utterances).forEach((item: any) => {
      ((this.adherenceForm.controls['adherence'] as FormGroup).controls['addUtterances'] as FormArray)
      ?.push(
        this.fb.group({
          utterance: new FormControl(item),
          language: new FormControl('english'),
        })
      )
    });
    this.patchCount();
  }

  // upadateAllObjects(){
  //   // (Object.keys(this.deletedUIds)).forEach((item)=>{
  //   //   ((this.adherenceForm.controls['adherence'] as FormGroup).controls['deleteUtterances'] as FormArray)
  //   //   ?.push(new FormControl(item));
  //   // });
  //   // ((this.adherenceForm.controls['adherence'] as FormGroup).controls['deleteUtterances'] as FormArray)?.setValue([...Object.keys(this.deletedUIds)]);
  //   // ((this.adherenceForm.controls['adherence'] as FormGroup).controls['addUtterances'] as FormArray)?.clear();
  //   // (this.selectedNewUtterances || []).forEach(element => {
  //   //   ((this.adherenceForm.controls['adherence'] as FormGroup).controls['addUtterances'] as FormArray)
  //   //   ?.push(
  //   //     this.fb.group({
  //   //       utterance: new FormControl(element.utterance),
  //   //       language: new FormControl(element.language),
  //   //     })
  //   //   )
  //   // });
  // }


  deleteUtternceNew(utter, i) {
    // this.selectedNewUtterances.splice(i, 1);
    this.cdRef.detectChanges();
    delete this.utterances[utter];
    ((this.adherenceForm.controls['adherence'] as FormGroup).controls['addUtterances'] as FormArray)
      ?.removeAt(i);
    this.patchCount();
  }

  patchCount(){
    (this.adherenceForm.controls['adherence'] as FormGroup)
    .controls['uttCount'].patchValue(this.selectedUtterancesArray.length + (this.adherenceForm.controls['adherence'].value?.addUtterances?.length));
  }

  deleteUtternce(utter, i) {
    if (utter._id) {
      this.deletedUIds[utter._id] = true;
    }
    this.selectedUtterancesArray.splice(i, 1);
      ((this.adherenceForm.controls['adherence'] as FormGroup).controls['deleteUtterances'] as FormArray)
      ?.push(new FormControl(utter._id));
    this.patchCount();
  }

  changeRadio(event){
    if(event === 'utterance'){
      this.getAddedUtterances();
      (this.adherenceForm as FormGroup).removeControl('adherence');
      (this.adherenceForm as FormGroup).addControl(
          'adherence', this.fb.group(this.clS.getUtteranceForm('utterance', true))
      );
      this.patchCount();
      this.adherenceForm.updateValueAndValidity();
    }else if(event === 'dialog'){
      (this.adherenceForm as FormGroup).removeControl('adherence');
      (this.adherenceForm as FormGroup).addControl(
        'adherence', this.fb.group(this.clS.getDialogForm(this.botId)
      ));
      ((this.adherenceForm as FormGroup).controls['adherence'] as FormGroup)
      .controls['type'].patchValue('dialog');
      if(this.currentBot.type === 'universalbot'){
        (this.adherenceForm.controls['adherence'] as FormGroup)
        .addControl('lBId', new FormControl('', [Validators.required]));
      }
    }else if(event === 'varibale'){
    }
  }

  isActive(event){
    if(event.target.checked){
      (this.adherenceForm as FormGroup).removeControl('adherence');
      (this.adherenceForm as FormGroup)
      .addControl('adherence', this.fb.group(this.clS.getUtteranceForm('', true)));
    }else {
      (this.adherenceForm as FormGroup).removeControl('adherence');
      (this.adherenceForm as FormGroup).addControl('adherence', this.fb.group({}));
    }
  }

  get onlyAdhreForm(): FormGroup{
    return this.adherenceForm?.controls['adherence'] as FormGroup;
  }
  standardBots = [];
  useCases = {};
  getLinkedBots(){
    const params = {
      userId: this.auth.getUserId(),
      streamId: this.botId
    }
    this.service.invoke('get.bt.stream', params).subscribe(res => {
      this.standardBots = res.publishedBots;
      this.standardBotsOj = (res.publishedBots || [])
      .reduce((acc, item)=>{
        acc[item._id] = item.botName;
        return acc;
      }, {});
    });
  }

  selectBot(bot, click=false){
    // this.childBotId = bot._id;
    if(click && (bot._id === this.onlyAdhreForm.value?.lBId)){
      return;
    }else if(click){
        this.useCases = {};
        this.onlyAdhreForm.controls['lBId'].patchValue('');
        this.onlyAdhreForm.controls['taskId'].patchValue('');
    }
    if(click){
      this.onlyAdhreForm.controls['lBId'].patchValue(bot._id);
    }
    this.service.invoke('get.usecases', {
      streamId: bot._id,
      search: '',
      filterby: '',
      status: '',
      usecaseType: 'dialog',
      offset: 0,
      limit: -1,

    }).subscribe((data) => {
      if (data) {
        this.useCases = (data?.usecases || [])
        .reduce((acc, item)=>{
          acc[item.dialogId] = item.usecaseName;
          return acc;
        }, {});
      }
    });
  }

  selectSMBot(bot, click=false){
    // this.childBotId = bot._id;
    if(click && (bot._id === this.onlyAdhreForm.value?.botId)){
      return;
    }else if(click){
      this.useCases = {};
      // this.onlyAdhreForm.controls['lBId']?.patchValue('');
      this.onlyAdhreForm.controls['taskId']?.patchValue('');
    }
    if(click){
      this.onlyAdhreForm.controls['botId'].patchValue(bot._id);
    }
    this.service.invoke('get.usecases', {
      streamId: bot._id,
      search: '',
      filterby: '',
      status: '',
      usecaseType: 'dialog',
      offset: 0,
      limit: -1,
    }).subscribe((data) => {
      if (data) {
        this.useCases = (data?.usecases || [])
        .reduce((acc, item)=>{
          acc[item.dialogId] = item.usecaseName;
          return acc;
        }, {});
      }
    });
  }

  selectUc(uc){
    ((this.adherenceForm as FormGroup).controls['adherence'] as FormGroup)
    .controls['taskId'].patchValue(uc.key);
  }

  dialogExec(ec){
    ((this.adherenceForm as FormGroup).controls['adherence'] as FormGroup)
      .controls['when'].patchValue(ec.key);
  }

  // selectBot(bot){
    
  // }

}
