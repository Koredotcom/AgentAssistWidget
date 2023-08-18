import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GuidedChecklistModule } from './guided-checklist.module';

@Injectable()
export class ChecklistService {
  constructor(
    private fb: FormBuilder
  ) { }
  metaForUtternace:any = {};
  getCheckListForm(botId, checkListType){
    let obj = {
      'botId': [botId, [Validators.required]],
      'name': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'tags': this.fb.array([]),
      'order': ['seqential', [Validators.required]],
      'channels': this.fb.array([], [Validators.required]),
      'type': [checkListType, [Validators.required]],
      'assignedTo': this.fb.group({
        'isAllInteractions': [true],
        'assignees': this.fb.group({
          'groups': this.fb.array([]),
          'agents': this.fb.array([]),
        }),
        'queues': this.fb.array([]),
        'skills': this.fb.array([]),
      }),
      'stages': this.fb.array([]),
      'isActive': [false, [Validators.required]],
    }
    if(checkListType === 'dynamic'){
      obj["adherence"]= this.fb.group({
        type: ['utterance'],
        addUtterances: this.fb.array([]),
        deleteUtterances: this.fb.array([])
      })
    }
    return obj;
  }

  setCheckListForm(obj){
    return {
      'botId': [obj.botId, [Validators.required]],
      'name': [obj.name, [Validators.required]],
      'description': [obj.description, [Validators.required]],
      'tags': this.fb.array(obj.tags),
      'order': [obj.order, [Validators.required]],
      'channels': this.fb.array(obj.channels, [Validators.required]),
      'type': [obj.type, [Validators.required]],
      'assignedTo': this.fb.group({
        'isAllInteractions': [obj.assignedTo?.isAllInteractions || true],
        'assignees': this.fb.group({
          'groups': this.fb.array(obj.assignedTo?.assignees?.groups || []),
          'agents': this.fb.array(obj.assignedTo?.assignees?.agents || []),
        }),
        'queues': this.fb.array(obj.queues || []),
        'skills': this.fb.array(obj.skills || []),
      }),
      'stages': this.fb.array(obj.stages),
      'isActive': [obj.isActive, [Validators.required]],
    }
  }

  getStepForm(botId){
    return {
      "botId": [botId, [Validators.required]],
      "name": ['', [Validators.required]],
      "description": ['', [Validators.required]],
      "confirmButtons": this.fb.array([]),
      'isAdherenceActive': [false, [Validators.required]],
      "adherence": this.fb.group({
        type: ['utterance'],
        addUtterances: this.fb.array([]),
        deleteUtterances: this.fb.array([])
      }),
      "clsId": ['', [Validators.required]],
    }
  }

  setStepForm(step, botId){
    let obj = {
      "_id": step._id,
      "botId": [botId, [Validators.required]],
      "name": [step.name, [Validators.required]],
      "description": [botId.description, [Validators.required]],
      "confirmButtons": this.fb.array([]),
      'isAdherenceActive': [botId.isAdherenceActive, [Validators.required]],
      "clsId": [step.clsId, [Validators.required]],
      "adherence": this.fb.group({})
    };
    if(step.adherence?.type === 'utterance'){
      obj['adherence'] = this.fb.group({
        type: ['utterance'],
        addUtterances: this.fb.array([]),
        deleteUtterances: this.fb.array([])
      })
    };
    return obj;
  }

  getTriggerBy(){
    return {
      'type': ['', [Validators.required]],
      'botId': ['', [Validators.required]],
      'taskId': ['', [Validators.required]],
      'when': ['', [Validators.required]],
      'addUtterances': this.fb.array([]),
    }
  };

  getUtteranceForm(){
    return {
      type: ['', [Validators.required]],
      addUtterances: this.fb.array([], [Validators.required]),
      deleteUtterances: this.fb.array([]),
    }
  }
}
