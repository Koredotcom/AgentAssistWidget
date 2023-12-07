import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from "rxjs";
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
  agentCoachingResponse$ = new Subject<any>();
  checkListStepResponse$ = new Subject<any>();
  checkListResponse$ = new Subject<any>();
  realtimeSentimeResponse$ = new Subject<any>();
  sendCheckListOpened$ = new Subject<any>();
  isWelcomeResonse = false;
  LoaderTimeout: number = 10000;

  loaderEvents = {
    'welcome_message_request' : true,
    'agent_assist_request' : true,
    'agent_menu_request': true,
    'agent_feedback_request' : true,
    'agent_assist_agent_request' : true,
    'request_resolution_comments' : true,
  }


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
        // this.commonEmitEvents();
        this.listenEvents();
        this.socketConnectFlag$.next(true);
        window._agentAssistSocketEventListener = true;
      }
    });
  }

  emitEvents(eventName,requestParams) {
    if(requestParams){
      requestParams.isExtAD = this.connectionDetails.fromSAT ? false : true;
      requestParams.source = this.connectionDetails.source;
      requestParams.experience = (this.connectionDetails.isCall && this.connectionDetails.isCall == "true") ?  ProjConstants.VOICE : ProjConstants.CHAT
    }
    if(this.loaderEvents[eventName]) {
      this.loaderOnTimer()
    }

    this._agentAsisstSocket.emit(eventName, requestParams);
  }

  listenEvents() {
    let menu_request_params : any = {
      botId : this.connectionDetails.botId,
      conversationId : this.connectionDetails.conversationId,
      experience : (this.connectionDetails.isCall && this.connectionDetails.isCall === "true") ?  ProjConstants.VOICE : ProjConstants.CHAT
    }
    if(this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      menu_request_params['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      menu_request_params['autoBotId'] = '';
    }
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
      this.handleSubjectService.assistTabSessionId = '';
      if(data.sessionId) {
        this.handleSubjectService.assistTabSessionId = data?.sessionId;
      }
      if (this.connectionDetails?.interactiveLanguage && typeof this.connectionDetails?.interactiveLanguage == 'string' && this.connectionDetails?.interactiveLanguage != "''") {
        menu_request_params['language'] = this.connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
      }
      try{
        if(data.buttons?.length === 1 && data.buttons[0]?.value){
          let val = data.buttons[0]?.value
          val = val.replace(/&quot;/g, '"');
          let obj = JSON.parse(val);
          if(obj?.isResend){
            this.emitEvents('agent_assist_request', {query: obj.text, ...data});
          }
        }
      }
      catch(e){

      }
    
      if(data.sendMenuRequest && !this.isWelcomeResonse){
        this.isWelcomeResonse = true;
        this.emitEvents(EVENTS.agent_menu_request, menu_request_params);
        this.sendCheckListOpened$.next(true);
      }
      this.agentAssistResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.agent_menu_response, (data) => {
      this.agentMenuResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.agent_coaching_response, (data)=>{
      this.agentCoachingResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.checklist_step_response, (data)=>{
      this.checkListStepResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.checklist_response, (data)=>{
      this.checkListResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.realtime_sentiment_response, (data) => {
      this.realtimeSentimeResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_agent_response, (data)=>{
      this.handleSubjectService.myBotTabSessionId = '';
      if(data.sessionId) {
        this.handleSubjectService.myBotTabSessionId = data?.sessionId;
      }
      this.agentAssistAgentResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_endoftask, (data) =>{
      this.endOfTaskResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    // this._agentAsisstSocket.on(EVENTS.agent_assist_endoftask, (data) =>{
    //   this.endOfTaskResponse$.next(data);
    // });

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
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.response_resolution_comments, (data) =>{
      this.responseResolutionCommentsResponse$.next(data);
      this.addOrRemoveLoader(false);
    })
  }

  loaderOnTimer() {
    this.addOrRemoveLoader(true)
    setTimeout(() => {
      this.addOrRemoveLoader(false)
    }, this.LoaderTimeout);
  }

  addOrRemoveLoader(falg: boolean) {
    this.handleSubjectService.setLoader(falg)
  }
}
