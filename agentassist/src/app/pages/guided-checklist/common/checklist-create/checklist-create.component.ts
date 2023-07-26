import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checklist-create',
  templateUrl: './checklist-create.component.html',
  styleUrls: ['./checklist-create.component.scss']
})
export class ChecklistCreateComponent implements OnInit {

  @Output() closeCheckList = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

  closeCheckListScreen(){
    this.closeCheckList.emit(true);
  }

}
