import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { connectionObj, ProjConstants, storageConst } from 'src/common/constants/proj.cnts';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { LocalStorageService } from 'src/common/services/local-storage.service';
import { WebSocketService } from '../common/services/web-socket.service';
import * as $ from 'jquery';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import { Router } from '@angular/router';
import { userAgInputMessages } from 'src/common/helper/data-models';
import { EVENTS } from 'src/common/helper/events';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'AgentAssistWidget';
  isGrantSuccess = false;
  errorMsg : string = 'Loading...';
  subsciption = new Subscription();
  wordTimeStamps: any = {};
  aaSettings = {};
  iswidgetEnabled = false;
  isErrorMsg = false;
  constructor(private webSocketService: WebSocketService,
              private service: CommonService,
              private route: ActivatedRoute,
              private handleSubjectService: HandleSubjectService,
              private randomID: KoreGenerateuuidPipe,
              private localStorageService: LocalStorageService,
              private templateChatConfig: TemplateRenderClassService,
              private router: Router) {
  }
  ngOnDestroy(): void {
    this.subsciption1.unsubscribe();
    this.subsciption.unsubscribe();
  }

  ngOnInit() {
    window.addEventListener("unload", (event) => {
      window.removeEventListener("message", this.receiveMessage);
      this.localStorageService.agentDetails = {};
      this.localStorageService.userDetails = {};
    });

    this.subsciption = this.route.queryParams
      .subscribe(params => {
        if(!(Object.keys(params)?.length > 0)){
          return
        }
        this.service.configObj = {...params};
        window.addEventListener("message", this.receiveMessage.bind(this), false);
        // let parentUrl = window.parent.location.hostname;
        let parentUrl = document.referrer;
        console.log(parentUrl, "parent url")
        let index = this.templateChatConfig.chatConfig.urls.findIndex(e=>parentUrl.includes(e));
        console.log(index, "index");
          if (!(index>-1)) {
            if(Object.keys(this.service.configObj).length > 0){
              this.initAgentAssist(this.templateChatConfig.chatConfig, params);
            }
          }
          var message = {
            method: 'agentassist_loaded',
            name: "agent_assist"
        };
          window.parent.postMessage(message, "*");

      });
  }

  initiateSocketConnection(params) {
    this.isGrantSuccess = true;
    this.handleSubjectService.setConnectionDetails(params);
    this.service.configObj['autoBotId'] = params?.autoBotId && (params?.autoBotId !== "undefined" && params?.autoBotId !== "null" && params.autoBotId !=="")? params?.autoBotId: undefined;
    this.handleSourceType(params);
    setTimeout(() => {
      this.handleSubjectService.setLoader(true);
      this.webSocketService.socketConnection();
      this.handleSubjectService.setLoader(false);
    }, 100);
  }

  grantCall(params) {
    this.handleSubjectService.setLoader(true);
    // let botid = params?.autoBotId ? params?.autoBotId : params.botid;
    this.service.grantCall(params.token, params.botid, params.agentassisturl).then((res) => {
      console.log(res, "sucess")
      // this.isGrantSuccess = true;
      this.service.grantResponseObj = res;
      this.getAgentAssistSettings(params);
    }).catch((err) => {
      this.handleSubjectService.setLoader(false);
      if (err.status === 500) {
        this.errorMsg = "Issue identified with the backend services! Please reach out to AgentAssist Admin.";
      } else {
        // this.errorMsg = "Issue identified in configuration settings! Please reach out to AgentAssist Admin.";
      }
      this.isGrantSuccess = false;
    });
  }

  handleSourceType(params) {
    let sourceType = params.source;
    if (sourceType === ProjConstants.SMARTASSIST_SOURCE) {
      $('body').addClass(sourceType);
    } else {
      $('body').addClass('default-color-scheme')
    }
  }
  subsciption1 = new Subscription()
  receiveMessage(e) {
    if(e.data?.wordLevelTimeStamps) {
      this.wordTimeStamps = e.data.wordLevelTimeStamps
    }
    if(e.data.name === 'init_agentassist') {
      console.log(e, "data from smartAssist");
        var chatConfig = this.templateChatConfig.chatConfig;
        let urlParams = e.data.urlParams;
        this.service.configObj = urlParams;
        this.initAgentAssist(chatConfig, urlParams);
    } else if(e.data.name === 'userBotConvos') {
        console.log(e.data);
        if (e.data && (e.data.sessionId && e.data.userId)) {
          this.handleSubjectService.setUserBotConversationDataDetails(e.data);
        }
    }
    else if(e.data.name === 'setAgentInfo'){
      console.log(e, "event", e.data.agentDetails, "agent details");
      this.localStorageService.agentDetails = e.data.agentDetails ? e.data.agentDetails : null;
    }else if(e.data.name === 'setUserInfo'){
      console.log(e, "event", e.data.userDetails, "user details");
      this.localStorageService.userDetails = e.data.userDetails ? e.data.userDetails : null;
    } else if(e.data.type === 'AGENT') {
      console.log(e.data);
      this.emitUserAgentMessage(e.data, 'agent_inp_msg');
    }else if(e.data.type === 'USER') {
      console.log(e.data);
      this.emitUserAgentMessage(e.data, 'user_inp_msg');
    }
    
  }

  emitUserAgentMessage(payload: userAgInputMessages, eType='') {
    // emit userAgentMsg
    
    if( eType === 'user_inp_msg') {
      this.webSocketService.emitEvents(EVENTS.user_sent_message, payload);
    } else if(eType === 'agent_inp_msg') {
      if(Object.keys(this.wordTimeStamps).length) {
        payload['wordLevelTimeStamps'] = this.wordTimeStamps;
      }
      this.webSocketService.emitEvents(EVENTS.agent_sent_message, payload);
    }
    this.wordTimeStamps = {};
  }

  initAgentAssist(chatConfig, params) {
    console.log(this.service.configObj, "configobj");
     this.service.configObj['conversationId'] = this.service.configObj.conversationid || this.service.configObj.conversationId
    // constructed url in 3rd party agentdesktops
    if (this.service.configObj.token && this.service.configObj.botid && this.service.configObj.agentassisturl && this.service.configObj.conversationId && !this.service.configObj.fromSAT) {
      this.grantCall(params);
    }
    // installed in the external systems
    else if (!this.service.configObj.token && !this.service.configObj.botid && !this.service.configObj.agentassisturl && !this.service.configObj.conversationId) {
      if (connectionObj.isAuthentication) {
        var jsonData = {
          "clientId": connectionObj.botDetails.clientId, // instance bot clientid
          "clientSecret": connectionObj.botDetails.clientSecret, // instance bot clientsecret
          "identity": this.randomID.transform(),
          "aud": "",
          "isAnonymous": false
        };

        this.service.callSts(jsonData).then((res) => {
          let params = {};
          let conversationId = this.randomID.transform();
          params['token'] = res.jwt;
          params['botid'] = connectionObj.botDetails.botId; // instance bot id
          params['agentassisturl'] = connectionObj.envinormentUrl;
          params['conversationid'] = conversationId;
          this.service.configObj = params;
          this.grantCall(params)
        }).catch((err) => {
          this.errorMsg = "jwt token generation failed";
          this.isGrantSuccess = false;
        })
      } else {
        this.handleSubjectService.setLoader(false);
        this.errorMsg = "Issue identified in configuration settings! Please reach out to AgentAssist Admin."
        this.isGrantSuccess = false;
      }

    }
    // Smartassist
    else {
      console.log(params);
      connectionObj['agentassisturl'] = connectionObj.envinormentUrl;
      connectionObj['jwtToken'] = params.token;
      connectionObj['accountId'] = params.accountId || '';
      connectionObj['userId'] = params.userId || '';
      connectionObj['orgId']= params.orgId || '';
      connectionObj['fromSAT'] = params.fromSAT || false;
      this.getAgentAssistSettings(params);
    }
  }

  getAgentAssistSettings(params) {
    // api call
    let paramsCopy = {...params};
    let headersVal : any = {};
    if(!this.service.configObj.fromSAT) {
        headersVal = {
            'Authorization': 'bearer' + ' ' + this.service.grantResponseObj?.authorization?.accessToken,
            'eAD': false,
            'accountId': this.service.grantResponseObj?.userInfo?.accountId,
            'iid' : this.service.configObj.botid ? this.service.configObj.botid : ''
        }
        paramsCopy.instanceBotId = this.service.configObj.botid;
    } else {
        headersVal = {
            'accountId': paramsCopy?.accountId,
            'Authorization': 'bearer' + ' ' + paramsCopy.token,
            'iid' : paramsCopy.instanceBotId || ''
        }
    }
    $.ajax({
      url: `${this.service.configObj.agentassisturl}/agentassist/api/v1/agentassist/${paramsCopy.instanceBotId}/agentassistsetting`,
      type: 'get',
      headers: headersVal,
      dataType: 'json',
      success:  (data) => {
        this.aaSettings = data.agentAssistSettings;
        this.service.configObj = {...this.service.configObj, ...this.aaSettings};
        this.iswidgetEnabled = this.aaSettings['agentAssistWidgetEnabled'];
        if(data.agentAssistSettings?.agentAssistWidgetEnabled) { 
        this.initiateSocketConnection(paramsCopy);
        this.handleSubjectService.setAgentAssistSettings(this.aaSettings);
        } else {
          this.iswidgetEnabled = data?.agentAssistSettings?.agentAssistWidgetEnabled;
        this.errorMsg = "AgentAssist Settings configuration are Disabled! Please reach out to AgentAssist Admin.";
        }
        this.isErrorMsg = true;
    },
      error:  (err)=> {
          console.error("Unable to fetch the details with the provided data", err);
      }
    });
  }

}