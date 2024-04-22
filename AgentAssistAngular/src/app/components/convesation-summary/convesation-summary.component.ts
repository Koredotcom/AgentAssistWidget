import { Component, Input } from '@angular/core';
import { ProjConstants, supportLanguage } from 'src/app/proj.const';

@Component({
  selector: 'app-convesation-summary',
  templateUrl: './convesation-summary.component.html',
  styleUrls: ['./convesation-summary.component.scss']
})
export class ConvesationSummaryComponent {
  @Input() conversationSummaryObj : any;
  summaryConverationText: any;
  projCnst : any = ProjConstants;
  tooltipText : string = supportLanguage.COPY;

  constructor() { }
  ngOnInit(): void {
    if(this.conversationSummaryObj?.editedSummary !== '') {
      this.summaryConverationText = this.conversationSummaryObj?.editedSummary;
    }
  }

  copyConversationSummaryTxt(data) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = data;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.tooltipText = supportLanguage.COPIED
    setTimeout(() => {
      this.tooltipText = supportLanguage.COPY;
    }, 3000);
  }
}
