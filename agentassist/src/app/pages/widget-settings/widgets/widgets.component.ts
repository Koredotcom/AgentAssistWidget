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
  progress: number;
  voice = 'Voice'

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
              tab: "assist"  
           },
      voice: {
            isEnabled:  true,
            tab: "assist" 
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
                tab: "assist"  
             },
        voice: {
              isEnabled:  true,
              tab: "assist" 
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
                      tab: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isWidgetLandingEnabled.chat.tab : 'assist'  
                  },
              voice: {
                    isEnabled:  this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isWidgetLandingEnabled.voice.isEnabled : false,
                    tab: this.agentAssistSettings.agentAssistWidgetEnabled ? this.agentAssistSettings.isWidgetLandingEnabled.voice.tab : "assist" 
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
    this.progress = 1;
    const formData = new FormData();
    formData.append("file", files);
    let botId = this.workflowService.getCurrentBtSmt(true)._id;
    const params = {
      botId
    };

    const payload = {
      formData
    }

    this.subs.sink = this.service.invoke("put.agentAssistSettings",params, payload,  {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event: any) => {
        console.log(event);
          this.progress = Math.round((100 / event.total) * event.loaded); 
          // if (event.type == HttpEventType.UploadProgress) {
          //   this.progress = Math.round((100 / event.total) * event.loaded);
          // } else if (event.type == HttpEventType.Response) {
          //   this.progress = null;
          // }
      }))
    .subscribe(
      (res) => {
          this.agentAssistSettings.isCustomisedLogoEnabled.fileName = '';
      },
      (err) => {
        this.notificationService.showError(
          err,
          this.translate.instant("FALLBACK_ERROR_MSG")
        );
      }
      )
  // 
  
}

ngOnDestroy() {
  this.subs.unsubscribe();
}

}
