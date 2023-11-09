import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';

@Component({
  selector: 'app-interrupt',
  templateUrl: './interrupt.component.html',
  styleUrls: ['./interrupt.component.scss']
})
export class InterruptComponent {

  projConstants : any = ProjConstants;

  @Input() currentDialog : any;
  @Output() handlePopupEvent = new EventEmitter();

  constructor(public rootService : RootService){

  }

  interruptClick(flag, runLater=false){
    this.handlePopupEvent.emit({ status: flag, runLater: runLater,  type: this.projConstants.INTERRUPT });
  }


}
