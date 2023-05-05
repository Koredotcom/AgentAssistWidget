import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { connectionObj } from 'src/common/constants/proj.cnts';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AgentAssistWidget';
  isGrantSuccess = false;
  errorMsg : string = '';

  constructor(private webSocketService: WebSocketService,
              private service: CommonService,
              private route: ActivatedRoute,
              private handleSubjectService: HandleSubjectService,
              private randomID: KoreGenerateuuidPipe,
              private localStorageService: LocalStorageService,
              private templateChatConfig: TemplateRenderClassService,
              private router: Router) {
  }

  ngOnInit() {
    window.addEventListener("unload", (event) => {
      window.removeEventListener("message", this.receiveMessage);
      this.localStorageService.agentDetails = {};
      this.localStorageService.userDetails = {};
    });

    this.route.queryParams
      .subscribe(params => {
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
     this.initiateSocketConnection(params);
    }).catch((err) => {
      this.handleSubjectService.setLoader(false);
      if (err.status === 500) {
        this.errorMsg = "Issue identified with the backend services! Please reach out to AgentAssist Admin.";
      } else {
        this.errorMsg = "Issue identified in configuration settings! Please reach out to AgentAssist Admin.";
      }
      this.isGrantSuccess = false;
    });
  }

  handleSourceType(params) {
    let sourceType = params.source;
    if (sourceType === 'smartassist-color-scheme') {
      $('body').addClass(sourceType);
    } else {
      $('body').addClass('default-color-scheme')
    }
  }

  receiveMessage(e) {
    if(e.data.name === 'init_agentassist') {
      console.log(e, "data from smartAssist");
        var chatConfig = this.templateChatConfig.chatConfig;
        let urlParams = e.data.urlParams;
        this.service.configObj = urlParams;
        this.initAgentAssist(chatConfig, urlParams);
      } else if(e.data.name === 'userBotConvos') {
        console.log(e.data);
        let userBotConversationDetails = e.data;
          let connectionDetails;
          let headersVal = {};
          this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
            if (response) {
              connectionDetails = response;
              headersVal = {
                'Authorization': this.service.grantResponseObj?.authorization?.token_type + ' ' + this.service.grantResponseObj?.authorization?.accessToken,
                'eAD': true,
            }
              $.ajax({
                url: `${connectionDetails.agentassisturl}/api/1.1/botmessages/chathistorytoagentassist?botId=${userBotConversationDetails.botId}&userId=${userBotConversationDetails.userId}&sessionId=${userBotConversationDetails.sessionId}`,
                type: 'get',
                headers: headersVal,
                dataType: 'json',
                success:  (data) => {
                  console.log(data);
                  if(data && data.length > 0) {
                    this.handleSubjectService.setUserHistoryData(data);
                  }
                },
                error: function (err) {
                    console.error("Unable to fetch the details with the provided data", err);
                }
            });
        }});
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
      this.webSocketService.emitEvents(EVENTS.agent_sent_message, payload);
    }


  }

  initAgentAssist(chatConfig, params) {
    console.log(this.service.configObj, "configobj");
     this.service.configObj['conversationId'] = this.service.configObj.conversationid || this.service.configObj.conversationId
     if (this.service.configObj.token && this.service.configObj.botid && this.service.configObj.agentassisturl && this.service.configObj.conversationId && !this.service.configObj.fromSAT) {
      this.grantCall(params);
    }
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

    } else {
      connectionObj['agentassisturl'] = connectionObj.envinormentUrl;
      connectionObj['jwtToken'] = params.token;
      connectionObj['accountId'] = params.accountId || '';
      connectionObj['userId'] = params.userId || '';
      connectionObj['orgId']= params.orgId || '';
      connectionObj['fromSAT'] = params.fromSAT || false;
      this.initiateSocketConnection(params);
    }


  }

}
