import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-utterance-adherence',
  templateUrl: './utterance-adherence.component.html',
  styleUrls: ['./utterance-adherence.component.scss']
})
export class UtteranceAdherenceComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  closeAdherence(e?) {
    this.onClose.emit(e);
  }
}
