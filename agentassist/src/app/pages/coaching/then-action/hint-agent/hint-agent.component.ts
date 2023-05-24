import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';
@Component({
  selector: 'app-hint-agent',
  templateUrl: './hint-agent.component.html',
  styleUrls: ['./hint-agent.component.scss']
})
export class HintAgentComponent implements OnInit {

  @ViewChild('adherenceSlider', { static: true }) adherenceSlider: SliderComponentComponent;
  @Input() form: FormGroup
  constructor() { }
  selMsgType:string = '';
  msgTypes = COACHINGCNST.TYPE_OF_HINT;
  closeTypes = COACHINGCNST.TYPE_OF_CLOSE;
  title: string = '';
  desc: string = '';
  bodyMsg: string = '';
  variableName: string = '';
  closeType: string = ''
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

  submitVariable(){
    this.title = this.variableName;
  }

  submitBody(){
    this.bodyMsg = this.desc;
  }

  clickCloseT(closeT){
    this.closeType = closeT;
  }
}
