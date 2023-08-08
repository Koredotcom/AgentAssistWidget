import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {

  @Output() closeNewService = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  closeService(){
    this.closeNewService.emit(true);
  }

  submitForm(){
    this.closeNewService.emit(true);
  }
}
