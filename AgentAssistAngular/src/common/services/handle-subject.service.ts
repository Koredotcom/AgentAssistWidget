import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ProjConstants } from '../constants/proj.cnts';

@Injectable({
  providedIn: 'root'
})
export class HandleSubjectService {

  public connectDetailsSubject = new BehaviorSubject<object>(null);
  public activeTabSubject = new BehaviorSubject<string>(null);
  public searchTextSubject = new BehaviorSubject<object>(null);
  public searchTextFromAgentSearch = new BehaviorSubject<object>(null);
  public runButtonClickEventSubject = new BehaviorSubject<object>(null);
  public terminateClickEventSubject = new BehaviorSubject<object>(null);
  public interruptClickEventSubject = new BehaviorSubject<object>(null);
  public restoreClickEventSubject = new BehaviorSubject<object>(null);
  public summarySubmitClickEventSubject= new BehaviorSubject<object>(null);
  public processAgentOrTranscriptResponseSubject = new BehaviorSubject<object>(null);
  public overridebtnClickEventSubject = new BehaviorSubject<object>(null);
  public isLoaderSetSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  setActiveTab(activeTab) {
    this.activeTabSubject.next(activeTab);
  }

  setSearchText(searchObj) {
    this.searchTextSubject.next(searchObj);
  }

  setLibrarySearchTextFromAgentSearch(searchObj) {
    this.searchTextFromAgentSearch.next(searchObj);
  }

  setRunButtonClickEvent(obj) {
    this.runButtonClickEventSubject.next(obj);
  }

  setTerminateClickEvent(obj) {
    this.terminateClickEventSubject.next(obj);
  }

  setInterruptClickEvent(obj) {
    this.interruptClickEventSubject.next(obj);
  }

  setRestoreClickEvent(obj){
    this.restoreClickEventSubject.next(obj);
  }

  setSummarySubmitClickEvent(obj){
    this.summarySubmitClickEventSubject.next(obj);
  }

  setConnectionDetails(obj) {
    let parmasObj : any = Object.assign({}, obj);
    for (let key in parmasObj) {
      if (key === "botid") {
        parmasObj[ProjConstants.BOTID] = parmasObj[key];
        delete parmasObj[key];
      } else if (key == 'conversationid') {
        parmasObj[ProjConstants.CONVESATIONID] = parmasObj[key];
        delete parmasObj[key];
      }
    }
    this.connectDetailsSubject.next(parmasObj);
  }

  setAgentOrTranscriptResponse(data){
    this.processAgentOrTranscriptResponseSubject.next(data);
  }

  setOverridebtnClickEvent(data){
    this.overridebtnClickEventSubject.next(data);
  }
  setLoader(falg) {
   this.isLoaderSetSubject.next(falg)
  }


}
