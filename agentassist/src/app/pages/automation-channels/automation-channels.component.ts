import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { INewChatsTransfer } from 'src/app/data/channels-chat.model';
import { Subscription,Observable } from 'rxjs';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { LocalStoreService } from '@kore.services/localstore.service';

@Component({
  selector: 'app-automation-channels',
  templateUrl: './automation-channels.component.html',
  styleUrls: ['./automation-channels.component.scss']
})
export class AutomationChannelsComponent implements OnInit, OnDestroy {

  showEmailSlider: boolean = false;
  @ViewChild('emailSlider', { static: true }) emailSlider: SliderComponentComponent;
  showVoiceSection = true;
  showChatSection = false;
  showEmailSection = false;
  chatList : INewChatsTransfer;
  chatValues : any;
  chatChannelData: Subscription;
  chatData: any;
  webhookUrl: any;
  showOpenEyeIcon : boolean = true;
  markDefaultBot : boolean = false;
  isLoading : boolean = false;
  currentBt : any = {};
  checkBotMarkEvent : any;
  accountId = '';
  subs = new SubSink();
  widgetV3Url : string = '';

  constructor( public workflowService: workflowService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    public modalService : NgbModal,
    private translate : TranslateService,
    private localStoreService: LocalStoreService,
    private auth: AuthService
              ) { }
  
  ngOnInit(): void {  
    this.showVoiceSection = true;
    this.showChatSection = false;
    this.showEmailSection = false;
    let selectedAccount = this.localStoreService.getSelectedAccount() || this.auth.getSelectedAccount();
    if (selectedAccount) {
      this.accountId = selectedAccount.accountId;
    }
    this.getChatChannelData();
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  subscribeEvents(){
    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((ele)=>{
      console.log(ele, "inside udpate use case");
      if(ele){
        this.getChatChannelData();
      } 
    });
  }

  
  openEmailSlider(e) {
    console.log(e);
    e.stopPropagation();
    this.emailSlider.openSlider("#emailSlider", "width940");
    this.showEmailSlider = true;
  }

  closeEmailSlider() {
    this.showEmailSlider = false;
    this.emailSlider.closeSlider("#emailSlider");
  }

  showHideSec(tab) {
    if(tab === 'voice') {
      this.showVoiceSection = true;
      this.showChatSection = false;
      this.showEmailSection = false;
    } else if(tab === 'chat') {
      this.showVoiceSection = false;
      this.showChatSection = true;
      this.showEmailSection = false;
        this.performBTNavigation('deploy',"channels");
    } else {
      this.showVoiceSection = false;
      this.showChatSection = false;
      this.showEmailSection = true;
    }
  }

  performBTNavigation(mainTab, link) {
    let navData = {
      navType: 'direct'
    }
    this.workflowService.directFlag = true;
    this.workflowService.mainTab = mainTab;
    this.workflowService.link = link;
    this.workflowService.btNavigation$.next(navData);
  }

  copyInputMessage(inputElement){
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = inputElement;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.notificationService.notify("copied successfully", "success");
  }


 getChatChannelData() {
    const params = {
            instanceId: this.authService.getAgentAssistStreamId(),
            'isAgentAssist':true
          };
    this.currentBt = this.workflowService.getCurrentBt(true);
    this.chatChannelData = this.service.invoke('get.chatList', params).subscribe(data => {
    
    this.chatList = data.app;
    this.webhookUrl = data.webhookUrl;
    this.markDefaultBot = this.currentBt.connectedBot;
    this.widgetV3Url = window.location.protocol + '//' + window.location.host + '/koreagentassist-sdk/UI/agentassist-iframe.html';
     
   });
 }

 EnableDefaultSelection(event,contentConfirmChatChannel) {
  this.checkBotMarkEvent = event;
  event.target.checked = false;
  this.modalService.open(contentConfirmChatChannel,{ centered: true, windowClass: 'delete-welcome-events-dialog', backdrop: 'static', keyboard: false });
}

confirmDefaultBot(type){  
  if(type == 'yes'){
    this.isLoading = true;
    this.updateMakeDefault();
  }else{
    this.checkBotMarkEvent.target.checked = this.markDefaultBot;
  }
  this.modalService.dismissAll();
}

async updateMakeDefault(){
  let streamId = this.authService.getAgentAssistStreamId()
  let automationBots = this.authService.smartAssistBots;
  if(!this.markDefaultBot){
    const automationBotIdArray = automationBots => automationBots
    .filter(obj => obj._id != streamId && obj.connectedBot)
    .map(obj => obj._id);
   
    for(let autoBot of automationBotIdArray(automationBots)){
      let remainingBotMarkDefaultCall = await this.getMarkDefaultEnableDisableCall(autoBot,false);
    }
  }
  let actualMarkDefaultCall = await this.getMarkDefaultEnableDisableCall(streamId,!this.markDefaultBot).then((res)=>{
    this.markDefaultBot = !this.markDefaultBot;
    this.authService.getDeflectApps();
    this.isLoading = false;
    this.notificationService.notify(this.translate.instant("CHANNELCHAT.SAVE_SUCCESS"), 'success');
  },(error)=>{
    this.isLoading = false;
    this.notificationService.showError(this.translate.instant("CHANNELCHAT.SAVE_FALIED"));
  });
}

getMarkDefaultEnableDisableCall(streamId, enabledFlag){
  let params : any = {
    streamId : streamId
  }
  return this.service.invoke('post.markDefault', params, {enabled : enabledFlag}).toPromise();
}
 
}

