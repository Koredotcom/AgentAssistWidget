import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjConstants } from 'src/app/proj.const';

@Component({
  selector: 'app-summary-popup',
  templateUrl: './summary-popup.component.html',
  styleUrls: ['./summary-popup.component.scss']
})
export class SummaryPopupComponent {

  @Input() summaryText: any;
  @Output() handlePopupEvent = new EventEmitter();

  editedSummaryText : any;
  projCnst : any = ProjConstants;
  tooltipText : string = ProjConstants.COPY;

  constructor(public modal : NgbActiveModal) { }

  ngOnInit(): void {
    this.editedSummaryText = this.summaryText?.summary ? this.summaryText?.summary[0]: '';
  }

  ngOnChanges(changes){
    if(changes?.summaryText?.currentValue?.summary?.length > 0){
        this.editedSummaryText = changes.summaryText.currentValue.summary[0]
    }
  }

  summaryButtonClick(flag){
    if(flag){
      this.handlePopupEvent.emit({status : false, summary : true, type : ProjConstants.SUMMARY, summaryText : this.summaryText, editedSummary : this.editedSummaryText})
    }
  }

  handleCopyButton(copyText){    
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = copyText;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.tooltipText = this.projCnst.COPIED;
    setTimeout(() => {
      this.tooltipText = this.projCnst.COPY;
    }, 3000);
  }

  closeSummary(){
    this.handlePopupEvent.emit({status : false, summary : false, type : ProjConstants.SUMMARY})
  }

  
}
