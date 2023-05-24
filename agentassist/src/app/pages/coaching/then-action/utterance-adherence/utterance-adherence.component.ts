import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-utterance-adherence',
  templateUrl: './utterance-adherence.component.html',
  styleUrls: ['./utterance-adherence.component.scss']
})
export class UtteranceAdherenceComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  constructor() { }

  ngOnInit(): void {
  }

  closeAdherence(e?) {
    this.onClose.emit(e);
  }
}
