import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ProjConstants, storageConst } from '../constants/proj.cnts';
import { EVENTS } from '../helper/events';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';
import { CommonService } from './common.service';
import { HandleSubjectService } from './handle-subject.service';
import { LocalStorageService } from './local-storage.service';
declare var io: any;


@Injectable()
export class WebSocketService {
  _agentAsisstSocket: any;
  socketEventsSub: any;
  connectionDetails : any;
  socketConnectFlag$ : BehaviorSubject<boolean> = new BehaviorSubject(null);
  agentMenuResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistResponse$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistAgentResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  endOfTaskResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  userMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentAssistUserMessageResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  agentFeedbackResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);
  responseResolutionCommentsResponse$ : BehaviorSubject<any[]> = new BehaviorSubject(null);

  
  constructor(private handleSubjectService : HandleSubjectService,
    private sanitizeHTMLPipe : SanitizeHtmlPipe, private localStorageService : LocalStorageService,
  ) {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.handleSubjectService.connectDetailsSubject.subscribe((urlParams : any) =>{
      if(urlParams && urlParams?.token){
        this.connectionDetails = urlParams;
        // this.socketConnection();
      }
    })
  }

  socketConnection() {    
    let webSocketConnection = {
      "path": "/agentassist/api/v1/chat/", transports: ['websocket', 'polling', 'flashsocket'], query: { 'jToken': this.connectionDetails.token }
    };
    this._agentAsisstSocket = io(`${this.connectionDetails.agentassisturl}/koreagentassist`, webSocketConnection);
    this._agentAsisstSocket.on("connect", () => {
      if(!window._agentAssistSocketEventListener){
        this.commonEmitEvents();
        this.listenEvents();
        this.socketConnectFlag$.next(true);
        window._agentAssistSocketEventListener = true;
      }
    });
  }

  commonEmitEvents(){
    let menu_request_params : any = {
      botId : this.connectionDetails.botId,
      conversationId : this.connectionDetails.conversationId,
      experience : this.connectionDetails.isCall == "false" ? ProjConstants.CHAT : ProjConstants.VOICE
    }
   

    let appState = this.localStorageService.getLocalStorageState();
    let shouldProcessResponse = true;    
    // if(appState[this.connectionDetails.conversationId] && appState[this.connectionDetails.conversationId][storageConst.IS_WELCOMEMSG_PROCESSED]){
    //   shouldProcessResponse = false;
    // }
    let parsedCustomData: any = {};
    let agent_user_details = {...this.localStorageService.agentDetails, ...this.localStorageService.userDetails};
    let welcomeMessageParams: any = {
      'waitTime': 2000,
      'userName': parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'user',
      'id': this.connectionDetails.conversationId,
      "isSendWelcomeMessage": shouldProcessResponse,
      'agentassistInfo' : agent_user_details,
      'botId' : this.connectionDetails.botId,
    }
    console.log("-------------connectionDetails---------------", this.connectionDetails)
    if(this.connectionDetails?.autoBotId) {
      welcomeMessageParams['autoBotId'] = this.connectionDetails.autoBotId;
      menu_request_params['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      welcomeMessageParams['autoBotId'] = '';
      menu_request_params['autoBotId'] = '';
    }
    this.emitEvents(EVENTS.welcome_message_request, welcomeMessageParams);
    this.emitEvents(EVENTS.agent_menu_request, menu_request_params);
    // this.agentAssistResponse$.next([
    //   "agent_assist_response",
    //   {
    //   "type": "button",
    //   "value": "Customer has waited for an agent for a few seconds. Here are some appropriate opening lines.",
    //   "buttons": [
    //   {
    //   "type": "text",
    //   "value": "Hello. How can I help you today?"
    //   },
    //   {
    //   "type": "text",
    //   "value": "Hello. Sorry for the long wait. How can I help you today?"
    //   },
    //   {
    //   "type": "text",
    //   "value": "Hi there. I apologize for your wait. How can I help you today?"
    //   }
    //   ],
    //   "botId": "st-d0fcba36-68fd-5363-806b-1c622c53ab10",
    //   "conversationId": "ch0987676",
    //   "autoBotId": "st-fb33bc49-11ce-5ab0-82b3-1c61ef0f546e",
    //   "event": "agent_assist_response"
    //   }
    //   ]);
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

    this._agentAsisstSocket.on(EVENTS.response_resolution_comments, (data) =>{
      this.responseResolutionCommentsResponse$.next(data);
    })
  }
}
