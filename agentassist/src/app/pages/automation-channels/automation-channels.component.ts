import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

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

  
  constructor( public workflowService: workflowService,
              ) { }
  
  ngOnInit(): void {  
    this.showVoiceSection = true;
    this.showChatSection = false;
    this.showEmailSection = false;
    // this.performBTNavigation('deploy',"channels");

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


}
