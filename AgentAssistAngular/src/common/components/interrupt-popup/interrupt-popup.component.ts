import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/common/constants/proj.cnts';

@Component({
  selector: 'app-interrupt-popup',
  templateUrl: './interrupt-popup.component.html',
  styleUrls: ['./interrupt-popup.component.scss']
})
export class InterruptPopupComponent implements OnInit {

  @Output() handleTerminatePopup = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  interruptButtonClick(flag){
    if(flag){
      this.handleTerminatePopup.emit({status : false, interrupt : true, type : ProjConstants.INTERRUPT})
    }else{
      this.handleTerminatePopup.emit({status : flag, type : ProjConstants.INTERRUPT})
    }
  }

}
