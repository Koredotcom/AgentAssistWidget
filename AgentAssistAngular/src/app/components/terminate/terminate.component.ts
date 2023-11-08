import { Component, EventEmitter, Output } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';

@Component({
  selector: 'app-terminate',
  templateUrl: './terminate.component.html',
  styleUrls: ['./terminate.component.scss']
})
export class TerminateComponent {

  projConstants : any = ProjConstants;

  @Output() handlePopupEvent = new EventEmitter();

  constructor(public rootService : RootService){

  }

  terminateClick(flag, override=false){
    this.handlePopupEvent.emit({ status: flag, override: override,  type: this.projConstants.TERMINATE });
  }

}
