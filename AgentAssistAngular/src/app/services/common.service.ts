import { Injectable } from '@angular/core';
import { EVENTS } from '../helpers/events';
import { KoreGenerateuuidPipe } from '../pipes/kore-generateuuid.pipe';
import { RandomUuidPipe } from '../pipes/random-uuid.pipe';
import { ProjConstants, RenderResponseType, storageConst } from '../proj.const';
import { HandleSubjectService } from './handle-subject.service';
import { LocalStorageService } from './local-storage.service';
import { RootService } from './root.service';
import { ServiceInvokerService } from './service-invoker.service';
import { TemplateRenderClassService } from './template-render-class.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  renderResponseType: any = RenderResponseType;
  projConstants: any = ProjConstants

  constructor(private rootService: RootService, private randomUUIDPipe: RandomUuidPipe,
    private handleSubjectService: HandleSubjectService, private localStorageService: LocalStorageService,
    private koreGenerateuuidPipe: KoreGenerateuuidPipe, private templateRenderClassService: TemplateRenderClassService,
    private serviceInvoker: ServiceInvokerService, private websocketService: WebSocketService) { }

  assistHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.assistHistorySA' : 'get.assistHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { historyAPiCall: 'true', botId: botId }, params.agentassisturl);
  }

  assistFeedback(params) {
    return this.serviceInvoker.invoke('get.assistFeedback', { tab: 'assist', conversationId: params.conversationId }, {}, { botId: params.botId }, params.agentassisturl);
  }

  mybotHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.mybotHistorySA' : 'get.mybotHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { historyAPiCall: 'true', botId: botId }, params.agentassisturl)
  }

  mybotFeedback(params) {
    return this.serviceInvoker.invoke('get.mybotFeedback', { tab: 'mybot', conversationId: params.conversationId }, {}, { botId: params.botId }, params.agentassisturl);
  }

  //dialogue click and agent response handling code.
  AgentAssist_run_click(dialog, dialogPositionId, intent?) {
    this.assistTabDialogforDashboard(dialog, intent);
    let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
    connectionDetails.value = dialog.intentName;
    if (dialog.intentName && intent) {
      connectionDetails.intentName = dialog.intentName;
    }
    connectionDetails.positionId = dialogPositionId;
    // connectionDetails.entities = this.rootService.isRestore ? JSON.parse(this.rootService.previousEntitiesValue) : this.rootService.entitiestValueArray
    connectionDetails.entities = this.rootService.entitiestValueArray
    connectionDetails.childBotId = dialog.childBotId;
    connectionDetails.childBotName = dialog.childBotName;
    if (dialog.userInput) {
      connectionDetails.userInput = dialog.userInput;
    }
    let assistRequestParams = this.rootService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
    this.rootService.entitiestValueArray = [];
  }

  assistTabDialogforDashboard(dialog, intent?) {
    let payloadForBE: any = Object.assign({}, this.rootService.connectionDetails);
    if (dialog.intentName && intent) {
      payloadForBE.intentName = dialog.intentName;
      payloadForBE.title = dialog.intentName;
    }
    payloadForBE.type = 'dialog';
    payloadForBE.input = dialog.userInput;
    payloadForBE.sessionId = this.rootService.assistTabSessionId;
    this.websocketService.emitEvents(EVENTS.agent_send_or_copy, payloadForBE)
  }

  mybot_run_click(dialog, myBotDialogPositionId, intent?) {
    if (dialog) {
      // this.dialogName = dialog.intentName;
      let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
      connectionDetails.value = dialog.intentName;
      connectionDetails.isSearch = false;
      connectionDetails.positionId = myBotDialogPositionId;
      connectionDetails.childBotName = this.rootService?.childBotDetails.childBotName;
      connectionDetails.childBotId = this.rootService?.childBotDetails.childBotId;
      if (this.rootService.connectionDetails?.interactiveLanguage && typeof this.rootService.connectionDetails?.interactiveLanguage == 'string' && this.rootService.connectionDetails?.interactiveLanguage != "''") {
        connectionDetails['language'] = this.rootService.connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
      }
      if (intent) {
        connectionDetails.intentName = dialog.intentName;
        connectionDetails.childBotName = this.rootService.childBotDetails.childBotName;
        connectionDetails.childBotId = this.rootService.childBotDetails.childBotId;
      }
      let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
      this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    }
  }


  updateLocalStorageForAssist(flag, isInitialDialogOnGoing?) {
    let storageObject: any = {};
    this.rootService.isAutomationOnGoing = flag;
    if (isInitialDialogOnGoing) {
      this.rootService.isInitialDialogOnGoing = true;
    }
    storageObject = {
      [storageConst.INITIALTASK_GOING_ON]: this.rootService.isInitialDialogOnGoing,
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.rootService.isAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
  }

  updateLocalStorageForMyBot(flag) {
    let storageObject: any = {};
    this.rootService.isMyBotAutomationOnGoing = flag;
    storageObject = {
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT]: this.rootService.isMyBotAutomationOnGoing
    }
  }


  prepareFeedbackData(assistResponseArray, automation, feedbackData?) {
    let type = assistResponseArray[assistResponseArray.length - 1]?.type;
    if (type == this.renderResponseType.AUTOMATION) {
      this.rootService.manualAssistOverrideMode = false;
      let renderResponse: any = {
        type: this.renderResponseType.FEEDBACK,
        uuid: automation.dropdownHeaderUuids,
        connectionDetails: this.rootService.connectionDetails,
        dialogName: automation.dialogName,
        dialogPositionId: automation.dialogPositionId,
        submitForm: feedbackData?.feedback ? true : false,
        feedback: feedbackData?.feedback ? feedbackData.feedback : '',
        feedbackDetails: feedbackData?.feedbackDetails?.length ? feedbackData.feedbackDetails : [],
        comment: feedbackData?.comment ? feedbackData?.comment : ''
      }
      assistResponseArray.push(renderResponse);
    }
    return assistResponseArray
  }

  dialogueRunClick(dialog, index, agentRun) {
    dialog.positionId = this.randomUUIDPipe.transform('positionId');
    dialog.intentName = dialog.name;
    dialog.userInput = dialog.name;
    dialog.agentRunButton = agentRun;
    dialog.from = this.projConstants.INTERRUPT;
    dialog.index = index
    this.handleSubjectService.setRunButtonClickEvent(dialog);
  }

  restartDialogueRunClick(dialogName, agentRun){
    let dialog : any = {};
    dialog.positionId = this.randomUUIDPipe.transform('positionId');
    dialog.intentName = dialogName;
    dialog.userInput = dialogName;
    dialog.agentRunButton = agentRun
    this.handleSubjectService.setRunButtonClickEvent(dialog);  
  }


  automationFlagUpdateForAssist(previousId, flag) {
    if (this.localStorageService.checkStorageItemWithInConvId(this.rootService.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
      this.rootService.isAutomationOnGoing = flag;
      this.rootService.dropdownHeaderUuids = previousId;
      let storageObject: any = {
        [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.rootService.isAutomationOnGoing
      }
      this.localStorageService.setLocalStorageItem(storageObject);
    }
  }

  automationFlagUpdateForMybot(previousId, flag) {
    if (this.localStorageService.checkStorageItemWithInConvId(this.rootService.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT)) {
      this.rootService.isMyBotAutomationOnGoing = flag;
      this.rootService.myBotDropdownHeaderUuids = previousId;
      let storageObject: any = {
        [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT]: this.rootService.isMyBotAutomationOnGoing
      }
      this.localStorageService.setLocalStorageItem(storageObject);
    }
  }

  updateInterruptDialogList(interruptDialogList, tab) {
    let storageKey = (tab == ProjConstants.ASSIST) ? storageConst.INTERRUPT_DIALOG_LIST : storageConst.MYBOT_INTERRUPT_DIALOG_LIST;
    let storageObject: any = {
      [storageKey] : interruptDialogList
    }
    this.localStorageService.setLocalStorageItem(storageObject);
  }

  updateSearchResponse(assistResponseArray,response, faqAnswerIdsPlace) {
    response.suggestions.faqs = this.rootService.formatFAQResponse(response.suggestions.faqs);
    let index = this.rootService.suggestionsAnswerPlaceableIDs.findIndex(suggestion => {
      return suggestion.input == faqAnswerIdsPlace.input
    });

    let accumulator = response.suggestions.faqs.reduce((acc, faq) => {
      if (faq.question == faqAnswerIdsPlace.input) {
        acc[faq.question] = faq;
        return acc;
      }
    }, {});

    if (index >= 0) {
      this.rootService.suggestionsAnswerPlaceableIDs.splice(index, 1);
      assistResponseArray[faqAnswerIdsPlace.assistSuggestion].searchResponse.faqs?.forEach(faq => {
        if (accumulator[faq.question] && accumulator[faq.question].answer) {
          faq.answer = accumulator[faq.question].answer;
          faq.toggle = true;
          faq.showMoreButton = false,
            faq.showLessButton = false
        }
      });
     assistResponseArray[faqAnswerIdsPlace.assistSuggestion].faqArrowClickResponse = true;
    }
    return assistResponseArray;
  }

  //suggestions RenderResponse

  formatSuggestionRenderResponse(data, responseId) {
    let renderResponse = {
      data: data,
      type: this.renderResponseType.SUGGESTIONS,
      uuid: responseId,
      searchResponse: this.rootService.formatSearchResponse(data),
      connectionDetails: this.rootService.connectionDetails
    }
    return renderResponse;
  }

  formatDialogRunRenderResponse(res, responseId, dialogId, dialogName) {
    let renderResponse = {
      data: res,
      type: this.renderResponseType.AUTOMATION,
      uuid: responseId,
      dialogId: dialogId,
      dialogName: dialogName,
      connectionDetails: this.rootService.connectionDetails,
      showAutomation: true
    }
    return renderResponse;
  }

  formatAutomationRenderResponse(data, responseId, result, newTemp) {
    let renderResponse = {
      data: data,
      type: this.renderResponseType.AUTOMATION,
      uuid: responseId,
      result: result,
      temp: newTemp,
      connectionDetails: this.rootService.connectionDetails,
      toggleOverride: false,
      responseType: this.renderResponseType.ASSISTRESPONSE,
      errorCount: 0,
      value: data?.buttons[0]?.value
    }
    return renderResponse;
  }

  formatSmallTalkRenderResponse(data, responseId, result, newTemp, dialogPositionId?) {
    let renderResponse: any = {
      data: data,
      type: this.renderResponseType.SMALLTALK,
      uuid: responseId,
      result: result,
      temp: newTemp,
      connectionDetails: this.rootService.connectionDetails,
      toggleOverride: false,
      title: data.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
      templateRender: this.smallTalkTemplateRenderCheck(data, result),
      value: data?.buttons[0]?.value,
      sendData: result?.parsedPayload ? newTemp : data?.buttons[0]?.value,
      dialogId: dialogPositionId,
      responseType: this.renderResponseType.ASSISTRESPONSE
    }
    renderResponse.template = this.rootService.getTemplateHtml(renderResponse.templateRender, result);
    return renderResponse;
  }

  smallTalkTemplateRenderCheck(data, result) {
    if (result.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))) {
      return true;
    }
    return false;
  }

  formatRunningLastAutomationEntityNode(assistResponseArray, data, showErrorPrompt, renderResponse, dropdownHeaderUuids, tab) {
    assistResponseArray.map(arrEle => {
      if (arrEle.uuid && arrEle.uuid == dropdownHeaderUuids) {
        arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
        if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = (tab == this.projConstants.MYBOT) ? false : this.rootService.manualAssistOverrideMode;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].disableInput = (data.isErrorPrompt || showErrorPrompt) ? false : true;
          if(tab == this.projConstants.MYBOT && data.userInput){
            arrEle.automationsArray[arrEle.automationsArray.length - 1].entityValue = data.userInput;
          }
          if (data.isErrorPrompt || showErrorPrompt) {
            arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = false;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].errorCount += 1;
          } else {
            arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
          }
        } else {
          arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
        }
      }
    });
    console.log(assistResponseArray, "assist response arry *******", data);
    
    return assistResponseArray;
  }

  formatRunningLastSmallTalkEntityNode(assistResponseArray, renderResponse) {
    if (assistResponseArray?.length > 1 && assistResponseArray[assistResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
      && assistResponseArray[assistResponseArray.length - 1]?.data?.isPrompt) {
      assistResponseArray = this.formatAssistResponseAutomationArray(assistResponseArray, this.rootService.dropdownHeaderUuids, true, true, false);
    }
    assistResponseArray.push(renderResponse);
    return assistResponseArray;
  }

  updateOverrideStatusOfAutomation(assistResponseArray, previousId, renderResponse?) {
    assistResponseArray = this.formatAssistResponseAutomationArray(assistResponseArray, previousId, true, true, false, renderResponse)
    return assistResponseArray;
  }

  removeOrAddOverRideDivForPreviousResponse(assistResponseArray, flag) {
    if (flag) {
      if (assistResponseArray?.length > 1 && assistResponseArray[assistResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
        && assistResponseArray[assistResponseArray.length - 1]?.data?.isPrompt) {
        assistResponseArray = this.formatAssistResponseSmallTalk(assistResponseArray, true, true, false);
      } else if (assistResponseArray?.length > 1) {
        assistResponseArray = this.formatAssistResponseAutomationArray(assistResponseArray, this.rootService.dropdownHeaderUuids, true, false, true);
      }
    } else {
      assistResponseArray = this.formatAssistResponseAutomationArray(assistResponseArray, this.rootService.dropdownHeaderUuids, false, false, false)
    }
    return assistResponseArray;
  }

  formatAssistResponseAutomationArray(assistResponseArray, uuids, hideOverrideDiv, disableInput, toggleOverride, renderResponse?) {
    assistResponseArray.map(arrEle => {
      if (arrEle.uuid && arrEle.uuid == uuids && arrEle.type == this.renderResponseType.AUTOMATION) {
        arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
        if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = hideOverrideDiv;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].disableInput = disableInput;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = toggleOverride;
        }
        if (renderResponse) {
          arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
        }
        arrEle.automationsArray = [...arrEle.automationsArray];
      }
    });
    return assistResponseArray;
  }

  formatAssistResponseSmallTalk(assistResponseArray, hideOverrideDiv, disableInput, toggleOverride) {
    assistResponseArray[assistResponseArray.length - 1].toggleOverride = toggleOverride;
    assistResponseArray[assistResponseArray.length - 1].hideOverrideDiv = hideOverrideDiv;
    assistResponseArray[assistResponseArray.length - 1].disableInput = disableInput;
    return assistResponseArray;
  }

  processUserMessagesForSmalltalk(data, assistResponseArray, hideOverrideDiv, toggleOverride, history?){    
    if (data.userInput) {          
      assistResponseArray[assistResponseArray.length - 1].entityValue = data.userInput;
      assistResponseArray[assistResponseArray.length - 1].hideOverrideDiv = hideOverrideDiv;
      assistResponseArray[assistResponseArray.length - 1].toggleOverride = toggleOverride;
      assistResponseArray[assistResponseArray.length - 1].userInput = data.userInput && (!history) ? data.userInput : ProjConstants.YES;
    }
    return assistResponseArray
  }

  processUserMessagesForAutomation(data, assistResponseArray, hideOverrideDiv, toggleOverride, showErrorPrompt,dropdownHeaderUuids){
    assistResponseArray.map(arrEle => {
      if (arrEle.uuid && arrEle.uuid == dropdownHeaderUuids) {
        arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
        if (data.userInput && arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = hideOverrideDiv;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = toggleOverride;
          if (data.userInput) {
            let userInput = arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].entityValue = data.userInput;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput = userInput ? userInput : ProjConstants.YES;
          }
          if(!showErrorPrompt){
            arrEle.automationsArray[arrEle.automationsArray.length - 1].errorCount = 0;
          }
        }
        arrEle.automationsArray = [...arrEle.automationsArray];
      }
    });
    return assistResponseArray;
  }

  processLastEntityNodeForHistory(responseArray){
    if (responseArray.length >=1) {
      responseArray.map((arrEle, actualarrayIndex) => {        
        if (arrEle?.uuid && arrEle?.automationsArray?.length) {
            arrEle?.automationsArray.forEach((element, index) => {
              if((index !== arrEle.automationsArray.length - 1) || (actualarrayIndex > 0 && actualarrayIndex != responseArray.length -1)){
                element.disableInput = true;
              }
            });
          arrEle.automationsArray = [...arrEle.automationsArray];
        }else if(arrEle?.type == this.renderResponseType.SMALLTALK && actualarrayIndex != responseArray.length -1){
          arrEle.disableInput = true;
        }
      });
    }  
    return responseArray;  
  }

}
