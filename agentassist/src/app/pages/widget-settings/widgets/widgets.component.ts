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
    {type:'advanced', desc:'Configure how you want to use Knowledge AI'}
  ]
  advancedModeScript: any = '';

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
    this.agentAssistFormGroup = this.fb.group({
      agentAssistSettings: this.fb.group({
        agentAssistWidgetEnabled: [false],
        isProactiveEnabled: [false],
        isAgentCoachingEnabled: [false],
        isAgentResponseEnabled: [true],
        issummarizationEnabled: [false],
        isAgentPlaybookEnabled: [false],
        isWidgetLandingEnabled: this.fb.group({
          isEnabled: [false],
          chat: this.fb.group({
            isEnabled: [false],
            tab: ['assist']
          }),
          voice: this.fb.group({
            isEnabled: [false],
            tab: ['transcript']
          })
        }),
        isbotEventsEnabled: [false],
        isCustomisedLogoEnabled: this.fb.group({
          isEnabled: [false],
          fileId: [''],
          fileName: [''],
          hash: ['']
        })
      })
    });
    
    // KnowledgeFromObject
    this.knowledgeAIFormGroup = this.fb.group({
      isSearchAssistEnabled: [false],
      searchAssistConfig: this.fb.group({
        criteria: ['alwaysShow'],
        alwaysShow: [true],
        isXODependant: [false],
        fallback: [false],
        suggestVal: ['On'],
        showAutoSuggestions: [true],
        integrations : this.fb.group({
          type: ['basic'],
          config: this.fb.group({
            script: ['', [Validators.required, Validators.minLength(2)]]
          })
        })
      })
    })
  }

  ngOnInit(): void {
    this.isUnifiedPlatform = this.workflowService?.isUnifiedPlatform();
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
          this.disableButtons = false;
          this.clonedWidgetSettings = JSON.parse(JSON.stringify(res));
          this.advancedModeScript = res.agentAssistSettings.searchAssistConfig.integrations.config.script;
          this.setAgentAssistAndKnowledgeSettings(res.agentAssistSettings);
          this.imgPreview = res?.agentAssistSettings?.isCustomisedLogoEnabled?.fileUrl;
        }
      },
      (err) => {
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
              this.agentAssistFormGroup.value.agentAssistSettings.isCustomisedLogoEnabled.fileName = file.name;
              this.agentAssistFormGroup.value.agentAssistSettings.isCustomisedLogoEnabled.hash = res.hash;
              this.agentAssistFormGroup.value.agentAssistSettings.isCustomisedLogoEnabled.fileId = res.fileId;
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
    this.agentAssistFormGroup.value.agentAssistSettings.isCustomisedLogoEnabled.fileName = '';
    this.agentAssistFormGroup.value.agentAssistSettings.isCustomisedLogoEnabled.hash = '';
    this.agentAssistFormGroup.value.agentAssistSettings.isCustomisedLogoEnabled.fileId = '';
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
            this.setAgentAssistAndKnowledgeSettings(res.agentAssistSettings);
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
      this.clonedWidgetSettings = (Object.assign({}, this.clonedWidgetSettings, this.knowledgeAIFormGroup.value))
      this.subs.sink = this.service.invoke("put.agentAssistSettings",params, payload)
      .subscribe(
        (res) => {
          if (res) {
              this.notificationService.showSuccess(this.translate.instant("AGENTASSIST_SETTINGS_SAVED"));
              this.disableButtons = false;
            this.clonedWidgetSettings = JSON.parse(JSON.stringify(res));
            this.setAgentAssistAndKnowledgeSettings(res.agentAssistSettings);
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

  // update the settings
  setAgentAssistAndKnowledgeSettings(res) {
    this.agentAssistFormGroup.patchValue({
      agentAssistSettings: { 
        agentAssistWidgetEnabled: res.agentAssistWidgetEnabled,
        isProactiveEnabled: res.isProactiveEnabled,
        isAgentCoachingEnabled: res.isAgentCoachingEnabled,
        isAgentResponseEnabled: res.isAgentResponseEnabled,
        issummarizationEnabled: res.issummarizationEnabled,
        isAgentPlaybookEnabled: res.isAgentPlaybookEnabled,
        isWidgetLandingEnabled: {
          isEnabled :  res.isWidgetLandingEnabled.isEnabled, 
           chat: {
                 isEnabled: res.isWidgetLandingEnabled.chat.isEnabled, 
                  tab: res.isWidgetLandingEnabled.chat.tab  
               },
          voice: {
                isEnabled: res.isWidgetLandingEnabled.voice.isEnabled,
                tab: res.isWidgetLandingEnabled.voice.tab 
               }
        },
        isbotEventsEnabled: res.isbotEventsEnabled,
        isCustomisedLogoEnabled: {
          isEnabled: res.isCustomisedLogoEnabled.isEnabled, 
          fileId : res.isCustomisedLogoEnabled.fileId,
          hash : res.isCustomisedLogoEnabled.hash,
          fileName: res.isCustomisedLogoEnabled.fileName
        }
      }
    })
    this.setCriteria();
    this.setAutoSugg();
    console.log(this.clonedWidgetSettings.agentAssistSettings);
    this.knowledgeAIFormGroup.patchValue({
      isSearchAssistEnabled: res.isSearchAssistEnabled,
    searchAssistConfig: {
      alwaysShow: res.searchAssistConfig.alwaysShow,
      isXODependant: res.searchAssistConfig.isXODependant,
      fallback: res.searchAssistConfig.fallback,
      showAutoSuggestions: res.searchAssistConfig.showAutoSuggestions,
      integrations : {
        type: res.searchAssistConfig.integrations?.type,
        config: res.searchAssistConfig.integrations?.config,
          script: res.searchAssistConfig.integrations?.script
      }    
    }   
    });
  }

  //Landing tab enabling
  selectTab(channel, tab) {
    if(channel === 'chat') {
      this.agentAssistFormGroup.value.agentAssistSettings.isWidgetLandingEnabled.chat.tab = tab;
    } else if(channel === 'voice') {
      this.agentAssistFormGroup.value.agentAssistSettings.isWidgetLandingEnabled.voice.tab = tab;
    }
  }

  // API Configuration for the SearchAssist in Advanced Mode
  apiAdvancedMode() {
    this.modalRef = this.modalService.open(ApiAdvancedModelComponent, { centered: true, keyboard: false, windowClass: 'api-advance-mode', backdrop: 'static' });
    this.modalRef.componentInstance.data = this.advancedModeScript;
    this.modalRef.result.then(emitedValue => {
      this.advancedModeScript = emitedValue
      this.knowledgeAIFormGroup.value.searchAssistConfig.integrations.config.script = emitedValue;
    });
  }

  // update the AutoSuggestions keys
  selectedSuggestionType(e, type) {
    if(type.type === 'On') {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          showAutoSuggestions: true
        }})
    } else {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          showAutoSuggestions: false
        }})
    }
  }

  // open script editor for the Advanced Mode
  selectedIntegrationType(e, integrate) {
    if(integrate.type === 'advanced') {
      this.apiAdvancedMode();
    }
  }

  // update search result keys
  getSelectedSearchResult(e, result) {
    if(this.knowledgeAIFormGroup.value.searchAssistConfig.criteria === 'alwaysShow') {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          alwaysShow: true,
          fallback: false,
          isXODependant: false
        },
      });
    } else if(this.knowledgeAIFormGroup.value.searchAssistConfig.criteria === 'fallback') {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          alwaysShow: false,
          fallback: true,
          isXODependant: false
        },
      });
    } else {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          alwaysShow: false,
          fallback: false,
          isXODependant: true
        },
      });
    }
  }

  // cancel agentassist Settings
  cancleAgentAssistSettingsNew(settingType) {
    if(settingType === 'widget') {
      this.agentAssistFormGroup.patchValue({
        agentAssistSettings: { 
          agentAssistWidgetEnabled: this.clonedWidgetSettings.agentAssistSettings.agentAssistWidgetEnabled,
          isProactiveEnabled: this.clonedWidgetSettings.agentAssistSettings.isProactiveEnabled,
          isAgentCoachingEnabled: this.clonedWidgetSettings.agentAssistSettings.isAgentCoachingEnabled,
          isAgentResponseEnabled: this.clonedWidgetSettings.agentAssistSettings.isAgentResponseEnabled,
          issummarizationEnabled: this.clonedWidgetSettings.agentAssistSettings.issummarizationEnabled,
          isAgentPlaybookEnabled: this.clonedWidgetSettings.agentAssistSettings.isAgentPlaybookEnabled,
          isWidgetLandingEnabled: {
            isEnabled :  this.clonedWidgetSettings.agentAssistSettings.isWidgetLandingEnabled.isEnabled, 
             chat: {
                   isEnabled: this.clonedWidgetSettings.agentAssistSettings.isWidgetLandingEnabled.chat.isEnabled, 
                    tab: this.clonedWidgetSettings.agentAssistSettings.isWidgetLandingEnabled.chat.tab  
                 },
            voice: {
                  isEnabled: this.clonedWidgetSettings.agentAssistSettings.isWidgetLandingEnabled.voice.isEnabled,
                  tab: this.clonedWidgetSettings.agentAssistSettings.isWidgetLandingEnabled.voice.tab 
                 }
          },
          isbotEventsEnabled: this.clonedWidgetSettings.agentAssistSettings.isbotEventsEnabled,
          isCustomisedLogoEnabled: {
            isEnabled: this.clonedWidgetSettings.agentAssistSettings.isCustomisedLogoEnabled.isEnabled, 
            fileId : this.clonedWidgetSettings.agentAssistSettings.isCustomisedLogoEnabled.fileId,
            hash : this.clonedWidgetSettings.agentAssistSettings.isCustomisedLogoEnabled.hash,
            fileName: this.clonedWidgetSettings.agentAssistSettings.isCustomisedLogoEnabled.fileName
          }
        }
      }) 
    } else {
      this.setCriteria();
      this.setAutoSugg();
      console.log(this.clonedWidgetSettings.agentAssistSettings);
      this.knowledgeAIFormGroup.patchValue({
        isSearchAssistEnabled: this.clonedWidgetSettings.agentAssistSettings.isSearchAssistEnabled,
      searchAssistConfig: {
        alwaysShow: this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.alwaysShow,
        isXODependant: this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.isXODependant,
        fallback: this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.fallback,
        suggestVal: this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.suggestVal,
        showAutoSuggestions: this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.showAutoSuggestions,
        integrations : {
          type: this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.integrations?.type,
          config: this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.integrations?.config,
            script: this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.integrations?.script
        }    
      }   
      });
    }
  }

  setCriteria() {
    if(this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.alwaysShow) {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          criteria: 'alwaysShow'
        }
      })
    } else if(this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.isXODependant) {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          criteria: 'isXODependant'
        }
      })
    } else {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          criteria: 'fallback'
        }
      })
    }
  }

  setAutoSugg() {
    if(this.clonedWidgetSettings.agentAssistSettings.searchAssistConfig.showAutoSuggestions) {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          suggestVal: 'On'
        }
      })
    } else {
      this.knowledgeAIFormGroup.patchValue({
        searchAssistConfig: {
          suggestVal: 'Off'
        }
      })
    }
  }

  // FormDirtyCheck
  isFormDirty() {
    if(this.agentAssistFormGroup.dirty) {
      this.agentAssistFormGroup?.valueChanges.subscribe(formObject => {
        for (let key in formObject) {
          if (formObject[key] != this.clonedWidgetSettings[key] && this.clonedWidgetSettings[key] && formObject[key]) {
            return this.agentAssistFormGroup.dirty;
          }
        }
      })
      
    }
    if(this.knowledgeAIFormGroup.dirty) {
      return this.knowledgeAIFormGroup.dirty;
    }
  }

  // Destroy all the subscribed event
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
