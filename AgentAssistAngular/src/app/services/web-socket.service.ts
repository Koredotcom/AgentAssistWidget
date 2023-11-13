import { Injectable } from '@angular/core';
import { ProjConstants } from '../proj.const';
import { io } from 'socket.io-client';
import { EVENTS } from '../helpers/events';
import { BehaviorSubject, Subject } from 'rxjs';
import { RootService } from './root.service';
import { LocalStorageService } from './local-storage.service';
import { HandleSubjectService } from './handle-subject.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  _agentAsisstSocket : any;

  agentMenuResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  agentAssistResponse$: BehaviorSubject<any> = new BehaviorSubject([]);
  agentAssistAgentResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  endOfTaskResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  userMessageResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  agentMessageResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  agentAssistUserMessageResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  agentFeedbackResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  responseResolutionCommentsResponse$ : BehaviorSubject<any> = new BehaviorSubject(null);
  agentCoachingResponse$ = new Subject<any>();
  checkListStepResponse$ = new Subject<any>();
  checkListResponse$ = new Subject<any>();
  realtimeSentimeResponse$ = new Subject<any>();
  sendCheckListOpened$ = new Subject<any>();
  isWelcomeResonse = false;

  constructor(private rootService : RootService, private localStorageService : LocalStorageService) {
  }

  socketConnection(){    
    let finalUrl = this.rootService.getConnectionDetails().agentassisturl + '/koreagentassist';
    const config = {
      url: finalUrl, options: {
        path: '/agentassist/api/v1/chat',
        autoConnect: false,
        transports: ['websocket', 'polling', 'flashsocket'],
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 13,
        query: {'jToken': this.rootService.getConnectionDetails().token }
      }
    };
    
    this._agentAsisstSocket =  io(config.url, config.options);
    this._agentAsisstSocket.connect();
    this._agentAsisstSocket.on("connect", () => {
      // if(!window._agentAssistSocketEventListener){
        this.listenEvents();
        this.commonEmitEvents(true);
      //   window._agentAssistSocketEventListener = true;
      // }
    });
  }

  commonEmitEvents(shouldProcessResponse){
    const {botId, conversationId, isCall, autoBotId, interactiveLanguage} = this.rootService.getConnectionDetails()
    let parsedCustomData: any = {};
    let agent_user_details = {...this.localStorageService.agentDetails, ...this.localStorageService.userDetails};
    let welcomeMessageParams: any = {
      'waitTime': 2000,
      'userName': parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'user',
      'id': conversationId,
      "isSendWelcomeMessage": shouldProcessResponse,
      'agentassistInfo' : agent_user_details,
      'botId': botId,
      'sendMenuRequest': true,
      'uId': this.rootService.userBotConversationDetails?.userId || '',
      'sId': this.rootService.userBotConversationDetails?.sessionId || '',
      'experience' : (isCall && isCall === "true") ?  ProjConstants.VOICE : ProjConstants.CHAT,
    }
    if(autoBotId && autoBotId !== 'undefined') {
      welcomeMessageParams['autoBotId'] = autoBotId;
    } else {
      welcomeMessageParams['autoBotId'] = '';
    }
    if (interactiveLanguage !== null && typeof interactiveLanguage !== 'undefined' && interactiveLanguage !== "''") {
      welcomeMessageParams['language'] = interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    this.emitEvents(EVENTS.welcome_message_request, welcomeMessageParams);
  }

  emitEvents(eventName : string,requestParams : any) {
    const {fromSAT, source, isCall, autoBotId} = this.rootService.getConnectionDetails()
    if(requestParams){
      requestParams.isExtAD = fromSAT ? false : true;
      requestParams.source = source;
      requestParams.experience = (isCall && isCall == "true") ?  ProjConstants.VOICE : ProjConstants.CHAT
    }

    // if(this.loaderEvents[eventName]) {
    //   this.loaderOnTimer()
    // }

    this._agentAsisstSocket.emit(eventName, requestParams);
  }

  listenEvents() {
    const {botId, conversationId, isCall, autoBotId} = this.rootService.getConnectionDetails()
    let menu_request_params : any = {
      botId,
      conversationId,
      experience : isCall && isCall === "true" ?  ProjConstants.VOICE : ProjConstants.CHAT
    }
    if(autoBotId && autoBotId !== 'undefined') {
      menu_request_params['autoBotId'] = autoBotId;
    } else {
      menu_request_params['autoBotId'] = '';
    }

    this._agentAsisstSocket.on(EVENTS.agent_assist_response, (data : any) => {
      this.rootService.assistTabSessionId = '';
      if(data.sessionId) {
        this.rootService.assistTabSessionId = data?.sessionId;
      }
      if (this.rootService.getConnectionDetails()?.interactiveLanguage && typeof this.rootService.getConnectionDetails()?.interactiveLanguage == 'string' && this.rootService.getConnectionDetails()?.interactiveLanguage != "''") {
        menu_request_params['language'] = this.rootService.getConnectionDetails()?.interactiveLanguage; // Return the default value for null, undefined, or "''"
      }
      if(data.sendMenuRequest && !this.isWelcomeResonse){
        this.isWelcomeResonse = true;
        this.emitEvents(EVENTS.agent_menu_request, menu_request_params);
        this.sendCheckListOpened$.next(true);
      }
      this.agentAssistResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_menu_response, (data : any) => {
      this.agentMenuResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_coaching_response, (data : any)=>{
      this.agentCoachingResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.checklist_step_response, (data : any)=>{
      this.checkListStepResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.checklist_response, (data : any)=>{
      this.checkListResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.realtime_sentiment_response, (data : any) => {
      this.realtimeSentimeResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_agent_response, (data : any)=>{
      this.rootService.myBotTabSessionId = '';
      if(data.sessionId) {
        this.rootService.myBotTabSessionId = data?.sessionId;
      }
      this.agentAssistAgentResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_endoftask, (data : any) =>{
      this.endOfTaskResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.user_message, (data : any) =>{
      this.userMessageResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_message, (data : any)=>{
      this.agentMessageResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_user_message, (data : any) => {
      this.agentAssistUserMessageResponse$.next(data);

    });

    this._agentAsisstSocket.on(EVENTS.agent_feedback_response, (data : any) =>{
      this.agentFeedbackResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.response_resolution_comments, (data : any) =>{
      this.responseResolutionCommentsResponse$.next(data);
    })
  }

  handleOverrideMode(toggleOverride, dialogId){
    let connectionDetails = this.rootService.connectionDetails;
    let overRideObj: any = {
      "agentId": "",
      "botId": connectionDetails.botId,
      "conversationId": connectionDetails.conversationId,
      "query": "",
      "enable_override_userinput": toggleOverride,
      'experience': connectionDetails.isCallConversation === true ? 'voice' : 'chat',
      "positionId": dialogId
    }
    this.emitEvents(EVENTS.enable_override_userinput, overRideObj);
    this.rootService.OverRideMode = toggleOverride;
  }

}
