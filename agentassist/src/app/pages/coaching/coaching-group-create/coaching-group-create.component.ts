import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-coaching-group-create',
  templateUrl: './coaching-group-create.component.html',
  styleUrls: ['./coaching-group-create.component.scss']
})
export class CoachingGroupCreateComponent implements OnInit {

  constructor() { }
  @Output() onClose = new EventEmitter();
  ngOnInit(): void {
  }
  closeGroup(group?) {
    this.onClose.emit(group);
  }

}
