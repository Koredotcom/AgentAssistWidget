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
  isLoading = true;
  iId = this.authService?.isLoadingOnSm && this.selAcc && this.selAcc?.instanceBots?.length ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;

  landingPageTabs = {
    transcript: 'Transcription',
    assist: 'Assist',
    library: 'Library',
    mybot: 'My bot'
  }



  agentAssistSettings = { 
    agentAssistWidgetEnabled: true,
    isProactiveEnabled: false,
    isAgentCoachingEnabled: false,
    isAgentResponseEnabled: false,
    isAgentPlaybookEnabled: false,
    isSearchAssistEnabled: true,
    searchAssistConfig : {
      isXODependant: false, 
      showAutoSuggestions: true
    },
    isWidgetLandingEnabled: {
      isEnabled :  true, 
       chat: {
             isEnabled: true, 
              tab: "assist"  
           },
      voice: {
            isEnabled:  true,
            tab: "transcript" 
           }
    },
    isCustomisedLogoEnabled: {
      isEnabled: true, 
      fileId : '',
     hash : '',
    fileName: ''
    }
  }
  

  constructor(
    public workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public translate: TranslateService,
    private authService: AuthService,
    private localstorage: LocalStoreService
  ) { }

  ngOnInit(): void {
    this.isUnifiedPlatform = this.workflowService?.isUnifiedPlatform();
    this.getAgentAssistSettings();
  }

  getAgentAssistSettings() {
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
          this.agentAssistSettings = {...this.agentAssistSettings, ...res.agentAssistSettings};
          this.imgPreview = res?.agentAssistSettings?.isCustomisedLogoEnabled?.fileUrl;
        }
      },
      (err) => {
        this.notificationService.showError(
          err,
          this.translate.instant("FALLBACK_ERROR_MSG")
        );
      }
    );
  }

  saveAgentAssistSettings() {
    this.disableButtons = true;
    let params = {
      orgId: this.authService?.getOrgId(),
      aasId: this.clonedWidgetSettings?.id
    };
    const payload = {
      "orgId": this.authService?.getOrgId(),
      "accountId": this.localstorage?.getSelectedAccount()?.accountId,
      "iId": this.iId,
      "agentAssistSettings": {
          agentAssistWidgetEnabled: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.agentAssistWidgetEnabled : false,
          isProactiveEnabled: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isProactiveEnabled : false,
          isAgentCoachingEnabled: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isAgentCoachingEnabled : false,
          isAgentResponseEnabled: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isAgentResponseEnabled :false,
          isAgentPlaybookEnabled: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isAgentPlaybookEnabled: false,
          isSearchAssistEnabled: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isSearchAssistEnabled: false,
          isWidgetLandingEnabled : {
            isEnabled :  this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isWidgetLandingEnabled.isEnabled : false, 
              chat: {
                    isEnabled: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isWidgetLandingEnabled?.chat?.isEnabled : false, 
                    tab: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isWidgetLandingEnabled?.chat?.tab : 'assist'  
                  },
              voice: {
                    isEnabled:  this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isWidgetLandingEnabled?.voice?.isEnabled : false,
                    tab: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isWidgetLandingEnabled?.voice?.tab : "transcript" 
                  }
            },
            searchAssistConfig : {
              isXODependant: (this.agentAssistSettings?.agentAssistWidgetEnabled && this.agentAssistSettings?.isSearchAssistEnabled ) ? this.agentAssistSettings.searchAssistConfig?.isXODependant : false, 
              showAutoSuggestions: (this.agentAssistSettings?.agentAssistWidgetEnabled && this.agentAssistSettings?.isSearchAssistEnabled ) ? this.agentAssistSettings.searchAssistConfig?.showAutoSuggestions : false
            },
            isCustomisedLogoEnabled: {
              isEnabled: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isCustomisedLogoEnabled.isEnabled : false, 
              fileId : this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isCustomisedLogoEnabled.fileId : '',
            hash :  this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isCustomisedLogoEnabled.hash : '',
            fileName: this.agentAssistSettings?.agentAssistWidgetEnabled ? this.agentAssistSettings?.isCustomisedLogoEnabled.fileName : ''
            }
      },
      "id": this.clonedWidgetSettings?.id,
      updatedByAId: this.clonedWidgetSettings?.updatedByAId
    } 

    this.subs.sink = this.service.invoke("put.agentAssistSettings",params, payload)
    .subscribe(
      (res) => {
        if (res) {
            this.notificationService.showSuccess(this.translate.instant("AGENTASSIST_SETTINGS_SAVED"));
            this.disableButtons = false;
          this.clonedWidgetSettings = JSON.parse(JSON.stringify(res));
          this.agentAssistSettings = {...this.agentAssistSettings, ...res.agentAssistSettings};
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

  cancleAgentAssistSettings() {
      if(this.clonedWidgetSettings){
        this.agentAssistSettings = this.clonedWidgetSettings.agentAssistSettings;
      }
  }

  selectedOption(e, selectedVal) {
    let isChecked = e.target.checked;
    if (selectedVal === 'voice') {
      this.agentAssistSettings.isWidgetLandingEnabled.voice.isEnabled = isChecked;
    } else {
      this.agentAssistSettings.isWidgetLandingEnabled.chat.isEnabled = isChecked;
    }
  }

  selectedSearchAssistOption(e, selectedVal) {
    let isChecked = e.target.checked;
    if (selectedVal === 'xoSearch') {
      this.agentAssistSettings.searchAssistConfig.isXODependant = isChecked;
    } else {
      this.agentAssistSettings.searchAssistConfig.showAutoSuggestions = isChecked;
    }
  }

  selectTab(channel, tab) {
    if(channel === 'chat') {
      this.agentAssistSettings.isWidgetLandingEnabled.chat.tab = tab;
    } else if(channel === 'voice') {
      this.agentAssistSettings.isWidgetLandingEnabled.voice.tab = tab;
    }
  }

  handleFileDrop(event: DragEvent) {
    if (event?.dataTransfer?.files?.length) {
      const files = event.dataTransfer.files;
      this.inputRef.nativeElement.files = files;
      this.addFiles(files);
    }
  }

  addFiles(files) {
      // let fileRegX = new RegExp("[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$");
      // if(files[0].size > 5242880 ) {
      //   this.largeFileFlag = true
      //   return;
      // }
      // if(!fileRegX.test(files[0].name)) {
      //   this.fileTypeFlag = true;
      //   return;
      // }
      this.fileUploadCall(files[0]);
  }

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
              this.agentAssistSettings.isCustomisedLogoEnabled.fileName = file.name;
              this.agentAssistSettings.isCustomisedLogoEnabled.hash = res.hash;
              this.agentAssistSettings.isCustomisedLogoEnabled.fileId = res.fileId;
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

  getuploadedLogoFileURL(fileId){
    this.service.invoke('get.uploadedLogo', {'fileId': fileId}).subscribe((res) => {
      if(res) {
        this.imgPreview = res.fileUrl;
      }
    })
  }

  removeFile() {
    this.largeFileFlag = false;
    this.fileTypeFlag = false;
    this.uploadedImgDetails = '';
  }

  // fileUploadCall(files) {
  //   this.progress = 1;
  //   const formData = new FormData();
  //   formData.append("file", files);
  //   let botId = this.workflowService.getCurrentBtSmt(true)._id;
  //     const params = {
  //       userId: this.authService.getUserId()
  //     };
  //     const payload = {
  //       formData
  //     }
  //     this.service.invoke("post.fileUpload",params, payload,  {
  //       reportProgress: true,
  //       observe: 'events',
  //     }).pipe(
  //       map((event: any) => {
  //           this.progress = Math.round((100 / event.total) * event.loaded); 
  //       }))
  //     .subscribe(
  //       (res: any) => {
  //           this.agentAssistSettings.isCustomisedLogoEnabled.fileName = res.fileName;
  //           this.agentAssistSettings.isCustomisedLogoEnabled.hash = res.hash;
  //           this.agentAssistSettings.isCustomisedLogoEnabled.fileId = res.fileId;

  //       },
  //       (err) => {
  //         this.notificationService.showError(
  //           err,
  //           this.translate.instant("FALLBACK_ERROR_MSG")
  //         );
  //       }
  //       ) 
  // }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
