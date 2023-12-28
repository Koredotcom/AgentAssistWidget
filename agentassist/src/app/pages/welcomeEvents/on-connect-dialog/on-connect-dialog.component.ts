import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-on-connect-dialog',
  templateUrl: './on-connect-dialog.component.html',
  styleUrls: ['./on-connect-dialog.component.scss']
})
export class OnConnectDialogComponent implements OnInit {

  @Input() currentBt : any;
  @Input() linkedBots : any;
  @Input() welcomeTaskData : any;
  @Input() welcomeTaskPreviousData : any;

  subs = new SubSink();

  onConnectDialogForm : FormGroup;
  onConnectActiveTab : string = 'chat';

  conversations: any[] = [];
  automationBots : any[] = [];
  selectedUseCase : any = null;
  selectedBot : any = null;
  taskEnable : boolean;
  universalBot : string = 'universalbot'
  
  constructor(private service : ServiceInvokerService, private cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initOnConnectDialogForm();
  }

  ngOnChanges(changes : SimpleChanges){
    if(changes?.welcomeTaskData?.currentValue && changes?.welcomeTaskPreviousData?.currentValue){
      console.log(changes, "changes****** inside on connect");
      this.updateUseCaseData();
      this.updateOnConnectDialogForm(this.welcomeTaskData?.['AA_ON_CONNECT_EVENT']?.[this.onConnectActiveTab] || {})
    }
  }

  initOnConnectDialogForm(){
    this.onConnectDialogForm = new FormGroup({
      'name' : new FormControl('AA_ON_CONNECT_EVENT', Validators.required),
      'enabled' : new FormControl(false, Validators.required),
      [this.onConnectActiveTab] : new FormGroup(this.getOnConnectActiveTabFormGroup({}))
    })
  }

  getUseCaseData(botId, update = true) { 
    const params : any = {
      streamId: botId,
      search: '',
      filterby: '',
      status: '',
      usecaseType: 'dialog',
      offset: 0,
      parentBotId : (this.currentBt.type == this.universalBot) ? this.currentBt._id : null
    }
    // this.showSpinner = true;
    this.subs.sink = this.service.invoke('get.LinkedBotUsecase', params, {})
      .subscribe((res) => {
        // this.showSpinner = false;
        this.conversations = res.usecases;
        if(update){
          this.updateTaskDetails(this.welcomeTaskData)
        }
      }, err => {
        // this.showSpinner = false;
        this.conversations  = [];
      });
  }


   // updating the welcome task and use case data after api call
   updateUseCaseData(){
    let botId = this.currentBt._id;
    if(this.currentBt.type == this.universalBot && this.welcomeTaskData?.['AA_ON_CONNECT_EVENT']?.[this.onConnectActiveTab]?.linkedBotId){
      this.getUseCaseData(this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab]?.linkedBotId);
    }else if(this.currentBt.type == this.universalBot && !this.welcomeTaskData?.['AA_ON_CONNECT_EVENT']?.[this.onConnectActiveTab]?.linkedBotId){
      this.updateTaskDetails(this.welcomeTaskData);
    }else if(this.currentBt.type != this.universalBot){
      this.getUseCaseData(botId);
    }
  }
  updateWelcomeTaskData(data){
    this.welcomeTaskData = data;
    this.updateTaskDetails(data);
  }

  // updating ngmodels in UI based on data from backend.
  updateTaskDetails(data, tabChange=false){
    console.log("inside task details", data);
    
    let welcomeTaskData = Object.assign({}, data);
    // this.taskEnable = welcomeTaskData && welcomeTaskData.events && welcomeTaskData?.['AA_ON_CONNECT_EVENT'] && welcomeTaskData?.['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab]?.enabled ? true : false;
    this.selectedBot = this.filterBotfromAutomationBotList(welcomeTaskData?.['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab]?.linkedBotId)
    if(this.currentBt.type == this.universalBot && tabChange && this.selectedBot?._id){
      this.getUseCaseData(this.selectedBot._id);
    }
    this.selectedUseCase = this.filterUseCaseFromUseCaseList(welcomeTaskData?.['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab]?.taskRefId);
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
    if(this.currentBt.type != this.universalBot || (this.currentBt.type == this.universalBot && this.selectedBot && this.selectedBot.botName)){
      if(Object.keys(filteredArray).length > 0){
        return filteredArray[0];
      }
    }
    return null;
  }


  prepareTaskPayLoad(){
    let payLoad : any = {
      "events" : [
        {
          "name": "AA_ON_CONNECT_EVENT",
          "chat" : this.welcomeTaskData && this.welcomeTaskData.events && this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'] && this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'].chat ? this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'].chat : {enabled : false},
          "voice": this.welcomeTaskData && this.welcomeTaskData.events && this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'] && this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'].voice ? this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'].voice : {enabled : false}
        }
      ]
    }
    // if(!taskEnable){
    //   payLoad['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab] = this.welcomeTaskData && this.welcomeTaskData.events && this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'] && this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab] ?
    //   this.welcomeTaskData?.['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab] : payLoad?.['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab];
    //   payLoad['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab].enabled = false;
    // }else{
      let innerObject : any = {
        enabled : true,
        usecaseId : this.selectedUseCase && this.selectedUseCase.usecaseId ? this.selectedUseCase.usecaseId  : '',
        refId : this.selectedUseCase.refId,
        dialogId : this.selectedUseCase.dialogId,
        taskRefId : this.selectedUseCase.taskRefId,
        linkedBotId : this.selectedBot && this.selectedBot._id ? this.selectedBot._id : ''
      }
      payLoad['AA_ON_CONNECT_EVENT'][this.onConnectActiveTab] = Object.assign({}, innerObject);
    // }
    return payLoad;
  }

  // dropdown on change activities
  changeUseCase(conv){
    this.selectedUseCase = Object.assign({}, conv);
    this.updateUsecaseFormData();
    this.cdRef.detectChanges();
  }

  changeBot(bot){
    this.selectedUseCase = null;
    this.selectedBot = bot;
    this.getUseCaseData(bot._id, false);
    this.cdRef.detectChanges();
  }

  changeOnConnectActiveTab(tab){
    this.onConnectActiveTab = tab;
    this.selectedBot = null;
    this.selectedUseCase = null;
    this.initOnConnectDialogForm();
    this.updateTaskDetails(this.welcomeTaskData, true);
    this.updateOnConnectDialogForm(this.welcomeTaskData?.['AA_ON_CONNECT_EVENT']?.[this.onConnectActiveTab])
  }


  updateOnConnectDialogForm(data, cancel = false){
    let welcomeTaskData = cancel ? this.welcomeTaskPreviousData : this.welcomeTaskData
    this.onConnectDialogForm.patchValue({
      enabled : welcomeTaskData?.['AA_ON_CONNECT_EVENT']?.enabled || false,
      [this.onConnectActiveTab] : this.updatetOnConnectActiveTabFormGroup(data)
    });
    this.updateOnConnectValidators();
  }

  updateUsecaseFormData(){    
    let innerObject : any = {
      enabled : true,
      usecaseId : this.selectedUseCase && this.selectedUseCase._id ? this.selectedUseCase._id  : '',
      refId : this.selectedUseCase.refId,
      dialogId : this.selectedUseCase.dialogId,
      taskRefId : this.selectedUseCase.taskRefId,
      linkedBotId : this.selectedBot && this.selectedBot._id ? this.selectedBot._id : ''
    }    
    this.onConnectDialogForm.patchValue({
      [this.onConnectActiveTab] : innerObject
    });        
  }

  updateOnConnectValidators(){
    for(let key in (this.onConnectDialogForm.controls[this.onConnectActiveTab] as FormGroup)?.controls){        
      if(this.onConnectDialogForm.get('enabled').value){ 
        let validatorList : any = [Validators.required];
        (this.onConnectDialogForm.controls[this.onConnectActiveTab] as FormGroup)?.controls[key].setValidators(validatorList);
      }else{          
        (this.onConnectDialogForm.controls[this.onConnectActiveTab] as FormGroup)?.controls[key].clearValidators();
      }
      (this.onConnectDialogForm.controls[this.onConnectActiveTab] as FormGroup)?.controls[key].updateValueAndValidity();
    }      
  }

  updatetOnConnectActiveTabFormGroup(data){
    let activeTabGroup : any = {
      "enabled" : data?.enabled || false,
      "usecaseId" : data?.usecaseId || '',
      "refId" : data?.refId || '',
      "dialogId" : data?.dialogId || '',
      "taskRefId" : data?.taskRefId || '',
      "extractIntents" : data?.extractIntents || false
    }
    if(data?.linkedBotId){
      activeTabGroup.linkedBotId = new FormControl(data?.linkedBotId, Validators.required);
    }
    return activeTabGroup;
  }

  getOnConnectActiveTabFormGroup(data){    
    let activeTabGroup : any = {
      "enabled" : new FormControl(data?.enabled || false, Validators.required),
      "usecaseId" : new FormControl(data?.usecaseId || '', Validators.required),
      "refId" : new FormControl(data?.refId || '', Validators.required),
      "dialogId" : new FormControl(data?.dialogId || '', Validators.required),
      "taskRefId" : new FormControl(data?.taskRefId || '', Validators.required),
      "extractIntents" : new FormControl(data?.extractIntents || false, Validators.required)
    };
    if(data?.linkedBotId){
      activeTabGroup.linkedBotId = new FormControl(data?.linkedBotId, Validators.required);
    }
    return activeTabGroup;
  }

  toggleOnConnectDialog(event){
    this.onConnectDialogForm.patchValue({enabled : event.target.checked});
    this.welcomeTaskData['AA_ON_CONNECT_EVENT'].enabled = event.target.checked;
    this.updateOnConnectValidators();
  }

  toggleExtractIntents(event){
    this.onConnectDialogForm.get(this.onConnectActiveTab)?.get('extractIntents').patchValue(event.target.checked);
  }

  cancelDialogTask(){
    this.updateTaskDetails(this.welcomeTaskPreviousData);
    this.updateOnConnectDialogForm(this.welcomeTaskPreviousData?.['AA_ON_CONNECT_EVENT']?.[this.onConnectActiveTab] || {}, true)
  }

  saveDialogTask(){

  }

}
