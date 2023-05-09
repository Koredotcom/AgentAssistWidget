import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/common/constants/proj.cnts';

@Component({
  selector: 'app-summary-popup',
  templateUrl: './summary-popup.component.html',
  styleUrls: ['./summary-popup.component.scss']
})
export class SummaryPopupComponent implements OnInit {

  @Input() summaryText: any;
  @Output() handlePopupEvent = new EventEmitter();

  editedSummaryText : any;

  constructor() { }

  ngOnInit(): void {
    this.editedSummaryText = this.summaryText?.summary ? this.summaryText?.summary[0]?.summary_text:'';
  }

  ngOnChanges(changes){
    let summary = changes.summaryText.currentValue?.summary;
    if(changes.summaryText && summary){
      if(typeof summary[0] === 'string'){
        this.editedSummaryText = summary[0]
      }else{
        this.editedSummaryText = summary[0].summary_text;
      }
    }
  }

  summaryButtonClick(flag){
    if(flag){
      this.handlePopupEvent.emit({status : false, summary : true, type : ProjConstants.SUMMARY, summaryText : this.summaryText, editedSummary : this.editedSummaryText})
    }
  }

}
