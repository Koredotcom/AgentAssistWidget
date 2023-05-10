import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/common/constants/proj.cnts';

@Component({
  selector: 'app-summary-popup',
  templateUrl: './summary-popup.component.html',
  styleUrls: ['./summary-popup.component.scss']
})
export class SummaryPopupComponent {

  @Input() summaryText: any;
  @Output() handlePopupEvent = new EventEmitter();

  // editedSummaryText : any;

  constructor() { }

  // ngOnInit(): void {
  //   this.editedSummaryText = this.summaryText?.summary ? this.summaryText?.summary[0]?.summary_text:'';
  // }

  ngOnChanges(changes){
    if(changes?.summaryText?.currentValue?.summary?.length > 0){
        this.summaryText = changes.summaryText.currentValue.summary[0]
    }
  }

  summaryButtonClick(flag){
    if(flag){
      this.handlePopupEvent.emit({status : false, summary : true, type : ProjConstants.SUMMARY, summaryText : this.summaryText, editedSummary : this.summaryText})
    }
  }

}
