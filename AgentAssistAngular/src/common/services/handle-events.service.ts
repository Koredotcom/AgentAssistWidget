import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandleEventsService {

  public agent_menu_response_event = new BehaviorSubject<object>({});
  public agent_assist_response_event = new BehaviorSubject<object>({});

  constructor() { }

  setAgentMenuResponse(response){
    this.agent_menu_response_event.next(response);
  }

  setAgentAssistResponse(response){
    this.agent_assist_response_event.next(response);
  }
  
}
