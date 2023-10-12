import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants, storageConst } from '../constants/proj.cnts';
import { EmptyObjectCheckPipe } from '../pipes/empty-object-check.pipe';
import { HandleSubjectService } from './handle-subject.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  subscriptionsList: Subscription[] = [];
  connectionDetails : any;
  userDetails : any = {};
  agentDetails : any = {};

  constructor(private handleSubjectService : HandleSubjectService, private emptyObjectCheckPipe : EmptyObjectCheckPipe) {
    this.subscribeEvents();
  }

  subscribeEvents(){
    let subscription1 = this.handleSubjectService.connectDetailsSubject.subscribe((urlParams: any) => {
      if (urlParams && urlParams?.token) {
        this.connectionDetails = urlParams;
      }
    });
    this.subscriptionsList.push(subscription1);
  }

  setLocalStorageItem(storageObject, currentTab?){
    
    let appState = this.getLocalStorageState();
    let conversationId = this.connectionDetails.conversationId;
    if(appState && Object.keys(appState).length > 0 && appState[conversationId]){
      // if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.AUTOMATION_GOING_ON])){
      //   appState[conversationId][storageConst.AUTOMATION_GOING_ON] = storageObject[storageConst.AUTOMATION_GOING_ON];
      // }
      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.IS_WELCOMEMSG_PROCESSED])){
        appState[conversationId][storageConst.IS_WELCOMEMSG_PROCESSED] = storageObject[storageConst.IS_WELCOMEMSG_PROCESSED];
      }
      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.INITIALTASK_GOING_ON])){
        appState[conversationId][storageConst.INITIALTASK_GOING_ON] = storageObject[storageConst.INITIALTASK_GOING_ON];
      }
      // if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.AUTOMATION_NOTRAN_ARRAY]) && currentTab){
      //   appState[conversationId][currentTab][storageConst.AUTOMATION_NOTRAN_ARRAY] = storageObject[storageConst.AUTOMATION_NOTRAN_ARRAY];
      // }
      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH])){
        appState[conversationId][storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH] = storageObject[storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH];
 
      }
      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT])){
        appState[conversationId][storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT] = storageObject[storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT];
      }
      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.CURRENT_TAB])){
        appState[conversationId][storageConst.CURRENT_TAB] = storageObject[storageConst.CURRENT_TAB]
      }

      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.FAQ_LIST])){
        appState[conversationId][storageConst.FAQ_LIST] = storageObject[storageConst.FAQ_LIST]
      }

      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.SEARCH_VALUE]) && currentTab){
        appState[conversationId][currentTab][storageConst.SEARCH_VALUE] = storageObject[storageConst.SEARCH_VALUE];
      }

      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.PROACTIVE_MODE])){
        appState[conversationId][storageConst.PROACTIVE_MODE] = storageObject[storageConst.PROACTIVE_MODE];
      }
      
    }
    localStorage.setItem(storageConst.AGENT_ASSIST_STATE, JSON.stringify(appState));
  }

  getLocalStorageState(){
   let appState = localStorage.getItem(storageConst.AGENT_ASSIST_STATE) ? JSON.parse(localStorage.getItem(storageConst.AGENT_ASSIST_STATE)) : {};
   return appState;
  }

  initializeLocalStorageState(){
    let appState = this.getLocalStorageState();
    console.log(appState, "app state inside local storage &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", this.connectionDetails.conversationId);
    
    if(!appState || !appState[this.connectionDetails.conversationId]){
      if(this.connectionDetails && this.connectionDetails.conversationId){
        let appState : any =  this.getLocalStorageState();
        let conversationId = this.connectionDetails.conversationId;
        console.log(conversationId, "conversationid");
        appState[conversationId]= {};
        appState[conversationId][ProjConstants.ASSIST] = {};
        appState[conversationId][ProjConstants.MYBOT] = {};
        appState[conversationId][ProjConstants.LIBRARY] = {};
        appState[conversationId][ProjConstants.TRANSCRIPT] = {};
        appState[conversationId][storageConst.FAQ_LIST] = [];
        // appState[conversationId][ProjConstants.ASSIST][storageConst.AUTOMATION_NOTRAN_ARRAY] = [];
        appState[conversationId][storageConst.IS_WELCOMEMSG_PROCESSED] = false;
        // appState[conversationId][storageConst.AUTOMATION_GOING_ON] = false;
        appState[conversationId][storageConst.INITIALTASK_GOING_ON] = false;
        appState[conversationId][storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH] = false;
        appState[conversationId][storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT] = false;
        // appState[conversationId][storageConst.PROACTIVE_MODE] = true;
        localStorage.setItem(storageConst.AGENT_ASSIST_STATE, JSON.stringify(appState));
        console.log("initialize local storage");
      }
    }
  }

  deleteLocalStorageState(convId){
    let appState = this.getLocalStorageState();
    if(appState && appState[convId]){
      appState[convId] = {};
      localStorage.setItem(storageConst.AGENT_ASSIST_STATE, JSON.stringify(appState));
    }
  }

  checkConversationIdStateInStorage(convId){
    console.log(convId, "conversation id");
    let appState = this.getLocalStorageState();
    if(appState[convId] && this.emptyObjectCheckPipe.transform(appState[convId])){
      return true;
    }
    return false;
  }

  checkStorageItemWithInConvId(convId,key){
    let appState = this.getLocalStorageState();
    if(appState && appState[convId] && this.emptyObjectCheckPipe.transform(appState[convId][key])){
      return true;
    }
    return false;
  }

}
