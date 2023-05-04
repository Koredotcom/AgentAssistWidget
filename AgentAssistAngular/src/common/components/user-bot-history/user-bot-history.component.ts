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
    this.subscribeEvents();
    
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  subscribeEvents(){
    let subscription1 = this.handleSubjectService.userHistoryDataSubject$.subscribe((res : any) => {
      console.log(res, "response inside history");
      if(res && res.chatHistory){
        this.historyResponse = res.chatHistory;
        this.formatHistoryResponse();
      }
    });
    this.subscriptionsList.push(subscription1);
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
