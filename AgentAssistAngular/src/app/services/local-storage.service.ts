import { Injectable } from '@angular/core';
import { EmptyObjectCheckPipe } from '../pipes/empty-object-check.pipe';
import { SubSink } from "subsink";
import { ProjConstants, storageConst } from '../proj.const';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  subs = new SubSink();
  userDetails : any = {};
  agentDetails : any = {};

  constructor(private rootService : RootService, private emptyObjectCheckPipe : EmptyObjectCheckPipe) {
  }


  setLocalStorageItem(storageObject : any, currentTab?){
    
    let appState = this.getLocalStorageState();
    let conversationId = this.rootService.getConnectionDetails().conversationId;
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

      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.THEME])){
        appState[conversationId][storageConst.THEME] = storageObject[storageConst.THEME];
      }

      if(this.emptyObjectCheckPipe.transform(storageObject[storageConst.LANGUAGE])){
        appState[conversationId][storageConst.LANGUAGE] = storageObject[storageConst.LANGUAGE];
      }
      
    }
    localStorage.setItem(storageConst.AGENT_ASSIST_STATE, JSON.stringify(appState));
  }

  getLocalStorageState(){
   let appState = localStorage.getItem(storageConst.AGENT_ASSIST_STATE) ? JSON.parse(localStorage.getItem(storageConst.AGENT_ASSIST_STATE) || '') : {};
   return appState;
  }

  initializeLocalStorageState(){
    let appState = this.getLocalStorageState();
    console.log(appState, "app state inside local storage &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", this.rootService.getConnectionDetails().conversationId);
    
    if(!appState || !appState[this.rootService.getConnectionDetails().conversationId]){
      if(this.rootService.getConnectionDetails() && this.rootService.getConnectionDetails().conversationId){
        let appState : any =  this.getLocalStorageState();
        let conversationId = this.rootService.getConnectionDetails().conversationId;
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
        appState[conversationId][storageConst.LANGUAGE] = storageConst.ENGLISH;
        appState[conversationId][storageConst.THEME] = storageConst.AUTO;
        localStorage.setItem(storageConst.AGENT_ASSIST_STATE, JSON.stringify(appState));
        console.log("initialize local storage");
      }
    }
  }

  deleteLocalStorageState(convId : any){
    let appState = this.getLocalStorageState();
    if(appState && appState[convId]){
      appState[convId] = {};
      localStorage.setItem(storageConst.AGENT_ASSIST_STATE, JSON.stringify(appState));
    }
  }

  checkConversationIdStateInStorage(convId : any){
    console.log(convId, "conversation id");
    let appState = this.getLocalStorageState();
    if(appState[convId] && this.emptyObjectCheckPipe.transform(appState[convId])){
      return true;
    }
    return false;
  }

  checkStorageItemWithInConvId(convId : any,key : string){
    let appState = this.getLocalStorageState();
    if(appState && appState[convId] && this.emptyObjectCheckPipe.transform(appState[convId][key])){
      return true;
    }
    return false;
  }

  setLanguageInfo(lang: string) {
    window.localStorage.setItem('lang', lang);
  }

  getLanguage(): string {
    return window.localStorage.getItem('lang') as string;
  }

  setTheme(theme: string) {
    window.localStorage.setItem('theme', theme);
  }

  getTheme(): string {
    return window.localStorage.getItem('theme') as string;
  }
}
