import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    private cdRef : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentBt = this.workflowService.getCurrentBt(true);
    this.streamId = this.currentBt._id;
    this.getWelcomeTaskData();
    this.subscribeEvents();
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
  }

  // get welcome task and use case data from backend api
  getWelcomeTaskData(){
    let params : any = {
      streamId : this.streamId,
    }
    this.welcomeTaskData = {
      "events" : [
        // {
        //   "name": "AA_ON_CONNECT_EVENT",
        //   "chat" : {
        //     "enabled" : true,
        //     "usecaseId": "sat-asdasda",
        //     "refId" : "asdasda",
        //     "dialogId": "dg-adasdasda",
        //     "taskRefId": "fc10f6e2-ef31-5df7-9fa3-f88080a662bb",
        //     "linkedBotId" : "st-2be8b912-da2f-53cc-a7f5-3713e387c5f5"
        //   },
        //   "voice":{
        //     "enabled" : false,
        //     "usecaseId": "sat-asdasda",
        //     "refId" : "asdasda",
        //     "dialogId": "dg-adasdasda",
        //     "taskRefId": "d2879c1d-1dd8-5eff-8c15-6e9c9dd91199",
        //   }
        // }
      ]
    }
    this.updateUseCaseData();
   
    // this.service.invoke('get.searchaccounts', params).subscribe(data => {
    //   if (data) {
    //     this.updateWelcomeTaskData(data);
    //   }
    // });
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
    this.subs.sink = this.service.invoke('get.usecases', params, {})
      .subscribe((res) => {
        this.conversations = res.usecases;
        if(update){
          this.updateTaskDetails(this.welcomeTaskData)
        }
      }, err => {
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
    this.showSpinner = false;
  }
  updateWelcomeTaskData(data){
    this.welcomeTaskData = data;
    this.updateTaskDetails(data);
    this.showSpinner = false;
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
      this.updateWelcomeTaskData(payLoad);
      // this.service.invoke('post.welcomeevent', { streamId: this.streamId }, payLoad).subscribe((data) => {
      //   console.log(data, "return data");
      //   if(data){
      //     this.updateTaskDetails(data);
      //   }
      // });      
    }else if(type == this.cancel){
      this.updateUseCaseData();
    }
  }
  prepareTaskPayLoad(taskEnable){
    let payLoad : any = {
      "events" : [
        {
          "name": "AA_ON_CONNECT_EVENT",
          "chat" : {
            "enabled" : false
          },
          "voice":{
            "enabled" : false
          }
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
        usecaseId : this.selectedUseCase.usecaseId ? this.selectedUseCase.usecaseId  : '',
        refId : this.selectedUseCase.refId,
        dialogId : this.selectedUseCase.dialogId,
        taskRefId : this.selectedUseCase.taskRefId,
        linkedBotId : this.selectedBot._id ? this.selectedBot._id : ''
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
