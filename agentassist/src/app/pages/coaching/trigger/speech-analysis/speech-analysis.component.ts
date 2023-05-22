import { Component, Input, OnInit } from '@angular/core';
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-speech-analysis',
  templateUrl: './speech-analysis.component.html',
  styleUrls: ['./speech-analysis.component.scss']
})
export class SpeechAnalysisComponent implements OnInit {

  @Input() form:any;
  @Input() index : number;
  @Input() length : number;

  speechType = COACHINGCNST.SPEECH_TYPE;
  occurances = COACHINGCNST.OCCURENCES;
  selOcc = COACHINGCNST.SELECTED_OCCURENCE;
  timer = COACHINGCNST.SELECTED_TIMER;
  selectedSpeechType : string = '';
  selectedOperator : string;

  constructor() { }

  ngOnInit(): void {
    console.log("form", this.form, this.index, this.length);
    this.form.controls.frequency.controls.every.setValue(this.timer+'s');
    this.selectedOperator = this.form.controls.operator.value;
  }

  clickOnType(type){
    this.selectedSpeechType = type
    this.form.controls.subType.setValue(type);
  }

  changeOperator(op){
    this.selectedOperator = op
    this.form.controls.operator.setValue(op);
    console.log(this.form, 'from');
    
  }


}
