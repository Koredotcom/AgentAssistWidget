import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { INewChatsTransfer } from 'src/app/data/channels-chat.model';
import { Subscription,Observable } from 'rxjs';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-automation-channels',
  templateUrl: './automation-channels.component.html',
  styleUrls: ['./automation-channels.component.scss']
})
export class AutomationChannelsComponent implements OnInit {

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

  constructor( public workflowService: workflowService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    public modalService : NgbModal,
    private translate : TranslateService
              ) { }
  
  ngOnInit(): void {  
    this.showVoiceSection = true;
    this.showChatSection = false;
    this.showEmailSection = false;
    this.getChatChannelData();
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.workflowService.updateBotDetails$.subscribe((ele)=>{
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

updateMakeDefault(){
  let params : any = {
    streamId : this.authService.getAgentAssistStreamId()
  }
  
  this.service.invoke('post.markDefault', params, {enabled : !this.markDefaultBot}).subscribe((res) => {
    this.markDefaultBot = !this.markDefaultBot;
    this.authService.getDeflectApps();
    this.isLoading = false;
    this.notificationService.notify(this.translate.instant("CHANNELCHAT.SAVE_SUCCESS"), 'success');
  },(error) => {
    this.isLoading = false;
    this.notificationService.showError(this.translate.instant("CHANNELCHAT.SAVE_FALIED"));
  });
}
 
}

