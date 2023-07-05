import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IdReferenceConst, ProjConstants, RenderResponseType } from 'src/common/constants/proj.cnts';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import * as $ from 'jquery';
import { CommonService } from 'src/common/services/common.service';
import { EVENTS } from 'src/common/helper/events';
import { WebSocketService } from 'src/common/services/web-socket.service';
@Component({
  selector: 'app-smalltalk',
  templateUrl: './smalltalk.component.html',
  styleUrls: ['./smalltalk.component.scss']
})
export class SmalltalkComponent implements OnInit, OnDestroy {
  @Input() smallTalkData : any = {};
  @Input() agentassistArrayIndex : number;
  @Input() agentassistResponseArrayLength : number;
  @Input() agentAssistResp : any;

  projConstants : any = ProjConstants;
  idReferenceConst : any = IdReferenceConst;
  renderResponseType : any = RenderResponseType;


  constructor(private templateRenderClassService: TemplateRenderClassService,
    private commonService : CommonService, private websocketService : WebSocketService){

  }

  ngOnInit(): void {
  
  }

  ngOnChanges(){
    if(this.smallTalkData && this.smallTalkData.data){
      this.formatAssistSmallTalk(this.smallTalkData);
     }
  }

  ngOnDestroy(): void {
    
  }

  formatAssistSmallTalk(smallTalkData){
    smallTalkData.showOverrideDiv = smallTalkData.hideOverrideDiv ? false : ((this.smallTalkData?.data?.isPrompt && this.smallTalkData?.proactiveModeStatus ? true : false));
    let agentInputEntityName = 'EnterDetails';
    if (this.agentAssistResp.newEntityDisplayName || this.agentAssistResp.newEntityName) {
      agentInputEntityName = this.agentAssistResp.newEntityDisplayName ? this.agentAssistResp.newEntityDisplayName : this.agentAssistResp.newEntityName;
    } else if (this.agentAssistResp.entityDisplayName || this.agentAssistResp.entityName) {
      agentInputEntityName = this.agentAssistResp.entityDisplayName ? this.agentAssistResp.entityDisplayName : this.agentAssistResp.entityName;
    };
      smallTalkData.agentInputEntityName = agentInputEntityName;
  }


  smallTalkTemplateRenderCheck(data,result){
    if(result.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))){
      return true;
    }
    return false;
  }

  toggleOverrideMode(eventName){
    this.smallTalkData.toggleOverride = !this.smallTalkData.toggleOverride;
    this.handleOverridBtnClick(this.smallTalkData.connectionDetails, this.smallTalkData.dialogId, this.smallTalkData.toggleOverride);
  }


handleOverridBtnClick(connectionDetails, dialogId, toggleOverride) {
  let overRideObj: any = {
    "agentId": "",
    "botId": connectionDetails.botId,
    "conversationId": connectionDetails.conversationId,
    "query": "",
    "enable_override_userinput": toggleOverride,
    'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
    "positionId": dialogId
  }
 
  this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj);
  this.commonService.OverRideMode = toggleOverride;
}

handleAgentInput(event){
  this.smallTalkData.hideOverrideDiv = true;
  this.AgentAssist_run_click(event.target.value);
}

AgentAssist_run_click(inputValue) {
  let connectionDetails = Object.assign({}, this.smallTalkData.connectionDetails);
  connectionDetails.value = inputValue;
  connectionDetails.positionId = this.smallTalkData.dialogId;
  connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
  connectionDetails.childBotId = this.smallTalkData.data.childBotId;
  connectionDetails.childBotName = this.smallTalkData.data.childBotName;
  let assistRequestParams = this.commonService.prepareAgentAssistRequestParams(connectionDetails);
  this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
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
