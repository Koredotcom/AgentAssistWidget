import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { EVENTS } from '../helper/events';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';
import { CommonService } from './common.service';
import { HandleSubjectService } from './handle-subject.service';
declare var io: any;


@Injectable()
export class WebSocketService {
  _agentAsisstSocket: any;
  socketEventsSub: any;
  connectionDetails : any;
  agentMenuResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistResponse$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistAgentResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  endOfTaskResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  userMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistUserMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentFeedbackResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);

  
  constructor(private handleSubjectService : HandleSubjectService,
    private sanitizeHTMLPipe : SanitizeHtmlPipe) {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.handleSubjectService.connectDetailsSubject.subscribe((urlParams : any) =>{
      if(urlParams && urlParams?.token){
        this.connectionDetails = urlParams;
        console.log(this.connectionDetails, "connection details");
        this.socketConnection();
      }
    })
  }

  socketConnection() {
    console.log("socket connection");
    
    let webSocketConnection = {
      "path": "/agentassist/api/v1/chat/", transports: ['websocket', 'polling', 'flashsocket'], query: { 'jToken': this.connectionDetails.token }
    };
    this._agentAsisstSocket = io(`${this.connectionDetails.agentassisturl}/koreagentassist`, webSocketConnection);
    this._agentAsisstSocket.on("connect", () => {
      console.log("connection done");
      this.listenEvents();
    });
  }

  emitEvents(eventName,requestParams) {
    this._agentAsisstSocket.emit(eventName, requestParams);
  }

  listenEvents() {

    // const channel = new BroadcastChannel('app-data');
    // channel.addEventListener('message', (event) => {
    //     console.log("event recived", event.data);
    //     let agent_assist_request = {
    //         'conversationId': this.connectionDetails.conversationId,
    //         'query': this.sanitizeHTMLPipe.transform(event.data.value),
    //         'botId': this.connectionDetails.botId,
    //         'experience': this.commonService.isCallConversation === true ? 'voice':'chat'
    //     }
    //     this.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
    // });

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
      console.log("user message inside assist angular",data);
      
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