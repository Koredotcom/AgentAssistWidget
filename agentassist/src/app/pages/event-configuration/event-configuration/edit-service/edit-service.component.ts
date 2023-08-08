import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.scss']
})
export class EditServiceComponent implements OnInit {

  @Output() onCloseService = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  closeService(rule?) {
    this.onCloseService.emit(true);
  }
}
