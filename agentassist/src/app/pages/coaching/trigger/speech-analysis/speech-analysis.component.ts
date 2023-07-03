import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-speech-analysis',
  templateUrl: './speech-analysis.component.html',
  styleUrls: ['./speech-analysis.component.scss']
})
export class SpeechAnalysisComponent implements OnInit {

  @Input() form : FormGroup;
  @Input() index : number;
  @Input() length : number;
  @Input() createOrEdit: string = '';
  @Output() deleteTrigger = new EventEmitter();

  coachingCnst = COACHINGCNST;
  speechType = COACHINGCNST.SPEECH_TYPE;
  occurances = COACHINGCNST.OCCURENCES;
  selOcc = COACHINGCNST.SELECTED_OCCURENCE;
  timer = COACHINGCNST.SELECTED_TIMER;
  showTimer = COACHINGCNST.SELECTED_TIMER;
  opList = COACHINGCNST.OPERATOR_LIST;
  selectedSpeechType : string = '';
  selectedOperator : string;
  wordcount = COACHINGCNST.SELECTED_WORDCOUNT;
  showWordcount = COACHINGCNST.SELECTED_WORDCOUNT;
  constructor() { }

  ngOnInit(): void {
    (this.form.controls.frequency as FormGroup).controls.timeTaken?.setValue(this.timer);
    this.selectedOperator = this.form.controls.operator?.value;
  }

  ngOnChanges(changes : any){
    if(changes["index"]?.currentValue ==  length){
      this.changeOperator(COACHINGCNST.AND_OPERATOR);
    }  
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      const formVal = this.form.value;
      this.selectedSpeechType = formVal.subType;
      this.selectedOperator = formVal.operator;
      this.selOcc = formVal.frequency.nOccurrences;
      this.timer = formVal.frequency.timeTaken;
      this.showTimer = formVal.frequency.timeTaken;
      this.wordcount = formVal.frequency.nWords;
      this.showWordcount = formVal.frequency.nWords;
      this.resetFormValidators(this.selectedSpeechType);
    }
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      this.selectedSpeechType = '';
      this.resetFormValuesBasedOnSpeechSelection(this.selectedSpeechType);
    }  
  }

  clickOnType(type){
    this.selectedSpeechType = type;
    if(type === 'speech_speed'){
      this.wordcount = COACHINGCNST.SELECTED_WORDCOUNT;
      (<FormGroup>this.form.controls.frequency).addControl('nWords', new FormControl(COACHINGCNST.SELECTED_WORDCOUNT));
      (<FormGroup>this.form.controls.frequency).removeControl('timeTaken');
    }else{
      this.timer = COACHINGCNST.SELECTED_TIMER;
      (<FormGroup>this.form.controls.frequency).addControl('timeTaken', new FormControl(COACHINGCNST.SELECTED_TIMER));
      (<FormGroup>this.form.controls.frequency).removeControl('nWords');
    };
    this.form.controls.subType.setValue(type);
    this.resetFormValuesBasedOnSpeechSelection(type);
  }

  resetFormValuesBasedOnSpeechSelection(type){
    if(type){
      this.clickOcc(1);
      this.onEnterTime(30);
      this.onEnterWords(180); 
      this.changeOperator(this.coachingCnst.AND_OPERATOR);
      this.resetFormValidators(type);   
    }
  }

  changeOperator(op){
    this.selectedOperator = op
    this.form.controls.operator.setValue(op);
  }

  deleteTriggerRule(){
    this.deleteTrigger.emit(this.index-1);
  }

  clickOcc(occ){
    this.selOcc = occ;
    (this.form.controls.frequency as FormGroup).controls.nOccurrences.setValue(occ);
  }

  onEnterTime(e){
    this.timer = e ? e : 1;
    (this.form.controls.frequency as FormGroup).controls?.timeTaken?.setValue(this.timer);
  }

  onEnterTimeCT(e){
    this.timer = e && e > 1 ? e : 2;
    (this.form.controls.frequency as FormGroup).controls?.timeTaken?.setValue(this.timer);
  }

  onEnterWords(e){
    this.wordcount = e ? e : 1;
    (this.form.controls.frequency as FormGroup).controls?.nWords?.setValue(this.wordcount);
  }

  resetFormValidators(type){
    if(type){
      let actualParams = COACHINGCNST.VALIDATORS[type];
      for(let key in (this.form.controls?.frequency as FormGroup)?.controls){
        if(actualParams.includes(key)){
          (this.form.controls?.frequency as FormGroup)?.controls[key].setValidators(Validators.required);
        }else{
          (this.form.controls?.frequency as FormGroup)?.controls[key].clearValidators();
        }
        (this.form.controls?.frequency as FormGroup)?.controls[key].updateValueAndValidity();
      }
    }
  }

}
