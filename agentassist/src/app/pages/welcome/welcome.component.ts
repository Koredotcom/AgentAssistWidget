import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  curStep: number = 1;
  // @Output() closeModal = new EventEmitter();
  @Output() wSel = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.getStarted();
  }

  toStep(n: number) {
    this.curStep = n;
  }

  getStarted() {
    this.wSel.emit();
  }

}
