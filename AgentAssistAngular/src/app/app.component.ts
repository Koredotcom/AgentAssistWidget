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
    private localStorageService: LocalStorageService) {

  }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.service.configObj = params;
        if (params.token && params.botid && params.agentassisturl && params.conversationid) {
          this.handleSubjectService.setLoader(true);
          this.grantCall(params);
        }
        else {
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

        }

      }
      );
  }

  grantCall(params) {
    this.handleSubjectService.setLoader(true);
    this.service.grantCall(params.token, params.botid, params.agentassisturl).then((res) => {
      console.log(res, "sucess")
      this.isGrantSuccess = true;
      this.service.grantResponseObj = res;
      this.handleSubjectService.setConnectionDetails(params);
      this.handleSourceType(params);
      setTimeout(() => {
        this.handleSubjectService.setLoader(true);
        this.webSocketService.socketConnection();
        this.handleSubjectService.setLoader(false);
      }, 100);
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

}



