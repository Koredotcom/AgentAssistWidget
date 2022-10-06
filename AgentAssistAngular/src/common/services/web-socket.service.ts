import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ConnectionDetails, ProjConstants } from '../constants/proj.cnts';
import { EVENTS } from '../helper/events';
declare var io: any;


@Injectable()
export class WebSocketService {
  _agentAsisstSocket: any;
  socketEventsSub: any;
  agentMenuResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistResponse$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistAgentResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  
  constructor() {
    this.socketConnection();
    console.log('inside WebSocketService constructor');
  }

  socketConnection() {
    let webSocketConnection = {
      "path": "/agentassist/api/v1/chat/", transports: ['websocket', 'polling', 'flashsocket'], query: { 'jToken': ProjConstants.jToken }
    };
    this._agentAsisstSocket = io("https://uat-smartassist.kore.ai/koreagentassist", webSocketConnection);
    this._agentAsisstSocket.on("connect", () => {
      console.log("connection done");
      this.listenEvents();
    });
  }

  emitEvents(eventName,requestParams) {
    this._agentAsisstSocket.emit(eventName, requestParams);
  }

  listenEvents() {
    this._agentAsisstSocket.on(EVENTS.agent_assist_response, (data) => {
      console.log("inside agenta ssist");

    });

    this._agentAsisstSocket.on(EVENTS.agent_menu_response, (data) => {
      console.log("inside menu response", data);
      this.agentMenuResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_agent_response, (data)=>{
      this.agentAssistAgentResponse$.next(data);
    })
  }
}
