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
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  @ViewChild('myDropdown', { static: false }) myDropdown: NgbDropdown;
  @ViewChild('conversationTransferDropdown') conversationTransferDropdown : NgbDropdown;

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
    library: 'Search',
    mybot: 'My bot'
  }
  multiLanguageList = {
    en : 'English',
    ar : 'Arabic',
    ko : 'Korean',
    ja : 'Japanese',
    es : 'Spanish',
    de : 'German',
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
  currentBot: any;
  useCases = {};
  linkedBotObjs:any = [];
  loaded = false;
  botId = this.workflowService.getCurrentBtSmt(true)._id;
  searchResultArr = [
      {type: 'alwaysShow', text: 'Always show', tooltip:'Display Knowledge AI results consistently, regardless of Bot Intents.'}, 
      {type: 'isXODependant', text: 'Show with XO results',tooltip:'Display Knowledge AI results when relevant Bot events (Dialog Tasks and FAQs) are detected.'}, 
      {type: 'fallback', text: 'Show as a Fallback event', tooltip:'Display Knowledge AI Results as a fallback when no Bot Intents are identified.'}
  ];
  AutoSuggestions = [{type:'On'}, {type: 'Off'}];
  summaryModelType = [
    {type:'kore', text:'OOTB Kore Summarization', tooltip:'The default Kore summarization model will be used'}, 
    {type:'customTask',text:'Custom Dialog Task', tooltip:'Ensure that this dialog task has only one message node.This message node will hold summarization content.'}]
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
  ];
  conversationTransferTypes = [
    { type: 'cold', tooltip: 'When Agent 1 transfer call to Agent 2', title: 'Cold Transfer'},
    { type: 'warm', tooltip: 'When Agent 1 invites Agent 2 to conference call' , title: 'Warm Transfer'}
  ];
  afterTransferSettings = [
    {type:'scrollToTop', text : 'Scroll up to First Message'},
    {type:'default', text : ' Continue from the Last Message'},
    {type:'task', text : 'Configure Dialog Task'},
  ];
  advancedModeScript: string = '';
  advanceDialogTaskModeScript: string = '';
  selectedChannel = 'chat';
  selectedKAIChannel = 'chat';
  currentSelectedBotDialogs: any = [];
  selectedDialog: any;
  isCoachingDisable = true;
  agentAssistSeedData : any = {};
  disableSaveButton : any = {
    channel : false,
    search : false,
    general : false
  }
  defaultDocLink : string = "https://docs.kore.ai/agentassist/";
  defaultFAQLink : string = "https://docs.kore.ai/agentassist/frequently-asked-questions/faq/";
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
            resource : [isUpdate ? (obj.showHelp?.documentation?.resource ?? this.defaultDocLink) : this.defaultDocLink],
          }),
          faq : this.fb.group({
            isEnabled : [isUpdate ? (obj.showHelp?.faq?.isEnabled ?? true) : true],
            resource : [isUpdate ? (obj.showHelp?.faq?.resource ?? this.defaultFAQLink) : this.defaultFAQLink],
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
    this.isUnifiedPlatform = this.workflowService?.isUnifiedPlatform();
    // this.initLoad(this.workflowService.getCurrentBt(true));
    // if(this.isUnifiedPlatform) {
      this.initLoad(this.workflowService.getCurrentBtSmt(true));
    // } else {
    //   this.initLoad(this.workflowService.getCurrentBt(true));
    // }

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
    this.isLoading = true;
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((bot)=>{
      if(bot){
        this.currentSelectedBotDialogs = [];
        this.useCases = {};
        this.linkedBotObjs = [];
        this.initLoad(bot);
      }
    });
  }

  closeDropdown(from) {
    if (from === 'summaryModel' && this.myDropdown) {
      this.myDropdown.close();
    } else if(from === 'convosTransfer' && this.conversationTransferDropdown) {
      this.conversationTransferDropdown.close();
    }
  }

  initLoad(bot?) {
    this.currentBot = bot;
    if(this.currentBot.type === 'universalbot') {
      this.getLinkedBots();  
      } else {
        this.botId = this.currentBot._id;
        this.getAgentAssistSettingsNew();
        this.getUseCases(this.botId);
        this.currentSelectedBotDialogs = [];
    }
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
    let scriptFrom = {'value': '',
                      'emitType': ''};
    this.modalRef = this.modalService.open(ApiAdvancedModelComponent, { centered: true, keyboard: false, windowClass: 'api-advance-mode', backdrop: 'static' });
    if(this.currentAdvMode === 'advance') {
      scriptFrom.value = this.advancedModeScript;
      scriptFrom.emitType = this.currentAdvMode;
      this.modalRef.componentInstance.data = scriptFrom;
      this.modalRef.result.then(emitedValue => {
        this.advancedModeScript = emitedValue;
          ((((((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup).get('integrations') as FormGroup)
        .get('config') as FormGroup).get('script') as FormControl).patchValue(emitedValue);
          ((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup).get('integrations').updateValueAndValidity();
          if(this.knowledgeAIFormGroup.get(this.selectedKAIChannel)?.value?.searchAssistConfig?.integrations?.type === 'advance' && emitedValue?.length !== 0) {
            this.knowledgeAIFormGroup.markAsDirty();
            // this.isApiConfigured = true;
          }
          this.currentAdvMode = '';
          this.advancedModeScript = '';
          scriptFrom.value = '';
          scriptFrom.emitType = '';
      });
    } else if(this.currentAdvMode === 'advancemode') {
      scriptFrom.value = this.advanceDialogTaskModeScript;
      scriptFrom.emitType = this.currentAdvMode;
      this.modalRef.componentInstance.data = scriptFrom;
      this.modalRef.result.then(emitedValue => {
        
        try {
          if(JSON.parse(emitedValue)) {
            this.advanceDialogTaskModeScript = emitedValue;
            (((((this.agentAssistFormGroup as FormGroup).get('agentAssistSettings') as FormGroup).get('dialogsDisplayNameParser') as FormGroup)
            .get('config') as FormGroup).get('script') as FormControl).patchValue(emitedValue);
            if(this.agentAssistFormGroup?.value?.agentAssistSettings?.dialogsDisplayNameParser?.mode === 'advance' && emitedValue?.length !== 0) {
              this.knowledgeAIFormGroup.markAsDirty();
              this.isApiConfigured = true;
            } 
            this.currentAdvMode = '';
            this.advanceDialogTaskModeScript = '';
            scriptFrom.value = '';
            scriptFrom.emitType = '';
            }
        } catch (err) {
          this.isApiConfigured = false;
          this.advanceDialogTaskModeScript = emitedValue;
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
    let settingsForm : any = {
      agentAssistWidgetEnabled: [isUpdate ? (obj.agentAssistWidgetEnabled ?? false) : false],
      isProactiveEnabled: [isUpdate ? (obj.isProactiveEnabled ?? false) : false],
      isAgentCoachingEnabled: [isUpdate ? (obj.isAgentCoachingEnabled ?? false) : false],
      isAgentResponseEnabled: [isUpdate ? (obj.isAgentResponseEnabled ?? false) : true],
      isAgentResponseCopyEnabled: [isUpdate ? (obj.isAgentResponseCopyEnabled ?? false) : true],
      transferConfigs : this.fb.group({
        cold: this.fb.group({
          isEnabled: [isUpdate ? (obj.transferConfigs?.cold?.isEnabled ?? false) : false],
          actionType: [isUpdate ? (obj.transferConfigs?.cold?.actionType ?? 'default') : 'default']
        }),
        warm: this.fb.group({
          isEnabled: [isUpdate ? (obj.transferConfigs?.warm?.isEnabled ?? false) : false],
          actionType: [isUpdate ? (obj.transferConfigs?.warm?.actionType ?? 'default') : 'default']
        })
      }),
      transcripts : this.fb.group({
        isEnabled : [isUpdate ? (obj.transcripts?.isEnabled??true) : true],
      }),
      summarization: this.fb.group({
        isEnabled : [isUpdate ? (obj.summarization?.isEnabled??false) : false],
        canSubmit : [isUpdate ? (obj.summarization?.canSubmit??false) : false],
        model: this.fb.group({
          type: [isUpdate ? (obj?.summarization?.model?.type ?? 'kore') : 'kore']
        })
      }),
      isAgentPlaybookEnabled: [isUpdate ? (obj.isAgentPlaybookEnabled ?? false) : false],
      isAutoScrollEnabled : [isUpdate ? (obj.isAutoScrollEnabled ?? true) : true],
      isWidgetLandingEnabled: this.fb.group({
        tab: [isUpdate ? (obj.isWidgetLandingEnabled?.tab??'assist') : 'assist']
      }),
    }
    if(isUpdate && obj?.isWidgetLandingEnabled?.tab === "transcript" && !obj?.transcript?.isEnabled){
      this.selectTab(this.selectedChannel ,'assist');
    }
    if(isUpdate && obj?.summarization?.model?.type === 'customTask') {

      ((settingsForm.summarization as FormGroup).get('model') as FormGroup).addControl('customTaskConfig', this.fb.group({
        usecaseId: obj?.summarization?.model?.customTaskConfig?.usecaseId,
        refId: obj?.summarization?.model?.customTaskConfig?.refId,
        dialogId: obj?.summarization?.model?.customTaskConfig?.dialogId,
        taskRefId: obj?.summarization?.model?.customTaskConfig?.taskRefId,
        linkedBotId: obj?.summarization?.model?.customTaskConfig?.linkedBotId
      }))
      if(this.currentBot.type === 'universalbot' && obj?.summarization?.model?.customTaskConfig?.linkedBotId !== '') {
        this.selectCustomBot( obj?.summarization?.model?.customTaskConfig?.linkedBotId, isUpdate, obj, 'customTask'); 
      }else {
        if(this.currentSelectedBotDialogs.lenght <= 0) {
          this.getUseCases(this.currentBot._id, isUpdate, obj, 'customTask')
        }
      }
    }

    if(isUpdate) {
      if( obj?.transferConfigs?.cold?.actionType === 'task') {
        ((settingsForm.transferConfigs as FormGroup).get('cold') as FormGroup).addControl('taskConfigs', this.fb.group({
          usecaseId: obj?.transferConfigs?.cold?.taskConfigs?.usecaseId || '',
          refId: obj?.transferConfigs?.cold?.taskConfigs?.refId || '',
          dialogId: obj?.transferConfigs?.cold?.taskConfigs?.dialogId || '',
          taskRefId: obj?.transferConfigs?.cold?.taskConfigs?.taskRefId || '',
          linkedBotId: obj?.transferConfigs?.cold?.taskConfigs?.linkedBotId || '',
          extractIntents: obj?.transferConfigs?.cold?.taskConfigs?.extractIntents || ''
        }));
        if(obj?.transferConfigs?.cold?.taskConfigs?.linkedBotId !== '') {
          this.selectCustomBot( obj?.transferConfigs?.cold?.taskConfigs?.linkedBotId, isUpdate, obj, 'cold'); 
        }else {
          this.getUseCases(this.currentBot._id, isUpdate, obj, 'cold')
        }
      }
      if( obj?.transferConfigs?.warm?.actionType === 'task') {
        ((settingsForm.transferConfigs as FormGroup).get('warm') as FormGroup).addControl('taskConfigs', this.fb.group({
          usecaseId: obj?.transferConfigs?.warm?.taskConfigs?.usecaseId || '',
          refId: obj?.transferConfigs?.warm?.taskConfigs?.refId || '',
          dialogId: obj?.transferConfigs?.warm?.taskConfigs?.dialogId || '',
          taskRefId: obj?.transferConfigs?.warm?.taskConfigs?.taskRefId || '',
          linkedBotId: obj?.transferConfigs?.warm?.taskConfigs?.linkedBotId || '',
          extractIntents: obj?.transferConfigs?.warm?.taskConfigs?.extractIntents || ''
        }));
          if(obj?.transferConfigs?.warm?.taskConfigs?.linkedBotId !== '') {
            this.selectCustomBot( obj?.transferConfigs?.warm?.taskConfigs?.linkedBotId, isUpdate, obj, 'warm'); 
          }else {
            this.getUseCases(this.currentBot._id, isUpdate, obj, 'warm')
          }
      }
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
    let defaultUrl = (key === 'documentation') ? this.defaultDocLink : this.defaultFAQLink;
    ((((((this.agentAssistFormGroup as FormGroup)
    .get('agentAssistSettings') as FormGroup))
    .get('showHelp') as FormGroup)
    .get(key) as FormGroup)
    .get('resource') as FormControl)
    .patchValue(defaultUrl);
  }

  autoSummaryEnabled(evt) {
    if(evt.target.checked) {
      (((((this.agentAssistFormGroup as FormGroup)
      .get('agentAssistSettings') as FormGroup)
      .get(this.selectedChannel) as FormGroup)
      .get('summarization') as FormGroup)
      .get('model') as FormGroup).patchValue({
        type: 'kore'
      })
    }
  }


  getUseCases(botId, isUpdate?, settings?, confType?){
    // limit=:limit&offset=:offset&search=:search&filterby=:filterby&usecaseType=:usecaseType&status=:status&isAgentAssist=true
    this.service.invoke('get.usecases', {
      streamId: botId,
      search: '',
      filterby: '',
      status: '',
      usecaseType: 'dialog',
      offset: 0,
      limit: -1,

    }).subscribe((data) => {
      if(data.usecases) {        
        this.currentSelectedBotDialogs = data.usecases;
        this.currentSelectedBotDialogs.forEach(obj => {
          this.useCases[obj.taskRefId] = obj.usecaseName;
        })
      }
    });
  }

  getLinkedBots(){
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.currentBot._id
    }
    this.service.invoke('get.bt.stream', params).subscribe(data => {
      if(data){
        this.linkedBotObjs = [...data.configuredBots, ...data.publishedBots];
        this.getAgentAssistSettingsNew();
      }
    });
  }

  

  selectedSummaryModelType(event, model) {
    ((((((this.agentAssistFormGroup as FormGroup)
      .get('agentAssistSettings') as FormGroup)
      .get(this.selectedChannel) as FormGroup)
      .get('summarization') as FormGroup)
      .get('model') as FormGroup)
      .get('type') as FormControl).patchValue(model.type);

      if(model.type === 'customTask') {
        ((((((this.agentAssistFormGroup as FormGroup)
          .get('agentAssistSettings') as FormGroup)
          .get(this.selectedChannel) as FormGroup)
          .get('summarization') as FormGroup)
          .get('model') as FormGroup)
          .addControl('customTaskConfig', this.fb.group({
            usecaseId: '',
            refId: ['', [Validators.required]],
            dialogId: ['', [Validators.required]],
            taskRefId: ['', [Validators.required]],
            linkedBotId: ''
          })))
      } else if(model.type === 'kore'){
        ((((((this.agentAssistFormGroup as FormGroup)
        .get('agentAssistSettings') as FormGroup)
        .get(this.selectedChannel) as FormGroup)
        .get('summarization') as FormGroup)
        .get('model') as FormGroup).removeControl('customTaskConfig'));
      }
  }

  selectCustomDialog(dialog, from, bot?, transferType?) {
    const selectedFormGroup = transferType === 'cold' ? 'cold' : 'warm';
    if(from === 'convosTransfer') {
      const taskConfigFormGroup = (((((((this.agentAssistFormGroup as FormGroup)
      .get('agentAssistSettings') as FormGroup)
      .get(this.selectedChannel) as FormGroup)
      .get('transferConfigs') as FormGroup)
      .get(selectedFormGroup) as FormGroup)
      .get('taskConfigs') as FormGroup));

      if (taskConfigFormGroup) {
        taskConfigFormGroup.patchValue({
          usecaseId: dialog?._id || '',
          refId: dialog?.refId || '',
          dialogId: dialog?.dialogId || '',
          taskRefId: dialog?.taskRefId || '',
          linkedBotId: bot?._id || ''
        });
      } else {
        (((((((this.agentAssistFormGroup as FormGroup)
        .get('agentAssistSettings') as FormGroup)
        .get(this.selectedChannel) as FormGroup)
        .get('transferConfigs') as FormGroup)
        .get(selectedFormGroup) as FormGroup)
        .addControl('taskConfigs', this.fb.group({
          usecaseId: dialog?._id || '',
          refId: [dialog?.refId ||  '', [Validators.required]],
          dialogId: [dialog?.dialogId || '', [Validators.required]],
          taskRefId: [dialog?.taskRefId ||  '', [Validators.required]],
          linkedBotId: bot?._id || '',
          extractIntents: false}))));
      }
      if(bot) {
        this.closeDropdown('convosTransfer');
      }
    } else if( from === 'summaryModel') {
      const customTaskConfigFormGroup = (((((((this.agentAssistFormGroup as FormGroup)
                                      .get('agentAssistSettings') as FormGroup)
                                      .get(this.selectedChannel) as FormGroup)
                                      .get('summarization') as FormGroup)
                                      .get('model') as FormGroup)
                                      .get('customTaskConfig') as FormGroup));
      if (customTaskConfigFormGroup) {
        customTaskConfigFormGroup.patchValue({
          usecaseId: dialog?._id || '',
          refId: dialog?.refId || '',
          dialogId: dialog?.dialogId || '',
          taskRefId: dialog?.taskRefId || '',
          linkedBotId: bot?._id || ''
        });
      } else {
        const newFormGroup = new FormGroup({
          usecaseId: new FormControl(dialog?._id || ''),
          refId: new FormControl(dialog?.refId || ''),
          dialogId: new FormControl(dialog?.dialogId || ''),
          taskRefId: new FormControl(dialog?.taskRefId || ''),
          linkedBotId: new FormControl(bot?._id || '')
        });
        (((((((this.agentAssistFormGroup as FormGroup)
        .get('agentAssistSettings') as FormGroup)
        .get(this.selectedChannel) as FormGroup)
        .get('summarization') as FormGroup)
        .get('model') as FormGroup)
        .addControl('customTaskConfig', newFormGroup)));
    }
    if(bot) {
      this.closeDropdown('summaryModel');
    }
  }
    
  }

  selectCustomBot(childBotDetails, isUpdate?, obj?, confType?) {
    this.loaded = false;
    let childBotObj:any = {};
    if(this.linkedBotObjs.length > 0) {
      let checkchildBotObj =this.linkedBotObjs.find(obj => obj._id === childBotDetails);
      if(checkchildBotObj && !checkchildBotObj['dialogs'] ) {
        this.service.invoke('get.usecases', {
          streamId: childBotDetails,
          search: '',
          filterby: '',
          status: '',
          usecaseType: 'dialog',
          offset: 0,
          limit: -1,
        }).subscribe((data) => {
          if (data.usecases) {      
            this.linkedBotObjs.forEach(bot => {
                if (bot._id == childBotDetails) {
                    bot.dialogs = data.usecases;
                    childBotObj = data.usecases;
                    childBotObj.forEach(obj => {
                      this.useCases[obj.taskRefId] = obj.usecaseName;
                    })
                }
            });
            this.loaded = true;
        }
        });
      } 
    }
  }

  getAfterTransferText(transferType: string): string {
    const actionType = this.agentAssistFormGroup.get('agentAssistSettings').value[this.selectedChannel]?.transferConfigs[transferType]?.actionType;
    const afterTransferSetting = this.afterTransferSettings.find(setting => setting.type === actionType);
    return afterTransferSetting ? afterTransferSetting.text : '';
  }
  
  getActionType(setting, transferType) {
    const selectedFormGroup = transferType === 'cold' ? 'cold' : 'warm';
    (((((((this.agentAssistFormGroup as FormGroup)
    .get('agentAssistSettings') as FormGroup)
    .get(this.selectedChannel) as FormGroup)
    .get('transferConfigs') as FormGroup)
    .get(selectedFormGroup) as FormGroup)
    .get('actionType') as FormControl).patchValue(setting));

    if(setting !== 'task') {
      const taskConfigFormGroup = (((((((this.agentAssistFormGroup as FormGroup)
      .get('agentAssistSettings') as FormGroup)
      .get(this.selectedChannel) as FormGroup)
      .get('transferConfigs') as FormGroup)
      .get(selectedFormGroup) as FormGroup)
      .get('taskConfigs') as FormGroup));
      if(taskConfigFormGroup) {
        (((((((this.agentAssistFormGroup as FormGroup)
        .get('agentAssistSettings') as FormGroup)
        .get(this.selectedChannel) as FormGroup)
        .get('transferConfigs') as FormGroup)
        .get(selectedFormGroup) as FormGroup)
        .removeControl('taskConfigs')));
      }
    }


  }
  
  // Extract intents from the Dialog
  toggleExtractIntents(event, transferType) {    
    const selectedFormGroup = transferType === 'cold' ? 'cold' : 'warm';
    const taskConfigs = (((((((this.agentAssistFormGroup as FormGroup)
                        .get('agentAssistSettings') as FormGroup)
                        .get(this.selectedChannel) as FormGroup)
                        .get('transferConfigs') as FormGroup)
                        .get(selectedFormGroup) as FormGroup)
                        .get('taskConfigs') as FormGroup));
    if (taskConfigs) {
      taskConfigs.patchValue({
        extractIntents: event.target.checked
      })
    } else {
      const intentExtract = (((((((this.agentAssistFormGroup as FormGroup)
                        .get('agentAssistSettings') as FormGroup)
                        .get(this.selectedChannel) as FormGroup)
                        .get('transferConfigs') as FormGroup)
                        .get(selectedFormGroup) as FormGroup)));
      intentExtract.addControl('taskConfigs', this.fb.group({
        'extractIntents': event.target.checked
      }))
    }
    
  }

  extractIntentsChecked(transferType: string): boolean {
    const taskConfigs = this.agentAssistFormGroup.get('agentAssistSettings').value[this.selectedChannel]?.transferConfigs[transferType]?.taskConfigs;
    return taskConfigs ? taskConfigs.extractIntents : false; // Assuming default value is false if not set
}

  handleTransferCheckboxClick(event, transferType) {
    if(!event.target.checked){
      this.toggleExtractIntents(event, transferType)
    }
  }

}
