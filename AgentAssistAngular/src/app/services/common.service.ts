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
import { EChartsOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  renderResponseType: any = RenderResponseType;
  projConstants: any = ProjConstants;
  realtimeSentiData : any = {};

  constructor(private rootService: RootService, private randomUUIDPipe: RandomUuidPipe,
    private handleSubjectService: HandleSubjectService, private localStorageService: LocalStorageService,
    private koreGenerateuuidPipe: KoreGenerateuuidPipe, private templateRenderClassService: TemplateRenderClassService,
    private serviceInvoker: ServiceInvokerService, private websocketService: WebSocketService) { }

  prepareChecklistPayload(connectionDetails, event,checkListData, checklistObj, step = false){
    let payload : any = {
      "payload": {
          "event": event,
          "conversationId": connectionDetails.conversationId,
          "ccVersion": checkListData?.ccVersion,
          "accountId": checkListData?.accountId,
          "botId": (connectionDetails?.fromSAT) ?  connectionDetails?.instanceBotId : connectionDetails?.botId,
          "agentInfo": {
              "agentId": "", // mendatory field
              //any other fields
          },
          "timestamp": 0,
          "context": {}
      }
    }

    if(step){
      payload.payload.checklistStep = checklistObj
    }else{
      payload.payload.checklist = checklistObj
    }
    return payload
  }

  assistHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.assistHistorySA' : 'get.assistHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { excludeAccountId: 'true' }, params.agentassisturl);
  }

  assistFeedback(params) {
    return this.serviceInvoker.invoke('get.assistFeedback', { tab: 'assist', conversationId: params.conversationId }, {}, { }, params.agentassisturl);
  }

  mybotHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.mybotHistorySA' : 'get.mybotHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { excludeAccountId: 'true' }, params.agentassisturl)
  }

  mybotFeedback(params) {
    return this.serviceInvoker.invoke('get.mybotFeedback', { tab: 'mybot', conversationId: params.conversationId }, {}, { }, params.agentassisturl);
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
    connectionDetails.sourceMsgId = dialog.sourceMsgId || '';

    if(dialog.taskRefId){
      connectionDetails.taskRefId = dialog.taskRefId
    }
    if(dialog.dialogId){
      connectionDetails.dialogId = dialog.dialogId
    }
    if (dialog.userInput) {
      connectionDetails.userInput = dialog.userInput;
    }
    if (dialog.traits && dialog.traits?.length > 0){
      connectionDetails.traits = dialog.traits
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
    payloadForBE = this.rootService.addSourceMsgIdToRequestParams(dialog,payloadForBE);
    this.websocketService.emitEvents(EVENTS.agent_send_or_copy, payloadForBE)
  }

  handleSendCopyButtonForNodes(actionType, sendData, automation) {
    let message = {};
    if (actionType == ProjConstants.SEND) {
      message = {
        method: 'send',
        name: ProjConstants.SENDMSG,
        conversationId: this.rootService.connectionDetails.conversationId,
        payload: sendData
      };
      window.parent.postMessage(message, '*');
    } else {
      message = {
        method: 'copy',
        name: ProjConstants.COPYMSG,
        conversationId: this.rootService.connectionDetails.conversationId,
        payload: sendData
      };
      parent.postMessage(message, '*');
    }
    this.messageNodeSendorCopyEvent(actionType,sendData, automation)
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType) {
    let message = {};
    if (actionType == this.projConstants.SEND) {
      message = {
        method: 'send',
        name: ProjConstants.SENDMSG,
        conversationId: this.rootService.connectionDetails.conversationId,
        payload: selectType == this.projConstants.FAQ ? (faq_or_article_obj.answer || faq_or_article_obj.ans) : faq_or_article_obj.content
      };
      if(selectType === this.projConstants.ARTICLE) {
        message['title'] = faq_or_article_obj.title;
        message['contentId'] = faq_or_article_obj.contentId;
      } else {
        message['title'] = faq_or_article_obj.displayName;
        message['contentId'] = faq_or_article_obj.taskRefId
      }
    } else {
      message = {
        method: 'copy',
        name: ProjConstants.COPYMSG,
        conversationId: this.rootService.connectionDetails.conversationId,
        payload: selectType == this.projConstants.FAQ ? (faq_or_article_obj.answer || faq_or_article_obj.ans) : faq_or_article_obj.content
      };
      if(selectType === this.projConstants.ARTICLE) {
        message['title'] = faq_or_article_obj.title;
        message['contentId'] = faq_or_article_obj.contentId;
      } else {
        message['title'] = faq_or_article_obj.displayName;
        message['contentId'] = faq_or_article_obj.taskRefId
      }
    }
    message['type'] = (selectType == this.projConstants.FAQ) ? 'faq' : 'article'
    window.parent.postMessage(message, '*');
    this.faqArticleSendorCopyEvent(selectType, message, faq_or_article_obj)
  }

  messageNodeSendorCopyEvent(eventName, payload, automation){
    let positionId = automation?.dialogId;
    let payloadForBE : any = {
      usedType: (eventName == this.projConstants.SEND) ? this.projConstants.SEND_METHOD : this.projConstants.COPY_METHOD,
      name: (eventName == this.projConstants.SENDMSG) ? this.projConstants.SENDMSG : this.projConstants.COPYMSG,
      conversationId: this.rootService.connectionDetails.conversationId,
      payload: payload,
      botId: this.rootService.connectionDetails.botId,
      positionId: positionId,
      type: 'sentence',
      sessionId: (this.rootService.activeTab == this.projConstants.MYBOT) ? this.rootService.myBotTabSessionId : this.rootService.assistTabSessionId,
    };
    if(automation?.data?.isPrompt && automation?.data?.componentType){
      payloadForBE.componentType = automation.data.componentType;
    }else if(!automation?.data?.isPrompt){
      payloadForBE.partialMessage = true;
    }
    payloadForBE = this.rootService.addSourceMsgIdToRequestParams(automation,payloadForBE);
    this.websocketService.emitEvents(EVENTS.agent_send_or_copy, payloadForBE);
  }


  faqArticleSendorCopyEvent(selectType, message, faq_or_article_obj) {
    let data: any = {
      botId: this.rootService.connectionDetails.botId,
      conversationId: this.rootService.connectionDetails.conversationId,
      experience: this.rootService.connectionDetails?.channel,
      source: this.rootService.connectionDetails.source,
      usedType: message.method,
      type: message.type,
      name: message.name,
      payload : message.payload,
      title: message.title,
      contentId : message.contentId,
      sessionId: (this.rootService.activeTab == this.projConstants.MYBOT || this.rootService.activeTab == this.projConstants.SEARCH) ? this.rootService.myBotTabSessionId : this.rootService.assistTabSessionId,
    };
    data = this.rootService.addSourceMsgIdToRequestParams(faq_or_article_obj,data);
    if(this.rootService.activeTab == this.projConstants.SEARCH){
      data.input = this.rootService.searchedResultData.userInput;
    }
    if(faq_or_article_obj.subType){
      data.subType = faq_or_article_obj.subType;
    }
    this.websocketService.emitEvents(EVENTS.agent_send_or_copy, data);
  }


  mybot_run_click(dialog, myBotDialogPositionId, intent?) {
    if (dialog) {
      // this.dialogName = dialog.intentName;
      let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
      connectionDetails.value = dialog.intentName;
      connectionDetails.isSearch = false;
      connectionDetails.positionId = myBotDialogPositionId;
      connectionDetails.entities = this.rootService.mybotEntitiestValueArray
      connectionDetails.childBotName = this.rootService?.childBotDetails.childBotName;
      connectionDetails.childBotId = this.rootService?.childBotDetails.childBotId;
      connectionDetails.sourceMsgId = dialog.sourceMsgId || '';
      if(dialog.taskRefId){
        connectionDetails.taskRefId = dialog.taskRefId
      }
      if(dialog.dialogId){
        connectionDetails.dialogId = dialog.dialogId
      }
      // if (this.rootService.connectionDetails?.interactiveLanguage && typeof this.rootService.connectionDetails?.interactiveLanguage == 'string' && this.rootService.connectionDetails?.interactiveLanguage != "''") {
      //   connectionDetails['language'] = this.rootService.connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
      // }
      if (intent) {
        connectionDetails.intentName = dialog.intentName;
        connectionDetails.childBotName = this.rootService.childBotDetails.childBotName;
        connectionDetails.childBotId = this.rootService.childBotDetails.childBotId;
      }
      if (dialog.traits && dialog.traits?.length > 0){
        connectionDetails.traits = dialog.traits
      }
      let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
      this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
      this.rootService.mybotEntitiestValueArray = [];
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
        comment: feedbackData?.comment ? feedbackData?.comment : '',
        sourceMsgId : assistResponseArray[assistResponseArray.length - 1].sourceMsgId || ''
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
    let index = this.rootService.suggestionsAnswerPlaceableIDs?.findIndex(suggestion => {
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
      assistResponseArray[faqAnswerIdsPlace.assistSuggestion]?.searchResponse?.faqs?.forEach(faq => {
        if (accumulator[faq.question] && accumulator[faq.question]?.answer) {
          faq.answer = accumulator[faq.question]?.answer;
          faq.toggle = true;
          faq.showMoreButton = false;
          faq.showLessButton = false;
          faq.showSpinner = false;
          faq.displayName = faq.displayName
        }
        if(accumulator[faq.question]){
          faq.showSpinner = false;
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
      showAutomation: true,
      sourceMsgId : res.sourceMsgId || ""
    }
    return renderResponse;
  }

  formatAutomationRenderResponse(data, responseId, result, newTemp, dialogPositionId) {
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
      value: data?.buttons[0]?.value,
      dialogId : dialogPositionId
    }
    return renderResponse;
  }

  formatWelcomeMessageResponse(data){
    let renderResponse: any = {
      data: data,
      type: this.renderResponseType.WELCOME_MSG,
      connectionDetails: this.rootService.connectionDetails,
      responseType: this.renderResponseType.ASSISTRESPONSE
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
      responseType: this.renderResponseType.ASSISTRESPONSE,
      sourceMsgId : data.sourceMsgId || ''
    }
    renderResponse.template = this.rootService.getTemplateHtml(renderResponse.templateRender, result);
    return renderResponse;
  }

  smallTalkTemplateRenderCheck(data, result) {
    // if (result.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))) {
    //   return true;
    // }
    if(result.parsedPayload){
      return true;
    }
    return false;
  }

  getLastAutomationSourceMsgId(assistResponseArray){
    if(assistResponseArray && assistResponseArray?.length > 0){
      let lastAutomation = assistResponseArray[assistResponseArray.length -1];
      return lastAutomation.sourceMsgId || '';
    }
    return '';
  }

  changeParentAutomationSourceMsgId(arrEle, data){
    if(arrEle.sourceMsgId == 'fromLibrary' && data.sourceMsgId){
       arrEle.sourceMsgId = data.sourceMsgId;
    }
    return arrEle;
  }

  formatRunningLastAutomationEntityNode(assistResponseArray, data, showErrorPrompt, renderResponse, dropdownHeaderUuids, tab, previousEntityNodes?) {
    assistResponseArray.map((arrEle, index) => {
      if (arrEle?.uuid && arrEle?.uuid == dropdownHeaderUuids) {
        arrEle = this.changeParentAutomationSourceMsgId(arrEle, data);
        arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
        if (arrEle.automationsArray?.length > 0 && arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].showSpinner = false;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = (tab == this.projConstants.MYBOT) ? false : this.rootService.manualAssistOverrideMode;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].disableInput = (data.isErrorPrompt || showErrorPrompt) ? false : true;
          if(tab == this.projConstants.MYBOT && data.userInput){
            arrEle.automationsArray[arrEle.automationsArray.length - 1].entityValue = data.userInput;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].grayOut = true;
            this.grayOutPreviousAutomation(assistResponseArray, arrEle.automationsArray.length, index);
          }
          if (data.isErrorPrompt || showErrorPrompt) {
            arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = false;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].errorCount += 1;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].grayOut = false;
          } else {
            renderResponse.sourceMsgId = arrEle.sourceMsgId || '';
            arrEle.automationsArray[arrEle.automationsArray.length - 1].errorCount = 0;
            arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
          }
        } else {
          renderResponse.sourceMsgId = arrEle.sourceMsgId || '';
          arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
        }
        if(previousEntityNodes?.length >= 1){
          arrEle.automationsArray = arrEle.automationsArray.concat(previousEntityNodes);
        }
      }
    });
    return assistResponseArray;
  }

  getPreviousEntityNodesAndValues(assistResponseArray, data){
    let entityNodes : any = [];
    if(data?.entities?.length >= 1){
      let entityNameList = data.entities.reduce((acc, automation) => {
        acc[automation.name] = 'true';
        return acc;
      }, {});      
      assistResponseArray.map(arrEle => {
        if(arrEle.restart){
          arrEle.restart = false;
          if (arrEle?.automationsArray?.length >= 1) {
            arrEle.automationsArray.forEach(automation => {
              let entityName = automation?.data?.entityDisplayName ? automation?.data?.entityDisplayName : automation.data.entityName;
              if(automation?.data?.isPrompt && entityNameList[entityName]){
                automation.showSpinner = false;
                automation.errorCount = 0;
                automation.grayOut = true;
                entityNodes.push(automation);
              }
            });
          }
        }
      });
    }    
    return entityNodes;
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
        if (arrEle.automationsArray?.length > 0 && arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].showSpinner = false;
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
    assistResponseArray[assistResponseArray.length - 1].showSpinner = false;
    assistResponseArray[assistResponseArray.length - 1].toggleOverride = toggleOverride;
    assistResponseArray[assistResponseArray.length - 1].hideOverrideDiv = hideOverrideDiv;
    assistResponseArray[assistResponseArray.length - 1].disableInput = disableInput;
    return assistResponseArray;
  }

  checkEntityValueDataType(entities, entityName, value){
    if(entities && Object.keys(entities)?.length > 0 && entities[entityName]){
      return entities[entityName];
    }
    if(value && Array.isArray(value) && value.length > 0){
      return value[0];
    }
    return value;
  }

  processUserMessagesForSmalltalk(data, assistResponseArray, hideOverrideDiv, toggleOverride, history?){    
    let entityName = assistResponseArray[assistResponseArray.length - 1]?.data?.entityDisplayName ? assistResponseArray[assistResponseArray.length - 1]?.data?.entityDisplayName : assistResponseArray[assistResponseArray.length - 1]?.data?.entityName;          
    assistResponseArray[assistResponseArray.length - 1].entityValue = this.checkEntityValueDataType(data.entities, entityName, data.entityValue || data.userInput);
    if (data.userInput) {     
      assistResponseArray[assistResponseArray.length - 1].showSpinner = false;     
      assistResponseArray[assistResponseArray.length - 1].grayOut = true;
      assistResponseArray[assistResponseArray.length - 1].hideOverrideDiv = hideOverrideDiv;
      assistResponseArray[assistResponseArray.length - 1].toggleOverride = toggleOverride;
      assistResponseArray[assistResponseArray.length - 1].userInput = data.userInput && (!history) ? data.userInput : ProjConstants.YES;
      this.grayOutPreviousAutomation(assistResponseArray, undefined, assistResponseArray.length - 1)
    }
    return assistResponseArray
  }

  processUserMessagesForAutomation(data, assistResponseArray, hideOverrideDiv, toggleOverride, showErrorPrompt,dropdownHeaderUuids){
    assistResponseArray.map((arrEle, index) => {
      if (arrEle.uuid && arrEle.uuid == dropdownHeaderUuids) {
        arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
        if (data.userInput && arrEle.automationsArray?.length > 0 &&  arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].showSpinner = false;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = hideOverrideDiv;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = toggleOverride;
          let userInput = arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput;          
          let entityName = arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.entityDisplayName ? arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.entityDisplayName : arrEle.automationsArray[arrEle.automationsArray.length - 1].data.entityName;          
          arrEle.automationsArray[arrEle.automationsArray.length - 1].entityValue = this.checkEntityValueDataType(data.entities, entityName, data.entityValue || data.userInput);
          arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput = userInput ? userInput : ProjConstants.YES;
          this.grayOutPreviousAutomation(assistResponseArray, arrEle.automationsArray.length, index);
          if(!showErrorPrompt){
            arrEle.automationsArray[arrEle.automationsArray.length - 1].errorCount = 0;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].grayOut = true;
          }else{
            arrEle.automationsArray[arrEle.automationsArray.length - 1].grayOut = false;
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
              element.grayOut = (actualarrayIndex == responseArray?.length - 1 && index == arrEle?.automationsArray?.length -1) ? false : true
            });
          arrEle.automationsArray = [...arrEle.automationsArray];
        }else if(arrEle?.type == this.renderResponseType.SMALLTALK && actualarrayIndex != responseArray.length -1){
          arrEle.disableInput = true;
          arrEle.grayOut = (actualarrayIndex == responseArray?.length - 1) ? false : true;
        }
      });
    }  
    return responseArray;  
  }

  grayOutPreviousAutomation(responseArray, automationIndex, responseArrayIndex){    
    let responseArrayLength = responseArray.length;
    if(responseArrayLength > 0){      
      for(let i = responseArrayLength - 1; i >= 0; i--){
        if(responseArray[i].type == this.renderResponseType.AUTOMATION){
          let automationArray = responseArray[i].automationsArray;
          let automationIndexNum = typeof (automationIndex) == 'number' ? automationIndex - 1 : automationArray.length - 1; 
          for(let j = automationIndexNum; j >= 0; j--){
            if(automationArray[j]){
              automationArray[j].grayOut = true;
            }
          }
        }else if(responseArray[i].type == this.renderResponseType.SMALLTALK && i != responseArrayIndex - 1){
          responseArray[i].grayOut = true;
        }
      }
    }
    return responseArray;
  }

  formatAssistAutomation(automation) {
    let templateRender = (!automation?.result?.parsedPayload || automation?.noTemplateRender) ? false : true
    automation.templateRender = templateRender;
    if (automation?.templateRender) {
      automation.template = this.rootService.getTemplateHtml(automation.templateRender, automation.result);
    }
    automation.showOverrideDiv = automation.hideOverrideDiv ? false : ((automation.data.isPrompt && automation.proactiveModeStatus ? true : false));
    this.updateSendCopyParams(automation);
    if (automation.data.newEntityDisplayName || automation.data.newEntityName) {
      automation.agentInputEntityName = automation.data.newEntityDisplayName ? automation.data.newEntityDisplayName : automation.data.newEntityName;
    } else if (automation.data.entityDisplayName || automation.data.entityName) {
      automation.agentInputEntityName = automation.data.entityDisplayName ? automation.data.entityDisplayName : automation.data.entityName;
    }
    return automation;
  }

  updateSendCopyParams(automation) {
    automation.showSend = (this.rootService.connectionDetails.isCallConversation || ((!automation.connectionDetails.source || automation.connectionDetails.source !== ProjConstants.SMARTASSIST_SOURCE) && automation.template)) ? false : true;
    automation.showCopy = (this.rootService.connectionDetails.isCallConversation) ? false : ((!automation.template) ? true : false);
    let sendData = null;
    if ((automation.data?.buttons && automation.data?.buttons[0]?.value)) {
      sendData = automation.data?.buttons[0].value
    }
    automation.sendData = automation.result?.parsedPayload ? automation.temp : sendData;
  }

  getInitialSentiChartOptions(object): EChartsOption | any {
    return {
      legend: {
        show : false
      },
      tooltip: {
        show : false
      },
      xAxis: {
        name: '',
        show : false,
        data : [1,2,3,4,5,6,7,8,9,10]
      },
      
      yAxis: {
        show : false
      },
      grid: {
        show : false,
        bottom: 10,
        top : 10
        // bottom: 100
      },
      series: [
        {
          name: 'bar',
          type: 'bar',
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          },
          barWidth: 2,
          barCategoryGap : '0%',
          data: [],
          itemStyle: {
            color: (param)  => {
              let color = 'green';
              if(param.value < -0.25){
                color = 'red';
              }else if(param.value >= -0.25 && param.value <= 0){
                color = 'gray';
              }else if(param.value > 0){
                color = 'green'
              }
              return color;
            }
          }
        }
      ]
    }
  }

  getSentiAnalysisChartOptions(object): EChartsOption | any {
    return {
      legend: {
        show : false
      },
      tooltip: {
        formatter : function (param){
          return 'Polarity : ' + param.value;
        }
      },
      xAxis: {
        name: '',
        show : false,
        data : [].constructor(100).map((item)=> item)
        // axisLine: { onZero: true },
        // splitLine: { show: false },
        // splitArea: { show: false },
        // nameGap : 0
      },
      
      yAxis: {
        show : false
      },
      grid: {
        show : false,
        bottom: 10,
        top : 10
      },
      series: [
        {
          name: 'bar',
          type: 'bar',
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          },
          barWidth: 2,
          barCategoryGap : '0%',
          data: [],
          itemStyle: {
            color: (param)  => {
              let color = 'green';
              if(param.value < -0.25){
                color = 'red';
              }else if(param.value >= -0.25 && param.value < 0){
                color = 'gray';
              }else if(param.value > 0){
                color = 'green'
              }
              return color;
            }
          }
        }
      ]
    }
  }

}
