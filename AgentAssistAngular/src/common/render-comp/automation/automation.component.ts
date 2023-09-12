import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import * as $ from 'jquery';
import { IdReferenceConst, ImageFileNames, ImageFilePath, ProjConstants, RenderResponseType } from 'src/common/constants/proj.cnts';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { EVENTS } from 'src/common/helper/events';
import { CommonService } from 'src/common/services/common.service';
import { DesignAlterService } from 'src/common/services/design-alter.service';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {
 @Input() automationData : any;
 @Input() agentassistArrayIndex : number;
 @Input() agentassistResponseArrayLength : number;
 @Output() scrollBottom = new EventEmitter();
 @Output() handlePopupEvent = new EventEmitter();

 idReferenceConst : any = IdReferenceConst;
 renderResponseType : any = RenderResponseType;
 imageFileNames: any = ImageFileNames;
 imageFilePath: string = ImageFilePath;
 projConstants : any = ProjConstants;
 showAutomation : boolean = true;

 constructor(private templateRenderClassService : TemplateRenderClassService,
  private websocketService : WebSocketService,
  private commonService : CommonService,
  private designAlterService : DesignAlterService,
  private randomUUIDPipe : RandomUUIDPipe,
  private cdRef : ChangeDetectorRef){

 }

 ngOnInit(){
  
 }

 ngOnChanges(changes : any){
  console.log(changes, 'change **************88', this.automationData, this.agentassistArrayIndex, this.agentassistResponseArrayLength);
  if(this.automationData && changes?.automationData?.currentValue && changes.automationData.currentValue?.automationsArray){
    this.automationData = changes.automationData.currentValue;
    this.toggleAutomation(this.automationData.showAutomation);
    this.formatAssistAutomation(changes.automationData.currentValue.automationsArray);
   }
 }

 formatAssistAutomation(automationsArray){
  let i = 0;
  for(let automation of automationsArray){
    let templateRender = (!automation?.result?.parsedPayload || automation?.noTemplateRender || (automation?.componentType == 'dialogAct' && (automation?.srcChannel != 'msteams' && automation?.srcChannel != 'rtm'))) ? false : true
    automation.templateRender = templateRender;
    
    if(automation?.result?.parsedPayload && automation?.templateRender){
      automation.template = this.commonService.getTemplateHtml(automation.templateRender, automation.result);
    }
    automation.agentInputId = this.randomUUIDPipe.transform();
    automation.agentInputEntityName = 'Enter Details';
    automation.showOverrideDiv = automation.hideOverrideDiv ? false : ((automation.data.isPrompt && automation.proactiveModeStatus ? true : false));
    automation.stepRunId = 'stepsRunData-' + automation.uuid + i;
    
    this.updateSendCopyParams(automation);
    if (automation.data.newEntityDisplayName || automation.data.newEntityName) {
      automation.agentInputEntityName = automation.data.newEntityDisplayName ? automation.data.newEntityDisplayName : automation.data.newEntityName;
    } else if (automation.data.entityDisplayName || automation.data.entityName) {
      automation.agentInputEntityName = automation.data.entityDisplayName ? automation.data.entityDisplayName : automation.data.entityName;
    }
    i++;

  }
  setTimeout(() => {
    this.scrollBottom.emit(true);
  }, 100);
 }

 updateSendCopyParams(automation){
  automation.showSend = (this.commonService.isCallConversation || ((!automation.connectionDetails.source || automation.connectionDetails.source !== ProjConstants.SMARTASSIST_SOURCE) && automation.template)) ? false : true; 
  automation.showCopy = (this.commonService.isCallConversation) ? false : ((!automation.template && automation.data?.componentType != 'dialogAct') ? true : false);
  automation.sendData = automation.result?.parsedPayload ? automation.temp : ((automation.data?.buttons && automation.data?.buttons[0]?.value) ? automation.data?.buttons[0]?.value : null);
 }

toggleOverrideMode(automation,eventName, dialogId){
  automation.toggleOverride = !automation.toggleOverride;
  this.handleOverridBtnClick(automation.uuid, automation.connectionDetails, dialogId, automation.toggleOverride);
}

handleOverridBtnClick(uuid, connectionDetails, dialogId, toggleOverride) {
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

handleAgentInput(event, automation){
  automation.hideOverrideDiv = true;
  if(this.commonService.activeTab == ProjConstants.ASSIST){
    this.AgentAssist_run_click(automation, event.target.value);
  }else{
    this.getAgentInputValue(automation,event.target.value);
  }
}

getAgentInputValue(automation,value) {
  if (value) {
    this.commonService.isMybotInputResponseClick = true;
    let connectionDetails: any = Object.assign({}, automation.connectionDetails);
    connectionDetails.value = value;
    connectionDetails.isSearch = false;
    connectionDetails.positionId = this.automationData.dialogId;
    let agent_assist_agent_request_params = this.commonService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
  }
}

AgentAssist_run_click(automation, inputValue) {
  let connectionDetails = Object.assign({}, automation.connectionDetails);
  connectionDetails.value = inputValue;
  
  connectionDetails.positionId = this.automationData.dialogId;
  connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
  connectionDetails.childBotId = automation.data.childBotId;
  connectionDetails.childBotName = automation.data.childBotName;  
  let assistRequestParams = this.commonService.prepareAgentAssistRequestParams(connectionDetails);  
  this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
}

terminateButtonClick(){
  if(this.automationData?.automationsArray[this.automationData?.automationsArray?.length-1] && this.automationData?.automationsArray[this.automationData?.automationsArray?.length-1]?.data?.isPrompt){
    this.automationData.automationsArray[this.automationData.automationsArray.length-1].toggleOverride = false;
    this.automationData.automationsArray[this.automationData.automationsArray.length-1].hideOverrideDiv = true;
  }
  this.handlePopupEvent.emit(true);
}

handleSendCopyButton(actionType, sendData) {
  let message = {};
  if (actionType == ProjConstants.SEND) {
    message = {
      method: 'send',
      name: IdReferenceConst.SENDMSG_REQUEST,
      conversationId: this.automationData.connectionDetails.conversationId,
      payload: sendData
    };
    window.parent.postMessage(message, '*');
  } else {
    message = {
      method: 'copy',
      name: IdReferenceConst.COPYMSG_REQUEST,
      conversationId: this.automationData.connectionDetails.conversationId,
      payload: sendData
    };
    parent.postMessage(message, '*');
  }
}

toggleAutomation(value){
  this.automationData.showAutomation = value;
  this.showAutomation = this.automationData.showAutomation;
}


}
