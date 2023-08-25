import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GuidedChecklistModule } from './guided-checklist.module';
import { CHECKLISTCNST } from './checklist.const';

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
      'order': ['sequential', [Validators.required]],
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
      'isActive': [checkListType === CHECKLISTCNST.dynamic ? true : false, [Validators.required]],
    }
    if(checkListType === CHECKLISTCNST.dynamic){
      obj["adherence"]= this.fb.group(
        this.getUtteranceForm('', true)
      )
    }
    return obj;
  }

  setCheckListForm(obj){
    let setForm = {
      '_id': [obj._id, [Validators.required]],
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
    if(obj.type === CHECKLISTCNST.dynamic){
      if(obj.triggerBy?.type === 'utterance'){
        setForm["adherence"]= this.fb.group(this.getUtteranceForm(obj.triggerBy.type, true))
      }else if(obj.triggerBy?.type === 'dialog'){
        setForm["adherence"]= this.fb.group(this.getDialogForm(obj.triggerBy))
      }
    }
    
    return setForm;
  }

  getStepForm(botId){
    return {
      "botId": [botId, [Validators.required]],
      "name": ['', [Validators.required]],
      "description": [''],
      "confirmButtons": this.fb.array([]),
      'isAdherenceActive': [false, [Validators.required]],
      "adherence": this.fb.group(
        this.getUtteranceForm('', false)
        // {}
      ),
      "clsId": ['', [Validators.required]],
    }
  }

  setStepForm(step, botId){
    let obj = {
      "_id": step._id,
      "botId": [botId, [Validators.required]],
      "name": [step.name, [Validators.required]],
      "description": [step.description],
      "confirmButtons": this.fb.array([]),
      'isAdherenceActive': [step.isAdherenceActive, [Validators.required]],
      "clsId": [step.clsId, [Validators.required]],
      "adherence": this.fb.group({})
    };
    if(step?.confirmButtons?.length){
      obj['confirmButtons'] = this.fb.array([...step?.confirmButtons], [Validators.required])
    }
    if(step.adherence?.type === 'utterance'){
      obj['adherence'] = this.fb.group(
        this.getUtteranceForm(step.adherence?.type, true)
      )
    }else if(step.adherence?.type === 'dialog'){
      obj["adherence"]= this.fb.group(this.getDialogForm(step.adherence));
    }
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

  getUtteranceForm(val, req=false){
    return {
      type: [val ? val : '', req ? [Validators.required] : []],
      addUtterances: this.fb.array([]),
      deleteUtterances: this.fb.array([]),
      uttCount: [0, req ? [Validators.required, Validators.min(1)] : []]
    }
  }

  getDialogForm(obj=null){
    return {
      type: [obj ? obj.type : '', [Validators.required]],
      taskId: [obj ? obj.taskId :'', [Validators.required]],
      when: [obj ? obj.when :'', [Validators.required]],
    }
  }
}
