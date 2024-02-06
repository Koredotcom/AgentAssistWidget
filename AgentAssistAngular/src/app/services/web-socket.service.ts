import { Injectable } from '@angular/core';
import { ProjConstants, storageConst } from '../proj.const';
import { io } from 'socket.io-client';
import { EVENTS } from '../helpers/events';
import { BehaviorSubject, Subject } from 'rxjs';
import { RootService } from './root.service';
import { LocalStorageService } from './local-storage.service';
import { HandleSubjectService } from './handle-subject.service';
import * as $ from 'jquery';
import { TemplateRenderClassService } from './template-render-class.service';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  _agentAsisstSocket : any;
  socketErrorCount = 0;
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
  LoaderTimeout: number = 10000;
  loaderEvents = {
    'welcome_message_request' : true,
    'agent_assist_request' : true,
    'agent_menu_request': true,
    'agent_feedback_request' : true,
    'agent_assist_agent_request' : true,
    'request_resolution_comments' : true,
  }

  prevTimeStamp : number = 0;
  intervalTime : number = 510;
  count = 1;

  constructor(private rootService : RootService, private localStorageService : LocalStorageService,
    private handleSubjectService : HandleSubjectService, private templateRenderClassService : TemplateRenderClassService) {
  }

  socketConnection(isR=false){    
    let finalUrl = this.rootService.getConnectionDetails().agentassisturl + '/koreagentassist';
    const config = {
      url: finalUrl,
      forceNew: true, 
      options: {
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

    if(!isR){
      this.socketConnectionEst();
    }
  }

  socketConnectionEst(){
    this._agentAsisstSocket.on("connect", () => {
      // if(!window._agentAssistSocketEventListener){
        this.listenEvents();
        this.commonEmitEvents(true);
      //   window._agentAssistSocketEventListener = true;
      // }
    });
  }

  commonEmitEvents(shouldProcessResponse){
    let customData = (this.rootService.connectionDetails?.customdata) || (this.rootService.connectionDetails?.customData);  
    // if(customData && this.rootService.connectionDetails?.source !== ProjConstants.SMARTASSIST_SOURCE) {
    //   try {
    //     customData = JSON.parse(customData);
    //   } catch (e) {
    //     customData = {};
    //       throw e;
    //   }
    // }
    const {botId, conversationId, isCall, autoBotId, interactiveLanguage, userName} = this.rootService.getConnectionDetails()
    let agent_user_details = {...this.localStorageService.agentDetails, ...this.localStorageService.userDetails};
    let appState = this.localStorageService.getLocalStorageState();
    shouldProcessResponse = appState[this.rootService.connectionDetails.conversationId] ? appState[this.rootService.connectionDetails.conversationId][storageConst.ISSEND_WELCOME_MSG] : true
    let welcomeMessageParams: any = {
      'waitTime': 2000,
      'userName': userName,
      'id': conversationId,
      "isSendWelcomeMessage": shouldProcessResponse,
      'agentassistInfo' : agent_user_details,
      'botId': botId,
      'sendMenuRequest': true,
      'uId': this.rootService.userBotConversationDetails?.userId || '',
      'sId': this.rootService.userBotConversationDetails?.sessionId || '',
      'experience' : this.rootService.connectionDetails?.channel,
    }
    if(customData && Object.keys(customData)?.length > 0 && this.rootService.connectionDetails?.source !== ProjConstants.SMARTASSIST_SOURCE) {
      welcomeMessageParams['customData'] = customData
    }
    // Check with Sarada regarding how to get the connectionDetails
    
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
      requestParams.experience = this.rootService.connectionDetails?.channel
    }

    if(this.loaderEvents[eventName]) {
      this.loaderOnTimer()
    }

    this._agentAsisstSocket.emit(eventName, requestParams);
  }

  getTimeout(){
    let timestamp1 = Date.now();
    let settimeoutTime = this.intervalTime;
    if ((timestamp1 - this.prevTimeStamp) < this.intervalTime) {
      settimeoutTime = (settimeoutTime * this.count) + (this.intervalTime - (timestamp1 - this.prevTimeStamp));
      this.count += 1;
    }else{
      this.count = 1;
    }
    this.prevTimeStamp = timestamp1;
    return settimeoutTime;
  }

  handleIsSendWelcomeRequest(data){
    let appState = this.localStorageService.getLocalStorageState();
    if (appState[this.rootService.connectionDetails.conversationId]) {
      if(!data.sendMenuRequest){
        let storageObject: any = {};
        storageObject = {
          [storageConst.ISSEND_WELCOME_MSG]: false
        }
        this.localStorageService.setLocalStorageItem(storageObject);
      }
    }
  }

  listenEvents() {
    const {botId, conversationId, isCall, autoBotId} = this.rootService.getConnectionDetails()
    let menu_request_params : any = {
      botId,
      conversationId,
      experience : this.rootService.connectionDetails?.channel
    }
    if(autoBotId && autoBotId !== 'undefined') {
      menu_request_params['autoBotId'] = autoBotId;
    } else {
      menu_request_params['autoBotId'] = '';
    }

    this._agentAsisstSocket.on(EVENTS.agent_assist_response, (data : any) => {
      console.log("🚀 ~ WebSocketService ~ this._agentAsisstSocket.on ~ agent_assist_response:", data)
      this.rootService.assistTabSessionId = '';
      if (data.sessionId) {
        this.rootService.assistTabSessionId = data?.sessionId;
      }
      if (this.rootService.getConnectionDetails()?.interactiveLanguage && typeof this.rootService.getConnectionDetails()?.interactiveLanguage == 'string' && this.rootService.getConnectionDetails()?.interactiveLanguage != "''") {
        menu_request_params['language'] = this.rootService.getConnectionDetails()?.interactiveLanguage; // Return the default value for null, undefined, or "''"
      }
      if (!this.isWelcomeResonse) {
        this.isWelcomeResonse = true;
        this.emitEvents(EVENTS.agent_menu_request, menu_request_params);
        this.sendCheckListOpened$.next(true);
      }
      this.handleIsSendWelcomeRequest(data);
      let settimeoutTime = this.getTimeout();
      setTimeout(() => {
        this.agentAssistResponse$.next(data);
        this.addOrRemoveLoader(false);
      }, settimeoutTime);
    });

    this._agentAsisstSocket.on(EVENTS.agent_menu_response, (data : any) => {
      this.agentMenuResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.agent_coaching_response, (data : any)=>{
      this.agentCoachingResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.checklist_step_response, (data : any)=>{
      this.checkListStepResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.checklist_response, (data : any)=>{
      this.checkListResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.realtime_sentiment_response, (data : any) => {
      this.realtimeSentimeResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_agent_response, (data : any)=>{
      let settimeoutTime = this.getTimeout();
      setTimeout(() => {
        this.rootService.myBotTabSessionId = '';
        if(data.sessionId) {
          this.rootService.myBotTabSessionId = data?.sessionId;
        }
        this.agentAssistAgentResponse$.next(data);
        this.addOrRemoveLoader(false);
      },settimeoutTime);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_endoftask, (data : any) =>{
      let settimeoutTime = this.getTimeout();
      setTimeout(() => {
        this.endOfTaskResponse$.next(data);
      },settimeoutTime);
    });

    this._agentAsisstSocket.on(EVENTS.user_message, (data : any) =>{
      this.userMessageResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_message, (data : any)=>{
      this.agentMessageResponse$.next(data);
    });

    this._agentAsisstSocket.on(EVENTS.agent_assist_user_message, (data : any) => {
      let settimeoutTime = this.getTimeout();
      setTimeout(() => {
        this.agentAssistUserMessageResponse$.next(data);
      },settimeoutTime);
    });

    this._agentAsisstSocket.on(EVENTS.agent_feedback_response, (data : any) =>{
      this.agentFeedbackResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on(EVENTS.response_resolution_comments, (data : any) =>{
      this.responseResolutionCommentsResponse$.next(data);
      this.addOrRemoveLoader(false);
    });

    this._agentAsisstSocket.on('error', (reason) => {
      console.log("🚀 ~ WebSocketService ~ error event", reason)
        // this._agentAsisstSocket.disconnect(true);
        // this._agentAsisstSocket.connect();
    });

    this._agentAsisstSocket.on(EVENTS.disconnect, (reason) => {
      console.log("🚀 ~ WebSocketService ~ this._agentAsisstSocket.on ~ disconnect event:", reason);
      this._agentAsisstSocket.disconnect(true);
      this._agentAsisstSocket.close();
      this._agentAsisstSocket = null;
      this.socketConnection(true);
      // this._agentAsisstSocket.connect();
    });
    
    this._agentAsisstSocket.on("connect_error", (err) => {
      console.error("connect_error event", err);
      console.log("🚀 ~ WebSocketService ~ this._agentAsisstSocket.on ~ socketErrorCount:", this.socketErrorCount)
      if (this.socketErrorCount < 12) {
        this.socketErrorCount++;
        this._agentAsisstSocket.connect();
      } else {
        console.error("Socket retry limit exceeded connect_error :: ");
      }
    });
  }
  

  handleOverrideMode(toggleOverride, dialogId){
    let connectionDetails = this.rootService.connectionDetails;
    let overRideObj: any = {
      "agentId": "",
      "botId": connectionDetails.botId,
      "conversationId": connectionDetails.conversationId,
      "query": "",
      "enable_override_userinput": toggleOverride,
      'experience': this.rootService.connectionDetails?.channel,
      "positionId": dialogId
    }
    this.emitEvents(EVENTS.enable_override_userinput, overRideObj);
    this.rootService.OverRideMode = toggleOverride;
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

  CustomTempClickEvents(tab, connectionObj) {
    let mythis = this;
    $('.card_body_acc_content.kore-chat-window').on('click', '.botResponseAttachments', function (event) {
      window.open($(this).attr('fileid'), '_blank');
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn,.viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv').on('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn, .viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv', function (e) {

      mythis.templateRenderClassService.AgentChatInitialize.bindEvents(true, e);
      mythis.HandleClickAndSendRequest(tab, connectionObj, e);
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .callendar-tabs .month-tab').on('click', '.advanced-list-wrapper .callendar-tabs .month-tab', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option .option-input').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option .option-input', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });

    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .main-title-text-block .search-block .search_icon').on('click', '.advanced-list-wrapper .main-title-text-block .search-block .search_icon', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .main-title-text-block .search-block .close_icon').on('click', '.advanced-list-wrapper .main-title-text-block .search-block .close_icon', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .main-title-text-block .search-block .input_text').on("keyup", '.advanced-list-wrapper .main-title-text-block .search-block .input_text', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .main-title-text-block .filter-sort-block .sort-icon').on("click", '.advanced-list-wrapper .main-title-text-block .filter-sort-block .sort-icon', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .see-more-data').on("click", '.advanced-list-wrapper .see-more-data', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .close-btn').on("click", '.advanced-list-wrapper .close-btn', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-btn').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-btn', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-button-info .close_btn,.filter-icon .close_btn').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-button-info .close_btn,.filter-icon .close_btn', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top .btn_block.dropdown,.filter-icon').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-header-top .btn_block.dropdown,.filter-icon', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', ".advancelisttemplate .TaskPickerContainer .close-button").on('click', ".advancelisttemplate .TaskPickerContainer .close-button", function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .inner-acc-table-sec .table-sec .column-table-more').on("click", '.advanced-list-wrapper .multiple-accor-rows .inner-acc-table-sec .table-sec .column-table-more', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });

    $('.card_body_acc_content.kore-chat-window').off('click', '.advanced-list-wrapper .button_,.advanced-list-wrapper .inner-btns-acc .button_,.advanced-list-wrapper .tags-data .tag-name,.advanced-list-wrapper .btn_group .submitBtn,.advanced-list-wrapper .btn_group .cancelBtn,.advanced-list-wrapper .details-content .text-info,.advancelisttemplate .inner-btns-acc .button_,.advancelisttemplate .filter-icon .button_').on("click", '.advanced-list-wrapper .button_,.advanced-list-wrapper .inner-btns-acc .button_,.advanced-list-wrapper .tags-data .tag-name,.advanced-list-wrapper .btn_group .submitBtn,.advanced-list-wrapper .btn_group .cancelBtn,.advanced-list-wrapper .details-content .text-info,.advancelisttemplate .inner-btns-acc .button_,.advancelisttemplate .filter-icon .button_', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
  }

  HandleClickAndSendRequest(tab, connectionDetails, e) {
    let connectionObj = this.rootService.getConnectionDetails();
    if (JSON.parse(localStorage.getItem('innerTextValue'))) {
      if (this.rootService.activeTab == ProjConstants.ASSIST) {

        let assistRequestParams =
        {
          "conversationId": connectionObj.conversationId,
          "query": JSON.parse(localStorage.getItem('innerTextValue')),
          "botId": connectionObj.botId,
          "agentId": "",
          "experience": this.rootService.connectionDetails?.channel,
          "positionId": this.rootService.currentPositionId,
          "entities": [],
          "check": true,
          "autoBotId": connectionObj.autoBotId,
          "intType" : "assist"
      }
        this.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
        this.rootService.isAgentSentRequestOnClick = true;
        this.rootService.setAssistTemplateClick(true);
        localStorage.setItem('innerTextValue', null);
        this.rootService.currentPositionId = "";
      } else if (this.rootService.activeTab == ProjConstants.MYBOT) {

        let agent_assist_agent_request_params =
        {
          "isSearch": false,
          "conversationId": connectionObj.conversationId,
          "query": JSON.parse(localStorage.getItem('innerTextValue')),
          "botId": connectionObj.botId,
          "experience": this.rootService.connectionDetails?.channel,
          "positionId": this.rootService.currentPositionIdOfMyBot,
          "autoBotId": connectionObj.autoBotId,
          "intType" : "myBot"
      }
      if(connectionObj.userInput && connectionObj.intentName) {
        agent_assist_agent_request_params['query'] = connectionObj.userInput;
      }
        this.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
        this.rootService.isMyBotAgentSentRequestOnClick = true;
        this.rootService.setMyBotTemplateClick(true);
        localStorage.setItem('innerTextValue', null);
        this.rootService.currentPositionIdOfMyBot = "";
      }
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
    }
  }


}
