import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjConstants } from '../proj.const';
import { TemplateRenderClassService } from './template-render-class.service';
import * as $ from 'jquery';
import { EVENTS } from '../helpers/events';

declare var $: any;
declare const agentAssistHelpers: any;
@Injectable({
  providedIn: 'root'
})
export class RootService {

  socketConnection$: BehaviorSubject<any> = new BehaviorSubject(null);
  activeTab$: BehaviorSubject<any> = new BehaviorSubject(null);
  assistTemplateClick$ : BehaviorSubject<any> = new BehaviorSubject(null);
  mybotTemplateClick$ : BehaviorSubject<any> = new BehaviorSubject(null);

  public userBotConversationDetails: any;

  projConstants: any = ProjConstants;

  activeTab: string;
  connectionDetails: any = {};
  assistTabSessionId = '';
  myBotTabSessionId = '';
  grantResponseObj: any = {};

  dropdownHeaderUuids : any;
  myBotDropdownHeaderUuids : any;

  OverRideMode: boolean = false;
  proactiveModeStatus : boolean = false;
  isAutomationOnGoing: boolean = false;
  isMyBotAutomationOnGoing: boolean = false;
  isInitialDialogOnGoing: boolean = false;
  isRestore: boolean = false;

  entitiestValueArray: any = [];
  mybotEntitiestValueArray : any = [];
  suggestionsAnswerPlaceableIDs: any = [];

  currentPositionId;
  currentPositionIdOfMyBot;
  childBotDetails = {
    childBotName: '',
    childBotId: ''
  }
  public chatWindowInstance: any;

  manualAssistOverrideMode: boolean = false;

  isUpdateFeedBackDetailsFlag: boolean = false;

  isAgentSentRequestOnClick: boolean = false;
  isMyBotAgentSentRequestOnClick: boolean = false;

  settingsData : any = {};
  bulbClick : boolean = false;
  aaHelpers = null;

  primaryChecklist: any = [];
  dynamicChecklist: any = [];

  searchedResultData : any = {};
  widgetMaxButtonClick : boolean = true;

  constructor(private templateRenderClassService: TemplateRenderClassService) {
    // this.chatWindowInstance = new chatWindow();
    this.aaHelpers = new agentAssistHelpers();
  }

  getConnectionDetails() {
    return this.connectionDetails;
  }

  formatConnectionDetails(obj: any) {
    let parmasObj: any = Object.assign({}, obj);
    for (let key in parmasObj) {
      if (key === "botid") {
        parmasObj[ProjConstants.BOTID] = parmasObj[key];
        delete parmasObj[key];
      } else if (key == 'conversationid') {
        parmasObj[ProjConstants.CONVESATIONID] = parmasObj[key];
        delete parmasObj[key];
      }
      else if (key == "autoBotId") {
        if (parmasObj[key] && (parmasObj[key] !== "undefined" && parmasObj[key] !== null)) {
          parmasObj['autoBotId'] = parmasObj[key];
        } else {
          parmasObj['autoBotId'] = '';
        }
      }
      else if (key == "isCall"){
        if (parmasObj[key] && (parmasObj[key] !== "undefined" && parmasObj[key] !== null)) {
          parmasObj['isCallConversation'] = (parmasObj[key] == "true") ? true : false
        }
      }
    }
    this.connectionDetails = parmasObj;
  }

  prepareAgentAssistAgentRequestParams(data) {
    let agent_assist_agent_request_params: any = {
      'isSearch': data.isSearch,
      'conversationId': data.conversationId,
      'query': data.value,
      'botId': data.botId,
      'experience': this.connectionDetails.isCallConversation === true ? 'voice' : 'chat',
      'positionId': data?.positionId,
      'childBotId': data?.childBotId || '',
      'childBotName': data?.childBotName || '',
      'intType': 'myBot'
    }
    if (data.intentName) {
      agent_assist_agent_request_params.intentName = data.intentName;
    }
    // if(data.childBotId) {
    //   agent_assist_agent_request_params['childBotId'] = data.childBotId;
    //   agent_assist_agent_request_params['childBotName'] = data.childBotName;
    // }
    if (this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      agent_assist_agent_request_params['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      agent_assist_agent_request_params['autoBotId'] = '';
    }
    if (data.intentName && data.userInput) {
      agent_assist_agent_request_params['query'] = data.userInput
    }
    if (data?.language) {
      agent_assist_agent_request_params['language'] = data.language; // Return the default value for null, undefined, or "''"
    }
    if (this.isMyBotAutomationOnGoing) {
      agent_assist_agent_request_params['positionId'] = this.currentPositionIdOfMyBot;
    }
    return agent_assist_agent_request_params;
  }

  isEmptyStr(s) {
    let str = s?.trim();
    str = str?.replaceAll('"', '').replaceAll("'", '');
    if (str && str.length > 1 && str !== "") {
      return true;
    } else {
      return false;
    }
  }


  setUserBotConversationDataDetails(data: any) {
    if (data && data.sessionId) {
      this.userBotConversationDetails = data;
    }
  }

  getUserBotConvosDataDetails() {
    return this.userBotConversationDetails;
  }

  setSocketConnection(data) {
    this.socketConnection$.next(data);
  }

  setActiveTab(tab) {
    if (tab) {
      this.activeTab$.next(tab);
      this.activeTab = tab;
    }
  }

  setAssistTemplateClick(value){
    this.assistTemplateClick$.next(value);
  }

  setMyBotTemplateClick(value){
    this.assistTemplateClick$.next(value);
  }

  formatSearchResponse(response) {
    let suggestions = response.suggestions
    let dialoguesArray = suggestions.dialogs || [];
    let faqArray = suggestions.faqs || [];
    let snippersArray = suggestions?.searchassist?.snippets || [];
    let searchResponse: any = {};
    if(dialoguesArray.length || faqArray.length || snippersArray.length){
      searchResponse.dialogs = [];
      searchResponse.faqs = [];
      searchResponse.articles = [];
      searchResponse.snippets = [];
      if (suggestions.searchassist && Object.keys(suggestions.searchassist).length > 0) {
        for (let source in suggestions.searchassist) {
          if (source != "snippets") {
            suggestions.searchassist[source] = this.checkEmptyObjectsInArray(suggestions.searchassist[source]);
            if (Object.keys(suggestions.searchassist[source]).length > 0) {
              searchResponse.articles.push.apply(searchResponse.articles, suggestions.searchassist[source]);
            }
          }
        }
        for (let article of searchResponse.articles) {
          article.showMoreButton = true;
          article.showLessButton = false;
          article.content = article.content ? article.content : '';
          article.contentId = article.contentId;
          article.userInput = response.userInput;
        }
      }
      for (let faq of faqArray) {
        let faqObject: any = {
          question: faq.question,
          displayName: faq.displayName,
          taskRefId: faq?.taskRefId,
          answer: (faq.answer && faq.answer.length > 0) ? [] : false,
          showMoreButton: true,
          showLessButton: false,
          answerRender: faq.answer || false,
          childBotId: faq.childBotId,
          childBotName: faq.childBotName,
          answerCount: 1
        }
        if (faq.answer && faq.answer.length > 0) {
          for (let ans of faq.answer) {
            let object: any = {
              ans: ans,
              taskRefId: faq.taskRefId,
              showMoreButton: true,
              showLessButton: false,
              displayName: faq.displayName
            }
            faqObject.answer.push(object);
          }
        }
        searchResponse.faqs.push(faqObject);
      }
      if (suggestions?.searchassist?.snippets?.length > 0) {
        for (let snippet of snippersArray) {
          if(snippet.title){
            searchResponse.snippets.push(snippet);
          }
        }
        for (let snippet of searchResponse.snippets) {
          snippet.showMoreButton = true;
          snippet.showLessButton = false;
        }
      }
  
      for (let dialog of dialoguesArray) {
        if (dialog.entities && dialog.entities?.length > 0) {
          dialog.entities.forEach(entity => {
            entity.editMode = false;
          });
        }
        searchResponse.dialogs.push({
          name: dialog.name, agentRunButton: false, childBotId: dialog.childBotId,
          childBotName: dialog.childBotName, entities: dialog.entities, userInput: dialog.userInput
        });
      }
    }
    return searchResponse;
  }

  checkEmptyObjectsInArray(arr) {
    arr = arr.filter(
      obj => !(obj && Object.keys(obj).length === 0)
    );
    return arr;
  }

  formatFAQResponse(faqArray) {
    let searchResponse = [];
    for (let faq of faqArray) {
      let faqObject: any = {
        question: faq.question,
        taskRefId: faq?.taskRefId,
        answer: (faq.answer && faq.answer.length > 0) ? [] : false
      }
      if (faq.answer && faq.answer.length > 0) {
        for (let ans of faq.answer) {
          let object: any = {
            taskRefId: faq.taskRefId,
            ans: ans,
            showMoreButton: true,
            showLessButton: false,
          }
          faqObject.answer.push(object);
        }
      }
      searchResponse.push(faqObject);
    }
    return searchResponse;
  }

  formatHistoryResponseForFAQ(response) {
    if (response) {
      let referenceObjvsAnswer: any = {};
      let historyResp: any = [];
      for (let resObj of response) {
        if (resObj && resObj.agentAssistDetails && resObj.agentAssistDetails.suggestions && resObj.agentAssistDetails.suggestions.faqs) {
          if (resObj.channels && resObj.channels[0] && resObj.channels[0].reqId) {
            if (!referenceObjvsAnswer[resObj.channels[0].reqId]) {
              referenceObjvsAnswer[resObj.channels[0].reqId] = [];
            }
            if (resObj.components && resObj.components[0] && resObj.components[0].data && resObj.components[0].data.text) {
              referenceObjvsAnswer[resObj.channels[0].reqId].push(resObj.components[0].data.text);
            }
          }
        }
      }

      for (let resObj of response) {
        if (resObj && resObj.agentAssistDetails && resObj.agentAssistDetails.suggestions && resObj.agentAssistDetails.suggestions.faqs) {
          if (resObj.channels && resObj.channels[0] && resObj.channels[0].reqId) {
            if (referenceObjvsAnswer[resObj.channels[0].reqId]) {
              resObj.components[0].data.text = referenceObjvsAnswer[resObj.channels[0].reqId];
              historyResp.push(resObj);
              referenceObjvsAnswer[resObj.channels[0].reqId] = false;
            }
          }
        } else {
          historyResp.push(resObj);
        }
      }
      return historyResp;
    }
  }

  formatHistoryResonseToNormalRender(res) {
    let result: any = {};
    result = Object.assign({}, res.agentAssistDetails);
    result.type = res.type;
    // result.components = res.components;
    result.buttons = JSON.parse(JSON.stringify(res.components));
    result.intentName = res.tN;
    result._id = res._id;
    result.entityDisplayName = result.newEntityDisplayName ? result.newEntityDisplayName : result.newEntityName;
    if ((result.suggestions || result.ambiguityList)) {
      result.suggestions = (result.suggestions) ? (result.suggestions) : (result.ambiguityList);
      result.faqResponse = res.agentAssistDetails.faqResponse;
    }
    //format buttons
    result.buttons.forEach((element, index) => {
      element.value = res.components[index]?.data?.text
    });

    return result;
  }

  formatUserBotHistoryResponse(res){
    let result: any = JSON.parse(JSON.stringify(res));
    result = Object.assign(result, res.agentAssistDetails);
    result.buttons = JSON.parse(JSON.stringify(res.components));
    result.intentName = res.tN;
    result._id = res._id;
    result.buttons.forEach((element, index) => {
      element.value = res.components[index]?.data?.text
    });
    return result;
  }


  sendAndCopyForPlaybook(eventName, conversationId, payload){
    let message : any = {
      method: (eventName == ProjConstants.SEND_METHOD) ? ProjConstants.SEND_METHOD : ProjConstants.COPY_METHOD,
      name: (eventName == ProjConstants.SEND_METHOD) ? ProjConstants.SENDMSG : ProjConstants.COPYMSG,
      conversationId,
      payload,
    };

    if (eventName == ProjConstants.SEND_METHOD) {
      window.parent.postMessage(message, '*');
    } else if (eventName == ProjConstants.COPY_METHOD) {
      parent.postMessage(message, '*');
    }
  }

  confirmationNodeRenderDataTransform(data) {
    data.expectedFormat = data.entityType;
    if ((data.componentType == 'dialogAct' || data.entityType == 'list_of_values') && data.buttons && data.buttons.length > 0) {
      if (!data.applyDefaultTemplate) {
        data.componentType = '';
        data.entityType = '';
      }
    }
    return data;
  }

  confirmationNodeRenderForHistoryDataTransform(res) {
    res.expectedFormat = res.entityType || res.newEntityType;
    if (res && (res.componentType == 'dialogAct' || res.entityType == 'list_of_values' || res.newEntityType == 'list_of_values') && res.buttons && res.buttons.length > 0 && res.buttons[0].data && res.buttons[0].value) {
      if (!res?.applyDefaultTemplate) {
        res.componentType = '';
        res.newEntityType = '';
      }
    }
    return res;
  }

  handleEmptyLine(answer, quotflag?) {
    let eleanswer = '';
    if (typeof answer === 'string') {
      eleanswer = answer.replace(/(\r\n|\n|\r)/gm, "<br>");
      eleanswer = this.replaceLtGt(eleanswer, quotflag)
      eleanswer = this.aaHelpers.convertMDtoHTML(eleanswer, "bot", eleanswer)
      if (quotflag) {
        eleanswer = this.replaceLtGt(eleanswer, quotflag)
      }
      return eleanswer;

    }
    return eleanswer
  }

  replaceLtGt(htmlString, quotflag) {
    let newHtmlStr;
    newHtmlStr = htmlString.replaceAll("&lt;", "<");
    newHtmlStr = newHtmlStr.replaceAll("&gt;", ">");
    if (quotflag) {
      newHtmlStr = newHtmlStr.replaceAll('"', "&quot;");
    }
    return newHtmlStr;
  }

  checkAutoBotIdDefined(id) {
    if (!id || id == 'undefined' || id == "null" || id == "") {
      return true;
    } else {
      return false;
    }
  }

  emptyDeep(mixedVar, emptyValues = [undefined, null, '']) {
    var key, i, len
    for (i = 0, len = emptyValues.length; i < len; i++) {
      if (mixedVar === emptyValues[i]) {
        return true
      }
    }
    if (typeof mixedVar === 'object') {
      for (const item of Object.values(mixedVar)) {
        if (!this.emptyDeep(item, emptyValues)) {
          return false
        }
      }
      return true
    }
    return false
  }




  //prepare request Prams for agentassist request
  prepareAgentAssistRequestParams(data) {
    let agent_assist_request = {
      'conversationId': data.conversationId,
      'query': data.value,
      'botId': data.botId,
      'agentId': '',
      'experience': this.connectionDetails.isCallConversation === true ? 'voice' : 'chat',
      'positionId': data.positionId,
      'intType': 'assist'
    }
    if (data.intentName) {
      agent_assist_request['intentName'] = data.value;
    }
    if (data.entities) {
      agent_assist_request['entities'] = data.entities;
    } else {
      agent_assist_request['entities'] = [];
    }
    if (data.childBotId) {
      agent_assist_request['childBotId'] = data.childBotId;
      agent_assist_request['childBotName'] = data.childBotName;
    }
    if (this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      agent_assist_request['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      agent_assist_request['autoBotId'] = '';
    }
    if (data.intentName && data.userInput) {
      agent_assist_request['query'] = data.userInput
    }
    if (this.isAutomationOnGoing) {
      agent_assist_request['positionId'] = this.currentPositionId;
    }
    return agent_assist_request;
  }

  // getTemplateHtml(isTemplateRender, result) {
  //   let renderMessage = isTemplateRender ? this.chatWindowInstance.generateMessageDOM(result) : '';
  //   if (renderMessage) {
  //     let obj = renderMessage.outerHTML
  //     return (obj);
  //   }
  //   return null;
  // }


  getTemplateHtml(isTemplateRender, result){    
    let renderedMessage = isTemplateRender ? this.templateRenderClassService?.AgentChatInitialize?.renderMessage(result) : '';
    if (renderedMessage && renderedMessage[0]) {
      let obj =  $(this.templateRenderClassService.AgentChatInitialize.renderMessage(result))[0].outerHTML
      return (obj);
    }
    return null;
  }



}
