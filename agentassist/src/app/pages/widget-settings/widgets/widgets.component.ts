import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { clone } from 'src/app/helpers/utils';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SubSink } from 'subsink';

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
  uploadedImg: any;
  progress: number;
  logoSize: any;

  landingPageTabs = {
    voice: [ 'Transcript', 'Assist Tab', 'library', 'MyBot'],
    chat: [ 'Assist',  'library', 'MyBot' ]
  }

  agentAssistSettings = { 
    agentAssistWidgetEnabled: true,
    isProactiveEnabled: true,
    isAgentCoachingEnabled: true,
    isAgentResponseEnabled: true,
    isAgentPlaybookEnabled: true,
    isSearchAssistEnabled: true,
    isWidgetLandingEnabled: {
      isEnabled :  true, 
       chat: {
             isEnabled: true, 
              tab: "Assist"  
           },
      voice: {
            isEnabled:  true,
            tab: "Transcription" 
           }
    },
    isCustomisedLogoEnabled: {
      isEnabled: true, 
      fileId : '',
     hash : '',
    fileName: ''
    }
  }
  

  constructor(public workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public translate: TranslateService) { }

  ngOnInit(): void {
    this.isUnifiedPlatform = this.workflowService.isUnifiedPlatform();
    this.getAgentAssistSettings();
  }

  getAgentAssistSettings() {
    let botId = this.workflowService.getCurrentBtSmt(true)._id
    let params = {
      botId
    };
    let body = {
      botId
    }
    // this.subs.sink = this.service.invoke("get.AgentAssistSettings", params).subscribe(
    //   (res) => {
    //     if (res) {
    //       res ={ agentAssistSettings: { 
    //         agentAssistWidgetEnabled: true,
    //         isProactiveEnabled: true,
    //         isAgentCoachingEnabled: true,
    //         isAgentResponseEnabled: true,
    //         isAgentPlaybookEnabled: true,
    //         isSearchAssistEnabled: true,
    //         isWidgetLandingEnabled: {
    //           isEnabled :  true, 
    //            chat: {
    //                  isEnabled: true, 
    //                   tab: "assist"  
    //                },
    //           voice: {
    //                 isEnabled:  true,
    //                 tab: "assist" 
    //                }
    //         },
    //         isCustomisedLogoEnabled: {
    //           isEnabled: true, 
    //           fileId : '',
    //          hash : '',
    //         fileName: ''
    //         }
    //       }}
    //       this.clonedWidgetSettings = clone(res);
    //       this.agentAssistSettings = {...res};
    //     }
    //   },
    //   (err) => {
    //     this.notificationService.showError(
    //       err,
    //       this.translate.instant("FALLBACK_ERROR_MSG")
    //     );
    //   }
    // );

    let mockRes = { agentAssistSettings: { 
      agentAssistWidgetEnabled: true,
      isProactiveEnabled: true,
      isAgentCoachingEnabled: true,
      isAgentResponseEnabled: true,
      isAgentPlaybookEnabled: true,
      isSearchAssistEnabled: true,
      isWidgetLandingEnabled: {
        isEnabled :  true, 
         chat: {
               isEnabled: true, 
                tab: "Assist"  
             },
        voice: {
              isEnabled:  true,
              tab: "Transcript" 
             }
      },
      isCustomisedLogoEnabled: {
        isEnabled: true, 
        fileId : '',
        hash : '',
        fileName: ''
      }
    }}
    this.clonedWidgetSettings = clone(mockRes);
    this.agentAssistSettings = {...mockRes.agentAssistSettings};
    
  }

  saveAgentAssistSettings() {
    this.disableButtons = true;
    let botId = this.workflowService.getCurrentBtSmt(true)._id
    const params = {
      botId
    };

    const payload = {
      // "orgId": this.clonedWidgetSettings.orgId,
      // "accountId": this.clonedWidgetSettings.accountId,
      // "iId": this.clonedWidgetSettings.iId,
      // "updatedByAId": this.clonedWidgetSettings.updatedByAId,
      // "createdByAId": this.clonedWidgetSettings.createdByAId,
      "agentAssistSettings": {
          agentAssistWidgetEnabled: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.agentAssistWidgetEnabled : false,
          isProactiveEnabled: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isProactiveEnabled : false,
          isAgentCoachingEnabled: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isAgentCoachingEnabled : false,
          isAgentResponseEnabled: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isAgentResponseEnabled :false,
          isAgentPlaybookEnabled: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isAgentPlaybookEnabled: false,
          isSearchAssistEnabled: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isSearchAssistEnabled : false,
          isWidgetLandingEnabled : {
            isEnabled :  this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isWidgetLandingEnabled.isEnabled : false, 
              chat: {
                    isEnabled: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isWidgetLandingEnabled.chat.isEnabled : false, 
                      tab: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isWidgetLandingEnabled.chat.tab : 'Assist'  
                  },
              voice: {
                    isEnabled:  this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isWidgetLandingEnabled.voice.isEnabled : false,
                    tab: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isWidgetLandingEnabled.voice.tab : "Transcript" 
                  }
            },
            isCustomisedLogoEnabled: {
              isEnabled: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isCustomisedLogoEnabled.isEnabled : true, 
              fileId : this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isCustomisedLogoEnabled.fileId : '',
            hash :  this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isCustomisedLogoEnabled.hash : '',
            fileName: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isCustomisedLogoEnabled.fileName : ''
            }
      },
      // "id": this.clonedWidgetSettings.id
    } 

    this.subs.sink = this.service.invoke("put.agentAssistSettings",params, payload)
    .subscribe(
      (res) => {
        if (res) {
            this.notificationService.showSuccess(this.translate.instant("AGENTASSIST_SETTINGS_SAVED"));
            this.disableButtons = false;
          this.clonedWidgetSettings = clone(res);
          this.agentAssistSettings = {...res};
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

  cancleAgentAssistSettings() {
    if(this.clonedWidgetSettings){
      this.agentAssistSettings.agentAssistWidgetEnabled = {...this.clonedWidgetSettings};
    }
}

selectedOption(selectedVal) {
  if (selectedVal === 'voice') {
    this.agentAssistSettings.isWidgetLandingEnabled.voice.isEnabled = !this.agentAssistSettings.isWidgetLandingEnabled.voice.isEnabled;
  } else {
    this.agentAssistSettings.isWidgetLandingEnabled.chat.isEnabled = !this.agentAssistSettings.isWidgetLandingEnabled.chat.isEnabled;
  }
}

selectTab(channel, tab) {
  if(channel === 'chat') {
    this.agentAssistSettings.isWidgetLandingEnabled.chat.tab = tab;
  } else {
    this.agentAssistSettings.isWidgetLandingEnabled.voice.tab = tab;
  }
}

handleFileDrop(event: DragEvent) {
  if (event?.dataTransfer?.files?.length) {
    const files = event.dataTransfer.files;
    console.log("🚀 ~ file: widgets.component.ts:214 ~ WidgetsComponent ~ handleFileDrop ~ files:", files)
    this.inputRef.nativeElement.files = files;
    this.addFiles(files);
  }
}

addFiles(files) {
  console.log(files);
    // api call
    let fileFormat =  // regex code here
    this.progress = 1;
    const formData = new FormData();
    formData.append("file", files);
    if(files[0].size < 5242880 ) {
      let botId = this.workflowService.getCurrentBtSmt(true)._id;
      const params = {
        botId
      };

      const payload = {
        formData
      }

      // this.subs.sink = this.service.invoke("put.agentAssistSettings",params, payload,  {
      //   reportProgress: true,
      //   observe: 'events',
      // }).pipe(
      //   map((event: any) => {
      //     console.log(event);
      //       this.progress = Math.round((100 / event.total) * event.loaded); 
      //       // if (event.type == HttpEventType.UploadProgress) {
      //       //   this.progress = Math.round((100 / event.total) * event.loaded);
      //       // } else if (event.type == HttpEventType.Response) {
      //       //   this.progress = null;
      //       // }
      //   }))
      // .subscribe(
      //   (res: any) => {
      //       this.agentAssistSettings.isCustomisedLogoEnabled.fileName = res.fileName;
      //       this.agentAssistSettings.isCustomisedLogoEnabled.hash = res.hash;
      //       this.agentAssistSettings.isCustomisedLogoEnabled.fileId = res.fileId;
      //       this.uploadedImg = res.imgURL;
      //   },
      //   (err) => {
      //     this.notificationService.showError(
      //       err,
      //       this.translate.instant("FALLBACK_ERROR_MSG")
      //     );
      //   }
      //   )
    }
    

    
  // 
  // dummy Data
  this.agentAssistSettings.isCustomisedLogoEnabled.fileName = files[0].name;
  // this.logoSize = this.convertByteSize(files[0].size);
  this.logoSize = Math.round((files[0].size) / 1024);
  console.log("🚀 ~ file: widgets.component.ts:285 ~ WidgetsComponent ~ addFiles ~ this.logoSize:", this.logoSize)
  this.uploadedImg = '';
  //
  let loaded = 0;
  while(this.progress < 100) {
    this.progress = Math.round((100 * loaded) / this.logoSize );
    console.log("🚀 ~ file: widgets.component.ts:291 ~ WidgetsComponent ~ addFiles ~ this.progress:", this.progress)
    loaded += 20;
    console.log("🚀 ~ file: widgets.component.ts:293 ~ WidgetsComponent ~ addFiles ~ loaded:", loaded)
  }
  
  
}

convertByteSize(bytes){
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 ** 2) {
      return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes < 1024 ** 3) {
      return (bytes / (1024 ** 2)).toFixed(2) + ' MB';
  } else if (bytes < 1024 ** 4) {
      return (bytes / (1024 ** 3)).toFixed(2) + ' GB';
  } else if (bytes < 1024 ** 5) {
      return (bytes / (1024 ** 4)).toFixed(2) + ' TB';
  } else {
      return (bytes / (1024 ** 5)).toFixed(2) + ' PB';
  }
}
    


ngOnDestroy() {
  this.subs.unsubscribe();
}

}
