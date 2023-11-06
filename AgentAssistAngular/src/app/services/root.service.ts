import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjConstants } from '../proj.const';

@Injectable({
  providedIn: 'root'
})
export class RootService {

  socketConnection$ : BehaviorSubject<any> = new BehaviorSubject(null);
  activeTab$ : BehaviorSubject<any> = new BehaviorSubject(null);

  public userBotConversationDetails : any;

  connectionDetails : any = {};
  assistTabSessionId = '';
  myBotTabSessionId = '';
  grantResponseObj : any = {};

  projConstants : any = ProjConstants;

  constructor() { }

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
        console.log("------- autobotid----xxxxxxxxxxxxxx", key)
        if(parmasObj[key] && (parmasObj[key] !== "undefined" && parmasObj[key] !== null)){
          parmasObj['autoBotId'] = parmasObj[key];
        }else{
          parmasObj['autoBotId'] = '';
        }
      }
    }
    console.log("-----------parmasObj-----------", parmasObj)
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
        article.showMoreButton = false;
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
        showMoreButton: false,
        showLessButton: false,
        answerRender : faq.answer || false,
        childBotId : faq.childBotId,
        childBotName : faq.childBotName
      }
      if(faq.answer && faq.answer.length > 0){
        for(let ans of faq.answer){
          let object : any = {
            ans : ans,
            taskRefId: faq.taskRefId,
            showMoreButton : false,
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
        snippet.showMoreButton = false;
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
            ans : ans
          }
          faqObject.answer.push(object);
        }
      }
      searchResponse.push(faqObject);
    }
    return searchResponse;
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType) {
    let message = {};
    if (actionType == this.projConstants.SEND) {
      message = {
        method: 'send',
        name: "agentAssist.SendMessage",
        conversationId: this.connectionDetails.conversationId,
        payload: selectType == this.projConstants.FAQ ? (faq_or_article_obj.answer || faq_or_article_obj.ans) : faq_or_article_obj.content
      };
      console.log(message, 'message')
      window.parent.postMessage(message, '*');
    } else {
      message = {
        method: 'copy',
        name: "agentAssist.CopyMessage",
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

  handleEmptyLine(answer, quotflag){
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