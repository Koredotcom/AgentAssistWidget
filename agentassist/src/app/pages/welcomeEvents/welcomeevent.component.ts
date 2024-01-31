import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { SubSink } from 'subsink';
import { WelcomeEventsService } from './welcome-events.service';

@Component({
  selector: 'app-welcomeevent',
  templateUrl: './welcomeevent.component.html',
  styleUrls: ['./welcomeevent.component.scss']
})
export class WelcomeeventComponent implements OnInit {

  welcomeTask : string = 'WELCOME_TASK';
  welcomeMsg : string = 'WELCOME_MSG';
  universalBot : string = 'universalbot'

  subs = new SubSink();

  streamId : string;
  formDirty : boolean = false;

  //welcomeTaskData
  
  linkedBots : any[] = [];
  showSpinner : boolean = false;
  currentBt : any;

  @ViewChild('newWelcomeEvent', { static: true }) newWelcomeEvent: SliderComponentComponent;
  
  constructor(
    private service: ServiceInvokerService,
    private workflowService : workflowService,
    private authService: AuthService,
    private cdRef : ChangeDetectorRef,
    private notificationService : NotificationService,
    private translate : TranslateService,
    private welcomeEventService : WelcomeEventsService
  ) { }

  ngOnInit(): void {
    this.subscribeEvents();
    this.updateDetailsOnBotUpdation(this.workflowService.getCurrentBt(true));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  

  subscribeEvents(){
    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((bot)=>{
      if(bot){
        this.updateDetailsOnBotUpdation(bot);
      }
    });
  }

  updateDetailsOnBotUpdation(bot){    
    this.currentBt = bot;
    this.streamId = this.currentBt._id;
    if(this.currentBt.type == this.universalBot){
      this.getLinkedBots().subscribe(data => {
        if(data){
          this.linkedBots = [...data.configuredBots, ...data.publishedBots];
          this.getWelcomeTaskData();
        } 
      });
    }else{
      this.getWelcomeTaskData();
    }
    
  }

  getLinkedBots(){
    let params : any = {
      'userId' : this.authService.getUserId(),
      'streamId' : this.streamId
    }
    return this.service.invoke('get.universalLinkedBots', params);
  }

  // get welcome task and use case data from backend api
  getWelcomeTaskData(){
    let params : any = {
      streamId : this.workflowService.getCurrentBtSmt(true)._id,
    }
    debugger;
    this.showSpinner = true;
    this.service.invoke('get.welcomeevent', params).subscribe(data => {
      // data = this.getMockData();
      this.showSpinner = false;
      this.welcomeEventService.setWelcomeEventData(data);
    },(error) => {
      this.welcomeEventService.setWelcomeEventData({});
      this.showSpinner = false;
    });
  }


 
  

  updateApi(postData){
    this.showSpinner = true;
    this.service.invoke('post.welcomeevent', { streamId: this.streamId }, postData).subscribe((data) => {
      this.showSpinner = false;

      if(data){
        this.welcomeEventService.setWelcomeEventData(data);
        this.notificationService.notify(this.translate.instant("WELCOMEEVENT.SAVE_SUCCESS"), 'success');
      }else{
        this.notificationService.showError(this.translate.instant("WELCOMEEVENT.SAVE_FALIED"));
      }
    },(error)=> {
      this.notificationService.showError(this.translate.instant("WELCOMEEVENT.SAVE_FALIED"));
      this.showSpinner = false;
    })
  }


  // getMockData(){
  //   return {
  //     "events": [
  //       {
  //         "name": "AA_ON_CONNECT_EVENT",
  //         "enabled" : false,
  //       //   "chat": {
  //       //     "enabled": true,
  //       //     "usecaseId": "sat-db9e832b-7d73-57e3-86d9-b30ec1b461ff",
  //       //     "refId": "3b9cf1a0-ea97-52a6-ae27-238f9f63dbcd",
  //       //     "dialogId": "dg-bc19ef5b-cfb3-5c1e-947b-64994c448bed",
  //       //     "taskRefId": "3b9cf1a0-ea97-52a6-ae27-238f9f63dbcd",
  //       //     "linkedBotId": "st-b245235c-5206-5053-b329-fc7ee33494d4"
  //       // },
  //       "chat": {
  //         "enabled": true,
  //         "usecaseId": "",
  //         "refId": "",
  //         "dialogId": "",
  //         "taskRefId": "",
  //         "linkedBotId": ""
  //     },
  //         "voice": {
  //           "enabled": false
  //         }
  //       },
  //       {
  //         "name": "AA_GREETING_MESSAGES",
  //         "enabled": true,
  //         "config": {
  //           "chat": {
  //             "randomMsg": true,
  //             "locale": {
  //               "en": [
  //                 {
  //                 "message": "Hi Hello How are you",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "I hope you are good",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "Hi Hello How are you",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "I hope you are good",
  //                 "enabled": false
  //               },
  //               {
  //                 "message": "Hi Hello How are you",
  //                 "enabled": false
  //               },
  //               {
  //                 "message": "I hope you are good",
  //                 "enabled": false
  //               },
  //               {
  //                 "message": "Hi Hello How are you",
  //                 "enabled": false
  //               },
  //               {
  //                 "message": "I hope you are good",
  //                 "enabled": false
  //               }
  //               ],
  //               "de": [
  //                 {
  //                 "message": "de asdQYTSDdadqwqw afdasdas",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "kjo QWEMsfcdsfsdfsdf mbgvij",
  //                 "enabled": true
  //               }
  //               ]
  //             }
  //           },
  //           "voice": {
  //             "randomMsg": true,
  //             "locale": {
  //               "en": [
  //                 {
  //                 "message": "Hi Hello How are you",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "I hope you are good",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "Hi Hello How are you",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "I hope you are good",
  //                 "enabled": false
  //               }
  //               ],
  //               "de": [{
  //                 "message": "de asdQYTSDdadqwqw afdasdas",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "kjo QWEMsfcdsfsdfsdf mbgvij",
  //                 "enabled": true
  //               }
  //               ]
  //             }
  //           },
  //           "email": {
  //             "randomMsg": true,
  //             "locale": {
  //               "en": [{
  //                 "message": "Hi Hello How are you",
  //                 "enabled": true
  //               },
  //               {
  //                 "message": "I hope you are good",
  //                 "enabled": true
  //               }
  //               ],
  //               "de": [{
  //                 "text": "de asdQYTSDdadqwqw afdasdas",
  //                 "enabled": true
  //               },
  //               {
  //                 "text": "kjo QWEMsfcdsfsdfsdf mbgvij",
  //                 "enabled": true
  //               }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     ],
  //     "priority": {
  //       "AA_ON_CONNECT_EVENT": false,
  //       "AA_GREETING_MESSAGES": true,
  //     }
  //   }    
  // }

}
