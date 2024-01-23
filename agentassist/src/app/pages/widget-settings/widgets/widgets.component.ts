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
  iId = this.authService?.isLoadingOnSm && this.selAcc && this.selAcc?.instanceBots?.length ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
  channels = ['chat', 'voice', 'email'];
  landingPageTabs = {
    transcript: 'Transcription',
    assist: 'Assist',
    library: 'Library',
    mybot: 'My bot'
  }
  clonedWidgetSettings:any = {};
  newRoleModalRef: any = {};
  modalRef: any;  
  agentAssistFormGroup: FormGroup;
  knowledgeAIFormGroup: FormGroup;
  agentAssistformDirty : boolean = false;
  searchResultArr = [
      {type: 'alwaysShow', text: 'Always show', tooltip:'Display Knowledge AI results consistently, regardless of Bot Intents.'}, 
      {type: 'isXODependant', text: 'Show with XO results',tooltip:'Display Knowledge AI results when relevant Bot events (Dialog Tasks and FAQs) are detected.'}, 
      {type: 'fallback', text: 'Show as a Fallback event', tooltip:'Display Knowledge AI Results as a fallback when no Bot Intents are identified.'}
  ];
  AutoSuggestions = [{type:'On'}, {type: 'Off'}];
  integration = [
    {type:'basic', desc: 'Use default Knowledge AI Configurations'}, 
    {type:'advance', desc:'Configure how you want to use Knowledge AI'}
  ]
  advancedModeScript: string = '';
  selectedChannel = 'chat';
  selectedKAIChannel = 'chat';
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
        chat: this.fb.group(this.commongSettingsForm(isUpdate, obj?.chat)),
        voice: this.fb.group(this.commongSettingsForm(isUpdate, obj?.voice)),
        email: this.fb.group(this.commongSettingsForm(isUpdate, obj?.email)),
      })
    })
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
  saveAgentAssistSettingsNew(settingType) {
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
  }

  // update the AutoSuggestions keys
  selectedSuggestionType(e, val) {
    ((((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup)
    .get('showAutoSuggestions') as FormControl)
    .patchValue((val.type === 'On') ? true : false);
  }

  // open script editor for the Advanced Mode
  selectedIntegrationType(e, integrate) {
    this.advancedModeScript = this.knowledgeAIFormGroup.get(this.selectedKAIChannel)?.value?.searchAssistConfig?.integrations?.config?.script;
    this.isApiConfigured = true;
    ((((this.knowledgeAIFormGroup.get(this.selectedKAIChannel) as FormGroup).get('searchAssistConfig') as FormGroup) as FormGroup).get('integrations') as FormGroup)
    .removeControl('config');
    if(integrate.type === 'advance') {
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

  // cancel agentassist Settings
  cancleAgentAssistSettingsNew() {

  }


  // Destroy all the subscribed event
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  commongSettingsForm(isUpdate, obj){
    return {
      agentAssistWidgetEnabled: [isUpdate ? (obj.agentAssistWidgetEnabled ?? false) : false],
      isProactiveEnabled: [isUpdate ? (obj.isProactiveEnabled ?? false) : false],
      isAgentCoachingEnabled: [isUpdate ? (obj.isAgentCoachingEnabled ?? false) : false],
      isAgentResponseEnabled: [isUpdate ? (obj.isAgentResponseEnabled ?? false) : true],
      isAgentResponseCopyEnabled: [isUpdate ? (obj.isAgentResponseCopyEnabled ?? false) : true],
      summarization: this.fb.group({
        isEnabled : [isUpdate ? (obj.summarization?.isEnabled??false) : false],
        canSubmit : [isUpdate ? (obj.summarization?.canSubmit??false) : false]
      }),
      isAgentPlaybookEnabled: [isUpdate ? (obj.isAgentPlaybookEnabled ?? false) : false],
      isWidgetLandingEnabled: this.fb.group({
        tab: [isUpdate ? (obj.isWidgetLandingEnabled?.tab??'assist') : 'assist']
      }),
    }
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
        integrations : this.fb.group({
          type: [ isUpdate ? (searchObj?.integrations?.type || 'basic') : 'basic']
        })
      })
    };

    if(isUpdate && searchObj?.integrations?.type === 'advance'){
      KAIObj["searchAssistConfig"]['integrations'] = this.fb.group({
        type: ['advance'],
        "config": this.fb.group({
          "script": [searchObj.integrations?.config.script || '', [Validators.required]]
        })
        // script: [searchObj.integrations?.config.script || '', [Validators.required]]
      })
    }
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

}
