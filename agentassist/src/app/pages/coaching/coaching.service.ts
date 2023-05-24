import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { COACHINGCNST } from './coaching.cnst';

@Injectable({
  providedIn: 'root'
})
export class CoachingService {

  coachingCnst : any = COACHINGCNST;
  constructor(private fb: FormBuilder) { }

  getUtteranceFormControlObject(){
    return {
      type: this.coachingCnst.UTTERANCE,
      by: ['', [Validators.required]],
      operator : ['And', [Validators.required]],
      when : this.fb.group({
        utterancesId: this.fb.array([1,2,3,4], Validators.required)
      }),
      frequency: this.fb.group({
        nOccurences: [1, Validators.required],
        every: ['30s', Validators.required]
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
