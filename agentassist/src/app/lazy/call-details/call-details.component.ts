import { Component, OnInit, ViewChild } from '@angular/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { AgentChatService } from '../../services/dataservices/agent-chat.service';

@Component({
  selector: 'app-call-details',
  templateUrl: './call-details.component.html',
  styleUrls: ['./call-details.component.scss']
})
export class CallDetailsComponent implements OnInit {

  userData;
  userMetaTagsCount = 20;
  sessionMetaTagsCount = 20;
  userMetaTagsEndCount = 4;
  sessionMetaTagsEndCount = 4;
  userMetaTagsHead = "User Meta Tags";
  sessionMetaTagsHead = "Session Meta Tags";
  userMetaTags: {tagName: string, tagValue: string}[] = [];
  sessionMetaTags: {tagName: string, tagValue: string} [] = [];

  constructor(private agentService: AgentChatService) { }

  @ViewChild(SliderComponentComponent, { static: true }) sliderComponent: SliderComponentComponent;

  ngOnInit() {
    this.agentService.getAgentChatData().subscribe(res=>{ 
        this.userData = res; 
        res.conversationInfo.conversationDetails.forEach(val => { this.setTags(val.conversationInfo); })
      },
      err=> { });
  }

  openUserMetaTagsSlider() { this.sliderComponent.openSlider("#userMetaTagsListSlider", "right500"); }
  
  openSessionMetaTagsSlider() { this.sliderComponent.openSlider("#sessionMetaTagsListSlider", "right500"); }

  closeUserMetaTagsSlider() { this.sliderComponent.closeSlider("#userMetaTagsListSlider"); }

  closeSessionMetaTagsSlider() { this.sliderComponent.closeSlider("#sessionMetaTagsListSlider"); }

  setTags(info) {
    this.userMetaTags = this.userMetaTags.concat(info.userTags);
    this.sessionMetaTags = this.sessionMetaTags.concat(info.sessionTags);
  }

}
