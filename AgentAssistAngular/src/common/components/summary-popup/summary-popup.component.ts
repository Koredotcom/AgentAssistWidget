import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/common/constants/proj.cnts';

@Component({
  selector: 'app-summary-popup',
  templateUrl: './summary-popup.component.html',
  styleUrls: ['./summary-popup.component.scss']
})
export class SummaryPopupComponent implements OnInit {

  @Output() handlePopupEvent = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  summaryButtonClick(flag){
    if(flag){
      this.handlePopupEvent.emit({status : false, summary : true, type : ProjConstants.SUMMARY})
    }else{
      this.handlePopupEvent.emit({status : flag, type : ProjConstants.SUMMARY})
    }
  }

}
