import { Component, Input, OnInit } from '@angular/core';
import { EVENTS } from '../helpers/events';
import { ProjConstants, RenderResponseType } from '../proj.const';
import { RootService } from '../services/root.service';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-ask-customer',
  templateUrl: './ask-customer.component.html',
  styleUrls: ['./ask-customer.component.scss']
})
export class AskCustomerComponent{

    @Input() automation : any;
    @Input() isWelcomeMsg;

    projConstants : any = ProjConstants;
    renderResponseType : any = RenderResponseType;
    inputName : string = ProjConstants.AWAITING;

    constructor(private rootService : RootService, private websocketService : WebSocketService){

    }


    ngOnChanges(){
      if(this.automation?.toggleOverride){
        this.inputName = this.projConstants.OVERRIDE;
      }
      console.log(this.automation, "automation");
    }

    confirmOverride(){
      if(!this.automation.toggleOverride){
        this.inputName = this.projConstants.OVERRIDE;
        this.automation.toggleOverride = true;
        if(!this.rootService.OverRideMode){
          this.rootService.OverRideMode = true;
          this.handleOverridBtnClick(this.automation.connectionDetails, this.automation.dialogId, this.automation.toggleOverride);
        }
      }
    }

    cancelOverride(){
      this.inputName = this.projConstants.AWAITING;
      this.automation.toggleOverride = false;
      this.rootService.OverRideMode = false;
      this.automation.entityValue = '';
      this.handleOverridBtnClick(this.automation.connectionDetails, this.automation.dialogId, this.automation.toggleOverride);
    }

    handleOverridBtnClick(connectionDetails, dialogId, toggleOverride) {
      let overRideObj: any = {
        "agentId": "",
        "botId": connectionDetails.botId,
        "conversationId": connectionDetails.conversationId,
        "query": "",
        "enable_override_userinput": toggleOverride,
        'experience': this.rootService.connectionDetails.isCallConversation === true ? 'voice' : 'chat',
        "positionId": dialogId
      }
      this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj);
      this.rootService.OverRideMode = toggleOverride;
    }

    handleAgentInput(){
      this.automation.hideOverrideDiv = true;
      this.automation.userInput = this.projConstants.NO;
      this.AgentAssist_run_click(this.automation.entityValue);
    }
    
    AgentAssist_run_click(inputValue) {
      let connectionDetails = Object.assign({}, this.automation.connectionDetails);
      connectionDetails.value = inputValue;
      connectionDetails.positionId = this.automation.dialogId;
      // connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
      connectionDetails.childBotId = this.automation.data.childBotId;
      connectionDetails.childBotName = this.automation.data.childBotName;
      let assistRequestParams = this.rootService.prepareAgentAssistRequestParams(connectionDetails);
      this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
    }

    handleSendCopyButton(method,automation){
      let sendData = this.isWelcomeMsg ? automation.value : automation.sendData;
      this.rootService.handleSendCopyButtonForNodes(method,sendData);
    }
   
}
