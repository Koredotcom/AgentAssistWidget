import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { EVENTS } from '../helpers/events';
import { ProjConstants, RenderResponseType } from '../proj.const';
import { CommonService } from '../services/common.service';
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
  @Input() automationArrayLength;
  @Input() automationIndex;
  @Input() responseArray;
  @Input() responseArrayIndex;
  @Input() assistAutomationData;

  subs = new SubSink();

  projConstants: any = ProjConstants;
  renderResponseType: any = RenderResponseType;
  inputName: string = this.translateService.instant("AWAITING");

  constructor(public rootService: RootService, private websocketService: WebSocketService, private translateService : TranslateService,
    private commonService : CommonService) {

  }

  ngOnInit(){
    this.subscribeEvents();
    this.hideSendAndCopy();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.assistTemplateClick$.subscribe(val => {
      if(val){
        this.automation.hideOverrideDiv = true;
        this.automation.userInput = this.projConstants.NO;
        this.grayOutCurrentAutomation();
        this.spinnerUpdate();
      }
    })

    this.subs.sink = this.rootService.mybotTemplateClick$.subscribe(val => {
      if(val){
        this.automation.hideOverrideDiv = true;
        this.automation.userInput = this.projConstants.NO;
        this.grayOutCurrentAutomation();
        this.spinnerUpdate();
      }
    })
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes?.automation?.currentValue?.toggleOverride) {
      this.inputName = this.translateService.instant("OVERRIDE");
    }
  }

  hideSendAndCopy(){
    // Both send and copy
    this.automation.hideActionButtons = ((this.automation.connectionDetails.isCallConversation) ||
       (this.automation.templateRender && this.automation.template && this.automation.connectionDetails.source != this.projConstants.SMARTASSIST_SOURCE)) ? true : false;

    // only copy button
    if(!this.rootService.settingsData?.isAgentResponseCopyEnabled || (this.automation.templateRender && this.automation.template && this.automation.connectionDetails.source == this.projConstants.SMARTASSIST_SOURCE)){
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
    this.grayOutCurrentAutomation();
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
    this.spinnerUpdate();
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
    this.spinnerUpdate();
  }

  handleSendCopyButton(method, automation) {
    automation.send = true;
    let sendData = automation.sendData;
    this.commonService.handleSendCopyButtonForNodes(method, sendData, this.automation.dialogId);
    this.responseArray = this.commonService.grayOutPreviousAutomation(this.responseArray, this.automationIndex, this.responseArrayIndex);
    this.responseArray = structuredClone(this.responseArray);
  }

  grayOutCurrentAutomation(){
    this.automation.grayOut = true;
  }

  spinnerUpdate(){
    this.automation.showSpinner = true;
    setTimeout(() => {
      if(this.automation.showSpinner){
        this.automation.showSpinner = false;
        this.automation.grayOut = false;
        this.automation.disableInput = false;
      }
    }, 10000);
  }
}
