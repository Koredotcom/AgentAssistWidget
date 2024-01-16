import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { clone } from 'src/app/helpers/utils';
import { map, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
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
  clonedWidgetSettings: any;
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

  landingPageTabs = {
    transcript: 'Transcription',
    assist: 'Assist',
    library: 'Library',
    mybot: 'My bot'
  }

  

  

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
    // agentAssistSettings Form object

    
    // KnowledgeFromObject

  }

  selectTab(tab, key){
    (((((this.agentAssistFormGroup as FormGroup)
    .get('agentAssistSettings') as FormGroup)
    .get('isWidgetLandingEnabled') as FormGroup)
    .get(tab) as FormGroup)
    .get('tab') as FormControl)
    .patchValue(key);
    this.agentAssistFormGroup.markAsDirty();
  }

  createOrUpdateAgSettingsForm(obj?){
    let isUpdate = false;
    if(obj && Object.keys(obj)){
      isUpdate = true;
    }
    this.agentAssistFormGroup = this.fb.group({
      agentAssistSettings: this.fb.group({
        agentAssistWidgetEnabled: [isUpdate ? (obj.agentAssistWidgetEnabled ?? false) : false],
        isProactiveEnabled: [isUpdate ? (obj.isProactiveEnabled ?? false) : false],
        isAgentCoachingEnabled: [isUpdate ? (obj.isAgentCoachingEnabled ?? false) : false],
        isAgentResponseEnabled: [isUpdate ? (obj.isAgentResponseEnabled ?? false) : true],
        summarization: this.fb.group({
          isEnabled : [isUpdate ? (obj.summarization?.isEnabled??false) : false],
          canSubmit : [isUpdate ? (obj.summarization?.canSubmit??false) : false]
        }),
        isAgentPlaybookEnabled: [isUpdate ? (obj.isAgentPlaybookEnabled ?? false) : false],
        isWidgetLandingEnabled: this.fb.group({
          isEnabled: [isUpdate ? (obj.isWidgetLandingEnabled?.isEnabled??false) : false],
          chat: this.fb.group({
            isEnabled: [isUpdate ? (obj.isWidgetLandingEnabled?.chat?.isEnabled??false) : false],
            tab: [isUpdate ? (obj.isWidgetLandingEnabled?.chat?.tab??'assist') : 'assist']
          }),
          voice: this.fb.group({
            isEnabled: [isUpdate ? (obj.isWidgetLandingEnabled?.voice?.isEnabled??false) : false],
            tab: [isUpdate ? (obj.isWidgetLandingEnabled?.voice?.tab??'transcript') : 'transcript']
          })
        }),
        botEvents: this.fb.group({
          fallback: this.fb.group({
              isEnabled: [isUpdate ? (obj.botEvents?.fallback?.isEnabled??false) : false],
          })
        }),
        isCustomisedLogoEnabled: this.fb.group({
          isEnabled: [isUpdate ? (obj.isCustomisedLogoEnabled?.isEnabled??false) : false],
          fileId: [isUpdate ? (obj.isCustomisedLogoEnabled?.fileId??'') : ''],
          fileName: [isUpdate ? (obj.isCustomisedLogoEnabled?.fileName??'') : ''],
          hash: [isUpdate ? (obj.isCustomisedLogoEnabled?.hash??'') : '']
        })
      })
    });
  }

  createOrUpdateSearchForm(obj?){
    let isUpdate = false;
    let searchObj: any = {};
    if(obj && Object.keys(obj)){
      searchObj = obj.searchAssistConfig
      isUpdate = true;
    }
    this.knowledgeAIFormGroup = this.fb.group({
      isSearchAssistEnabled: [isUpdate ? obj.isSearchAssistEnabled : false],
      searchAssistConfig: this.fb.group({
        criteria: ['alwaysShow'], //need to check
        alwaysShow: [isUpdate ? (searchObj?.alwaysShow ?? false) : false],
        isXODependant: [isUpdate ? (searchObj?.isXODependant ?? false) : false],
        fallback: [isUpdate ? (searchObj?.fallback ?? false) : false],
        suggestVal: [isUpdate ? (searchObj?.showAutoSuggestions ? 'On' : 'Off') : 'On'], 
        showAutoSuggestions: [isUpdate ? (searchObj?.showAutoSuggestions ?? true) : true],
        integrations : this.fb.group({
          type: [ isUpdate ? (searchObj?.integrations?.type || 'basic') : 'basic']
        })
      })
    });
    if(isUpdate){
      let picked = (({ alwaysShow, isXODependant, fallback }) => ({ alwaysShow, isXODependant, fallback }))(searchObj || {});
      let criteria = 'alwaysShow';
      for(let key in picked){
        if(picked[key]){
          criteria = key;
        }
      }
      ((this.knowledgeAIFormGroup.get('searchAssistConfig') as FormGroup)
      .get('criteria') as FormControl)
      .patchValue(criteria);


      if(searchObj?.integrations?.type === 'advance') {
        ((((this.knowledgeAIFormGroup.get('searchAssistConfig') as FormGroup).get('integrations') as FormGroup)
      .addControl('config', this.fb.group({
        script: [searchObj.integrations?.config.script || '']
      }))));
      this.advancedModeScript = (searchObj.integrations?.config.script.length > 0) ? searchObj.integrations?.config.script : '';
      }
      
    }
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
          this.isLoading = false;
          //backup
          this.clonedWidgetSettings = JSON.parse(JSON.stringify(res));

          

          // this.setAgentAssistAndKnowledgeSettings(res.agentAssistSettings);
    this.createOrUpdateAgSettingsForm(res.agentAssistSettings);
    this.createOrUpdateSearchForm(res.agentAssistSettings)


          //why we need global variable
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
      ((((this.knowledgeAIFormGroup.get('searchAssistConfig') as FormGroup).get('integrations') as FormGroup)
       .get('config') as FormGroup).get('script') as FormControl).patchValue(emitedValue);
      this.knowledgeAIFormGroup.get('searchAssistConfig').get('integrations').updateValueAndValidity();
      if(this.knowledgeAIFormGroup?.value?.searchAssistConfig?.integrations?.type === 'advance' && emitedValue.length !== 0) {
        this.knowledgeAIFormGroup.markAsDirty();
        this.isApiConfigured = true;
      } else {
        this.isApiConfigured = false;
      }
    });
  }

  // update the AutoSuggestions keys
  selectedSuggestionType(e, val) {
    ((this.knowledgeAIFormGroup.get('searchAssistConfig') as FormGroup)
    .get('showAutoSuggestions') as FormControl)
    .patchValue((val.type === 'On') ? true : false);
  }

  // open script editor for the Advanced Mode
  selectedIntegrationType(e, integrate) {
    this.isApiConfigured = true;
    ((this.knowledgeAIFormGroup.get('searchAssistConfig') as FormGroup).get('integrations') as FormGroup)
    .removeControl('config');
    if(integrate.type === 'advance') {
      ((this.knowledgeAIFormGroup.get('searchAssistConfig') as FormGroup).get('integrations') as FormGroup)
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
    obj[this.knowledgeAIFormGroup.value.searchAssistConfig.criteria] = true;
    (this.knowledgeAIFormGroup.get('searchAssistConfig') as FormGroup)
    .patchValue(obj);
  }

  // cancel agentassist Settings
  cancleAgentAssistSettingsNew(settingType, obj) {
    if(settingType === 'widget') {
      this.createOrUpdateAgSettingsForm(obj.agentAssistSettings);
    }else {
      this.createOrUpdateSearchForm(obj.agentAssistSettings);
    }
  }


  // Destroy all the subscribed event
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
