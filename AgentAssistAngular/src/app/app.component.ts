import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { WebSocketService } from './services/web-socket.service';
import { SubSink } from 'subsink';
import { userAgInputMessages } from './helpers/data.models';
import { EVENTS } from './helpers/events';
import { RootService } from './services/root.service';
import { TranslateService } from '@ngx-translate/core';
import { DirService } from './services/dir.service';
import { ServiceInvokerService } from './services/service-invoker.service';
import { KoreGenerateuuidPipe } from './pipes/kore-generateuuid.pipe';
import { HandleSubjectService } from './services/handle-subject.service';
import { finalize } from 'rxjs';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{
  isGrantSuccess = false;
  errorMsg: string = '';
  subs = new SubSink();
  // urls = ['smartassist.kore.ai', 'smartassist-jp.kore.ai', 'smartassist.korebots.com', 'smartassist-de.kore.ai', 'smartassist-korevg-np.kore.ai'];
  connectionDetails: any = {};
  widgetSettings : any;
  widgetLoader : boolean = true;
  showFeedback : boolean = false;
  timeoutId : any;

  constructor(
    private webSocketService: WebSocketService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private rootService: RootService,
    private localStorageService: LocalStorageService,
    private dirService: DirService,
    private serviceInvoker : ServiceInvokerService,
    private koregenerateUUIDPipe : KoreGenerateuuidPipe,
    private handleSubjectService: HandleSubjectService,
    private sanitizeHTMLPipe : SanitizeHtmlPipe
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    const lang = this.localStorageService.getLanguage();
    this.dirService.setDirection(lang === 'ar' ? 'rtl' : 'ltr');

    // const theme = this.localStorageService.getTheme();

    window.addEventListener('unload', (event) => {
      window.removeEventListener('message', this.receiveMessage);
      this.localStorageService.agentDetails = {};
      this.localStorageService.userDetails = {};
    });

    this.subs.sink = this.route.queryParams.subscribe((params) => {
      if (!(Object.keys(params)?.length > 0)) {
        return;
      }

      this.rootService.formatConnectionDetails(params);
      this.connectionDetails = this.rootService.getConnectionDetails();

      window.addEventListener('message', this.receiveMessage.bind(this), false);
      if (this.connectionDetails && Object.keys(this.connectionDetails)?.length > 1) {
        this.initAgentAssist(this.connectionDetails);
      }
      var message = {
        method: 'agentassist_loaded',
        name: 'agent_assist',
      };
      window.parent.postMessage(message, '*');
    });

    this.subs.sink = this.webSocketService.agentFeedbackResponse$.subscribe((response: any) => {
      if (response && Object.keys(response)?.length > 0) {
        this.showFeedback = true;
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
          this.showFeedback = false;
        }, 5000);
      }
    });
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }


  initiateSocketConnection(params: any) {
    this.localStorageService.initializeLocalStorageState(this.widgetSettings);
    this.isGrantSuccess = true;
    setTimeout(() => {
      this.webSocketService.socketConnection();
      this.rootService.setSocketConnection(true);
    }, 100);
  }

  grantCall(params : any) {    
    var payload = {
      "assertion": params.token,
      "botInfo": {
        "chatBot": "sample Bot",
        "taskBotId": params.botId
      },
      "token": {}
    }
    this.serviceInvoker.invoke('post.grant',{}, payload,{},params.agentassisturl).subscribe((res)=> {
      this.rootService.grantResponseObj = res;
      // this.initiateSocketConnection(params);
      this.getAgentAssistSettings(params);
    },(err)=> {
      if (err.status === 500) {
        this.errorMsg = "Issue identified with the backend services! Please reach out to AgentAssist Admin.";
      } else {
        this.errorMsg = "Issue identified in configuration settings! Please reach out to AgentAssist Admin.";
      }
      this.isGrantSuccess = false;
    });
  }

  receiveMessage(e: any) {
    if (e.data.name === 'init_agentassist') {
      let urlParams = e.data.urlParams;
      // this.service.configObj = urlParams;
      this.rootService.formatConnectionDetails(urlParams);
      this.connectionDetails = this.rootService.getConnectionDetails();
      this.initAgentAssist(this.connectionDetails);
    } else if (e.data.name === 'userBotConvos') {
      if (e.data && e.data.sessionId && e.data.userId) {
        this.rootService.setUserBotConversationDataDetails(e.data);
      }
    } else if (e.data.name === 'setAgentInfo') {
      this.localStorageService.agentDetails = e.data.agentDetails
        ? e.data.agentDetails
        : null;
    } else if (e.data.name === 'setUserInfo') {
      this.localStorageService.userDetails = e.data.userDetails
        ? e.data.userDetails
        : null;
    } else if (e.data.type === 'AGENT') {
      this.emitUserAgentMessage(e.data, 'agent_inp_msg');
    } else if (e.data.type === 'USER') {
      this.emitUserAgentMessage(e.data, 'user_inp_msg');
    }
    this.eventListenerFromParent(e);
  }

  eventListenerFromParent(e) {
    if (e.data.name === EVENTS.response_resolution_comments && e.data.conversationId == this.connectionDetails.conversationId) {
      this.handleSubjectService.setSummaryPopup(e.data);
    }
    if (e.data.name == 'initial_data') {
      e.data?.data?.forEach((ele) => {
        let agent_assist_request = {
          'conversationId': ele.conversationId,
          'query': this.sanitizeHTMLPipe.transform(ele.value),
          'botId': ele.botId,
          'agentId': '',
          'experience': this.connectionDetails?.channel,
          'positionId': ele?.positionId
        }
        if (ele?.intentName) {
          agent_assist_request['intentName'] = ele.value;
        }
        if (ele?.entities) {
          agent_assist_request['entities'] = ele.entities;
        } else {
          agent_assist_request['entities'] = [];
        }
        if (ele.conversationId === this.connectionDetails.conversationId) {
          this.webSocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
        }
      })
    }
    if (e.data.name === 'agentAssist.endOfConversation' && (e.data.conversationId || e.data.conversationid)) {
      let currentEndedConversationId = e.data.conversationId || e.data.conversationid;
      if (this.localStorageService.checkConversationIdStateInStorage([currentEndedConversationId])) {
        let request_resolution_comments = {
          conversationId: e.data?.conversationId,
          userId: '',
          botId: this.connectionDetails.botId,
          sessionId: this.koregenerateUUIDPipe.transform(),
          chatHistory: e.data?.payload?.chatHistory
        }
        if(this.widgetSettings?.summarization?.isEnabled) {
        this.webSocketService.emitEvents(EVENTS.request_resolution_comments, request_resolution_comments);
        }
        this.webSocketService.emitEvents(EVENTS.end_of_conversation, request_resolution_comments);
        this.localStorageService.deleteLocalStorageState(currentEndedConversationId);
      }
      return;
    }else if(e.data.name === 'conversation.endAgentAssist' && e.data.convsId){
      this.localStorageService.deleteLocalStorageState(e.data.convsId);
      return;
    }

    if (e.data.value) {
      let userInputData = e.data;
      let agent_assist_request = {
        'author': {
          "firstName": userInputData.author?.firstName,
          "lastName": userInputData.author?.lastName,
          "type": userInputData.author?.type
        },
        'botId': this.connectionDetails.botId,
        'conversationId': userInputData.conversationid,
        'experience': this.connectionDetails?.channel,
        'query': this.sanitizeHTMLPipe.transform(userInputData.value),
        'positionId' : this.rootService.isAutomationOnGoing ? this.rootService.currentPositionId : null
      }
      let user_messsage = {
        "botId": this.connectionDetails.botId,
        "type": "text",
        "conversationId": userInputData.conversationid,
        "value": this.sanitizeHTMLPipe.transform(userInputData.value),
        "author": {
          "firstName": userInputData.author?.firstName,
          "lastName": userInputData.author?.lastName,
          "type": userInputData.author?.type
        },
        "event": "user_message",
        'positionId' : this.rootService.isAutomationOnGoing ? this.rootService.currentPositionId : null
      }
      if(userInputData?.customData) {
        agent_assist_request['customData'] = JSON.parse(JSON.stringify(userInputData?.customData));
      }
      if(userInputData?.secureCustomData) {
        agent_assist_request['secureCustomData'] = userInputData?.secureCustomData;
      }
      if (this.connectionDetails.isCallConversation === true) {
        this.handleSubjectService.setAgentOrTranscriptResponse(userInputData);
      } else {
        if (userInputData?.author?.type === 'USER') {
          if (!this.rootService.OverRideMode) {
            this.webSocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
          } else {
            this.webSocketService.emitEvents(EVENTS.user_message, user_messsage);
          }
        }
      }
    }
  }

  emitUserAgentMessage(payload: userAgInputMessages, eType = '') {
    // emit userAgentMsg
    if (eType === 'user_inp_msg') {
      this.webSocketService.emitEvents(EVENTS.user_sent_message, payload);
    } else if (eType === 'agent_inp_msg') {
      this.webSocketService.emitEvents(EVENTS.agent_sent_message, payload);
    }
  }

  initAgentAssist(params: any) {
    //  this.connectionDetails['conversationId'] = this.connectionDetails.conversationid || this.connectionDetails.conversationId
    // constructed url in 3rd party agentdesktops
    if (
      this.connectionDetails.token &&
      this.connectionDetails.botId &&
      this.connectionDetails.agentassisturl &&
      this.connectionDetails.conversationId
    ) {
      if (this.connectionDetails.fromSAT) {
        this.connectionDetails = this.rootService.getConnectionDetails();
        // this.initiateSocketConnection(this.connectionDetails);
        this.getAgentAssistSettings(params);
      } else {
        this.grantCall(params);
      }
    }
  }


  getAgentAssistSettings(params){
    let instanceBotId = params.fromSAT ? params.instanceBotId : params.botId;
    this.serviceInvoker.invoke('get.settings', {instanceBotId : instanceBotId, channel : params.channel}, {},{ },params.agentassisturl).pipe(finalize(() => {this.widgetLoader = false})).subscribe((res)=> {
      if(res && res.agentAssistSettings && res.agentAssistSettings[params.channel]){
        this.widgetSettings = Object.assign(res.agentAssistSettings, res.agentAssistSettings[params.channel]);
      }else{
        this.widgetSettings = this.rootService.defaultwidgetSettings;
      }
      this.rootService.settingsData = JSON.parse(JSON.stringify(this.widgetSettings));
      this.initiateSocketConnection(params);
    },(err)=> {
      this.widgetSettings = this.rootService.defaultwidgetSettings;
      this.rootService.settingsData = JSON.parse(JSON.stringify(this.widgetSettings));
      this.initiateSocketConnection(params);
    });

  }

  closeFeedback(){
    this.showFeedback = false;
  }

}
