import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/common/constants/proj.cnts';

@Component({
  selector: 'app-terminate',
  templateUrl: './terminate.component.html',
  styleUrls: ['./terminate.component.scss']
})
export class TerminateComponent implements OnInit {

  @Output() handlePopupEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  terminateButtonClick(flag){
    if(flag){
      this.handlePopupEvent.emit({status : false, terminate : true, type : ProjConstants.TERMINATE})
    }else{
      this.handlePopupEvent.emit({status : flag, type : ProjConstants.TERMINATE})
    }
  }

}
