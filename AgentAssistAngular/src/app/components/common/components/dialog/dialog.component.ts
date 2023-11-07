import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() automationData : any;
  @Input() agentassistArrayIndex : number;
  @Input() agentassistResponseArrayLength : number;
  @Output() scrollBottom = new EventEmitter();
  @Output() handlePopupEvent = new EventEmitter();
}
