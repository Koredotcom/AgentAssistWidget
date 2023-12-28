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

@Component({
  selector: 'app-welcomeevent',
  templateUrl: './welcomeevent.component.html',
  styleUrls: ['./welcomeevent.component.scss']
})
export class WelcomeeventComponent implements OnInit {

  @ViewChild('newWelcomeEvent', { static: true }) newWelcomeEventSlider: SliderComponentComponent;

  welcomeTask : string = 'WELCOME_TASK';
  welcomeMsg : string = 'WELCOME_MSG';
  universalBot : string = 'universalbot'

  subs = new SubSink();

  streamId : string;
  formDirty : boolean = false;

  //welcomeTaskData
  
  linkedBots : any[] = [];
  welcomeTaskData : any;
  welcomeTaskPreviousData : any;
  showSpinner : boolean = false;
  currentBt : any;

  
  greetingForm : FormGroup;

  
  greetingActiveTab : string = 'chat';



  @ViewChild('newWelcomeEvent', { static: true }) newWelcomeEvent: SliderComponentComponent;
  
  constructor(
    private modalService: NgbModal,
    private service: ServiceInvokerService,
    private workflowService : workflowService,
    private authService: AuthService,
    private cdRef : ChangeDetectorRef,
    private notificationService : NotificationService,
    private translate : TranslateService
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
      streamId : this.streamId,
    }
    this.showSpinner = true;
    this.service.invoke('get.welcomeevent', params).subscribe(data => {
      data = this.getMockData();
      this.showSpinner = false;
      if(data){
        this.welcomeTaskData = this.formatWelcomeTaskData(data);

        console.log(this.welcomeTaskData, "welcome task data");        
       
      }
    },error => {
      this.showSpinner = false;
    });
  }


 
  formatWelcomeTaskData(data){
    data.events?.forEach(obj => {
      data[obj.name] = Object.assign({}, obj);
    });
    this.welcomeTaskPreviousData = JSON.parse(JSON.stringify(data));
    console.log(data, 'data *********'); 
    return data;
  }


  changeGreetingActiveTab(tab){
    this.greetingActiveTab = tab;
  } 

  // slider events

  deleteWelcomeEvent(contentDeleteWelcomeEvents) {
    this.modalService.open(contentDeleteWelcomeEvents,{ centered: true, windowClass: 'delete-welcome-events-dialog', backdrop: 'static', keyboard: false });
  }
  
  openWelcomeEvent(){
    this.newWelcomeEventSlider.openSlider("#newWelcome", "width550");
  }

  closeWelcomeEvent() {
    this.newWelcomeEventSlider.closeSlider('#newWelcome');
  }

  openModal(contentDeleteWelcomeEvents){
    this.modalService.open(contentDeleteWelcomeEvents, {backdropClass: 'adjust-zindex-above-slider', modalDialogClass:'confirm-copy', centered: true, backdrop: 'static', keyboard: false});

  }

  getMockData(){
    return {
      "events": [
        {
          "name": "AA_ON_CONNECT_EVENT",
          "enabled" : false,
          "chat": {
            "enabled": true,
            "usecaseId": "sat-db9e832b-7d73-57e3-86d9-b30ec1b461ff",
            "refId": "3b9cf1a0-ea97-52a6-ae27-238f9f63dbcd",
            "dialogId": "dg-bc19ef5b-cfb3-5c1e-947b-64994c448bed",
            "taskRefId": "3b9cf1a0-ea97-52a6-ae27-238f9f63dbcd",
            "linkedBotId": "st-b245235c-5206-5053-b329-fc7ee33494d4"
        },
          "voice": {
            "enabled": false
          }
        },
        {
          "name": "AA_GREETING_MESSAGES",
          "enabled": true,
          "config": {
            "chat": {
              "randomMsg": true,
              "locale": {
                "en": [{
                  "message": "Hi Hello How are you",
                  "enabled": true
                },
                {
                  "message": "I hope you are good",
                  "enabled": true
                }
                ],
                "de": [{
                  "text": "de asdQYTSDdadqwqw afdasdas",
                  "enabled": true
                },
                {
                  "text": "kjo QWEMsfcdsfsdfsdf mbgvij",
                  "enabled": true
                }
                ]
              }
            },
            "voice": {
              "randomMsg": true,
              "locale": {
                "en": [{
                  "message": "Hi Hello How are you",
                  "enabled": true
                },
                {
                  "message": "I hope you are good",
                  "enabled": true
                }
                ],
                "de": [{
                  "text": "de asdQYTSDdadqwqw afdasdas",
                  "enabled": true
                },
                {
                  "text": "kjo QWEMsfcdsfsdfsdf mbgvij",
                  "enabled": true
                }
                ]
              }
            },
            "email": {
              "randomMsg": true,
              "locale": {
                "en": [{
                  "message": "Hi Hello How are you",
                  "enabled": true
                },
                {
                  "message": "I hope you are good",
                  "enabled": true
                }
                ],
                "de": [{
                  "text": "de asdQYTSDdadqwqw afdasdas",
                  "enabled": true
                },
                {
                  "text": "kjo QWEMsfcdsfsdfsdf mbgvij",
                  "enabled": true
                }
                ]
              }
            }
          }
        }
      ],
      "priority": {
        "AA_ON_CONNECT_EVENT": false,
        "AA_GREETING_MESSAGES": true,
      }
    }    
  }

}
