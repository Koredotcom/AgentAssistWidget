import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/common/constants/proj.cnts';

@Component({
  selector: 'app-restore-popup',
  templateUrl: './restore-popup.component.html',
  styleUrls: ['./restore-popup.component.scss']
})
export class RestorePopupComponent implements OnInit {

  @Output() handlePopupEvent = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  restoreButtonClick(flag){
    if(flag){
      this.handlePopupEvent.emit({status : false, restore : true, type : ProjConstants.RESTORE})
    }else{
      this.handlePopupEvent.emit({status : flag, type : ProjConstants.RESTORE})
    }
  }
}
