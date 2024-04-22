import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-convesation-summary',
  templateUrl: './convesation-summary.component.html',
  styleUrls: ['./convesation-summary.component.scss']
})
export class ConvesationSummaryComponent {
  @Input() conversationSummaryObj : any;
  summaryConverationText: any;

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
  }
}
