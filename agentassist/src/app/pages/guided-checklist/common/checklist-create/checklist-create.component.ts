import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-checklist-create',
  templateUrl: './checklist-create.component.html',
  styleUrls: ['./checklist-create.component.scss']
})
export class ChecklistCreateComponent implements OnInit {

  @Output() closeCheckList = new EventEmitter();
  @ViewChild('checklistCreateSlider', { static: true }) checklistCreateSlider: SliderComponentComponent;



  constructor() { }

  ngOnInit(): void {
  }

  closeCheckListScreen(){
    this.closeCheckList.emit(true);
  }

  openSettings(){
    this.checklistCreateSlider.openSlider("#checklistCreate", "width940");
  }

  closeSettings(){
    this.checklistCreateSlider.closeSlider('#checklistCreate');
  }

}
