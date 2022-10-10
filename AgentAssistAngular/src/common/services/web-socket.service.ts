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
  endOfTaskResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  userMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistUserMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentFeedbackResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);

  
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
      this.agentAssistResponse$.next(data);

    });

    this._agentAsisstSocket.on(EVENTS.agent_menu_response, (data) => {
      console.log("inside menu response", data);
      this.agentMenuResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_agent_response, (data)=>{
      this.agentAssistAgentResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_endoftask, (data) =>{
      this.endOfTaskResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_endoftask, (data) =>{
      this.endOfTaskResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.user_message, (data) =>{
      this.userMessageResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_message, (data)=>{
      this.agentMessageResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_user_message, (data) => {
      this.agentAssistUserMessageResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_feedback_response, (data) =>{
      this.agentFeedbackResponse$.next(data);
    });



  }
}