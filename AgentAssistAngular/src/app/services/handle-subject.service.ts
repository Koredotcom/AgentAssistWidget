import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProjConstants } from '../proj.const';

@Injectable({
  providedIn: 'root'
})
export class HandleSubjectService {

  suggestionResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  faqsearchResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  public runButtonClickEventSubject = new BehaviorSubject<object>(null);
  public proactiveModeSubject = new Subject<boolean>();
  public callConversationSuggestions$ = new Subject<object>();
  public processAgentOrTranscriptResponseSubject = new BehaviorSubject<object>(null);
  public summaryPopupSubject = new Subject<object>();
  public isLoaderSetSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  setFaqSearchResponse(data){
    this.faqsearchResponse$.next(data);
  }

  setSuggestionResponse(data){
    this.suggestionResponse$.next(data);
  }

  setProactiveModeStatus(flag){
    this.proactiveModeSubject.next(flag);
  }

  setCallConversationSuggestions(obj){
    this.callConversationSuggestions$.next(obj);
  }

  setRunButtonClickEvent(obj) {
    this.runButtonClickEventSubject.next(obj);
  }

  setAgentOrTranscriptResponse(data){
    this.processAgentOrTranscriptResponseSubject.next(data);
  }

  setSummaryPopup(data){
    this.summaryPopupSubject.next(data);
  }

  setLoader(falg) {
    this.isLoaderSetSubject.next(falg)
   }

}
