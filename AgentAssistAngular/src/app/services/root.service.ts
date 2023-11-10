import { Injectable } from '@angular/core';
import { chatWindow } from '@koredev/kore-web-sdk';
import { BehaviorSubject } from 'rxjs';
import { ProjConstants } from '../proj.const';

@Injectable({
  providedIn: 'root'
})
export class RootService {

  socketConnection$ : BehaviorSubject<any> = new BehaviorSubject(null);
  activeTab$ : BehaviorSubject<any> = new BehaviorSubject(null);

  public userBotConversationDetails : any;

  projConstants : any = ProjConstants;

  activeTab : string;
  connectionDetails : any = {};
  assistTabSessionId = '';
  myBotTabSessionId = '';
  grantResponseObj : any = {};

  OverRideMode: boolean = false;
  isAutomationOnGoing: boolean = false;
  isMyBotAutomationOnGoing : boolean = false;
  isInitialDialogOnGoing: boolean = false;
  isRestore : boolean = false;

  entitiestValueArray : any;
  suggestionsAnswerPlaceableIDs : any = [];
  
  currentPositionId;
  currentPositionIdOfMyBot;
  childBotDetails = {
    childBotName : '',
    childBotId : ''
  }
  public chatWindowInstance : any;
  manualAssistOverrideMode : boolean = false;

  isUpdateFeedBackDetailsFlag : boolean = false;

  constructor() { 
    this.chatWindowInstance = new chatWindow();
  }

  getConnectionDetails(){
    return this.connectionDetails;
  }

  formatConnectionDetails(obj : any) {
    let parmasObj : any = Object.assign({}, obj);
    for (let key in parmasObj) {
      if (key === "botid") {
        parmasObj[ProjConstants.BOTID] = parmasObj[key];
        delete parmasObj[key];
      } else if (key == 'conversationid') {
        parmasObj[ProjConstants.CONVESATIONID] = parmasObj[key];
        delete parmasObj[key];
      }
      else if(key == "autoBotId"){
        if(parmasObj[key] && (parmasObj[key] !== "undefined" && parmasObj[key] !== null)){
          parmasObj['autoBotId'] = parmasObj[key];
        }else{
          parmasObj['autoBotId'] = '';
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
      'intType' : 'mybot'
    }
    if (data.intentName) {
      agent_assist_agent_request_params.intentName = data.intentName;
    }
    // if(data.childBotId) {
    //   agent_assist_agent_request_params['childBotId'] = data.childBotId;
    //   agent_assist_agent_request_params['childBotName'] = data.childBotName;
    // }
    if(this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
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
    if(this.isMyBotAutomationOnGoing){
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


  setUserBotConversationDataDetails(data : any) {
    if (data && data.sessionId) {
      this.userBotConversationDetails = data;
    }
  }

  getUserBotConvosDataDetails() {
    return this.userBotConversationDetails;
  }

  setSocketConnection(data){
    this.socketConnection$.next(data);
  }

  setActiveTab(tab){
    if(tab){
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
      for(let source in suggestions.searchassist){
        if(source != "snippets"){
          suggestions.searchassist[source] = this.checkEmptyObjectsInArray(suggestions.searchassist[source]);
          if(Object.keys(suggestions.searchassist[source]).length > 0){
            searchResponse.articles.push.apply(searchResponse.articles,suggestions.searchassist[source]);
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
      let faqObject : any = {
        question: faq.question,
        displayName: faq.displayName,
        taskRefId: faq?.taskRefId,
        answer: (faq.answer && faq.answer.length > 0) ? [] : false,
        showMoreButton: true,
        showLessButton: false,
        answerRender : faq.answer || false,
        childBotId : faq.childBotId,
        childBotName : faq.childBotName,
        answerCount : 1
      }
      if(faq.answer && faq.answer.length > 0){
        for(let ans of faq.answer){
          let object : any = {
            ans : ans,
            taskRefId: faq.taskRefId,
            showMoreButton : true,
            showLessButton : false,
          }
          faqObject.answer.push(object);
        }
      }
      searchResponse.faqs.push(faqObject);
    }
    if(suggestions?.searchassist?.snippets?.length > 0){
      for(let snippet of snippersArray){
        searchResponse.snippets.push(snippet);
      }
      for (let snippet of searchResponse.snippets) {
        snippet.showMoreButton = true;
        snippet.showLessButton = false;
      }
    }

    for (let dialog of dialoguesArray) {
      if(dialog.entities && dialog.entities?.length > 0){
        dialog.entities.forEach(entity => {
          entity.editMode = false;
        });
      }
      searchResponse.dialogs.push({ name: dialog.name, agentRunButton: false, childBotId : dialog.childBotId,
        childBotName : dialog.childBotName, entities : dialog.entities, userInput : dialog.userInput });
    }
    return searchResponse;
  }

  checkEmptyObjectsInArray(arr){
    arr = arr.filter(
        obj => !(obj && Object.keys(obj).length === 0)
    );
    return arr;
  }

  formatFAQResponse(faqArray){    
    let searchResponse = [];
    for (let faq of faqArray) {
      let faqObject : any = {
        question: faq.question,
        taskRefId : faq?.taskRefId,
        answer: (faq.answer && faq.answer.length > 0) ? [] : false
      }
      if(faq.answer && faq.answer.length > 0){
        for(let ans of faq.answer){
          let object : any = {
            taskRefId: faq.taskRefId,
            ans : ans,
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


  formatHistoryResponseForFAQ(response){
    if(response){
      let referenceObjvsAnswer : any = {};
      let historyResp : any = [];
      for(let resObj of response){
        if(resObj && resObj.agentAssistDetails && resObj.agentAssistDetails.suggestions && resObj.agentAssistDetails.suggestions.faqs){
          if(resObj.channels && resObj.channels[0] && resObj.channels[0].reqId){
            if(!referenceObjvsAnswer[resObj.channels[0].reqId]){
              referenceObjvsAnswer[resObj.channels[0].reqId] = [];
            }
            if(resObj.components && resObj.components[0] && resObj.components[0].data && resObj.components[0].data.text){
              referenceObjvsAnswer[resObj.channels[0].reqId].push(resObj.components[0].data.text);
            }
          }
        }
      }
  
      for(let resObj of response){
        if(resObj && resObj.agentAssistDetails && resObj.agentAssistDetails.suggestions && resObj.agentAssistDetails.suggestions.faqs){
          if(resObj.channels && resObj.channels[0] && resObj.channels[0].reqId){
            if(referenceObjvsAnswer[resObj.channels[0].reqId]){
              resObj.components[0].data.text = referenceObjvsAnswer[resObj.channels[0].reqId];
              historyResp.push(resObj);
              referenceObjvsAnswer[resObj.channels[0].reqId] = false;
            }
          }
        }else{
          historyResp.push(resObj);
        }
      }
      return historyResp;
    }
  }

  formatHistoryResonseToNormalRender(res){
    let result : any = {};

    result = Object.assign({},res.agentAssistDetails);

    result.type = res.type;
    result.components = res.components;
    // result.buttons = res.components;
    result.intentName = res.tN;
    result._id = res._id;
    if((result.suggestions || result.ambiguityList)){
      result.suggestions = (result.suggestions) ? (result.suggestions) : (result.ambiguityList);
      result.faqResponse = res.agentAssistDetails.faqResponse;
    }

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

  confirmationNodeRenderDataTransform(data){
    if((data.componentType == 'dialogAct' || data.entityType == 'list_of_values')  && data.buttons && data.buttons.length > 0){
      if(!data.applyDefaultTemplate){
        data.componentType = '';
        data.entityType = '';
      }
    }
    return data;
  }

  confirmationNodeRenderForHistoryDataTransform(res){
    if(res && res.agentAssistDetails && (res.agentAssistDetails.componentType == 'dialogAct' || res.agentAssistDetails.entityType == 'list_of_values' || res.agentAssistDetails.newEntityType == 'list_of_values')  && res.components && res.components.length > 0 && res.components[0].data && res.components[0].data.text){

      if(!res.agentAssistDetails.applyDefaultTemplate){

        res.agentAssistDetails.componentType = '';
        res.agentAssistDetails.newEntityType = '';
      }
    }
    return res;
  }

  handleEmptyLine(answer, quotflag?){
    let eleanswer = '';
    if(typeof answer === 'string'){
        eleanswer = answer.replace(/(\r\n|\n|\r)/gm, "<br>");
        eleanswer = this.replaceLtGt(eleanswer, quotflag)
        // eleanswer = this.aaHelpers.convertMDtoHTML(eleanswer, "bot", eleanswer)
        if(quotflag) {
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
    if(quotflag) {
      newHtmlStr = newHtmlStr.replaceAll('"', "&quot;");
    }
    return newHtmlStr;
  }

  checkAutoBotIdDefined(id){
    if(!id || id == 'undefined' || id == "null" || id == ""){
      return true;
    }else{
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
      'intType' : 'assist'
    }
    if (data.intentName) {
      agent_assist_request['intentName'] = data.value;
    }
    if (data.entities) {
      agent_assist_request['entities'] = data.entities;
    } else {
      agent_assist_request['entities'] = [];
    }
    if(data.childBotId) {
      agent_assist_request['childBotId'] = data.childBotId;
      agent_assist_request['childBotName'] = data.childBotName;
    }
    if(this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      agent_assist_request['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      agent_assist_request['autoBotId'] = '';
    }
    if (data.intentName && data.userInput) {
      agent_assist_request['query'] = data.userInput
    }
    if(this.isAutomationOnGoing){
      agent_assist_request['positionId'] = this.currentPositionId;
    }
    return agent_assist_request;
  }

  getTemplateHtml(isTemplateRender, result){
    let renderMessage = isTemplateRender ? this.chatWindowInstance.generateMessageDOM(result) : '';    
    if (renderMessage) {
      let obj =  renderMessage.outerHTML      
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

  getMockData() {
    return [{"_id":"ms-78a55ed2-c7fe-5cdc-99bf-987a43ab30b2","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"type":"agentassist","from":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","to":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","reqId":"cbr-20d99828-8ceb-5103-b8fc-705be3f0ab07","isGroup":false,"body":"city","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","preferredChannelForResponse":"rtm","channelInst":"agentassist","channelDispName":"AgentAssistV2","enable":true,"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","message":"The bot is disabled via AgentAssist. You can still talk to the bot via SmartAssist, Webhook, Web/Mobile Client, AgentAssist.","activeChannels":"SmartAssist,Webhook,Web/Mobile Client,AgentAssist.","isAsync":true,"tokens":[],"__userInputTime":"2023-11-10T10:01:30.073Z","__loopCount":0,"handle":{"clientId":"cs-0c15f901-7df7-5f4b-857d-a185807662c8"},"userId":"u-063e1706-c716-50a2-b64f-11fe066056c3"}],"type":"incoming","status":"received","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","lmodifiedBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","createdOn":"2023-11-10T10:01:30.193Z","lmodifiedOn":"2023-11-10T10:01:30.193Z","botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","components":[{"_id":"cp-d8edbfdf-2c06-5e0e-a47c-f64921fa18f7","cT":"text","data":{"text":"city"},"thumbnails":[]}],"iv":"4kxv7fWQLjQNJ6JGafI2Kw==","ire":true,"timestampValue":1699610490226,"__v":0,"lang":"en","sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-265850f1-8a64-5f87-b1e9-aab7aa87eeae","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-20d99828-8ceb-5103-b8fc-705be3f0ab07","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:30.758Z","lmodifiedOn":"2023-11-10T10:01:30.758Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-93ce0282-12ac-54eb-8d76-a13e908dec45","cT":"text","data":{"text":""},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"city","suggestions":{"dialogs":[{"name":"City","taskRefId":""}]},"isPrompt":false},"iv":"7Edn6DxqHw4P69xJ7GWcXA==","ire":true,"timestampValue":1699610490761,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-aea53707-7754-5a47-8bb1-90a25e5dcd24","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"type":"agentassist","from":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","to":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","reqId":"cbr-b8ee32b4-02b5-59fa-b377-a71c9973891f","isGroup":false,"body":"City","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","preferredChannelForResponse":"agentassist","channelInst":"agentassist","channelDispName":"AgentAssistV2","nlMeta":{"intent":"City","isRefresh":true},"enable":true,"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","message":"The bot is disabled via AgentAssist. You can still talk to the bot via SmartAssist, Webhook, Web/Mobile Client, AgentAssist.","activeChannels":"SmartAssist,Webhook,Web/Mobile Client,AgentAssist.","isAsync":true,"tokens":[],"__userInputTime":"2023-11-10T10:01:32.818Z","__loopCount":0,"handle":{"clientId":"cs-0c15f901-7df7-5f4b-857d-a185807662c8"},"userId":"u-063e1706-c716-50a2-b64f-11fe066056c3"}],"type":"incoming","status":"received","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","lmodifiedBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","createdOn":"2023-11-10T10:01:32.928Z","lmodifiedOn":"2023-11-10T10:01:32.928Z","botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","components":[{"_id":"cp-5ccceee0-cf83-5218-aab0-caf670d58e10","cT":"text","data":{"text":"City"},"thumbnails":[]}],"iv":"efgvlakZPAr3U1VWt8e8nQ==","ire":true,"timestampValue":1699610492930,"__v":0,"lang":"en","sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","nodeType":0,"tr0_I":"dg-cee54c3e-86a5-5c70-99e7-78c408a5b38b:intent0","tr0_O":"dg-cee54c3e-86a5-5c70-99e7-78c408a5b38b:nd-ent-390e3a01-34c0-432d-88f1-0788745992c1:0f9e2656f73800b6ea38912b495bf016","tr0_T":"0","tr_isSS":1,"resourceid":"messagestore"},{"_id":"ms-519e9ffb-6211-5b6b-8d0d-e6a27f4f6fc5","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-b8ee32b4-02b5-59fa-b377-a71c9973891f","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"agentassist"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:33.389Z","lmodifiedOn":"2023-11-10T10:01:33.389Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-2d551a50-7ca5-53b3-a129-5dedbb0b49bf","cT":"text","data":{"text":"welcome"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"City","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"","userInput":"City","isPrompt":false},"iv":"sSyNARIBJaeLrQsRJyj4Gg==","ire":true,"timestampValue":1699610493391,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-7e9e0a4e-09e1-5e8f-a348-22ea9fdd69ca","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-b8ee32b4-02b5-59fa-b377-a71c9973891f","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"agentassist"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:33.568Z","lmodifiedOn":"2023-11-10T10:01:33.568Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-45deedad-e83e-5488-9f2b-6d4b4c54879d","cT":"text","data":{"text":"enter the city you want to validate"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"City","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"","userInput":"City","entityRequest":true,"entityName":"EnterCity","newEntityDisplayName":"EnterCity","newEntityType":"city","newEntityName":"EnterCity","componentType":"entity","applyDefaultTemplate":false,"isPrompt":true},"iv":"cVP/CPeveaDFtbS/cnsIQg==","ire":true,"timestampValue":1699610493570,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-d3a7401a-b8ef-59b4-b54e-9b2d7965d7dd","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"type":"agentassist","from":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","to":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","reqId":"cbr-37125fac-2279-583f-a515-7404fca64d97","isGroup":false,"body":"hyderabad","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","preferredChannelForResponse":"rtm","channelInst":"agentassist","channelDispName":"AgentAssistV2","enable":true,"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","message":"The bot is disabled via AgentAssist. You can still talk to the bot via SmartAssist, Webhook, Web/Mobile Client, AgentAssist.","activeChannels":"SmartAssist,Webhook,Web/Mobile Client,AgentAssist.","isAsync":true,"tokens":[],"__userInputTime":"2023-11-10T10:01:39.456Z","__loopCount":0,"handle":{"clientId":"cs-0c15f901-7df7-5f4b-857d-a185807662c8"},"userId":"u-063e1706-c716-50a2-b64f-11fe066056c3"}],"type":"incoming","status":"received","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","lmodifiedBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","createdOn":"2023-11-10T10:01:39.515Z","lmodifiedOn":"2023-11-10T10:01:39.515Z","botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","components":[{"_id":"cp-4d54dfca-f794-5f81-9b7b-6fb85170598c","cT":"text","data":{"text":"hyderabad"},"thumbnails":[]}],"iv":"kffOpTqgqw4kNzg7qZYNNw==","ire":true,"timestampValue":1699610499517,"__v":0,"lang":"en","sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","path":"dg-cee54c3e-86a5-5c70-99e7-78c408a5b38b:nd-msg-33123c12-7fa5-45fc-a006-d2a501c4ca86>dg-cee54c3e-86a5-5c70-99e7-78c408a5b38b:nd-ent-390e3a01-34c0-432d-88f1-0788745992c1","tr0_I":"dg-cee54c3e-86a5-5c70-99e7-78c408a5b38b:nd-ent-390e3a01-34c0-432d-88f1-0788745992c1:0f9e2656f73800b6ea38912b495bf016","tr0_O":"dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-ent-b8ec169a-c538-4352-9050-278d98636d3f:74698d3ea69f146400a68b815dcb28a3","tr0_T":"5","resourceid":"messagestore"},{"_id":"ms-fa83070b-9e74-5c88-9956-1635a63d91b5","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-37125fac-2279-583f-a515-7404fca64d97","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:40.196Z","lmodifiedOn":"2023-11-10T10:01:40.196Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-8c32f8fd-e613-518f-935f-5945f543c2a9","cT":"text","data":{"text":"your city is Hyderabad and its valid\n"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"City","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"hyderabad","isPrompt":false,"entityResponse":true,"entityName":"EnterCity","entityValue":"Hyderabad"},"iv":"HqThDEr4xHtA2c9NIugN/A==","ire":true,"timestampValue":1699610500198,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-87324135-d7c5-5625-a769-031b0dd446f6","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-37125fac-2279-583f-a515-7404fca64d97","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:40.323Z","lmodifiedOn":"2023-11-10T10:01:40.323Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-d060b6fc-535c-5200-8ce2-236cbd7d6714","cT":"text","data":{"text":"Please wait while we trigger the next dialog"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"City","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"hyderabad","isPrompt":false},"iv":"saz8H5nmZaZNtwnnLjlTeA==","ire":true,"timestampValue":1699610500326,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-c43df5ec-d41c-50a1-a172-960d603ddbe9","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-37125fac-2279-583f-a515-7404fca64d97","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:40.483Z","lmodifiedOn":"2023-11-10T10:01:40.483Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-1f1bc6b9-cbc6-5ca4-85c5-2c8cde11ed5a","cT":"text","data":{"text":"welcome"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"Multiple","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"hyderabad","isPrompt":false},"iv":"IkadicJWnfHeLSQ+zb0X4g==","ire":true,"timestampValue":1699610500485,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-2e10426f-f849-5307-8fc2-5ce840739da4","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-37125fac-2279-583f-a515-7404fca64d97","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:40.595Z","lmodifiedOn":"2023-11-10T10:01:40.595Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-23601c8b-ac88-5d81-886f-e6d68842526e","cT":"text","data":{"text":"please wait"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"Multiple","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"hyderabad","isPrompt":false},"iv":"FElzJfoNgyfS0Bpk3GkAGw==","ire":true,"timestampValue":1699610500596,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-b0424da7-9d74-583d-8c20-f973227461a2","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-37125fac-2279-583f-a515-7404fca64d97","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:40.712Z","lmodifiedOn":"2023-11-10T10:01:40.712Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-f7074cff-47d3-5524-99f8-ab17cea6c623","cT":"text","data":{"text":"Sample message 01"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"Multiple","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"hyderabad","isPrompt":false},"iv":"xFqSJNUuxwtc9GHZPR9shQ==","ire":true,"timestampValue":1699610500714,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-de0070a2-b4fd-5caf-bc86-90c799bfbf59","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-37125fac-2279-583f-a515-7404fca64d97","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:40.848Z","lmodifiedOn":"2023-11-10T10:01:40.848Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-7ad8950f-3be4-5640-9fe1-a58677bf810a","cT":"text","data":{"text":"Sample message 02\n"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"Multiple","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"hyderabad","isPrompt":false},"iv":"sOYD8fRxGDqpKsYjZ2Obzg==","ire":true,"timestampValue":1699610500850,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-94c390f8-7069-58ea-b75f-6cbdd71cc958","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-37125fac-2279-583f-a515-7404fca64d97","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:41.021Z","lmodifiedOn":"2023-11-10T10:01:41.021Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-1d2a7751-b0ee-5e54-99d3-1d5c468b81df","cT":"text","data":{"text":"Enter the date you want to validate in a format\n"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"Multiple","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"hyderabad","entityRequest":true,"entityName":"Entity0008","newEntityDisplayName":"Multiple","newEntityType":"date","newEntityName":"Entity0008","componentType":"entity","applyDefaultTemplate":false,"isPrompt":true},"iv":"T2+3lWdbwlG55QSvzceoow==","ire":true,"timestampValue":1699610501023,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-0bbfadde-224b-5176-9521-a23710de3561","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"type":"agentassist","from":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","to":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","reqId":"cbr-5429ae9a-f67b-59bc-a244-8ca5f9e2c94a","isGroup":false,"body":"today","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","preferredChannelForResponse":"rtm","channelInst":"agentassist","channelDispName":"AgentAssistV2","enable":true,"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","message":"The bot is disabled via AgentAssist. You can still talk to the bot via SmartAssist, Webhook, Web/Mobile Client, AgentAssist.","activeChannels":"SmartAssist,Webhook,Web/Mobile Client,AgentAssist.","isAsync":true,"tokens":[],"__userInputTime":"2023-11-10T10:01:47.595Z","__loopCount":0,"handle":{"clientId":"cs-0c15f901-7df7-5f4b-857d-a185807662c8"},"userId":"u-063e1706-c716-50a2-b64f-11fe066056c3"}],"type":"incoming","status":"received","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","lmodifiedBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","createdOn":"2023-11-10T10:01:47.655Z","lmodifiedOn":"2023-11-10T10:01:47.655Z","botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","components":[{"_id":"cp-8ba7e905-8416-50bb-99d1-604c1dd80c84","cT":"text","data":{"text":"today"},"thumbnails":[]}],"iv":"plw7zxXx8hCvWcOpZgX4nw==","ire":true,"timestampValue":1699610507658,"__v":0,"lang":"en","sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","path":"dg-cee54c3e-86a5-5c70-99e7-78c408a5b38b:nd-msg-ea80726c-6140-4319-8c6a-882573a9cb58>dg-cee54c3e-86a5-5c70-99e7-78c408a5b38b:nd-msg-1429738a-b02a-42f6-b519-221be23e9d32>dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:intent0>dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-msg-cf396274-2db4-4270-b2d7-ac3dff6567c4>dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-msg-3174b017-0345-4839-b591-865b1abbf609>dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-msg-8c8f494a-1022-4068-9e6c-1d4555225c96>dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-msg-e6b50856-5e8c-45d2-abae-058ed7c614ad>dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-ent-b8ec169a-c538-4352-9050-278d98636d3f","tr0_I":"dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-ent-b8ec169a-c538-4352-9050-278d98636d3f:74698d3ea69f146400a68b815dcb28a3","tr0_O":"dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-msg-48462a23-8a67-4daa-981b-476f33b0cff7:9a7c7fa41ac19942a0d6d35a115f5bdd","tr0_T":"0","tr1_I":"dg-9039a37f-3dab-585a-b6cf-ee59c9b5e9bc:nd-msg-48462a23-8a67-4daa-981b-476f33b0cff7:9a7c7fa41ac19942a0d6d35a115f5bdd","tr1_O":"dg-2b7ab3ce-6d03-57de-81a1-c39ab8b54a0c:nd-dac-1cb0d941-af40-44e3-8c5c-ece997277d4c:76c855f54192bfe2847c62b1adec69a9","tr1_T":"8","resourceid":"messagestore"},{"_id":"ms-ceac9214-418c-5b69-a05d-325d1048ea0f","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-5429ae9a-f67b-59bc-a244-8ca5f9e2c94a","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:48.201Z","lmodifiedOn":"2023-11-10T10:01:48.201Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-98c714eb-ff62-5951-b8bc-d670e608e68b","cT":"text","data":{"text":"The date entered is identified in a format as 2023-11-10"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"Multiple","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"today","isPrompt":false,"entityResponse":true,"entityName":"Entity0008","entityValue":"2023-11-10"},"iv":"pAv3GoZT4SjPXZbrrpJaTA==","ire":true,"timestampValue":1699610508202,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-f21a227e-1d45-52d9-a5d6-e57feef427ed","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-5429ae9a-f67b-59bc-a244-8ca5f9e2c94a","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:48.425Z","lmodifiedOn":"2023-11-10T10:01:48.425Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-19174f68-b51a-55e6-ab65-adeba5a852a2","cT":"text","data":{"text":"Is there anything else that I can assist ?"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"AnythingElse","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"today","endReason":1,"endOfTask":true,"entityRequest":true,"newEntityDisplayName":"Helpagain","newEntityName":"Helpagain","componentType":"dialogAct","applyDefaultTemplate":false,"isPrompt":true},"iv":"2MZdf2LklrF0+40lo4FFlQ==","ire":true,"timestampValue":1699610508427,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"},{"_id":"ms-878b597f-454a-572b-9aea-82fcb61b5c24","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"type":"agentassist","from":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","to":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","reqId":"cbr-2a620a4c-cae9-50f5-afb3-9483ebedee9c","isGroup":false,"body":"no","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","preferredChannelForResponse":"rtm","channelInst":"agentassist","channelDispName":"AgentAssistV2","enable":true,"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","message":"The bot is disabled via AgentAssist. You can still talk to the bot via SmartAssist, Webhook, Web/Mobile Client, AgentAssist.","activeChannels":"SmartAssist,Webhook,Web/Mobile Client,AgentAssist.","isAsync":true,"tokens":[],"__userInputTime":"2023-11-10T10:01:56.796Z","__loopCount":0,"handle":{"clientId":"cs-0c15f901-7df7-5f4b-857d-a185807662c8"},"userId":"u-063e1706-c716-50a2-b64f-11fe066056c3"}],"type":"incoming","status":"received","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","lmodifiedBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","createdOn":"2023-11-10T10:01:56.857Z","lmodifiedOn":"2023-11-10T10:01:56.857Z","botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","components":[{"_id":"cp-27bdd0b3-8165-5767-9165-50a349db595d","cT":"text","data":{"text":"no"},"thumbnails":[]}],"iv":"4J1CEu5ggj1emkUUVz2KSA==","ire":true,"timestampValue":1699610516862,"__v":0,"lang":"en","sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","path":"dg-2b7ab3ce-6d03-57de-81a1-c39ab8b54a0c:nd-msg-91f13e4c-46fb-4da1-986f-fbb666e75db2","tr0_I":"dg-2b7ab3ce-6d03-57de-81a1-c39ab8b54a0c:nd-dac-1cb0d941-af40-44e3-8c5c-ece997277d4c:76c855f54192bfe2847c62b1adec69a9","tr0_O":"dg-2b7ab3ce-6d03-57de-81a1-c39ab8b54a0c:nd-msg-91f13e4c-46fb-4da1-986f-fbb666e75db2:1618e2194361e61bb364b7d4dde5492d","tr0_T":"0","EOD":0,"resourceid":"messagestore"},{"_id":"ms-29661925-6504-5a9a-9b51-926699d2ecae","cek":{"header":{"alg":"dir","enc":"aes-256-gcm","kid":"k-bcf22763-a5be-53d1-8352-aa047caab97b"}},"channels":[{"app_token":"105b74f408dd490f0fcd4679ef770f1ec2cacda1493db7a9231446084a8e7a79","post_url":"https://huddl-xo-dev.kore.ai:443/api/v1/internal/aaresponse","to":"64b8d07946e54e3e3a46a37c/agentassist/c-77886bd-c35e-4c1b-936c-94d4ae1ad408","from":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","type":"agentassist","isAsync":true,"reqId":"cbr-2a620a4c-cae9-50f5-afb3-9483ebedee9c","isGroup":false,"channelDispName":"AgentAssistV2","preferredChannelForResponse":"rtm"}],"type":"outgoing","status":"pending","createdOn":"2023-11-10T10:01:57.397Z","lmodifiedOn":"2023-11-10T10:01:57.397Z","createdBy":"u-063e1706-c716-50a2-b64f-11fe066056c3","components":[{"_id":"cp-a9d15cfc-c050-5a5b-acb3-0d8c87d7392d","cT":"text","data":{"text":"thank you for your support"},"thumbnails":[]}],"botId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","orgId":"o-20b86e6d-abd1-5082-86aa-585b7100db4b","accountId":"64b8d07946e54e3e3a46a37c","tN":"AnythingElse","isBB":0,"ms":1,"chnl":"agentassist","isD":0,"lang":"en","conversationId":"c-77886bd-c35e-4c1b-936c-94d4ae1ad408","agentAssistDetails":{"streamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","srcChannel":"rtm","childBotStreamId":"st-b4ee8ef0-d27b-5ae3-b655-5540054cdb7a","experience":"CHAT","userInput":"no","isPrompt":false,"entityResponse":true,"entityName":"Helpagain","entityValue":"no"},"iv":"eP7/DPqcS7IUGOahQvhDtQ==","ire":true,"timestampValue":1699610517398,"__v":0,"sT":1,"sessionId":"654dff7a1f7ec4381b0c25a8","resourceid":"messagestore"}]
  }

  
}
