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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AgentAssistWidget';
  isGrantSuccess = false;
  errorMsg;

  constructor(private webSocketService: WebSocketService, private service: CommonService,
    private route: ActivatedRoute, private handleSubjectService: HandleSubjectService, private randomID: KoreGenerateuuidPipe,
    private localStorageService: LocalStorageService, private templateChatConfig: TemplateRenderClassService, private router: Router) {
  }

  ngOnInit() {
    window.addEventListener("unload", (event) => {
      window.removeEventListener("message", this.receiveMessage);
      this.localStorageService.agentDetails = {};
      this.localStorageService.userDetails = {};
    });

    this.route.queryParams
      .subscribe(params => {    
        this.service.configObj = params;
        window.addEventListener("message", this.receiveMessage.bind(this), false);
        // let parentUrl = window.parent.location.hostname;
        let parentUrl = document.referrer;
        console.log(parentUrl, "parent url")
        let index = this.templateChatConfig.chatConfig.urls.findIndex(e=>parentUrl.includes(e));
        console.log(index, "index");
          if (!(index>-1)) {
            console.log("inside if condition");
            
            this.initAgentAssist(this.templateChatConfig.chatConfig, params);
          } else {
            var message = {
              method: 'agentassist_loaded',
              name: "agent_assist"
          };
          window.parent.postMessage(message, "*");
          }
      });
  }

  initiateSocketConnection(params) {
    this.isGrantSuccess = true;
    this.handleSubjectService.setConnectionDetails(params);
    this.handleSourceType(params);
    setTimeout(() => {
      this.handleSubjectService.setLoader(true);
      this.webSocketService.socketConnection();
      this.handleSubjectService.setLoader(false);
    }, 100);
  }

  grantCall(params) {
    this.handleSubjectService.setLoader(true);
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
    }else if(e.data.name === 'setAgentInfo'){
      console.log(e, "event", e.data.agentDetails, "agent details");
      this.localStorageService.agentDetails = e.data.agentDetails ? e.data.agentDetails : null;
    }else if(e.data.name === 'setUserInfo'){
      console.log(e, "event", e.data.userDetails, "user details");
      this.localStorageService.userDetails = e.data.userDetails ? e.data.userDetails : null;
    }
  }

  initAgentAssist(chatConfig, params) {
    console.log(this.service.configObj, "configobj");
     this.service.configObj.conversationId = this.service.configObj.conversationid || this.service.configObj.conversationId
     if (this.service.configObj.token && this.service.configObj.botid && this.service.configObj.agentassisturl && this.service.configObj.conversationId && !this.service.configObj.fromSAT) {
      this.handleSubjectService.setLoader(true);
      this.grantCall(params);
    }
    else if (!this.service.configObj.token && !this.service.configObj.botid && !this.service.configObj.agentassisturl && !this.service.configObj.conversationId) {
      if (connectionObj.isAuthentication) {
        var jsonData = {
          "clientId": connectionObj.botDetails.clientId,
          "clientSecret": connectionObj.botDetails.clientSecret,
          "identity": this.randomID.transform(),
          "aud": "",
          "isAnonymous": false
        };

        this.service.callSts(jsonData).then((res) => {
          let params = {};
          let conversationId = this.randomID.transform();
          params['token'] = res.jwt;
          params['botid'] = connectionObj.botDetails.botId;
          params['agentassisturl'] = connectionObj.envinormentUrl;
          params['conversationid'] = conversationId
          this.service.configObj = params;
          this.grantCall(params)
        }).catch((err) => {
          this.errorMsg = "jwt token generation failed";
        })
      } else {
        this.handleSubjectService.setLoader(false);
        this.errorMsg = "Issue identified in configuration settings! Please reach out to AgentAssist Admin."
      }

    } else {
      connectionObj['envinormentUrl'] = connectionObj.envinormentUrl;
      connectionObj['jwtToken'] = params.token;
      connectionObj['accountId'] = params.accountId || '';
      connectionObj['userId'] = params.userId || '';
      connectionObj['orgId']= params.orgId || '';
      connectionObj['isSAT'] = params.fromSAT || false;
      this.initiateSocketConnection(params);
    }


  }

}
