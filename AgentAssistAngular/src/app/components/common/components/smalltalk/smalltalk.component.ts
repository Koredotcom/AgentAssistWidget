import { Component, Input } from '@angular/core';
import { ProjConstants, RenderResponseType } from 'src/app/proj.const';

@Component({
  selector: 'app-smalltalk',
  templateUrl: './smalltalk.component.html',
  styleUrls: ['./smalltalk.component.scss']
})
export class SmalltalkComponent {

  @Input() smallTalkData : any = {};
  @Input() agentassistArrayIndex : number;
  @Input() agentassistResponseArrayLength : number;
  @Input() agentAssistResp : any;
  
  projConstants : any = ProjConstants;
  renderResponseType : any = RenderResponseType;
}
