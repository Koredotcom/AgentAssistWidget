import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EVENTS } from '../helpers/events';
import { ProjConstants, RenderResponseType } from '../proj.const';
import { RootService } from '../services/root.service';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-ask-customer',
  templateUrl: './ask-customer.component.html',
  styleUrls: ['./ask-customer.component.scss']
})
export class AskCustomerComponent {

  @Input() automation: any;
  @Input() listView : boolean;

  projConstants: any = ProjConstants;
  renderResponseType: any = RenderResponseType;
  inputName: string = this.translateService.instant("AWAITING");

  constructor(public rootService: RootService, private websocketService: WebSocketService, private translateService : TranslateService) {

  }


  ngOnChanges() {
    if (this.automation?.toggleOverride) {
      this.inputName = this.translateService.instant("OVERRIDE");
    }
    this.hideSendAndCopy();
  }

  hideSendAndCopy(){
    // Both send and copy
    this.automation.hideActionButtons = ((this.automation.connectionDetails.isCallConversation) ||
       (this.automation.templateRender && this.automation.template && this.automation.connectionDetails.source != this.projConstants.SMARTASSIST_SOURCE)) ? true : false;

    // only copy button
    if(this.automation.templateRender && this.automation.template && this.automation.connectionDetails.source == this.projConstants.SMARTASSIST_SOURCE){
      this.automation.hideCopyButton = true; 
    }

    if(!this.rootService.settingsData?.isAgentResponseEnabled){
      this.automation.hideSendButton = true;
    }

    if(this.automation.hideSendButton && this.automation.hideCopyButton){
      this.automation.hideActionButtons = true;
    }    
  }

  confirmOverride() {
    if (!this.automation.toggleOverride && this.rootService.activeTab != this.projConstants.MYBOT) {
      this.inputName = this.translateService.instant("OVERRIDE");
      this.automation.toggleOverride = true;
      if (!this.rootService.OverRideMode) {
        this.handleOverridBtnClick(this.automation.connectionDetails, this.automation.dialogId, this.automation.toggleOverride);
      }
    }
  }

  cancelOverride() {
    if (this.rootService.activeTab != this.projConstants.MYBOT) {
      this.inputName = this.translateService.instant("AWAITING");
      this.automation.toggleOverride = false;
      this.automation.entityValue = '';
      if(this.rootService.OverRideMode && this.rootService.proactiveModeStatus && !this.rootService.manualAssistOverrideMode){
        this.handleOverridBtnClick(this.automation.connectionDetails, this.automation.dialogId, this.automation.toggleOverride);
      }
    }
  }

  handleOverridBtnClick(connectionDetails, dialogId, toggleOverride) {
    this.websocketService.handleOverrideMode(toggleOverride, dialogId);
  }

  handleAgentInput() {
    this.automation.hideOverrideDiv = true;
    this.automation.userInput = this.projConstants.NO;
    if (this.rootService.activeTab == this.projConstants.ASSIST) {
      this.assistInputValue(this.automation.entityValue);
    } else if (this.rootService.activeTab == this.projConstants.MYBOT) {
      this.mybotInputValue(this.automation.entityValue)
    }
  }

  assistInputValue(inputValue) {
    let connectionDetails = Object.assign({}, this.automation.connectionDetails);
    connectionDetails.value = inputValue;
    connectionDetails.positionId = this.automation.dialogId;
    // connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
    connectionDetails.childBotId = this.automation.data.childBotId;
    connectionDetails.childBotName = this.automation.data.childBotName;
    let assistRequestParams = this.rootService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
    this.automation.showSpinner = true;
  }

  mybotInputValue(inputValue) {
    let connectionDetails: any = Object.assign({}, this.automation.connectionDetails);
    connectionDetails.value = inputValue;
    connectionDetails.isSearch = false;
    connectionDetails.positionId = this.automation.dialogId;
    connectionDetails.childBotName = this.rootService?.childBotDetails.childBotName;
    connectionDetails.childBotId = this.rootService?.childBotDetails.childBotId;
    let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    this.automation.showSpinner = true;
  }

  handleSendCopyButton(method, automation) {
    automation.send = true;
    let sendData = automation.sendData;
    this.rootService.handleSendCopyButtonForNodes(method, sendData);
  }


}
