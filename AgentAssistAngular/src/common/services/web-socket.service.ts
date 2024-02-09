import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ProjConstants, storageConst } from '../constants/proj.cnts';
import { EVENTS } from '../helper/events';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';
import { CommonService } from './common.service';
import { HandleSubjectService } from './handle-subject.service';
import { LocalStorageService } from './local-storage.service';
declare var io: any;
import { KoreGenerateuuidPipe } from '../pipes/kore-generateuuid.pipe';


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
    private koregenerateUUIDPipe : KoreGenerateuuidPipe
  ) {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.handleSubjectService.connectDetailsSubject.subscribe((urlParams : any) =>{
      if(urlParams && urlParams?.token){
        this.connectionDetails = urlParams;
        // this.connectionDetails['channel'] = ((urlParams?.channel && urlParams?.channel.trim() !== "''") ? urlParams?.channel : (urlParams.isCall === 'true' ? 'voice' : 'chat')) || 'chat';
        // this.socketConnection();
      }
    })
  }

  socketConnection() {
    let webSocketConnection = {
      "path": "/agentassist/api/v1/chat/", transports: ['websocket', 'polling', 'flashsocket'], query: { 'jToken': this.connectionDetails.token }
    };
    this._agentAsisstSocket = io(`${this.connectionDetails.agentassisturl}/koreagentassist`, webSocketConnection);
    this.listenEvents();
    this._agentAsisstSocket.on("connect", () => {
      this.commonEmitEvents(true);
      if(!window._agentAssistSocketEventListener){
        this.socketConnectFlag$.next(true);
        window._agentAssistSocketEventListener = true;
      }
    });
  }

  emitEvents(eventName,requestParams) {
    let uuids = this.koregenerateUUIDPipe.transform();
    if(requestParams){
      requestParams.isExtAD = this.connectionDetails.fromSAT ? false : true;
      requestParams.source = this.connectionDetails.source;
      requestParams.experience = this.connectionDetails.channel;
      requestParams.traceId = uuids;
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
      experience : this.connectionDetails.channel
    }
    if(this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      menu_request_params['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      menu_request_params['autoBotId'] = '';
    }
    // const channel = new BroadcastChannel('app-data');
    // channel.addEventListener('message', (event) => {
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
      if(!this.isWelcomeResonse){
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

  commonEmitEvents(shouldProcessResponse){
    let customData = (this.connectionDetails?.customdata) || (this.connectionDetails?.customData);
    
      if(customData && this.connectionDetails?.source !== ProjConstants.SMARTASSIST_SOURCE) {
        try {
          customData = JSON.parse(customData);
        } catch (e) {
          customData = {};
           throw e;
        }
    }
    
    let parsedCustomData: any = {};
    let agent_user_details = {...this.localStorageService.agentDetails, ...this.localStorageService.userDetails};
    let welcomeMessageParams: any = {
      'waitTime': 2000,
      'id': this.connectionDetails.conversationId,
      "isSendWelcomeMessage": shouldProcessResponse,
      'agentassistInfo' : agent_user_details,
      'botId': this.connectionDetails.botId,
      'sendMenuRequest': true,
      'uId': this.handleSubjectService.userBotConversationDetails?.userId || '',
      'sId': this.handleSubjectService.userBotConversationDetails?.sessionId || '',
      'experience' : this.connectionDetails.channel,
      'jToken': this.connectionDetails.token
    }
    if(customData && Object.keys(customData).length > 0 && this.connectionDetails?.source !== ProjConstants.SMARTASSIST_SOURCE) {
      welcomeMessageParams['customData'] = customData
    }
    if (this.connectionDetails.fromSAT) {
      welcomeMessageParams['userName'] = this.connectionDetails?.endUserName !== 'Anonymous' ? this.connectionDetails?.endUserName : 'user';
    } else {
      welcomeMessageParams['userName'] = parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'user'
    }
    if(this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      welcomeMessageParams['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      welcomeMessageParams['autoBotId'] = '';
    }
    if (this.connectionDetails?.interactiveLanguage !== null && typeof this.connectionDetails?.interactiveLanguage !== 'undefined' && this.connectionDetails?.interactiveLanguage !== "''") {
      welcomeMessageParams['language'] = this.connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    this.emitEvents(EVENTS.welcome_message_request, welcomeMessageParams);
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
