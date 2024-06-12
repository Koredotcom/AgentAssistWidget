import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ProjConstants, supportLanguage } from 'src/app/proj.const';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';

@Component({
  selector: 'app-summary-popup',
  templateUrl: './summary-popup.component.html',
  styleUrls: ['./summary-popup.component.scss']
})
export class SummaryPopupComponent {

  @Input() summaryText: any;
  @Input() initPopup : any;
  @Output() handlePopupEvent = new EventEmitter();

  editedSummaryText : any;
  projCnst : any = ProjConstants;
  tooltipText : string = supportLanguage.COPY;
  submitEnabled:boolean = false

  constructor(public modal : NgbActiveModal, private translate : TranslateService, private rootService: RootService,
    private handleSubjectService : HandleSubjectService) { }

  ngOnInit(): void {
    this.submitEnabled = this.rootService?.settingsData?.summarization?.canSubmit;
    this.checkSummaryText(this.summaryText);
  }

  ngOnChanges(changes){
    if(changes?.summaryText?.currentValue){
        this.checkSummaryText(changes?.summaryText?.currentValue);
    }
  }

  checkSummaryText(summaryText){
    if(summaryText?.isError){
      this.editedSummaryText = this.translate.instant("SUMMARY_ERROR_TEXT");
    }else if(summaryText?.summary && summaryText?.summary[0]){
      this.editedSummaryText = summaryText.summary[0]
    }
  }

  summaryButtonClick(flag){
    this.handlePopupEvent.emit({status : flag, summary : true, type : ProjConstants.SUMMARY, summaryText : this.summaryText, editedSummary : this.editedSummaryText})
  }

  handleCopyButton(copyText){    
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = copyText;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.tooltipText = supportLanguage.COPIED
    setTimeout(() => {
      this.tooltipText = supportLanguage.COPY;
    }, 3000);
  }

  closeSummary(){
    this.handlePopupEvent.emit({status : false, summary : false, type : ProjConstants.SUMMARY})
  }

  clearSummary(){
   this.editedSummaryText = ''; 
  }

  
}
