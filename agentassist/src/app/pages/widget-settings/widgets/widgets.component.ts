import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ApiAdvancedModelComponent } from '../api-advanced-model/api-advanced-model.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') inputRef: ElementRef<HTMLInputElement>;

  isUnifiedPlatform: boolean = false;
  disableButtons: boolean =  false;
  subs = new SubSink();
  uploadedImgDetails: any = '';
  progress: number;
  logoSize: any;
  largeFileFlag = false;
  fileTypeFlag = false;
  validExtensions: string[] = ['.png'];
  uploadInprogress: boolean = false;
  selAcc = this.localstorage.getSelectedAccount();
  imgPreview: any;
  isLoading = false;
  isApiConfigured= true;
  currentAdvMode = '';
  iId = this.authService?.isLoadingOnSm && this.selAcc && this.selAcc?.instanceBots?.length ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
  channels = ['chat', 'voice', 'email'];
  landingPageTabs = {
    transcript: 'Transcription',
    assist: 'Assist',
    library: 'Library',
    mybot: 'My bot'
  }
  multiLanguageList = {
    en : 'English',
    ar : 'Arabic',
    kr : 'Korean',
    jp : 'Japanese',
    sp : 'Spanish',
    ge : 'German',
    fr : 'French'
  }
  numberOfLineList = {
    2 : "2 Minimum",
    3 : '3',
    4 : '4',
    5 : '5',
    6 : '6',
    7 : '7',
    8 : '8',
    9 : '9',
    10 : '10',
    [-1] : 'Maximum'
  }
  lineList = Object.keys(this.numberOfLineList);
  clonedWidgetSettings:any = {};
  newRoleModalRef: any = {};
  modalRef: any;  
  agentAssistFormGroup: FormGroup;
  knowledgeAIFormGroup: FormGroup;
  agentAssistformDirty : boolean = false;
  isV3= false;
  searchResultArr = [
      {type: 'alwaysShow', text: 'Always show', tooltip:'Display Knowledge AI results consistently, regardless of Bot Intents.'}, 
      {type: 'isXODependant', text: 'Show with XO results',tooltip:'Display Knowledge AI results when relevant Bot events (Dialog Tasks and FAQs) are detected.'}, 
      {type: 'fallback', text: 'Show as a Fallback event', tooltip:'Display Knowledge AI Results as a fallback when no Bot Intents are identified.'}
  ];
  AutoSuggestions = [{type:'On'}, {type: 'Off'}];
  URLBehaviour = [
      {type: 'defaultBehaviour', text: 'Default System Behaviour', tooltip: "The AgentAssist widget will use the system's default governing approach for URL opening."},
      {type: 'sendPostEvent', text: 'Post Event', tooltip:'The AgentAssist widget will open URLs based on the consumed "AgentAssist.UrlClickedMessage" post event.'}]
  integration = [
    {type:'basic', desc: 'Use Default Knowledge AI Configurations'}, 
    {type:'advance', desc:'Configure How You Want To Use Knowledge AI'}
  ]
  dialogTaskConfig = [
    {type: 'default', title: 'Default System Behaviour', desc: 'Use Default System Behaviour'},
    {type: 'advance', title: 'Advance Mode', desc: 'Define your custom script logic'}
  ]
  dataFormat = [
    {type:'Plain string', tooltip:'Transmit as plain text', value : 'plainString'},
    {type:'Original Format', tooltip: 'Transmit HTML tags exactly as they are received', value : 'original'}
  ]
  helpSupport = [
    {type:'Documentation', tooltip: 'Control accessibility to doc and customise URLs.', value : 'documentation'}, 
    {type:'FAQ', tooltip:'Control accessibility to FAQ and customise URLs.', value : 'faq'},
    {type:'Kore Academy', tooltip:'Control accessibility to Kore Academy', value : 'koreAcademy'}
  ]
  advancedModeScript: string = '';
  advanceDialogTaskModeScript: string = '';
  selectedChannel = 'chat';
  selectedKAIChannel = 'chat';
  isCoachingDisable = true;
  agentAssistSeedData : any = {};
  disableSaveButton : any = {
    channel : false,
    search : false,
    general : false
  }
  constructor(
    public workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public translate: TranslateService,
    private authService: AuthService,
    private localstorage: LocalStoreService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
  }

  selectTab(tab, key){
    (((((this.agentAssistFormGroup as FormGroup)
    .get('agentAssistSettings') as FormGroup)
    .get(this.selectedChannel) as FormGroup)
    .get('isWidgetLandingEnabled') as FormGroup)
    .get('tab') as FormControl)
    .patchValue(key);
  }

  selectLanguage(key){
    (((((this.agentAssistFormGroup as FormGroup)
    .get('agentAssistSettings') as FormGroup))
    .get('languageSettings') as FormGroup)
    .get('language') as FormControl)
    .patchValue(key);
  }

  createOrUpdateAgSettingsForm(obj?){
    let isUpdate = false;
    if(obj && Object.keys(obj)){
      isUpdate = true;
    }
    this.agentAssistFormGroup = this.fb.group({
      agentAssistSettings : this.fb.group({
        isCustomisedLogoEnabled: this.fb.group({
          isEnabled: [isUpdate ? (obj.isCustomisedLogoEnabled?.isEnabled??false) : false],
          fileId: [isUpdate ? (obj.isCustomisedLogoEnabled?.fileId??'') : ''],
          fileName: [isUpdate ? (obj.isCustomisedLogoEnabled?.fileName??'') : ''],
          hash: [isUpdate ? (obj.isCustomisedLogoEnabled?.hash??'') : '']
        }),
        botEvents: this.fb.group({
          fallback: this.fb.group({
              isEnabled: [isUpdate ? (obj.botEvents?.fallback?.isEnabled??false) : false],
          })
        }),
        urlOpenBehaviour : this.fb.group({
          urlOpenType: ['defaultBehaviour'],
          defaultBehaviour: [isUpdate ? (obj.urlOpenBehaviour?.defaultBehaviour ?? false) : false],
          sendPostEvent: [isUpdate ? (obj.urlOpenBehaviour?.sendPostEvent ?? false) : false]
        }),
        agentActions : this.fb.group({
          sharingFormat : [isUpdate ? (obj.agentActions?.sharingFormat ?? 'plainString') : 'plainString'],
        }),
        sentiment : this.fb.group({
          isEnabled: [isUpdate ? (obj.sentiment?.isEnabled ?? true) : true]
        }),
        intentExecution : this.fb.group({
          restartFunctionality : this.fb.group({
            isEnabled : [isUpdate ? (obj.intentExecution?.restartFunctionality?.isEnabled ?? true) : true]
          }),
          entityView : this.fb.group({
            isEnabled : [isUpdate ? (obj.intentExecution?.entityView?.isEnabled ?? true) : true]
          })
        }),
        languageSettings : this.fb.group({
          language : [isUpdate ? (obj.languageSettings?.language??'en') : 'en'],
          allowAgentSwitch : [isUpdate ? (obj.languageSettings?.allowAgentSwitch??false) : false],
        }),
        dialogsDisplayNameParser : this.fb.group({
          mode : [isUpdate ? (obj.dialogsDisplayNameParser?.mode ??'default'): 'default']
        }),
        showHelp : this.fb.group({
          isEnabled : [isUpdate ? (obj.showHelp?.isEnabled ?? true) : true],
          documentation : this.fb.group({
            isEnabled : [isUpdate ? (obj.showHelp?.documentation?.isEnabled ?? true) : true],
            resource : [isUpdate ? (obj.showHelp?.documentation?.resource ?? this.agentAssistSeedData?.defaultDocLink) : this.agentAssistSeedData?.defaultDocLink],
          }),
          faq : this.fb.group({
            isEnabled : [isUpdate ? (obj.showHelp?.faq?.isEnabled ?? true) : true],
            resource : [isUpdate ? (obj.showHelp?.faq?.resource ?? this.agentAssistSeedData?.defaultFAQLink) : this.agentAssistSeedData?.defaultFAQLink],
          }),
          koreAcademy : this.fb.group({
            isEnabled : [isUpdate ? (obj.showHelp?.koreAcademy?.isEnabled ?? true) : true]
          })
        }),
        chat: this.fb.group(this.commongSettingsForm(isUpdate, obj?.chat)),
        voice: this.fb.group(this.commongSettingsForm(isUpdate, obj?.voice)),
        email: this.fb.group(this.commongSettingsForm(isUpdate, obj?.email)),
      })
    });
    if(isUpdate) {
      let picked = obj?.urlOpenBehaviour
      let urlOpenType = 'defaultBehaviour';
      for(let key in picked){
        if(picked[key]){
          urlOpenType = key;
        }
      }
      (((this.agentAssistFormGroup.get('agentAssistSettings') as FormGroup).get('urlOpenBehaviour')as FormGroup)
      .get('urlOpenType') as FormControl)
      .patchValue(urlOpenType);

      if(obj.dialogsDisplayNameParser?.mode === 'advance') {
        ((this.agentAssistFormGroup.get('agentAssistSettings') as FormGroup).get('dialogsDisplayNameParser') as FormGroup).addControl('config', this.fb.group({
          script: [obj.dialogsDisplayNameParser.config.script || '']
        }))
        this.advanceDialogTaskModeScript = (obj.dialogsDisplayNameParser?.config?.script.length > 0) ? obj.dialogsDisplayNameParser?.config?.script : '';
      }
    }

    if(this.agentAssistFormGroup){
      for(let obj of this.helpSupport){
        let value = this.agentAssistFormGroup.get('agentAssistSettings')?.value?.showHelp[obj.value]?.isEnabled ?? true;
        this.resetValidations(value, obj.value);
      }
    }
  }

  createOrUpdateSearchForm(obj?){
    let isUpdate = false;
    let searchObj: any = {};
    if(obj && Object.keys(obj)){
      // searchObj = obj[this.selectedKAIChannel].searchAssistConfig
      isUpdate = true;
    }
    this.knowledgeAIFormGroup = this.fb.group({
      chat: this.fb.group(this.commonSearchAssistForm(isUpdate, obj?.chat, obj?.chat?.searchAssistConfig)),
      voice: this.fb.group(this.commonSearchAssistForm(isUpdate, obj?.voice, obj?.voice?.searchAssistConfig)),
      email: this.fb.group(this.commonSearchAssistForm(isUpdate, obj?.email, obj?.email?.searchAssistConfig)),
    });


/* Need to uncomment */

  }

  ngOnInit(): void {
    this.subs.sink = this.authService.isAgentCoachongEnable$.subscribe(isEnabled => {
      this.isCoachingDisable = isEnabled;
    });
    this.subs.sink = this.workflowService.seedData$.subscribe(res => {
      if(res && res?.agentAssistSeedData){
        this.agentAssistSeedData = res?.agentAssistSeedData;
      }
    });

    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((bot)=>{
      if(bot){
        this.isLoading = true;
        this.getAgentAssistSettingsNew();
      }
    });
    
    this.createOrUpdateAgSettingsForm();
    this.createOrUpdateSearchForm();
    this.isUnifiedPlatform = this.workflowService?.isUnifiedPlatform();
    this.isLoading = true;
    this.getAgentAssistSettingsNew();
  }

  // Get AgentAssist Settings in the Get API Call
  getAgentAssistSettingsNew() {
    this.disableButtons = true;
    let botId = this.workflowService?.getCurrentBtSmt(true)._id
    let params = {
      orgId: this.authService?.getOrgId(),
    };
    let body = {
      botId
    }
    this.service.invoke("get.agentAssistSettings", params, body).subscribe(
      (res) => {
        if (res) {
          this.clonedWidgetSettings = res;
          this.isLoading = false;
          this.createOrUpdateAgSettingsForm(res.agentAssistSettings);
          this.createOrUpdateSearchForm(res.agentAssistSettings);
          this.imgPreview = res?.agentAssistSettings?.isCustomisedLogoEnabled?.fileUrl;
        }
      },
      (err) => {
        this.isLoading = false;
        this.notificationService.showError(
          err,
          this.translate.instant("FALLBACK_ERROR_MSG")
        );
      }
    )
  }

  // Drag and Drop files method
  handleFileDrop(event: DragEvent) {
    if (event?.dataTransfer?.files?.length) {
      const files = event.dataTransfer.files;
      this.inputRef.nativeElement.files = files;
      this.addFiles(files);
    }
  }

  // adding the files by selection
  addFiles(files) {
    if(this.agentAssistFormGroup?.value?.agentAssistSettings?.isCustomisedLogoEnabled?.fileName !== '') {
      // this.inputRef.nativeElement.files = ;
      this.removeFile();
    }
    this.fileUploadCall(files[0]);
  }

  // file upload method
  fileUploadCall(file){
    if (file) {
      this.uploadedImgDetails = file.name;
      if(file?.size > 2000000){ // file size restricting to 2MB
        this.largeFileFlag = true;
        this.notificationService.notify(this.translate.instant('MAX_FILE_SIZE_PERMITED_MB', {size: 2}), "error");
        return;
      }
      const _ext = file.name.substring(file.name.lastIndexOf('.'));

      if (this.validExtensions.indexOf(_ext.toLowerCase()) === -1) {
        this.fileTypeFlag = true;
        this.notificationService.notify(this.translate.instant('NOTIFY.INVALID_EXT', {ext: this.validExtensions.join(', ').toUpperCase()}), "error");
        return;
      }
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileContext', 'marketplace');
        formData.append('fileExtension', file.name.substring(file.name.lastIndexOf('.') + 1));
        formData.append('Content-Type', file.type);
        self.uploadInprogress = true;
        const _params = { "userId": this.authService.getUserId() }
        this.progress = Math.round((100 / event.total) * event.loaded);
        this.service.invoke('post.uploadfaqfile', _params, formData)
        .pipe(finalize(() => { }))
          .subscribe(
            (res : any) => {
              this.largeFileFlag = false;
              this.fileTypeFlag = false;
              this.uploadedImgDetails = '';
              this.agentAssistFormGroup.patchValue({
                agentAssistSettings: ({
                  isCustomisedLogoEnabled: ({
                    fileName: file.name,
                    hash: res.hash,
                    fileId: res.fileId
                  })
                })
              });

              this.getuploadedLogoFileURL(res.fileId);
              this.notificationService.notify(this.translate.instant('NOTIFY.FILE_UPLOADED_SUCCESSFULLY'), "success");
              self.uploadInprogress = false;
            }, err => {
              this.notificationService.showError(err, this.translate.instant('NOTIFY.FAILED_TO_UPLOAD_FILE'));
              self.uploadInprogress = false;
            });
      };
    }
  }

  // get uploaded image preview method
  getuploadedLogoFileURL(fileId){
    this.service.invoke('get.uploadedLogo', {'fileId': fileId}).subscribe((res) => {
      if(res) {
        this.imgPreview = res.fileUrl;
      }
    })
  }

  // removed added files
  removeFile() {
    this.largeFileFlag = false;
    this.fileTypeFlag = false;
    this.uploadedImgDetails = '';
    this.agentAssistFormGroup.patchValue({
      agentAssistSettings: ({
        isCustomisedLogoEnabled: ({
          fileName: '',
          hash: '',
          fileId: ''
        })
      })
    });
  }

  // save AgentAssistSettings
  saveAgentAssistSettingsNew(settingType, type) {
    this.disableSaveButton[type] = true;
    let params = {
      orgId: this.authService?.getOrgId(),
      aasId: this.clonedWidgetSettings?.id
    };    
    const payload = {
      "orgId": this.authService?.getOrgId(),
      "accountId": this.localstorage?.getSelectedAccount()?.accountId,
      "iId": this.iId,
      "id": this.clonedWidgetSettings?.id,
      updatedByAId: this.clonedWidgetSettings?.updatedByAId,
      "agentAssistSettings" : {}
    }
    if(settingType === 'widget') {
      payload.agentAssistSettings = this.agentAssistFormGroup.value.agentAssistSettings;
      this.subs.sink = this.service.invoke("put.agentAssistSettings",params, payload)
      .pipe(finalize(() => this.disableSaveButton[type] = false))
      .subscribe(
        (res) => {
          if (res) {
            this.notificationService.showSuccess(this.translate.instant("AGENTASSIST_SETTINGS_SAVED"));
            this.disableButtons = false;
            this.clonedWidgetSettings = JSON.parse(JSON.stringify(res));
            this.createOrUpdateAgSettingsForm(res.agentAssistSettings);
            this.imgPreview = res?.agentAssistSettings?.isCustomisedLogoEnabled?.fileUrl;
          }
        },
        (err) => {
          this.createOrUpdateAgSettingsForm(this.clonedWidgetSettings.agentAssistSettings);
          this.disableButtons = false;
          this.notificationService.showError(
            err,
            this.translate.instant("SAVE_FALLBACK_ERROR_MSG")
          );
        }
      );
      // 
    } else {
      payload.agentAssistSettings = this.knowledgeAIFormGroup.value;
      this.subs.sink = this.service.invoke("put.agentAssistSettings",params, payload)
      .pipe(finalize(() => this.disableSaveButton[type] = false))
      .subscribe(
        (res) => {
          if (res) {
              this.notificationService.showSuccess(this.translate.instant("AGENTASSIST_SETTINGS_SAVED"));
              this.disableButtons = false;
            this.clonedWidgetSettings = JSON.parse(JSON.stringify(res));
            this.createOrUpdateSearchForm(res.agentAssistSettings)
            this.imgPreview = res?.agentAssistSettings?.isCustomisedLogoEnabled?.fileUrl;
          }
        },
        (err) => {
          this.disableButtons = false;
          this.createOrUpdateSearchForm(this.clonedWidgetSettings.agentAssistSettings)
          this.notificationService.showError(
            err,
            this.translate.instant("SAVE_FALLBACK_ERROR_MSG")
            
          );
        }
      );
    }
  }

  // API Configuration for the SearchAssist in Advanced Mode
  apiAdvancedMode() {
    this.modalRef = this.modalService.open(ApiAdvancedModelComponent, { centered: true, keyboard: false, windowClass: 'api-advance-mode', backdrop: 'static' });
    if(this.currentAdvMode === 'advance') {
      this.modalRef.componentInstance.data = this.advancedModeScript;
      this.modalRef.result.then(emitedValue => {
        this.advancedModeScript = emitedValue;
          ((((((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup).get('integrations') as FormGroup)
        .get('config') as FormGroup).get('script') as FormControl).patchValue(emitedValue);
          ((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup).get('integrations').updateValueAndValidity();
          if(this.knowledgeAIFormGroup.get(this.selectedKAIChannel)?.value?.searchAssistConfig?.integrations?.type === 'advance' && emitedValue?.length !== 0) {
            this.knowledgeAIFormGroup.markAsDirty();
            // this.isApiConfigured = true;
            this.advancedModeScript = '';
          } else {
            // this.isApiConfigured = false;
            this.advancedModeScript = '';
          }
      });
    } else if(this.currentAdvMode === 'advancemode') {
      this.modalRef.componentInstance.data = this.advanceDialogTaskModeScript;
      this.modalRef.result.then(emitedValue => {
        this.advanceDialogTaskModeScript = emitedValue;
        (((((this.agentAssistFormGroup as FormGroup).get('agentAssistSettings') as FormGroup).get('dialogsDisplayNameParser') as FormGroup)
        .get('config') as FormGroup).get('script') as FormControl).patchValue(emitedValue);
        if(this.agentAssistFormGroup?.value?.agentAssistSettings?.dialogsDisplayNameParser?.mode === 'advance' && emitedValue?.length !== 0) {
          this.knowledgeAIFormGroup.markAsDirty();
          // this.isApiConfigured = true;
          this.advanceDialogTaskModeScript = '';
        } else {
          // this.isApiConfigured = false;
          this.advanceDialogTaskModeScript = '';
        }
      }
      )};
      
    
  }

  // update the AutoSuggestions keys
  selectedSuggestionType(e, val) {
    ((((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup)
    .get('showAutoSuggestions') as FormControl)
    .patchValue((val.type === 'On') ? true : false);
  }

  selectLines(key){
    if(key){
      ((((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup)
      .get('displayLines') as FormControl)
      .patchValue(parseFloat(key));
    }
  }

  // open script editor for the DialogTask Display Name config Mode
  dialogConfigType(e, configType) {
    this.advanceDialogTaskModeScript = this.agentAssistFormGroup?.value?.agentAssistSettings?.dialogsDisplayNameParser?.config?.script;
    this.isApiConfigured = true;
    (((this.agentAssistFormGroup as FormGroup).get('agentAssistSettings') as FormGroup).get('dialogsDisplayNameParser') as FormGroup).removeControl('config');
    if(configType.type === 'advance') {
      this.currentAdvMode =  'advancemode';
      (((this.agentAssistFormGroup as FormGroup).get('agentAssistSettings') as FormGroup).get('dialogsDisplayNameParser') as FormGroup).addControl('config',this.fb.group({
        script: ['',[Validators.required]],
      }));
      this.apiAdvancedMode();
    }
  }

  // open script editor for the Advanced Mode
  selectedIntegrationType(e, integrate) {
    this.advancedModeScript = this.knowledgeAIFormGroup.get(this.selectedKAIChannel)?.value?.searchAssistConfig?.integrations?.config?.script;
    this.isApiConfigured = true;
    ((((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup).get('integrations') as FormGroup)
    .removeControl('config');
    if(integrate.type === 'advance') {
      this.currentAdvMode = integrate.type;
      ((((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup).get('integrations') as FormGroup)
      .addControl('config', this.fb.group({
        script: ['',[Validators.required]],
      }));
      this.apiAdvancedMode();
    }
  }

  // update search result keys
  getSelectedSearchResult(e, result) {
    let obj = {
      alwaysShow: false,
      fallback: false,
      isXODependant: false
    };
    obj[this.knowledgeAIFormGroup.get(this.selectedKAIChannel)?.value.searchAssistConfig.criteria] = true;
    ((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup)
    .get('searchAssistConfig') as FormGroup)
    .patchValue(obj);
    
/*     (((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup)
    .patchValue(obj); */
  }


  // Destroy all the subscribed event
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  commongSettingsForm(isUpdate, obj){
    let settingsForm = {
      agentAssistWidgetEnabled: [isUpdate ? (obj.agentAssistWidgetEnabled ?? false) : false],
      isProactiveEnabled: [isUpdate ? (obj.isProactiveEnabled ?? false) : false],
      isAgentCoachingEnabled: [isUpdate ? (obj.isAgentCoachingEnabled ?? false) : false],
      isAgentResponseEnabled: [isUpdate ? (obj.isAgentResponseEnabled ?? false) : true],
      isAgentResponseCopyEnabled: [isUpdate ? (obj.isAgentResponseCopyEnabled ?? false) : true],
      transcripts : this.fb.group({
        isEnabled : [isUpdate ? (obj.transcripts?.isEnabled??true) : true],
      }),
      summarization: this.fb.group({
        isEnabled : [isUpdate ? (obj.summarization?.isEnabled??false) : false],
        canSubmit : [isUpdate ? (obj.summarization?.canSubmit??false) : false]
      }),
      isAgentPlaybookEnabled: [isUpdate ? (obj.isAgentPlaybookEnabled ?? false) : false],
      isWidgetLandingEnabled: this.fb.group({
        tab: [isUpdate ? (obj.isWidgetLandingEnabled?.tab??'assist') : 'assist']
      }),
    }
    if(isUpdate && obj?.isWidgetLandingEnabled?.tab === "transcript" && !obj?.transcript?.isEnabled){
      this.selectTab(this.selectedChannel ,'assist');
    }
    return settingsForm;
  }

  commonSearchAssistForm(isUpdate, obj, searchObj){
    let criteria = 'alwaysShow';
    if(isUpdate){
      let picked = (({ alwaysShow, isXODependant, fallback }) => ({ alwaysShow, isXODependant, fallback }))(searchObj || {});
      for(let key in picked){
        if(picked[key]){
          criteria = key;
        }
      };
    }

    let KAIObj =  {
      isSearchAssistEnabled: [isUpdate ? (obj.isSearchAssistEnabled ?? false) : false],
      searchAssistConfig: this.fb.group({
        criteria: [isUpdate ? criteria : 'alwaysShow'], //need to check
        alwaysShow: [isUpdate ? (searchObj?.alwaysShow ?? false) : false],
        isXODependant: [isUpdate ? (searchObj?.isXODependant ?? false) : false],
        fallback: [isUpdate ? (searchObj?.fallback ?? false) : false],
        suggestVal: [isUpdate ? (searchObj?.showAutoSuggestions ? 'On' : 'Off') : 'On'], 
        showAutoSuggestions: [isUpdate ? (searchObj?.showAutoSuggestions ?? true) : true],
        displayLines : [isUpdate ? (searchObj?.displayLines ?? 4) : 4]
      })
    };

    let integrations: FormGroup;
    if(isUpdate && searchObj?.integrations?.type === 'advance'){
      integrations = this.fb.group({
        type: ['advance'],
        config: this.fb.group({
          script: [searchObj.integrations?.config.script || '', [Validators.required]]
        })
      });
    }else{
      integrations = this.fb.group({
        type: ['basic'],
      });
    }
    (KAIObj['searchAssistConfig'] as FormGroup).addControl('integrations', integrations);
    console.log(KAIObj, "KAI object *************");
    
    return KAIObj;
  }

  chooseChannel(channel){
    this.selectedChannel = channel;
    this.agentAssistFormGroup.updateValueAndValidity();
  }

  chooseKAIChannel(channel){
    this.selectedKAIChannel = channel;
    this.knowledgeAIFormGroup.updateValueAndValidity();
  }

  cancleAgentAssistSettingsNew(type?){
    if(type === 'widget'){
      this.createOrUpdateAgSettingsForm(this.clonedWidgetSettings.agentAssistSettings);
    }else{
      this.createOrUpdateSearchForm(this.clonedWidgetSettings.agentAssistSettings);
    }
  }

  selectedURLOpeningBehaviourType(e, val) {
    let obj = {
      defaultBehaviour: false,
      sendPostEvent: false,
      urlOpenType: 'defaultBehaviour'
    }
    obj[val] = true;
    obj.urlOpenType = val;
    (((this.agentAssistFormGroup as FormGroup).get('agentAssistSettings') as FormGroup).get('urlOpenBehaviour') as FormGroup).patchValue(obj);
  }

  resetValidations(value, key){
    const FormGroup = (this.agentAssistFormGroup.get('agentAssistSettings.showHelp') as FormGroup);
    if(FormGroup){
      const resourceParentGroup = FormGroup.get(key) as FormGroup;
      if(resourceParentGroup){        
        const resourceFormControl = resourceParentGroup.get('resource');
        if(resourceFormControl){          
          if(value){
            resourceFormControl.setValidators([Validators.required, Validators.pattern('https?://.+')]);
          }else{
            resourceFormControl.clearValidators();
          }
          resourceFormControl.updateValueAndValidity();
        }
      }
    }
  }

  transcriptControlChange(event){
    let selectedLandingTab = (this.agentAssistFormGroup as FormGroup).get('agentAssistSettings').value[this.selectedChannel]?.isWidgetLandingEnabled?.tab; 
    if(!event.target.checked && selectedLandingTab === 'transcript'){
      this.selectTab(this.selectedChannel ,'assist');
    }
  }

  resetClick(key){
    let defaultUrl = (key === 'documentation') ? this.agentAssistSeedData?.defaultDocLink : this.agentAssistSeedData?.defaultFAQLink;
    ((((((this.agentAssistFormGroup as FormGroup)
    .get('agentAssistSettings') as FormGroup))
    .get('showHelp') as FormGroup)
    .get(key) as FormGroup)
    .get('resource') as FormControl)
    .patchValue(defaultUrl);
  }

}
