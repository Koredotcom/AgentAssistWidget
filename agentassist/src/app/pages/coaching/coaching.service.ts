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
      _id: ['aat-'+uuid(), [Validators.required]],
      type: [this.coachingCnst.UTTERANCE, [Validators.required]],
      by: ['', [Validators.required]],
      operator : ['and', [Validators.required]],
      when : this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
        utteranceCount: ['', [Validators.required]]
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
        addUtterances: [[]],
        deleteUtterances: [[]],
        utteranceCount: [obj.when?.utteranceCount,[Validators.required]]
      }),
      frequency: this.fb.group({
        nOccurences: [obj.frequency?.nOccurences, Validators.required],
        every: [obj.frequency?.every, Validators.required],
      })
    } 
  }

  getSpeechAnalysisFormControlObject(){
    return {
      _id: ['aat-'+uuid(), [Validators.required]],
      type: [this.coachingCnst.SPEECH_ANALYSIS, [Validators.required]],
      subType: ['', [Validators.required]],
      operator : ['And', [Validators.required]],
      frequency: this.fb.group({
        nOccurences: [1, Validators.required],
        timeTaken: ['30s'],
        nWords : [180]
      })
    }
  }

  setSpeechAnalysisForm(obj){
    return {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.SPEECH_ANALYSIS,
      subType: [obj.subType, [Validators.required]],
      operator : [obj.operator, [Validators.required]],
      frequency: this.fb.group({
        nOccurences: [obj.frequency?.nOccurences],
        timeTaken: [obj.frequency?.timeTaken],
        nWords : [obj.frequency?.nWords]
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
      _id: ['aat-'+uuid(), [Validators.required]],
      type: this.coachingCnst.NUDGE_AGENT,
      expression: ['', [Validators.required]],
      message : this.fb.group({
        title: ['', Validators.required]
      }),
      adherence : this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
        utteranceCount: ['', [Validators.required]]
      })
    }
  }

  setNudgeForm(obj){
    return {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.NUDGE_AGENT,
      expression: [obj.expression, [Validators.required]],
      message : this.fb.group({
        title: [obj.message?.title, Validators.required]
      }),
      adherence : this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
        utteranceCount: [obj.adherence?.utteranceCount,[Validators.required]]
      })
    }
  }

  getHintFromObj(){
    return {
      _id: ['aat-'+uuid(), [Validators.required]],
      type: this.coachingCnst.HINT_AGENT,
      expression: ['', [Validators.required]],
      message : this.fb.group({
        title: ['', Validators.required],
        body : ['', Validators.required],
        postAction : ['', Validators.required]
      }),
      adherence : this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
        utteranceCount: ['', [Validators.required]]
      })
    }
  }

  setHintForm(obj){
    return {
      _id: [obj._id, [Validators.required]],
      type: this.coachingCnst.HINT_AGENT,
      expression: [obj.expression, [Validators.required]],
      message : this.fb.group({
        title: [obj.message?.title, Validators.required],
        body : [obj.message?.body, Validators.required],
        postAction : [obj.message?.postAction, Validators.required]
      }),
      adherence : this.fb.group({
        addUtterances: [[]],
        deleteUtterances: [[]],
        utteranceCount: [obj.adherence?.utteranceCount,[Validators.required]]
      })
    }
  }

}
