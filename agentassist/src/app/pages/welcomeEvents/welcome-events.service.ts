import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WelcomeEventsService {

  welcomeEventData$ = new Subject();
  
  constructor() { }

  setWelcomeEventData(data){
    this.welcomeEventData$.next(data);
  }

  formatWelcomeTaskData(data){
    data.events?.forEach(obj => {
      data[obj.name] = Object.assign({}, obj);
    });
    return data;
  }

    //automation bot list and usecase list filter based on selection
    filterBotfromAutomationBotList(linkBotId, linkedBots, currentBt) {
      let filteredArray = linkedBots.filter(obj => obj._id == linkBotId);
      if ((currentBt.type == 'universalbot')) {
        if (Object.keys(filteredArray).length > 0) {
          return filteredArray[0];
        }
      }
      return null;
    }
  
    filterUseCaseFromUseCaseList(trid, conversations, currentBt, selectedBot) {
      let filteredArray = conversations.filter(obj => obj.taskRefId == trid);
      if (currentBt.type != 'universalbot' || (currentBt.type == 'universalbot' && selectedBot && selectedBot.botName)) {
        if (Object.keys(filteredArray).length > 0) {
          return filteredArray[0];
        }
      }
      return null;
    }

    formatOnconnectFormObject(selectedUseCase, selectedBot){
      return {
        enabled: selectedUseCase?.taskRefId ? true : false,
        usecaseId: selectedUseCase && selectedUseCase?._id ? selectedUseCase._id : '',
        refId: selectedUseCase?.refId || '',
        dialogId: selectedUseCase?.dialogId || '',
        taskRefId: selectedUseCase?.taskRefId || '',
        linkedBotId: selectedBot && selectedBot._id ? selectedBot._id : ''
      }
    }

    getOnConnectActiveTabFormGroup(data){
      return {
        "enabled": new FormControl(data?.enabled || false, Validators.required),
        "usecaseId": new FormControl(data?.usecaseId || ''),
        "refId": new FormControl(data?.refId || '', Validators.required),
        "dialogId": new FormControl(data?.dialogId || '', Validators.required),
        "taskRefId": new FormControl(data?.taskRefId || '', Validators.required),
        "extractIntents": new FormControl(data?.extractIntents || false, Validators.required),
        "linkedBotId": new FormControl(data?.linkedBotId || '')
      };
    }


}
