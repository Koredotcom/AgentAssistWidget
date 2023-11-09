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
      'childBotName': data?.childBotName || ''
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
      'positionId': data.positionId
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
    return [{ "_id": "ms-5ae780d1-4df6-5bcd-b069-add9b64d56f8", "cek": { "header": { "alg": "dir", "enc": "aes-256-cbc", "kid": "k-e93b9499-2301-5b96-867e-8d817fd6fc59" } }, "channels": [{ "type": "agentassist", "from": "6328000258a2245ee86010d9/agentassist/c-6342449-13b5-4e2e-8b65-18e85c6669ab", "to": "st-88a140b7-c824-5b95-b765-24d24d618b28", "reqId": "cbr-e7269975-7ac5-5805-a869-4ef550ad6276", "isGroup": false, "body": "Flight status", "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "preferredChannelForResponse": "agentassist", "channelInst": "agentassist", "channelDispName": "AgentAssistV2", "nlMeta": { "intent": "Flight status", "isRefresh": true }, "enable": true, "app_token": "3f6302b3bf1e1ff14962a0d403a11494907d393a931b3f82ec415bec3245b3b3", "post_url": "https://uat-sabots.kore.ai:443/api/v1/internal/aaresponse", "message": "The bot is disabled via Agentassist. You can still talk to the bot via SmartAssist, Ivr Inst C 24 C 967 C 94 C 6 59 D 2 85 E 1 9 Ad 0 Ee 1 B 17 Df, Widget SDK, Web/Mobile Client, Agentassist.", "activeChannels": "SmartAssist,Ivr Inst C 24 C 967 C 94 C 6 59 D 2 85 E 1 9 Ad 0 Ee 1 B 17 Df,Widget SDK,Web/Mobile Client,Agentassist.", "isAsync": true, "tokens": [], "__userInputTime": "2023-11-09T05:10:37.859Z", "__loopCount": 0, "handle": { "clientId": "cs-9870861d-1bbf-59b5-9023-314c97e305a6" }, "userId": "u-4259982a-57f5-5b37-b8de-06753741f4d3" }], "type": "incoming", "status": "received", "createdBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "lmodifiedBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "createdOn": "2023-11-09T05:10:38.126Z", "lmodifiedOn": "2023-11-09T05:10:38.126Z", "botId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "orgId": "o-0bc185d6-41a2-54e6-8a34-1f9c848276d0", "accountId": "6328000258a2245ee86010d9", "isBB": 0, "ms": 1, "chnl": "agentassist", "isD": 1, "conversationId": "c-6342449-13b5-4e2e-8b65-18e85c6669ab", "components": [{ "_id": "cp-b9c163f0-94e9-5dba-a3ef-2305afc75c2b", "cT": "text", "data": { "text": "Flight status" }, "thumbnails": [] }], "iv": "B4TiAzjrhTvoeuMzFT2Tnw==", "ire": true, "timestampValue": 1699506638130, "__v": 0, "lang": "en", "sT": 1, "sessionId": "654c6451c66723325bad5b0d", "nodeType": 0, "tr0_I": "dg-19d696c6-10f9-5d6e-b615-fd379fa82a28:intent0:b5657e272ba114bbe7bc6ae22d31bfe0", "tr0_O": "dg-19d696c6-10f9-5d6e-b615-fd379fa82a28:entity6:138f7647a5cd0a618b4df4a2851d15ed", "tr0_T": "0", "tr_pId": "dg-ce7d0884-7b12-5149-9f80-d2186eb88ffb:entity2:5154d8c9a6d82c46cf52bc4de40a3764", "resourceid": "messagestore" }, { "_id": "ms-d0474239-a37b-5f3f-ba5f-da48993b4a62", "cek": { "header": { "alg": "dir", "enc": "aes-256-cbc", "kid": "k-e93b9499-2301-5b96-867e-8d817fd6fc59" } }, "channels": [{ "app_token": "3f6302b3bf1e1ff14962a0d403a11494907d393a931b3f82ec415bec3245b3b3", "post_url": "https://uat-sabots.kore.ai:443/api/v1/internal/aaresponse", "to": "6328000258a2245ee86010d9/agentassist/c-6342449-13b5-4e2e-8b65-18e85c6669ab", "from": "st-88a140b7-c824-5b95-b765-24d24d618b28", "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "type": "agentassist", "isAsync": true, "reqId": "cbr-e7269975-7ac5-5805-a869-4ef550ad6276", "isGroup": false, "channelDispName": "AgentAssistV2", "preferredChannelForResponse": "agentassist" }], "type": "outgoing", "status": "pending", "createdOn": "2023-11-09T05:10:38.491Z", "lmodifiedOn": "2023-11-09T05:10:38.491Z", "createdBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "components": [{ "_id": "cp-9dcbb7b0-515b-586d-a52b-db3a75ede9f1", "cT": "text", "data": { "text": "Please provide the departure city and arrival city to get the flight status" }, "thumbnails": [] }], "botId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "orgId": "o-0bc185d6-41a2-54e6-8a34-1f9c848276d0", "accountId": "6328000258a2245ee86010d9", "tN": "Flight status", "isBB": 0, "ms": 1, "chnl": "agentassist", "isD": 0, "lang": "en", "conversationId": "c-6342449-13b5-4e2e-8b65-18e85c6669ab", "agentAssistDetails": { "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "positionId": "dg-edjx6y3ui4", "srcChannel": "rtm", "childBotStreamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "experience": "", "userInput": "Flight status", "entityRequest": true, "entityName": "ArrivalCity", "newEntityDisplayName": "FlightStatus", "newEntityType": "composite", "newEntityName": "FlightStatus", "componentType": "entity", "applyDefaultTemplate": false, "isPrompt": true }, "iv": "ktZfcXBaf1OTy81XYJWv/A==", "ire": true, "timestampValue": 1699506638493, "__v": 0, "sT": 1, "sessionId": "654c6451c66723325bad5b0d", "resourceid": "messagestore" }, { "_id": "ms-8bddd2f2-c2c3-50af-83b9-690aed207f34", "cek": { "header": { "alg": "dir", "enc": "aes-256-cbc", "kid": "k-e93b9499-2301-5b96-867e-8d817fd6fc59" } }, "channels": [{ "type": "agentassist", "from": "6328000258a2245ee86010d9/agentassist/c-6342449-13b5-4e2e-8b65-18e85c6669ab", "to": "st-88a140b7-c824-5b95-b765-24d24d618b28", "reqId": "cbr-903e5503-2def-5e79-bcde-70336d11730e", "isGroup": false, "body": "hyderabad,mumbai", "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "preferredChannelForResponse": "agentassist", "channelInst": "agentassist", "channelDispName": "AgentAssistV2", "enable": true, "app_token": "3f6302b3bf1e1ff14962a0d403a11494907d393a931b3f82ec415bec3245b3b3", "post_url": "https://uat-sabots.kore.ai:443/api/v1/internal/aaresponse", "message": "The bot is disabled via Agentassist. You can still talk to the bot via SmartAssist, Ivr Inst C 24 C 967 C 94 C 6 59 D 2 85 E 1 9 Ad 0 Ee 1 B 17 Df, Widget SDK, Web/Mobile Client, Agentassist.", "activeChannels": "SmartAssist,Ivr Inst C 24 C 967 C 94 C 6 59 D 2 85 E 1 9 Ad 0 Ee 1 B 17 Df,Widget SDK,Web/Mobile Client,Agentassist.", "isAsync": true, "tokens": [], "__userInputTime": "2023-11-09T05:10:53.943Z", "__loopCount": 0, "handle": { "clientId": "cs-9870861d-1bbf-59b5-9023-314c97e305a6" }, "userId": "u-4259982a-57f5-5b37-b8de-06753741f4d3" }], "type": "incoming", "status": "received", "createdBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "lmodifiedBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "createdOn": "2023-11-09T05:10:54.274Z", "lmodifiedOn": "2023-11-09T05:10:54.274Z", "botId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "orgId": "o-0bc185d6-41a2-54e6-8a34-1f9c848276d0", "accountId": "6328000258a2245ee86010d9", "isBB": 0, "ms": 1, "chnl": "agentassist", "isD": 1, "conversationId": "c-6342449-13b5-4e2e-8b65-18e85c6669ab", "components": [{ "_id": "cp-d0c662da-4c62-5837-9e99-3d59436f59b4", "cT": "text", "data": { "text": "hyderabad,mumbai" }, "thumbnails": [] }], "iv": "cinABuDhhr0Z1KBNJu/05Q==", "ire": true, "timestampValue": 1699506654278, "__v": 0, "lang": "en", "sT": 1, "sessionId": "654c6451c66723325bad5b0d", "tr0_I": "dg-19d696c6-10f9-5d6e-b615-fd379fa82a28:entity6:138f7647a5cd0a618b4df4a2851d15ed", "tr0_T": "0", "path": "dg-19d696c6-10f9-5d6e-b615-fd379fa82a28:service3>dg-19d696c6-10f9-5d6e-b615-fd379fa82a28:script5>dg-19d696c6-10f9-5d6e-b615-fd379fa82a28:message4>dg-ce7d0884-7b12-5149-9f80-d2186eb88ffb:intent0>dg-ce7d0884-7b12-5149-9f80-d2186eb88ffb:script1", "tr0_O": "dg-19d696c6-10f9-5d6e-b615-fd379fa82a28:message4:5ef5a10aba8ba1cd06302da99aec20d2", "EOD": 0, "resourceid": "messagestore" }, { "_id": "ms-235c1bb3-0e71-51fc-8536-882292d7716c", "cek": { "header": { "alg": "dir", "enc": "aes-256-cbc", "kid": "k-e93b9499-2301-5b96-867e-8d817fd6fc59" } }, "channels": [{ "app_token": "3f6302b3bf1e1ff14962a0d403a11494907d393a931b3f82ec415bec3245b3b3", "post_url": "https://uat-sabots.kore.ai:443/api/v1/internal/aaresponse", "to": "6328000258a2245ee86010d9/agentassist/c-6342449-13b5-4e2e-8b65-18e85c6669ab", "from": "st-88a140b7-c824-5b95-b765-24d24d618b28", "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "type": "agentassist", "isAsync": true, "reqId": "cbr-903e5503-2def-5e79-bcde-70336d11730e", "isGroup": false, "channelDispName": "AgentAssistV2", "preferredChannelForResponse": "agentassist" }], "type": "outgoing", "status": "pending", "createdOn": "2023-11-09T05:10:54.971Z", "lmodifiedOn": "2023-11-09T05:10:54.971Z", "createdBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "components": [{ "_id": "cp-9c43d049-6b0e-535e-ab4e-e587952cd790", "cT": "text", "data": { "text": "" }, "thumbnails": [] }], "botId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "orgId": "o-0bc185d6-41a2-54e6-8a34-1f9c848276d0", "accountId": "6328000258a2245ee86010d9", "tN": "Flight status", "isBB": 0, "ms": 1, "chnl": "agentassist", "isD": 0, "lang": "en", "conversationId": "c-6342449-13b5-4e2e-8b65-18e85c6669ab", "agentAssistDetails": { "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "srcChannel": "rtm", "childBotStreamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "experience": "", "userInput": "hyderabad,mumbai", "isPrompt": false, "entityResponse": true, "entityName": "Flight_status", "entityValue": "hyderabad,mumbai", "skipMessageDelivery": true }, "iv": "MaZ4G9kpEnUeohPzvUlzDQ==", "ire": true, "timestampValue": 1699506654975, "__v": 0, "sT": 1, "sessionId": "654c6451c66723325bad5b0d", "resourceid": "messagestore" }, { "_id": "ms-7130d5d2-ec7a-555a-8f5b-7b97b8c6ce8f", "cek": { "header": { "alg": "dir", "enc": "aes-256-cbc", "kid": "k-e93b9499-2301-5b96-867e-8d817fd6fc59" } }, "channels": [{ "app_token": "3f6302b3bf1e1ff14962a0d403a11494907d393a931b3f82ec415bec3245b3b3", "post_url": "https://uat-sabots.kore.ai:443/api/v1/internal/aaresponse", "to": "6328000258a2245ee86010d9/agentassist/c-6342449-13b5-4e2e-8b65-18e85c6669ab", "from": "st-88a140b7-c824-5b95-b765-24d24d618b28", "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "type": "agentassist", "isAsync": true, "reqId": "cbr-903e5503-2def-5e79-bcde-70336d11730e", "isGroup": false, "channelDispName": "AgentAssistV2", "preferredChannelForResponse": "agentassist" }], "type": "outgoing", "status": "pending", "createdOn": "2023-11-09T05:10:55.966Z", "lmodifiedOn": "2023-11-09T05:10:55.966Z", "createdBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "components": [{ "_id": "cp-705e96f7-c1d5-565b-9296-72799ac70515", "cT": "text", "data": { "text": "Please click <a href=\"https://uat-smartassist.kore.ai/r/42726e44515258714561efbfbdefbfbd\">here</a> to view all flight status" }, "thumbnails": [] }], "botId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "orgId": "o-0bc185d6-41a2-54e6-8a34-1f9c848276d0", "accountId": "6328000258a2245ee86010d9", "tN": "Flight status", "isBB": 0, "ms": 1, "chnl": "agentassist", "isD": 0, "lang": "en", "conversationId": "c-6342449-13b5-4e2e-8b65-18e85c6669ab", "agentAssistDetails": { "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "srcChannel": "rtm", "childBotStreamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "experience": "", "userInput": "", "isPrompt": false }, "iv": "cL97BjZk5xM+BMIX8gByOg==", "ire": true, "timestampValue": 1699506655967, "__v": 0, "sT": 1, "sessionId": "654c6451c66723325bad5b0d", "resourceid": "messagestore" }, { "_id": "ms-399b7068-182b-554c-a3c3-99b090d772a3", "cek": { "header": { "alg": "dir", "enc": "aes-256-cbc", "kid": "k-e93b9499-2301-5b96-867e-8d817fd6fc59" } }, "channels": [{ "app_token": "3f6302b3bf1e1ff14962a0d403a11494907d393a931b3f82ec415bec3245b3b3", "post_url": "https://uat-sabots.kore.ai:443/api/v1/internal/aaresponse", "to": "6328000258a2245ee86010d9/agentassist/c-6342449-13b5-4e2e-8b65-18e85c6669ab", "from": "st-88a140b7-c824-5b95-b765-24d24d618b28", "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "type": "agentassist", "isAsync": true, "reqId": "cbr-903e5503-2def-5e79-bcde-70336d11730e", "isGroup": false, "channelDispName": "AgentAssistV2", "preferredChannelForResponse": "agentassist" }], "type": "outgoing", "status": "pending", "createdOn": "2023-11-09T05:10:56.359Z", "lmodifiedOn": "2023-11-09T05:10:56.359Z", "createdBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "components": [{ "_id": "cp-801d34dd-8b3d-5044-bd78-c0b608ea1fee", "cT": "text", "data": { "text": "Let me know if you need any other assistance" }, "thumbnails": [] }], "botId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "orgId": "o-0bc185d6-41a2-54e6-8a34-1f9c848276d0", "accountId": "6328000258a2245ee86010d9", "tN": "AnyThingElse", "isBB": 0, "ms": 1, "chnl": "agentassist", "isD": 0, "lang": "en", "conversationId": "c-6342449-13b5-4e2e-8b65-18e85c6669ab", "agentAssistDetails": { "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "srcChannel": "rtm", "childBotStreamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "experience": "", "userInput": "", "endReason": 1, "endOfTask": true, "entityRequest": true, "newEntityDisplayName": "HelpAgain", "newEntityType": "list_of_values", "newEntityName": "HelpAgain", "componentType": "entity", "applyDefaultTemplate": false, "isPrompt": true }, "iv": "iQG5x32C+H+xOnknouoLGA==", "ire": true, "timestampValue": 1699506656361, "__v": 0, "sT": 1, "sessionId": "654c6451c66723325bad5b0d", "resourceid": "messagestore" }, { "_id": "ms-116ae66d-bba9-5178-affe-dae1e265e531", "cek": { "header": { "alg": "dir", "enc": "aes-256-cbc", "kid": "k-e93b9499-2301-5b96-867e-8d817fd6fc59" } }, "channels": [{ "type": "agentassist", "from": "6328000258a2245ee86010d9/agentassist/c-6342449-13b5-4e2e-8b65-18e85c6669ab", "to": "st-88a140b7-c824-5b95-b765-24d24d618b28", "reqId": "cbr-833ce616-8762-597b-959e-702e9ebe191f", "isGroup": false, "body": "No", "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "preferredChannelForResponse": "agentassist", "channelInst": "agentassist", "channelDispName": "AgentAssistV2", "enable": true, "app_token": "3f6302b3bf1e1ff14962a0d403a11494907d393a931b3f82ec415bec3245b3b3", "post_url": "https://uat-sabots.kore.ai:443/api/v1/internal/aaresponse", "message": "The bot is disabled via Agentassist. You can still talk to the bot via SmartAssist, Ivr Inst C 24 C 967 C 94 C 6 59 D 2 85 E 1 9 Ad 0 Ee 1 B 17 Df, Widget SDK, Web/Mobile Client, Agentassist.", "activeChannels": "SmartAssist,Ivr Inst C 24 C 967 C 94 C 6 59 D 2 85 E 1 9 Ad 0 Ee 1 B 17 Df,Widget SDK,Web/Mobile Client,Agentassist.", "isAsync": true, "tokens": [], "__userInputTime": "2023-11-09T05:11:02.842Z", "__loopCount": 0, "handle": { "clientId": "cs-9870861d-1bbf-59b5-9023-314c97e305a6" }, "userId": "u-4259982a-57f5-5b37-b8de-06753741f4d3" }], "type": "incoming", "status": "received", "createdBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "lmodifiedBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "createdOn": "2023-11-09T05:11:03.113Z", "lmodifiedOn": "2023-11-09T05:11:03.113Z", "botId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "orgId": "o-0bc185d6-41a2-54e6-8a34-1f9c848276d0", "accountId": "6328000258a2245ee86010d9", "isBB": 0, "ms": 1, "chnl": "agentassist", "isD": 1, "conversationId": "c-6342449-13b5-4e2e-8b65-18e85c6669ab", "components": [{ "_id": "cp-a2d989ff-55c3-56fc-b992-af8b2f94de95", "cT": "text", "data": { "text": "No" }, "thumbnails": [] }], "iv": "/3FD+aG7x0ii2z8/vm1ODA==", "ire": true, "timestampValue": 1699506663116, "__v": 0, "lang": "en", "sT": 1, "sessionId": "654c6451c66723325bad5b0d", "EOD": 0, "nodeType": 3, "tr0_I": "smalltalk_9f46b71b:1d1e0b2638e9b2a94bac7fced807fa88", "tr_pId": "dg-ce7d0884-7b12-5149-9f80-d2186eb88ffb:entity2:68fa0de5e2a61edc64a0ba3b2336db71", "path": "dg-ce7d0884-7b12-5149-9f80-d2186eb88ffb:entity2>dg-ce7d0884-7b12-5149-9f80-d2186eb88ffb:message3", "resourceid": "messagestore" }, { "_id": "ms-2abf8e52-7183-576a-90a1-07dcdca63f41", "cek": { "header": { "alg": "dir", "enc": "aes-256-cbc", "kid": "k-e93b9499-2301-5b96-867e-8d817fd6fc59" } }, "channels": [{ "app_token": "3f6302b3bf1e1ff14962a0d403a11494907d393a931b3f82ec415bec3245b3b3", "post_url": "https://uat-sabots.kore.ai:443/api/v1/internal/aaresponse", "to": "6328000258a2245ee86010d9/agentassist/c-6342449-13b5-4e2e-8b65-18e85c6669ab", "from": "st-88a140b7-c824-5b95-b765-24d24d618b28", "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "type": "agentassist", "isAsync": true, "reqId": "cbr-833ce616-8762-597b-959e-702e9ebe191f", "isGroup": false, "channelDispName": "AgentAssistV2", "preferredChannelForResponse": "agentassist" }], "type": "outgoing", "status": "pending", "createdOn": "2023-11-09T05:11:03.716Z", "lmodifiedOn": "2023-11-09T05:11:03.716Z", "createdBy": "u-4259982a-57f5-5b37-b8de-06753741f4d3", "components": [{ "_id": "cp-f70dab1c-a5d8-5cbb-be24-6c8b2bc46d58", "cT": "text", "data": { "text": "Thank you for contacting us. Have a great day." }, "thumbnails": [] }], "botId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "orgId": "o-0bc185d6-41a2-54e6-8a34-1f9c848276d0", "accountId": "6328000258a2245ee86010d9", "tN": "AnyThingElse", "isBB": 0, "ms": 1, "chnl": "agentassist", "isD": 0, "lang": "en", "conversationId": "c-6342449-13b5-4e2e-8b65-18e85c6669ab", "agentAssistDetails": { "streamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "positionId": "dg-edjx6y3ui4", "srcChannel": "rtm", "childBotStreamId": "st-88a140b7-c824-5b95-b765-24d24d618b28", "experience": "", "userInput": "No", "isPrompt": false, "entityResponse": true, "entityName": "HelpAgain", "entityValue": "no" }, "iv": "5O9XMhY1gvltzdMzj7SBAg==", "ire": true, "timestampValue": 1699506663718, "__v": 0, "sT": 1, "sessionId": "654c6451c66723325bad5b0d", "resourceid": "messagestore" }]
  }
  
}
