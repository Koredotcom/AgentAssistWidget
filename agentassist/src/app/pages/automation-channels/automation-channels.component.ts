import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { INewChatsTransfer, CHATCHANNEL_TRASFER_MOCKDATA } from 'src/app/data/chats.mock';
import { Subscription,Observable } from 'rxjs';
import { NotificationService } from '@kore.services/notification.service';

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
  
  constructor( public workflowService: workflowService,
    private notificationService: NotificationService,
              ) { }
  
  ngOnInit(): void {  
    this.showVoiceSection = true;
    this.showChatSection = false;
    this.showEmailSection = false;
    // this.performBTNavigation('deploy',"channels");
    this.getChatData();
  }

  chatTransferData: typeof CHATCHANNEL_TRASFER_MOCKDATA = CHATCHANNEL_TRASFER_MOCKDATA;
  
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
//copy to chat variables
  copyInputMessage(inputElement){
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = inputElement;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.notificationService.notify("copied successfully", "success");
  }

  getChatData(){
  this.chatValues = this.chatTransferData.chatVariables;
  }

}
