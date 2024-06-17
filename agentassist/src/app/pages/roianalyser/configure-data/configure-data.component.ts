import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-configure-data',
  templateUrl: './configure-data.component.html',
  styleUrls: ['./configure-data.component.scss']
})
export class ConfigureDataComponent implements OnInit {

  @Output() closeConfigureData = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(){
    this.closeConfigureData.emit(true);
  }

}
