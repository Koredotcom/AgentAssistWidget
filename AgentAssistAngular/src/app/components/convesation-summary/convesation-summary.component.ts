import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-convesation-summary',
  templateUrl: './convesation-summary.component.html',
  styleUrls: ['./convesation-summary.component.scss']
})
export class ConvesationSummaryComponent {
  @Input() conversationSummaryObj : any;

  constructor() { }
  ngOnInit(): void {
    console.log(this.conversationSummaryObj);
    if(this.conversationSummaryObj?.summaryText !== '') {
      console.log(this.conversationSummaryObj?.summaryText)
    } else {
      console.log(this.conversationSummaryObj?.summaryText);
    }
  }
}
