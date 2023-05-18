import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { COACHINGCNST } from './coaching.cnst';

@Injectable({
  providedIn: 'root'
})
export class CoachingService {

  coachingCnst : any = COACHINGCNST;
  constructor() { }

  getUtteranceFormControlObject(){
    return {
      type: this.coachingCnst.UTTERANCE,
      by: [null, [Validators.required]],
      when : [[], [Validators.required]],
      streetType: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      nOccurences: [null, [Validators.required]],
      every: [null, [Validators.required]],
      operator : [null, [Validators.required]]
    }
  }

  getSpeechAnalysisFormControlObject(){
    return {
      type: this.coachingCnst.SPEECH_ANALYSIS,
      by: [null, [Validators.required]],
      when : [[], [Validators.required]],
      streetType: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      nOccurences: [null, [Validators.required]],
      every: [null, [Validators.required]],
      operator : [null, [Validators.required]]
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

}
