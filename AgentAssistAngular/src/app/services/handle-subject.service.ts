import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProjConstants } from '../proj.const';

@Injectable({
  providedIn: 'root'
})
export class HandleSubjectService {

  searchResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  public proactiveModeSubject = new Subject<boolean>();
  public callConversationSuggestions$ = new Subject<object>();

  constructor() { }

  setSearchResponse(data){
    this.searchResponse$.next(data);
  }

  setProactiveModeStatus(flag){
    this.proactiveModeSubject.next(flag);
  }

  setCallConversationSuggestions(obj){
    this.callConversationSuggestions$.next(obj);
  }

}
