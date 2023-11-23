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

  formatSearchResponse(response) {
    let suggestions = response.suggestions
    let searchResponse: any = {};
    searchResponse.dialogs = [];
    searchResponse.faqs = [];
    searchResponse.articles = [];
    searchResponse.snippets = [];
    let dialoguesArray = suggestions.dialogs || [];
    let faqArray = suggestions.faqs || [];
    let snippersArray = suggestions?.searchassist?.snippets || []
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

  handleSendCopyButtonForNodes(actionType, sendData) {
    let message = {};
    if (actionType == ProjConstants.SEND) {
      message = {
        method: 'send',
        name: ProjConstants.SENDMSG,
        conversationId: this.connectionDetails.conversationId,
        payload: sendData
      };
      window.parent.postMessage(message, '*');
    } else {
      message = {
        method: 'copy',
        name: ProjConstants.COPYMSG,
        conversationId: this.connectionDetails.conversationId,
        payload: sendData
      };
      parent.postMessage(message, '*');
    }
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType) {
    let message = {};
    if (actionType == this.projConstants.SEND) {
      message = {
        method: 'send',
        name: ProjConstants.SENDMSG,
        conversationId: this.connectionDetails.conversationId,
        payload: selectType == this.projConstants.FAQ ? (faq_or_article_obj.answer || faq_or_article_obj.ans) : faq_or_article_obj.content
      };
      window.parent.postMessage(message, '*');
    } else {
      message = {
        method: 'copy',
        name: ProjConstants.COPYMSG,
        conversationId: this.connectionDetails.conversationId,
        payload: selectType == this.projConstants.FAQ ? (faq_or_article_obj.answer || faq_or_article_obj.ans) : faq_or_article_obj.content
      };
      parent.postMessage(message, '*');
    }
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
    if ((data.componentType == 'dialogAct' || data.entityType == 'list_of_values') && data.buttons && data.buttons.length > 0) {
      if (!data.applyDefaultTemplate) {
        data.componentType = '';
        data.entityType = '';
      }
    }
    return data;
  }

  confirmationNodeRenderForHistoryDataTransform(res) {
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


  getAgentMessage() {
    return {
      "botId": "st-cc165ac6-e002-5569-b0a8-1cc5b77d6251",
      "orgId": "o-a5d0dc0b-efbe-5c06-931b-dff41331c0cc",
      "sessionId": "6541e9959e42c059deb6cbd5",
      "accountId": "65029ffbfe1e180cdff2e960",
      "type": "text",
      "conversationId": "c-4a552bc-6d12-46ca-90b9-535b38b754b1",
      "value": "Yes I can do Please tell me",
      "author": {
        "type": "AGENT",
        "id": "u-8112bdbb-2d98-5e15-8adf-d8dddb1b6f63",
        "firstName": "sat",
        "lastName": "sept"
      },
      "event": "agent_message",
      "_id": "ms-56aa6d38-596a-56ac-913a-f0cc739f25e8",
      "channel": "audiocodes",
      "wordsInfo": {
        "id": "cc3a86a5-f055-47a7-92b9-96bf8149d6bb",
        "timestamp": "2023-11-01T06:01:39.766Z",
        "language": "en-US",
        "type": "message",
        "text": "Hello. Hello.",
        "parameters": {
          "confidence": 0.8375823497772217,
          "recognitionOutput": {
            "results": [
              {
                "alternatives": [
                  {
                    "words": [
                      {
                        "startTime": {
                          "seconds": "23",
                          "nanos": 900000000
                        },
                        "endTime": {
                          "seconds": "24",
                          "nanos": 500000000
                        },
                        "word": "Hello.",
                        "confidence": 0,
                        "speakerTag": 0
                      },
                      {
                        "startTime": {
                          "seconds": "24",
                          "nanos": 500000000
                        },
                        "endTime": {
                          "seconds": "24",
                          "nanos": 700000000
                        },
                        "word": "Hello.",
                        "confidence": 0,
                        "speakerTag": 0
                      }
                    ],
                    "transcript": "Hello. Hello.",
                    "confidence": 0.8375823497772217
                  }
                ],
                "isFinal": true,
                "stability": 0,
                "resultEndTime": {
                  "seconds": "24",
                  "nanos": 940000000
                },
                "channelTag": 0,
                "languageCode": "en-us"
              }
            ]
          },
          "participant": "participant-2",
          "participantUriUser": "supporthuddl445",
          "words": [
            {
              "word": "Hello.",
              "offset": 23900,
              "duration": 600
            },
            {
              "word": "Hello.",
              "offset": 24500,
              "duration": 200
            }
          ]
        },
        "sttProvider": "my_google",
        "channel": "audiocodes"
      }
    }
  }

  getUserMessage() {
    return {
      "botId": "st-cc165ac6-e002-5569-b0a8-1cc5b77d6251",
      "orgId": "o-a5d0dc0b-efbe-5c06-931b-dff41331c0cc",
      "sessionId": "6541e9959e42c059deb6cbd5",
      "accountId": "65029ffbfe1e180cdff2e960",
      "type": "text",
      "conversationId": "c-4a552bc-6d12-46ca-90b9-535b38b754b1",
      "value": "Hello can you help me",
      "author": {
        "type": "USER",
        "id": "u-b3e755a4-95c4-57e9-8476-5dcec80b89ab",
        "firstName": "Kore",
        "lastName": "User"
      },
      "event": "user_message",
      "_id": "ms-bf93a0d4-2fe1-5e0d-b0ba-c50f54c58701",
      "channel": "audiocodes",
      "wordsInfo": {
        "id": "02e00336-8fc8-477d-b2e4-4c1a77c8a2a8",
        "timestamp": "2023-11-01T06:02:12.408Z",
        "language": "en-US",
        "type": "message",
        "text": "Hello.",
        "parameters": {
          "confidence": 0.8375823497772217,
          "recognitionOutput": {
            "results": [
              {
                "alternatives": [
                  {
                    "words": [
                      {
                        "startTime": {
                          "seconds": "5",
                          "nanos": 500000000
                        },
                        "endTime": {
                          "seconds": "5",
                          "nanos": 900000000
                        },
                        "word": "Hello.",
                        "confidence": 0,
                        "speakerTag": 0
                      }
                    ],
                    "transcript": "Hello.",
                    "confidence": 0.8375823497772217
                  }
                ],
                "isFinal": true,
                "stability": 0,
                "resultEndTime": {
                  "seconds": "6",
                  "nanos": 410000000
                },
                "channelTag": 0,
                "languageCode": "en-us"
              }
            ]
          },
          "participant": "participant",
          "participantUriUser": "+16176754444",
          "words": [
            {
              "word": "Hello.",
              "offset": 5500,
              "duration": 400
            }
          ]
        },
        "sttProvider": "my_google",
        "channel": "audiocodes"
      }
    }
  }

}
