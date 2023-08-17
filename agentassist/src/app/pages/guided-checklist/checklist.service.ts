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
    return {
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
      'isActive': [true, [Validators.required]],
    }
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
      "adherence": this.fb.group({
        'isAdherenceActive': new FormControl(false, [Validators.required]),
        "type": new FormControl('', [Validators.required]),
        "botId": new FormControl('', [Validators.required]),
      }),
      "clsId": ['', [Validators.required]],
    }
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
}
