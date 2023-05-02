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
  isWelcomeResonse = false;
  LoaderTimeout: number = 10000;


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
      'botId': this.connectionDetails.botId,
      'sendMenuRequest': true,
    }
    if(this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      welcomeMessageParams['autoBotId'] = this.connectionDetails.autoBotId;
      // menu_request_params['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      welcomeMessageParams['autoBotId'] = '';
      // menu_request_params['autoBotId'] = '';
    }
    this.emitEvents(EVENTS.welcome_message_request, welcomeMessageParams);
  }

  emitEvents(eventName,requestParams) {
    this.loaderOnTimer()
    this._agentAsisstSocket.emit(eventName, requestParams);
  }

  listenEvents() {
    let menu_request_params : any = {
      botId : this.connectionDetails.botId,
      conversationId : this.connectionDetails.conversationId,
      experience : (this.connectionDetails.isCall && this.connectionDetails.isCall == "true") ?  ProjConstants.VOICE : ProjConstants.CHAT
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
      if(data.sendMenuRequest && !this.isWelcomeResonse){
        this.isWelcomeResonse = true;
        this.emitEvents(EVENTS.agent_menu_request, menu_request_params);
      }
      this.agentAssistResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.agent_menu_response, (data) => {
      this.agentMenuResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_agent_response, (data)=>{
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
