import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  welcomeTask : string = 'WELCOME_TASK';
  welcomeMsg : string = 'WELCOME_MSG';
  chatTab : string = 'chat';
  voiceTab : string = 'voice';
  save : string = 'save';
  cancel : string = 'cancel';
  universalBot : string = 'universalbot'

  activeTab : string = 'WELCOME_TASK';
  taskActive : string = 'chat';

  subs = new SubSink();

  streamId : string;
  formDirty : boolean = false;

  //welcomeTaskData
  conversations: any[] = [];
  automationBots : any[] = [];
  linkedBots : any[] = [];
  welcomeTaskData : any = {};
  selectedUseCase : any = null;
  selectedBot : any = null;
  taskEnable : boolean;
  showSpinner : boolean = false;
  currentBt : any;


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
    this.updateDetailsOnBotUpdation(this.workflowService.getCurrentBt(true));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  subscribeEvents(){
    this.subs.sink = this.authService.deflectApps.subscribe( (res : any) => {
      if(res){
        this.automationBots = Object.assign([], res);
        if(this.currentBt.type == this.universalBot){
          let linkedBotIds = [];
          let config_publish_bot_array = [...this.currentBt?.configuredBots, ...this.currentBt.publishedBots];
          linkedBotIds = config_publish_bot_array.map(a => a._id);          
          this.linkedBots = res.filter(element => linkedBotIds.includes(element._id));          
        }
      }
    });
    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((bot)=>{
      if(bot){
        this.updateDetailsOnBotUpdation(bot);
      }
    });
  }

  updateDetailsOnBotUpdation(bot){
    this.currentBt = bot;
    this.streamId = this.currentBt._id;
    this.getWelcomeTaskData();
    this.subscribeEvents();
  }

  // get welcome task and use case data from backend api
  getWelcomeTaskData(){
    let params : any = {
      streamId : this.streamId,
    }
    this.showSpinner = true;
    this.service.invoke('get.welcomeevent', params).subscribe(data => {
      this.showSpinner = false;
      if (data) {
       this.welcomeTaskData = Object.assign({}, data);
       this.updateUseCaseData();
      }
    },error => {
      this.showSpinner = false;
    });
  }
  getUseCaseData(botId, update = true) { 
    const params = {
      streamId: botId,
      search: '',
      filterby: '',
      status: '',
      usecaseType: 'dialog',
      offset: 0
    }
    this.showSpinner = true;
    this.subs.sink = this.service.invoke('get.usecases', params, {})
      .subscribe((res) => {
        this.showSpinner = false;
        this.conversations = res.usecases;
        if(update){
          this.updateTaskDetails(this.welcomeTaskData)
        }
      }, err => {
        this.showSpinner = false;
        this.conversations  = [];
      });
  }

  // updating the welcome task and use case data after api call
  updateUseCaseData(){
    let usecaseId = this.currentBt._id;
    if(this.currentBt.type == this.universalBot && this.welcomeTaskData?.events[0]?.[this.taskActive]?.linkedBotId){
      this.getUseCaseData(this.welcomeTaskData.events[0][this.taskActive].linkedBotId);
    }else if(this.currentBt.type == this.universalBot && !this.welcomeTaskData?.events[0]?.[this.taskActive]?.linkedBotId){
      this.updateTaskDetails(this.welcomeTaskData);
    }else if(this.currentBt.type != this.universalBot){
      this.getUseCaseData(usecaseId);
    }
  }
  updateWelcomeTaskData(data){
    this.welcomeTaskData = data;
    this.updateTaskDetails(data);
  }

  // updating ngmodels in UI based on data from backend.
  updateTaskDetails(data){
    let welcomeTaskData = Object.assign({}, data);
    this.taskEnable = welcomeTaskData && welcomeTaskData.events && welcomeTaskData.events[0] && welcomeTaskData.events[0][this.taskActive]?.enabled ? true : false;
    this.selectedBot = this.taskEnable ? this.filterBotfromAutomationBotList(welcomeTaskData.events[0][this.taskActive].linkedBotId) : null;
    this.selectedUseCase = this.taskEnable ? this.filterUseCaseFromUseCaseList(welcomeTaskData.events[0][this.taskActive].taskRefId) : null;
  }

  //automation bot list and usecase list filter based on selection
  filterBotfromAutomationBotList(linkBotId){
    let filteredArray = this.linkedBots.filter(obj => obj._id == linkBotId);
    if((this.currentBt.type == this.universalBot)){
      if(Object.keys(filteredArray).length > 0){
        return filteredArray[0];
      }
    }
    return null;
  }
  filterUseCaseFromUseCaseList(trid){
    let filteredArray = this.conversations.filter(obj => obj.taskRefId == trid);    
    if(this.currentBt.type != this.universalBot || (this.currentBt.type == this.universalBot && this.selectedBot && this.selectedBot.name)){
      if(Object.keys(filteredArray).length > 0){
        return filteredArray[0];
      }
    }
    return null;
  }

  // save and cancel click events
  updateDetails(type){
    this.showSpinner = true;
    if(type == this.save){
      let payLoad = this.prepareTaskPayLoad(this.taskEnable);
      // this.updateWelcomeTaskData(payLoad);
      this.service.invoke('post.welcomeevent', { streamId: this.streamId }, payLoad).subscribe((data) => {
        this.showSpinner = false;
        if(data){
           this.updateWelcomeTaskData(data);
           this.notificationService.notify(this.translate.instant("WELCOMEEVENT.SAVE_SUCCESS"), 'success');
        }else{
          this.notificationService.showError(this.translate.instant("WELCOMEEVENT.SAVE_FALIED"));
        }
      },error => {
        this.notificationService.showError(this.translate.instant("WELCOMEEVENT.SAVE_FALIED"));
        this.showSpinner = false;
      });      
    }else if(type == this.cancel){
      this.updateUseCaseData();
      this.showSpinner = false;
    }
  }
  prepareTaskPayLoad(taskEnable){
    let payLoad : any = {
      "events" : [
        {
          "name": "AA_ON_CONNECT_EVENT",
          "chat" : this.welcomeTaskData && this.welcomeTaskData.events && this.welcomeTaskData.events[0] && this.welcomeTaskData.events[0].chat ? this.welcomeTaskData.events[0].chat : {enabled : false},
          "voice": this.welcomeTaskData && this.welcomeTaskData.events && this.welcomeTaskData.events[0] && this.welcomeTaskData.events[0].voice ? this.welcomeTaskData.events[0].voice : {enabled : false}
        }
      ]
    }
    if(!taskEnable){
      payLoad.events[0][this.taskActive] = this.welcomeTaskData && this.welcomeTaskData.events && this.welcomeTaskData.events[0] && this.welcomeTaskData.events[0][this.taskActive] ?
      this.welcomeTaskData.events[0][this.taskActive] : payLoad.events[0][this.taskActive];
      payLoad.events[0][this.taskActive].enabled = false;
    }else{
      let innerObject : any = {
        enabled : true,
        usecaseId : this.selectedUseCase && this.selectedUseCase.usecaseId ? this.selectedUseCase.usecaseId  : '',
        refId : this.selectedUseCase.refId,
        dialogId : this.selectedUseCase.dialogId,
        taskRefId : this.selectedUseCase.taskRefId,
        linkedBotId : this.selectedBot && this.selectedBot._id ? this.selectedBot._id : ''
      }
      payLoad.events[0][this.taskActive] = Object.assign({}, innerObject);
    }
    return payLoad;
  }

  // dropdown on change activities
  changeUseCase(conv){
    this.selectedUseCase = Object.assign({}, conv);
    this.cdRef.detectChanges();
  }
  changeBot(bot){
    this.selectedUseCase = null;
    this.selectedBot = bot;
    this.getUseCaseData(bot._id, false);
    this.cdRef.detectChanges();
  }

  // save and cancel button disable condition
  checkFieldChange(){
    if(this.welcomeTaskData && this.welcomeTaskData.events && this.welcomeTaskData.events[0] && this.welcomeTaskData.events[0][this.taskActive]){
      if(this.welcomeTaskData.events[0][this.taskActive].enabled != this.taskEnable || (this.selectedUseCase && this.welcomeTaskData.events[0][this.taskActive].taskRefId != this.selectedUseCase?.taskRefId) || (this.currentBt.type == this.universalBot && this.selectedBot && this.welcomeTaskData.events[0][this.taskActive].linkedBotId != this.selectedBot?._id)){
        return false;
      }
    }else if(!this.welcomeTaskData || !this.welcomeTaskData?.events || !this.welcomeTaskData?.events[0] || !this.welcomeTaskData?.events[0]?.[this.taskActive]){
      if(this.taskEnable){
        return false;
      }
    }
    return true;
  }

 // changing tab actives
  changeActiveTab(tab){
    this.activeTab = tab;
  }
  changeTaskActive(tab){
    this.taskActive = tab;
    this.updateTaskDetails(this.welcomeTaskData);
  }

  // slider events

  deleteWelcomeEvent(contentDeleteWelcomeEvents) {
		this.modalService.open(contentDeleteWelcomeEvents,{ centered: true, windowClass: 'delete-welcome-events-dialog', backdrop: 'static', keyboard: false });
	}
  
  openWelcomeEvent(){
    this.newWelcomeEvent.openSlider("#newWelcome", "width600");
  }

  closeWelcomeEvent() {
    this.newWelcomeEvent.closeSlider('#newWelcome');
  }

}
