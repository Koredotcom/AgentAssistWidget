import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-work-notes',
  templateUrl: './work-notes.component.html',
  styleUrls: ['./work-notes.component.scss']
})
export class WorkNotesComponent {
  @Input() automation: any;
  // @Input() listView : boolean;
  @Input() automationArrayLength;
  @Input() automationIndex;
  @Input() responseArray;
  @Input() responseArrayIndex;
  @Input() assistAutomationData;
}
