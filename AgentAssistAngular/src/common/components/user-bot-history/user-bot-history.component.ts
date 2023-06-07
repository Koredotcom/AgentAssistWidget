import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants } from 'src/common/constants/proj.cnts';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-bot-history',
  templateUrl: './user-bot-history.component.html',
  styleUrls: ['./user-bot-history.component.scss']
})
export class UserBotHistoryComponent implements OnInit, OnDestroy{

  subscriptionsList: Subscription[] = [];
  historyResponse : any = [];
  projconstants : any = ProjConstants

  constructor(
    private handleSubjectService : HandleSubjectService,
    private templateRenderClassService : TemplateRenderClassService,
    public commonService : CommonService
    ) { }

  ngOnInit(): void {
    // this.subscribeEvents();
    this.userBotConversationHistory();
  }

  userBotConversationHistory() {
    let userBotConversationDetails = this.handleSubjectService.getUserBotConvosDataDetails();
    let connectionDetails;
    let headersVal = {};
    let subscription2 = this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      if (response) {
        connectionDetails = response;
        if((userBotConversationDetails?.botId || connectionDetails?.botId) && userBotConversationDetails?.userId && userBotConversationDetails?.sessionId) {
          headersVal = {
            'Authorization': this.commonService.grantResponseObj?.authorization?.token_type + ' ' + this.commonService.grantResponseObj?.authorization?.accessToken,
            'iid' : userBotConversationDetails.botId ? userBotConversationDetails.botId : 'st-1c3a28c8-335d-5322-bd21-f5753dc7f1f9'

          }
            $.ajax({
              url: `${connectionDetails.agentassisturl}/api/1.1/botmessages/chathistorytoagentassist?botId=${userBotConversationDetails?.botId || connectionDetails?.botId}&userId=${userBotConversationDetails?.userId}&sessionId=${userBotConversationDetails?.sessionId}&limit=-1&msgDirection=true`,
              type: 'get',
              headers: headersVal,
              dataType: 'json',
              success:  (data) => {
                console.log(data);
                if(data && data.messages.length > 0) {
                  this.handleSubjectService.setUserHistoryData(data);
                  this.historyResponse = data.messages;
                  this.formatHistoryResponse();
                }
              },
              error: function (err) {
                this.historyResponse = [];
                  console.error("Unable to fetch the details with the provided data", err);
              }
          });
        }
    }});
    this.subscriptionsList.push(subscription2);
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  formatHistoryResponse(){
    for(let hisRes of this.historyResponse){
      hisRes = this.commonService.confirmationNodeRenderForHistoryDataTransform(hisRes);
      let result : any = this.templateRenderClassService.getResponseUsingTemplateForHistory(hisRes);
      hisRes.isTemplateRender = this.templateRenderCheck(hisRes,result);
      hisRes.value = hisRes?.components[0]?.data?.text || null;
      hisRes.template = this.getTemplateHtml(hisRes.isTemplateRender, result);
    }
  }

  getTemplateHtml(isTemplateRender, result){
    let renderedMessage = isTemplateRender ? this.templateRenderClassService?.AgentChatInitialize?.renderMessage(result) : '';
    if (renderedMessage && renderedMessage[0]) {
      let obj =  $(this.templateRenderClassService.AgentChatInitialize.renderMessage(result))[0].outerHTML
      return (obj);
    }
    return null;
  }

  templateRenderCheck(data,result){
    if(result.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))){
      return true;
    }
    return false;
  }

}
