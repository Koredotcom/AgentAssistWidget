import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { COACHINGCNST } from './coaching.cnst';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CoachingService {

  coachingCnst : any = COACHINGCNST;
  constructor(private fb: FormBuilder) { }

  getUtteranceFormControlObject(){
    return {
      _id: [uuid(), [Validators.required]],
      type: [this.coachingCnst.UTTERANCE, [Validators.required]],
      by: ['', [Validators.required]],
      operator : ['And', [Validators.required]],
      when : this.fb.group({
        utterancesId: [[], Validators.required]
      }),
      frequency: this.fb.group({
        nOccurences: [1, Validators.required],
        every: ['30s', Validators.required]
      })
    }
  }

  setUtteranceForm(obj){
    return {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.UTTERANCE,
      by: [obj.by, [Validators.required]],
      operator : [obj.operator, [Validators.required]],
      when : this.fb.group({
        utterancesId: [obj.when?.utterancesId, Validators.required]
      }),
      frequency: this.fb.group({
        nOccurences: [obj.frequency?.nOccurences, Validators.required],
        every: [obj.frequency?.every, Validators.required]
      })
    } 
  }

  getSpeechAnalysisFormControlObject(){
    return {
      type: this.coachingCnst.SPEECH_ANALYSIS,
      subType: ['', [Validators.required]],
      operator : ['And', [Validators.required]],
      frequency: this.fb.group({
        nOccurences: [1, Validators.required],
        every: ['30s', Validators.required]
      })
    }
  }

  getVariableFormControlObject(){
    return {
      type: this.coachingCnst.VARIABLE,
      by: [null, [Validators.required]],
      when : [[], [Validators.required]],
      streetType: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      nOccurences: [null, [Validators.required]],
      every: [null, [Validators.required]],
      operator : [null, [Validators.required]]
    }
  }

  getDialogFormControlObject(){
    return {
      type: this.coachingCnst.DIALOG,
      by: [null, [Validators.required]],
      when : [[], [Validators.required]],
      streetType: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      nOccurences: [null, [Validators.required]],
      every: [null, [Validators.required]],
      operator : [null, [Validators.required]]
    }
  }

  getNudgeFromObj(){
    return {
      type: this.coachingCnst.NUDGE_AGENT,
      by: [null, [Validators.required]],
      when : [[], [Validators.required]],
      streetType: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      nOccurences: [null, [Validators.required]],
      every: [null, [Validators.required]],
      operator : [null, [Validators.required]]
    }
  }

  getHintFromObj(){
    return {
      type: this.coachingCnst.HINT_AGENT,
      by: [null, [Validators.required]],
      when : [[], [Validators.required]],
      streetType: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      nOccurences: [null, [Validators.required]],
      every: [null, [Validators.required]],
      operator : [null, [Validators.required]]
    }
  }

}
