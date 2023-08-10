import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-create',
  templateUrl: './step-create.component.html',
  styleUrls: ['./step-create.component.scss']
})
export class StepCreateComponent implements OnInit, OnChanges {
  @Output() closeE = new EventEmitter();
  @Output() saveStep = new EventEmitter();
  @Input() stepForm: FormGroup;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("this.stepForm", this.stepForm);
  }

  ngOnInit(): void {

  }

  close(){
    this.closeE.emit(false);
  }

  save(){
    this.saveStep.emit(true);
  }
}
