import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ProjConstants } from '../constants/proj.cnts';

@Injectable({
  providedIn: 'root'
})
export class HandleSubjectService {

  public connectDetailsSubject = new BehaviorSubject<object>({});
  public activeTabSubject = new BehaviorSubject<string>(ProjConstants.ASSIST);
  public searchTextSubject = new BehaviorSubject<object>({});
  public searchTextFromAgentSearch = new BehaviorSubject<object>({});
  public runButtonClickEventSubject = new BehaviorSubject<object>({});
  public terminateClickEventSubject = new BehaviorSubject<object>({});
  public interruptClickEventSubject = new BehaviorSubject<object>({});

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

  setConnectionDetails(obj) {
    console.log(obj, "obj");
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
    console.log(parmasObj, "after obj");
    

    this.connectDetailsSubject.next(parmasObj);
  }
}
