import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjConstants } from '../constants/proj.cnts';

@Injectable({
  providedIn: 'root'
})
export class HandleSubjectService {

  public activeTabSubject = new BehaviorSubject<string>(ProjConstants.ASSIST);

  constructor() { }

  setActiveTab(activeTab){
    this.activeTabSubject.next(activeTab);
  }

}
