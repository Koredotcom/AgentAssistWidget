import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-speech-analysis',
  templateUrl: './speech-analysis.component.html',
  styleUrls: ['./speech-analysis.component.scss']
})
export class SpeechAnalysisComponent implements OnInit {

  @Input() form : UntypedFormGroup;
  @Input() index : number;
  @Input() length : number;
  @Input() createOrEdit: string = '';
  @Output() deleteTrigger = new EventEmitter();

  @ViewChild('utteranceTimer') private utteranceTimer: NgbDropdown;
  @ViewChild('talkrationpercentagedropdown') private trdropdown :NgbDropdown;

  coachingCnst = COACHINGCNST;
  speechType = COACHINGCNST.SPEECH_TYPE;
  occurances = COACHINGCNST.OCCURENCES;
  timer = COACHINGCNST.SELECTED_TIMER;
  opList = COACHINGCNST.OPERATOR_LIST;
  showTimer = COACHINGCNST.SELECTED_TIMER;
  selOcc = COACHINGCNST.SELECTED_OCCURENCE;
  wordcount = COACHINGCNST.SELECTED_WORDCOUNT;
  showWordcount = COACHINGCNST.SELECTED_WORDCOUNT;
  periodList : any = [COACHINGCNST.TRIGGER_FIRST, COACHINGCNST.TRIGGER_WITHIN];

  selectedSpeechType : string = '';
  selectedOperator : string;
  selectedConvType : string;
  selectedCompator : string;
  selectedPercentage : any = [];
  showPercentage : any = [];
  selectedList : any = {}
  inconvList : any = {}
  selUser: '';

  validatePasswordMatch = (control: AbstractControl): { [key: string]: any } | null => {

    if (this.selectedSpeechType == this.coachingCnst.SPEECHSPEED || this.selectedSpeechType == this.coachingCnst.TALKRATIO) {
      return null;
    }

    let enteredTime = (this.form.controls.frequency as UntypedFormGroup).value?.timeTaken as number;
    let inConvTime = (this.form.controls.frequency as UntypedFormGroup).value?.nSeconds as number;

    if (enteredTime <= inConvTime) {
      this.utteranceTimer?.close();
      return null;
    }
    this.utteranceTimer?.open();
    return { valueMisMatch: true };;

  };


  constructor() {
  
   }

  ngOnInit(): void {
    (this.form.controls.frequency as UntypedFormGroup).controls.timeTaken?.setValue(this.timer);
    this.selectedOperator = this.form.controls.operator?.value;
  }

  ngOnChanges(changes : any){
    if(changes["index"]?.currentValue ==  this.length){
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
      this.selUser = formVal.by;

      this.selectedPercentage = formVal.conditions?.value || [];
      this.showPercentage = formVal.conditions?.value || [];
      this.selectedCompator = formVal.conditions?.operator;

      this.resetFormValidators(this.selectedSpeechType);
      this.updateInConversationVariables(formVal);
    }

    if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      this.selectedSpeechType = '';
      this.updateInConversationVariables(this.form.value);
      this.resetFormValuesBasedOnSpeechSelection(this.selectedSpeechType);
    }  
  }

  updateInConversationVariables(formVal){
    this.selectedConvType = formVal.frequency.duration;
    this.selectedList.period = formVal.frequency.period ? formVal.frequency.period : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.period;
    if(formVal.subType === this.coachingCnst.TALKRATIO){
      const val = formVal.frequency.nSeconds/60
      this.selectedList.nSeconds = formVal.frequency.nSeconds ? (val < 1 ? 1 : val) : 1;
      this.inconvList.nSeconds = formVal.frequency.nSeconds ? (val < 1 ? 1 : val) : 1;
    }else{
      this.selectedList.nSeconds = formVal.frequency.nSeconds ? formVal.frequency.nSeconds : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.nSeconds;
      this.inconvList.nSeconds = formVal.frequency.nSeconds ? formVal.frequency.nSeconds : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.nSeconds;
    }
    this.inconvList.period = formVal.frequency.period ? formVal.frequency.period : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.period;
  }

  clickOnUser(user){
    this.selUser = user;
    this.form.controls.by.setValue(user);
  }

  clickOnComparator(comp){
    if(this.selectedCompator != comp){
      this.showPercentage = [];
      this.selectedPercentage = [];
      this.selectedCompator = comp;
      (this.form.controls.conditions as UntypedFormGroup)?.controls?.operator.setValue(this.selectedCompator);
    }
  }

  clickOnType(type){
    if(this.selectedSpeechType != type){
      this.selectedSpeechType = type;

      this.form.removeControl('conditions');

      (<UntypedFormGroup>this.form.controls.frequency).removeControl('nWords');
      (<UntypedFormGroup>this.form.controls.frequency).removeControl('timeTaken');

      if(type === this.coachingCnst.SPEECHSPEED){
        this.wordcount = COACHINGCNST.SELECTED_WORDCOUNT;
        (<UntypedFormGroup>this.form.controls.frequency).addControl('nWords', new UntypedFormControl(COACHINGCNST.SELECTED_WORDCOUNT));
      }else if(type === this.coachingCnst.CROSSTALK || type === this.coachingCnst.DEADAIR){
        this.timer = COACHINGCNST.SELECTED_TIMER;
        (<UntypedFormGroup>this.form.controls.frequency).addControl('timeTaken', new UntypedFormControl(COACHINGCNST.SELECTED_TIMER));
      }else if(type == this.coachingCnst.TALKRATIO){
        this.form.addControl('conditions', new UntypedFormGroup({
          'operator' : new UntypedFormControl('', [Validators.required]),
          'value' : new UntypedFormControl('', [Validators.required])
        }));
      }
      this.setDefaultBy(type);
      this.form.controls.subType.setValue(type);
      this.resetFormValuesBasedOnSpeechSelection(type);
      let val = 1;
      if(type !== this.coachingCnst.TALKRATIO){
        val = COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.nSeconds;
      }
      this.onEnterSeconds(val);
    }

  }

  setDefaultBy(type, value?){
    this.selUser = value ? value : '';
    this.form.removeControl('by');
    if(type != COACHINGCNST.CROSSTALK && type != COACHINGCNST.TALKRATIO){
      this.form.addControl('by', new UntypedFormControl(this.selUser, [Validators.required]))
    }
  }

  clickOnConvType(type) {
    if (type && this.selectedConvType != type) {
      this.selectedConvType = type;
      let addConvSelectionList: any = [];
      for (let item in COACHINGCNST.UTTERANCE_CONV_REMOVE_LIST) {
        let utteranceConvSelectionList = COACHINGCNST.UTTERANCE_CONV_REMOVE_LIST[item];
        if (item != type) {
          for (let param of utteranceConvSelectionList) {
            (<UntypedFormGroup>this.form.controls.frequency).removeControl(param);
          }
        } else {
          addConvSelectionList = COACHINGCNST.UTTERANCE_CONV_REMOVE_LIST[item];
        }
      }
      for (let param of addConvSelectionList) {
        let validatorList : any = [Validators.required];
        if(param == 'nSeconds'){
          validatorList.push(this.validatePasswordMatch.bind(this));
        }
        (<UntypedFormGroup>this.form.controls.frequency).addControl(param, new UntypedFormControl(COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION[param], validatorList));
        this.selectedList[param] = COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION[param];
      }
      (this.form.controls.frequency as UntypedFormGroup).controls?.duration?.setValue(type);
      this.resetFormValuesBasedOnConvSelection(type);
    }
    if(type == this.coachingCnst.TRIGGER_BYTIME){
      this.utteranceTimer.open();
    }
    
  }

  resetFormValuesBasedOnConvSelection(type){
    if(type){
      this.onEnterPeriod(this.coachingCnst.UTTERANCE_CONV_DEFAULT_SELECTION.period);
      let val = 1;
      if(this.selectedSpeechType !== this.coachingCnst.TALKRATIO){
        val = COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.nSeconds;
      }
      this.onEnterSeconds(val);
    }
  }

  onEnterPeriod(e){
    this.inconvList.period = e;
    this.selectedList.period = e;
    if((this.form.controls.frequency as UntypedFormGroup).controls?.period){
      (this.form.controls.frequency as UntypedFormGroup).controls?.period.setValue(this.inconvList.period);
    }    
  }


  onEnterSeconds(e){
    // if(this.selectedSpeechType == this.coachingCnst.DEADAIR && (!e || e <= this.timer)){
    //   e = this.timer;
    // }else 
    if(this.selectedSpeechType == this.coachingCnst.SPEECHSPEED || this.selectedSpeechType == this.coachingCnst.TALKRATIO){
      if(!e){
        e = 1;
      }
      this.utteranceTimer?.close();
    }
    this.inconvList.nSeconds = e;
    this.selectedList.nSeconds = e;
    if((this.form.controls.frequency as UntypedFormGroup).controls?.nSeconds){
      (this.form.controls.frequency as UntypedFormGroup).controls?.nSeconds.setValue(this.inconvList.nSeconds * (this.selectedSpeechType == this.coachingCnst.TALKRATIO ? 60 : 1));
      (this.form.controls.frequency as UntypedFormGroup).controls?.nSeconds.updateValueAndValidity();
    }
  }


  resetFormValuesBasedOnSpeechSelection(type){
    if(type){
      this.clickOcc(1);
      this.onEnterTime(30);
      this.onEnterWords(180); 
      this.changeOperator(this.coachingCnst.AND_OPERATOR);
      this.resetFormValidators(type);  
      this.clearConvType();
      this.clearPercentage();
      this.clearComparator();
    }
  }

  clearComparator(){
    this.selectedCompator = null;
    (this.form.controls.conditions as UntypedFormGroup)?.controls?.operator?.setValue('');

  }

  clearPercentage(){
    this.selectedPercentage = [];
    (this.form.controls.conditions as UntypedFormGroup)?.controls?.value?.setValue([]);
  }

  clearConvType(){
    this.selectedConvType = null;
    (this.form.controls.frequency as UntypedFormGroup).controls?.duration?.setValue('');
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
    (this.form.controls.frequency as UntypedFormGroup).controls.nOccurrences.setValue(occ);
  }

  onEnterTime(e){
    this.timer = e ? e : 1;
    (this.form.controls.frequency as UntypedFormGroup).controls?.timeTaken?.setValue(this.timer);
    (this.form.controls.frequency as UntypedFormGroup).controls?.nSeconds?.updateValueAndValidity();
  }

  onEnterTimeCT(e){
    this.timer = e && e > 1 ? e : 2;
    (this.form.controls.frequency as UntypedFormGroup).controls?.timeTaken?.setValue(this.timer);
    // if(this.timer > this.selectedList.nSeconds){
    //   this.onEnterSeconds(this.timer);
    // }
    (this.form.controls.frequency as UntypedFormGroup).controls?.nSeconds?.updateValueAndValidity();
  }

  onEnterPercentage(e){
    this.selectedPercentage[0] = (e ? e : 1);
    (this.form.controls.conditions as UntypedFormGroup)?.controls?.value?.setValue(this.selectedPercentage);
    this.trdropdown.close();
  }

  submitPercentage(){
    this.selectedPercentage = Object.assign([],this.showPercentage);
    (this.form.controls.conditions as UntypedFormGroup)?.controls?.value?.setValue(this.selectedPercentage);
    this.trdropdown.close();
  }

  onEnterWords(e){
    this.wordcount = e ? e : 1;
    (this.form.controls.frequency as UntypedFormGroup).controls?.nWords?.setValue(this.wordcount);
  }

  resetFormValidators(type){
    if(type){
      this.setDefaultBy(type, this.selUser);
      let actualParams = COACHINGCNST.VALIDATORS[type];
      for(let key in (this.form.controls?.frequency as UntypedFormGroup)?.controls){        
        if(actualParams.includes(key)){
          let validatorList : any = [Validators.required];
          (this.form.controls?.frequency as UntypedFormGroup)?.controls[key].setValidators(validatorList);
        }else if(key != 'nSeconds'){          
          (this.form.controls?.frequency as UntypedFormGroup)?.controls[key].clearValidators();
        }
        (this.form.controls?.frequency as UntypedFormGroup)?.controls[key].updateValueAndValidity();
      }
    }    
  }

  clonePercentage(){
    this.showPercentage = Object.assign([],this.selectedPercentage)
  }

}
