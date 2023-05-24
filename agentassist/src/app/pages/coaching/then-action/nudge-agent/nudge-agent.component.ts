import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-nudge-agent',
  templateUrl: './nudge-agent.component.html',
  styleUrls: ['./nudge-agent.component.scss']
})
export class NudgeAgentComponent implements OnInit {
  @ViewChild('adherenceSlider', { static: true }) adherenceSlider: SliderComponentComponent;
  @Input() form: FormGroup;
  msgTypes = COACHINGCNST.TYPE_OF_HINT;
  selMsgType: string = '';
  nudgeMsg: string = '';
  showNudgeMsg: string = ''
  constructor() { }

  ngOnInit(): void {
  }

  openAdherence(){
    this.adherenceSlider.openSlider("#adherenceSlider", "width900");
  }
  
  closeAdherence(group){
    this.adherenceSlider.closeSlider("#adherenceSlider");
  }

  selectMsgType(type){
    this.selMsgType = type;
  }

  submitnudgeMsg(){
    this.showNudgeMsg = this.nudgeMsg;
  }
}
