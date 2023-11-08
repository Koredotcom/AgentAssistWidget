import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {

  @Output() maxButtonClick = new EventEmitter();
  @Input() maxButton : boolean;


  minimizeToggle(){
    this.maxButton = !this.maxButton;
    this.maxButtonClick.emit(this.maxButton);
  }

}
