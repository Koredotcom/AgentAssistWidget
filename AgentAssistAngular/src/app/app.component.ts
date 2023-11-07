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

  constructor(
    private webSocketService: WebSocketService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private rootService: RootService,
    private localStorageService: LocalStorageService,
    private dirService: DirService,
    private serviceInvoker : ServiceInvokerService
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
      // let parentUrl = document.referrer;
      // let index = this.urls.findIndex(e=>parentUrl.includes(e));

      // if (!(index>-1)) {
      if (Object.keys(this.connectionDetails).length > 1) {
        this.initAgentAssist(this.connectionDetails);
      }
      // }
      var message = {
        method: 'agentassist_loaded',
        name: 'agent_assist',
      };
      window.parent.postMessage(message, '*');
    });
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }


  initiateSocketConnection(params: any) {
    this.localStorageService.initializeLocalStorageState();
    this.isGrantSuccess = true;
    // this.handleSourceType(params);
    setTimeout(() => {
      // this.rootService.setLoader(true);
      this.webSocketService.socketConnection();
      this.rootService.setSocketConnection(true);
      // this.rootService.setLoader(false);
    }, 100);
  }

  grantCall(params : any) {
    console.log("grant call");
    
    var payload = {
      "assertion": params.token,
      "botInfo": {
        "chatBot": "sample Bot",
        "taskBotId": params.botId
      },
      "token": {}
    }
    this.serviceInvoker.invoke('post.grant',{}, payload,{},params.agentassisturl).subscribe((res)=> {
      console.log(res);
      this.rootService.grantResponseObj = res;
      this.initiateSocketConnection(params);
    },(err)=> {
      if (err.status === 500) {
        this.errorMsg = "Issue identified with the backend services! Please reach out to AgentAssist Admin.";
      } else {
        this.errorMsg = "Issue identified in configuration settings! Please reach out to AgentAssist Admin.";
      }
      this.isGrantSuccess = false;
    });
  }

  // handleSourceType(params) {
  //   let sourceType = params.source;
  //   if (sourceType === ProjConstants.SMARTASSIST_SOURCE) {
  //     $('body').addClass(sourceType);
  //   } else {
  //     $('body').addClass('default-color-scheme')
  //   }
  // }

  receiveMessage(e: any) {
    if (e.data.name === 'init_agentassist') {
      console.log(e, 'data from smartAssist');
      let urlParams = e.data.urlParams;
      // this.service.configObj = urlParams;
      this.rootService.formatConnectionDetails(urlParams);
      this.connectionDetails = this.rootService.getConnectionDetails();
      this.initAgentAssist(urlParams);
    } else if (e.data.name === 'userBotConvos') {
      console.log(e.data);
      if (e.data && e.data.sessionId && e.data.userId) {
        this.rootService.setUserBotConversationDataDetails(e.data);
      }
    } else if (e.data.name === 'setAgentInfo') {
      console.log(e, 'event', e.data.agentDetails, 'agent details');
      this.localStorageService.agentDetails = e.data.agentDetails
        ? e.data.agentDetails
        : null;
    } else if (e.data.name === 'setUserInfo') {
      console.log(e, 'event', e.data.userDetails, 'user details');
      this.localStorageService.userDetails = e.data.userDetails
        ? e.data.userDetails
        : null;
    } else if (e.data.type === 'AGENT') {
      console.log(e.data);
      this.emitUserAgentMessage(e.data, 'agent_inp_msg');
    } else if (e.data.type === 'USER') {
      console.log(e.data);
      this.emitUserAgentMessage(e.data, 'user_inp_msg');
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
        this.initiateSocketConnection(this.connectionDetails);
      } else {
        this.grantCall(params);
      }
    }
  }


}
