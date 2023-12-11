import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RandomUuidPipe } from 'src/app/pipes/random-uuid.pipe';
import { ProjConstants, RenderResponseType } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() automationData : any;
  @Input() agentassistArrayIndex : number;
  @Input() agentassistResponseArray : any;

  renderResponseType : any = RenderResponseType;

  assistRespType(index, respType) {
    return respType?.data?._id;
  };

  constructor(private rootService : RootService, private randomUUIDPipe : RandomUuidPipe){

  }

}
