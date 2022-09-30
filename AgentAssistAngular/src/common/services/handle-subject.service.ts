import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ProjConstants } from '../constants/proj.cnts';

@Injectable({
  providedIn: 'root'
})
export class HandleSubjectService {

  public activeTabSubject = new BehaviorSubject<string>(ProjConstants.ASSIST);
  public searchTextSubject = new BehaviorSubject<object>({});
  public searchTextFromAgentSearch = new BehaviorSubject<object>({});
  public runButtonClickEventSubject = new BehaviorSubject<object>({});

  constructor() { }

  setActiveTab(activeTab){
    this.activeTabSubject.next(activeTab);
  }
  
  setSearchText(searchObj){
    this.searchTextSubject.next(searchObj);
  }

  setLibrarySearchTextFromAgentSearch(searchObj){
    this.searchTextFromAgentSearch.next(searchObj);
  }

  setRunButtonClickEvent(obj){
    this.runButtonClickEventSubject.next(obj);
  }

}
