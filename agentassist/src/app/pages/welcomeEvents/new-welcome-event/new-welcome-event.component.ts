import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-welcome-event',
  templateUrl: './new-welcome-event.component.html',
  styleUrls: ['./new-welcome-event.component.scss']
})
export class NewWelcomeEventComponent implements OnInit {

  @Output() close = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }
  closeSlider() {
    this.close.emit();
  }
}
