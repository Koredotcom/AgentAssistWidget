import { Component, OnInit, ViewChild } from '@angular/core';
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

  activeTab : string = 'WELCOME_TASK';
  taskActive : string = 'chat';

  subs = new SubSink();

  streamId : string;
  formDirty : boolean = false;

  //welcomeTaskData
  conversations: any[] = [];
  automationBots : any[] = [];
  welcomeTaskData : any = {};
  selectedUseCase : any = null;
  selectedBot : any = null;
  taskEnable : boolean;
  currentBt : any;


  @ViewChild('newWelcomeEvent', { static: true }) newWelcomeEvent: SliderComponentComponent;
  
  constructor(
    private modalService: NgbModal,
    private service: ServiceInvokerService,
    private workflowService : workflowService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentBt = this.workflowService.getCurrentBt(true);
    this.streamId = this.currentBt._id;

    this.getWelcomeTaskData();
    this.getUseCaseData(this.workflowService.getCurrentBt(true)._id);
    console.log(this.currentBt, 'current bt');
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  subscribeEvents(){
    this.subs.sink = this.authService.deflectApps.subscribe( (res : any) => {
      console.log(res, "result");
      if(res){
        this.automationBots = Object.assign([], res);
      }
    });
  }

  getWelcomeTaskData(){
    let params : any = {
      streamId : this.streamId,
    }
    this.updateWelcomeTaskData({
      "events" : [
        {
          "name": "AA_ON_CONNECT_EVENT",
          "chat" : {
            "enabled" : true,
            "usecaseId": "sat-asdasda",
            "refId" : "asdasda",
            "dialogId": "dg-adasdasda",
            "taskRefId": "fc10f6e2-ef31-5df7-9fa3-f88080a662bb",
          },
          "voice":{
            "enabled" : false,
            "usecaseId": "sat-asdasda",
            "refId" : "asdasda",
            "dialogId": "dg-adasdasda",
            "taskRefId": "d2879c1d-1dd8-5eff-8c15-6e9c9dd91199",
          }
        }
      ]
    })
    // this.service.invoke('get.searchaccounts', params).subscribe(data => {
    //   if (data) {
    //     this.updateWelcomeTaskData(data);
    //   }
    // });
  }

  updateTaskDetails(data){
    let welcomeTaskData = Object.assign({}, data);
    console.log(welcomeTaskData, "welcome task data", this.taskActive);
    this.taskEnable = welcomeTaskData && welcomeTaskData.events && welcomeTaskData.events[0] && welcomeTaskData.events[0][this.taskActive]?.enabled ? true : false;
    this.selectedUseCase = this.taskEnable ? this.filterUseCaseFromUseCaseList(welcomeTaskData.events[0][this.taskActive].taskRefId) : null;
  }

  filterUseCaseFromUseCaseList(trid){
    let filteredArray = this.conversations.filter(obj => obj.taskRefId == trid);
    console.log(filteredArray, "filtered array");
    
    if(this.currentBt.type != 'universalbot' || (this.currentBt.type == 'universalbot' && this.selectedBot && this.selectedBot.name)){
      if(Object.keys(filteredArray).length > 0){
        return filteredArray[0];
      }
    }
    return null;
  }

  updateWelcomeTaskData(data){
    this.welcomeTaskData = data;
    this.updateTaskDetails(data);
  }

  getUseCaseData(botId) { 
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
        console.log(this.conversations, 'conversations');
        this.updateTaskDetails(this.welcomeTaskData)
      }, err => {
        this.conversations  = [];
      });
  }

  changeUseCase(conv){
    console.log(conv, "usecase");
    this.selectedUseCase = Object.assign({}, conv);
  }

  changeBot(bot){
    this.selectedUseCase = null;
    this.getUseCaseData(bot._id);
  }

  changeActiveTab(tab){
    this.activeTab = tab;
  }

  changeTaskActive(tab){
    this.taskActive = tab;
    this.updateTaskDetails(this.welcomeTaskData);
  }

  updateDetails(type){
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
      this.updateTaskDetails(this.welcomeTaskData);
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
      }
      payLoad.events[0][this.taskActive] = Object.assign({}, innerObject);
    }
    return payLoad;
  }

  checkFieldChange(){
    if(this.welcomeTaskData && this.welcomeTaskData.events && this.welcomeTaskData.events[0] && this.welcomeTaskData.events[0][this.taskActive]){
      if(this.welcomeTaskData.events[0][this.taskActive].enabled != this.taskEnable || (this.selectedUseCase && this.welcomeTaskData.events[0][this.taskActive].taskRefId != this.selectedUseCase?.taskRefId)){
        return false;
      }
    }
    return true;
  }

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
