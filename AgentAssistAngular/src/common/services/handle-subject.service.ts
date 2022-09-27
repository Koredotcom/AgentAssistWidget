import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ProjConstants } from '../constants/proj.cnts';

@Injectable({
  providedIn: 'root'
})
export class HandleSubjectService {

  public activeTabSubject = new BehaviorSubject<string>(ProjConstants.ASSIST);
  public searchTextSubject = new BehaviorSubject<object>({});

  constructor() { }

  setActiveTab(activeTab){
    this.activeTabSubject.next(activeTab);
  }
  
  setSearchText(searchObj){
    this.searchTextSubject.next(searchObj);
  }

}
