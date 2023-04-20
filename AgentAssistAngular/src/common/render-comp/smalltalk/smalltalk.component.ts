import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IdReferenceConst, ProjConstants } from 'src/common/constants/proj.cnts';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-smalltalk',
  templateUrl: './smalltalk.component.html',
  styleUrls: ['./smalltalk.component.scss']
})
export class SmalltalkComponent implements OnInit, OnDestroy {
  @Input() smallTalkData : any = {};

  smallTalkArray : any = [];
  projConstants : any = ProjConstants;


  constructor(private templateRenderClassService: TemplateRenderClassService){

  }

  ngOnInit(): void {
   console.log(this.smallTalkData, "small talk data");
   if(this.smallTalkData && this.smallTalkData.data){
    this.formatAssistSmallTalk(this.smallTalkData);
   }
  }
  ngOnDestroy(): void {
    
  }

  formatAssistSmallTalk(smallTalkData){
    let smallTalkObject : any = {
      title : smallTalkData.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
      isTemplateRender : this.smallTalkTemplateRenderCheck(smallTalkData.data,smallTalkData.result),
      value : smallTalkData.data?.buttons[0]?.value,
      sendData : smallTalkData.result?.parsedPayload ? smallTalkData.temp : smallTalkData.data?.buttons[0]?.value,
      isThirdParty : false
    }
    smallTalkObject.template = this.getTemplateHtml(smallTalkObject.isTemplateRender, smallTalkData.result);
    this.smallTalkArray.push(smallTalkObject);
    console.log(this.smallTalkArray, "small talk array");
    
  }


  smallTalkTemplateRenderCheck(data,result){
    if(result.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))){
      return true;
    }
    return false;
  }

  getTemplateHtml(isTemplateRender, result){
    let renderedMessage = isTemplateRender ? this.templateRenderClassService?.AgentChatInitialize?.renderMessage(result) : '';
    if (renderedMessage && renderedMessage[0]) {
      let obj =  $(this.templateRenderClassService.AgentChatInitialize.renderMessage(result))[0].outerHTML
      return (obj);
    }
    return null;
  }


  handleSendCopyButton(actionType, sendData) {
    let message = {};
    if (actionType == ProjConstants.SEND) {
      message = {
        method: 'send',
        name: IdReferenceConst.SENDMSG_REQUEST,
        conversationId: this.smallTalkData.connectionDetails.conversationId,
        payload: sendData
      };
      window.parent.postMessage(message, '*');
    } else {
      message = {
        method: 'copy',
        name: IdReferenceConst.COPYMSG_REQUEST,
        conversationId: this.smallTalkData.connectionDetails.conversationId,
        payload: sendData
      };
      parent.postMessage(message, '*');
    }
  }

  

}
