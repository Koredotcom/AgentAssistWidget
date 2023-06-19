import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EVENTS } from '../helper/events';
import { WebSocketService } from './web-socket.service';
import * as $ from 'jquery';
import { IdReferenceConst, ProjConstants, storageConst } from '../constants/proj.cnts';
import { DesignAlterService } from './design-alter.service';
import { LocalStorageService } from './local-storage.service';
import { TemplateRenderClassService } from './template-render-class.service';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';

declare var $: any;
declare const agentAssistHelpers: any;
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  configObj;
  grantResponseObj;
  activeTab : string;
  userIntentInput: string;
  scrollContent: any = {};
  entitiestValueArray : any;
  previousEntitiesValue : any;
  isRestore : boolean = false;
  OverRideMode: boolean = false;
  automationNotRanArray: any = [];
  isCallConversation: boolean = false;
  isAutomationOnGoing: boolean = false;
  isInitialDialogOnGoing: boolean = false;
  isMyBotAutomationOnGoing: boolean = false;
  noAutomationrunninginMyBot: boolean = true;
  isFirstMessagOfDialogInMyBot : boolean = false;
  isAgentSentRequestOnClick: boolean = false;
  isMyBotAgentSentRequestOnClick: boolean = false;
  isUpdateFeedBackDetailsFlag : boolean = false;
  currentPositionId;
  currentPositionIdOfMyBot;
  childBotDetails = {
    childBotName : '',
    childBotId : ''
  }

  clickEventObjectsBeforeTabShift : any = [];
  tabNamevsId : any = {
    [ProjConstants.ASSIST] : IdReferenceConst.DYNAMICBLOCK,
    [ProjConstants.MYBOT] : IdReferenceConst.MYBOTAUTOMATIONBLOCK,
    [ProjConstants.TRANSCRIPT] : IdReferenceConst.SCRIPTCONTAINER,
    [ProjConstants.LIBRARY] : IdReferenceConst.LIBRARY_CONATINER,
    [ProjConstants.HISTORY] : IdReferenceConst.HISTORY_CONTAINER
  }

  tabNamevsScrollId : any = {
    [ProjConstants.ASSIST] : IdReferenceConst.SCROLLBUTTON_ASSIST,
    [ProjConstants.MYBOT] : IdReferenceConst.SCROLLBUTTON_MYBOT,
    [ProjConstants.TRANSCRIPT] : IdReferenceConst.SCROLLBUTTON_TRANSCRIPT,
    [ProjConstants.HISTORY] : IdReferenceConst.SCROLLBUTTON_HISTORY
  }
  aaHelpers = null;
  constructor(private route: ActivatedRoute, private webSocketService: WebSocketService, private designAlterService: DesignAlterService,
    private localStorageService: LocalStorageService,private templateRenderClassService: TemplateRenderClassService) {
    this.setScrollContent();
    this.aaHelpers = new agentAssistHelpers();
  }


  //initialize and update scroll related variables
  setScrollContent() {
    this.scrollContent = {
      [ProjConstants.ASSIST]: {
        numberOfNewMessages: 0,
        newlyAddedIdList: [],
        newlyAddedMessagesUUIDlist: [],
        removedIdListOnScroll: [],
        lastElement: '',
        lastElementBeforeNewMessage: '',
        scrollAtEnd: true
      },
      [ProjConstants.MYBOT]: {
        numberOfNewMessages: 0,
        newlyAddedIdList: [],
        newlyAddedMessagesUUIDlist: [],
        removedIdListOnScroll: [],
        lastElement: '',
        lastElementBeforeNewMessage: '',
        scrollAtEnd: true
      },
      [ProjConstants.TRANSCRIPT]: {
        numberOfNewMessages: 0,
        newlyAddedIdList: [],
        newlyAddedMessagesUUIDlist: [],
        removedIdListOnScroll: [],
        lastElement: '',
        lastElementBeforeNewMessage: '',
        scrollAtEnd: true
      },
      [ProjConstants.HISTORY]: {
        numberOfNewMessages: 0,
        newlyAddedIdList: [],
        newlyAddedMessagesUUIDlist: [],
        removedIdListOnScroll: [],
        lastElement: '',
        lastElementBeforeNewMessage: '',
        scrollAtEnd: true
      }
    }
  }

  updateScrollAtEndVariables(tabType) {
    $(".scroll-bottom-btn span").text('Scroll to bottom');
    $(".scroll-bottom-btn").removeClass("new-messages");
    $(".scroll-bottom-show-btn").addClass('hiddenEle');
    this.scrollContent[tabType].numberOfNewMessages = 0;
    this.scrollContent[tabType].newlyAddedMessagesUUIDlist = [];
    this.scrollContent[tabType].newlyAddedIdList = [];
    this.scrollContent[tabType].removedIdListOnScroll = [];
  }

  //prepare request Prams for agentassist request
  prepareAgentAssistRequestParams(data) {
    let agent_assist_request = {
      'conversationId': data.conversationId,
      'query': data.value,
      'botId': data.botId,
      'agentId': '',
      'experience': this.isCallConversation === true ? 'voice' : 'chat',
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
    if(this.configObj?.autoBotId && this.configObj?.autoBotId !== 'undefined') {
      console.log(this.configObj);
      agent_assist_request['autoBotId'] = this.configObj.autoBotId;
    } else {
      agent_assist_request['autoBotId'] = '';
    }
    return agent_assist_request;
  }

  prepareAgentAssistAgentRequestParams(data) {
    let agent_assist_agent_request_params: any = {
      'isSearch': data.isSearch,
      'conversationId': data.conversationId,
      'query': data.value,
      'botId': data.botId,
      'experience': this.isCallConversation === true ? 'voice' : 'chat',
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
    if(this.configObj?.autoBotId && this.configObj?.autoBotId !== 'undefined') {
      console.log(this.configObj);
      agent_assist_agent_request_params['autoBotId'] = this.configObj.autoBotId;
    } else {
      agent_assist_agent_request_params['autoBotId'] = '';
    }
    return agent_assist_agent_request_params;
  }

  //local storage update
  updateAgentAssistState(_convId, _tabName, _data) {
    if (!_data.suggestions && _data.buttons?.length > 1) {
      let storageObject: any = {
        [storageConst.IS_WELCOMEMSG_PROCESSED]: true,
        // [storageConst.AUTOMATION_GOING_ON]: this.isAutomationOnGoing
      }
      this.localStorageService.setLocalStorageItem(storageObject);
    }
  }

  // grant call and sts related code
  grantCall(jwtID, botid, url): Promise<any> {
    var payload = {
      "assertion": jwtID,
      "botInfo": {
        "chatBot": "sample Bot",
        "taskBotId": botid
      },
      "token": {}
    }
    return $.ajax({
      url: url + '/api/1.1/oAuth/token/jwtgrant',
      type: 'POST',
      crossDomain: true,
      contentType: 'application/json',
      headers: {
        "content-type": 'application/json'
      },
      data: JSON.stringify(payload),
      dataType: "json",
      success: function (response) {
        this.grantResponseObj = response;
        return response;
      },
      error: function (error) {
        console.error("token is wrong");
        return error;
      }
    }).promise();

  }

  getAccessToken() {
    return this.grantResponseObj?.authorization.accessToken;
  }

  callSts(jsonData) {
    return $.ajax({
      url: "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts",
      type: 'post',
      data: jsonData,
      dataType: 'json',
      success: function (data) {
        return data;
      },
      error: function (err) {
        console.error("jwt token generation failed");
        return err;
      }
    }).promise();
  }

  // old message collapse
  checkDropdownCollapaseState(lastElement, tabType) {
    if (lastElement && lastElement.className.includes('steps-run-data')) {
      let lastElementId = this.designAlterService.getUUIDFromId(lastElement.id);
      lastElementId = lastElementId.split("*")[0];
      let collapseElement = document.getElementById('dropDownData-' + lastElementId);
      if (collapseElement && collapseElement.className.includes('hide') && this.scrollContent[tabType].numberOfNewMessages) {
        this.scrollContent[tabType].scrollAtEnd = false;
      }
    }
  }

  // new message count update
  updateNewMessageCount(lastElementBeforeNewMessage, tabType) {
    for (let id of this.scrollContent[tabType].newlyAddedIdList) {
      let element = document.getElementById(id);
      if (element) {
        let inView = !this.designAlterService.isScrolledIntoView(element) ? true : false;
        if (inView) {
          this.scrollContent[tabType].removedIdListOnScroll.push(id);
          this.scrollContent[tabType].newlyAddedIdList = this.scrollContent[tabType].newlyAddedIdList.filter(item => item !== id)
          this.scrollContent[tabType].numberOfNewMessages = this.scrollContent[tabType].numberOfNewMessages > 0 ? this.scrollContent[tabType].numberOfNewMessages - 1 : 0;
          if (id.includes('automationSuggestions')) {
            let agentUttInfoId = id.split('-');
            agentUttInfoId.shift();
            agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
            if (document.getElementById(agentUttInfoId)) {
              lastElementBeforeNewMessage = document.getElementById(agentUttInfoId);
            }
          } else if (id.includes('stepsrundata')) {
            lastElementBeforeNewMessage = document.getElementById(id);
          } else {
            lastElementBeforeNewMessage = this.designAlterService.getLastElement(id);
          }

          if (this.scrollContent[tabType].numberOfNewMessages) {
            $(".scroll-bottom-btn").addClass("new-messages");
            $(".scroll-bottom-btn span").text(this.scrollContent[tabType].numberOfNewMessages + ' new');
          } else {
            $(".scroll-bottom-btn span").text('Scroll to bottom');
          }
        }
      }
    }
  }

  //Feedback related code.
  addFeedbackHtmlToDomForHistory(data, botId, userIntentInput, id, runForAgentBot, previousTaskPositionId) {
    var dropDownData;
    var endOfDialoge;
    let taskIdOfDialog = $(`#dropDownData-${id}`).attr('data-task-id');
    let positionID = previousTaskPositionId;
    this.isAutomationOnGoing = false;
    if (runForAgentBot) {
      $(`#myBotTerminateAgentDialog-${id}.btn-danger`).remove();
      dropDownData = $(`#dropDownData-${id}`);
      endOfDialoge = $(`#MyBotaddRemoveDropDown-${id}`);
    } else {
      $(`#addRemoveDropDown-${id} .btn-danger`).remove();
      dropDownData = $(`#dropDownData-${id}`);
      endOfDialoge = $(`#addRemoveDropDown-${id}`);
    }
    let endofDialogeHtml = `
                    <div class="dilog-task-end" id="endTaks-${id}">
                    <div class="text-dialog-task-end">Dialog Task ended</div>
                               </div>
                               <div class="feedback-helpul-container" id="feedbackHelpfulContainer-${id}">
                                <div class="titles-content">
                                    <div class="title">Helpful?</div>
                                    <div class="btn-positive" id="feedbackup-${id}">
                                        <i class="ast-thumbup"
                                        id="feedbackup-${id}"
                                        data-feedbacklike="false"
                                        data-conv-id="${this.configObj.conversationId}"
                                        data-bot-id="${botId}" data-feedback="like"
                                        data-dialog-name="${data.tN}"
                                        data-user-input="${userIntentInput}"
                                        data-comment=""
                                        data-feedbackdetails="[]"
                                        data-task-id ="${taskIdOfDialog}"
                                        data-dialogId="${positionID}"></i>
                                        <span class="tootltip-tabs">Like</span>
                                    </div>
                                    <div class="btn-negtive" id="feedbackdown-${id}">
                                        <i class="ast-thumbdown"
                                        id="feedbackdown-${id}"
                                        data-feedbackdislike="false"
                                        data-conv-id="${this.configObj.conversationId}"
                                        data-bot-id="${botId}" data-feedback="dislike"
                                        data-dialog-name="${data.tN}"
                                        data-user-input="${userIntentInput}"
                                        data-comment=""
                                        data-feedbackdetails="[]"
                                        data-task-id ="${taskIdOfDialog}"
                                        data-dialogId="${positionID}"></i>
                                        <span class="tootltip-tabs">Dislike</span>
                                    </div>
                                    <div class="thanks-update hide">Thanks for the feedback!</div>
                                    <div class="help-improve-arrow hide">
                                        <div class="title-improve hide">Help us improve (optional)</div>
                                        <div class="arrow-icon" data-feedback-drop-down-opened="false" id="dropdownArrowFeedBack-${id}">
                                            <i class="ast-carrotup" data-feedback-drop-down-opened="false" id="dropdownArrowFeedBackIcon-${id}"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="explore-more-negtive-data hide">
                                    <div class="btns-group-negtive-chips" id="feedBackOptions-${id}">
                                        <div class="btn-chip-negtive" data-chip-click='false'>Wrong suggestions</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Incorrect intent</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Accidental click</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Time taking</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Other</div>
                                    </div>
                                    <div class="input-block-optional">
                                        <div class="label-text">Additional comments (Optional)</div>
                                        <input type="text" placeholder="Type to add comment" class="input-text" id="feedBackComment-${id}"
                                        data-feedback-comment="true">
                                    </div>
                                    <button class="submit-btn" data-updateFlag="false" id="feedbackSubmit" disabled>Submit</button>
                                </div>
                            </div>

                    `;
    if (!document.getElementById('endTaks-' + id)) {
      endOfDialoge.append(endofDialogeHtml);
      $(`#overRideDiv-${id}`).remove();
    }
    $(`.customer-feeling-text`).addClass('bottom-95');
    setTimeout(() => {
      id = undefined;
    }, 100)
    // dropdownHeaderUuids = undefined;
  }

  UpdateFeedBackDetails(data, tabName) {
      if(!tabName){
          tabName = 'userAutoIcon'? 'dynamicBlock':'agentAutoContainer';
      }
      let allFeedBackDetails = $(`#${tabName} .feedback-helpul-container`);
      allFeedBackDetails?.each((i, ele) => {
          let feedDataSet;
          if (data.feedback == 'dislike') {
              feedDataSet = $(ele).find('.btn-negtive .ast-thumbdown').data();
          } else {
              feedDataSet = $(ele).find('.btn-positive .ast-thumbup').data();
          }

          if (feedDataSet.dialogid == data.positionId && data.feedback == 'like') {
              $(ele).find('.btn-positive').addClass('active-feedback');
              $(ele).find('.btn-positive .ast-thumbup').addClass('active-feedback');
              $(ele).find('.thanks-update').removeClass('hide');
          } else if (feedDataSet.dialogid == data.positionId && data.feedback == 'dislike') {
              $(ele).find('.btn-negtive').addClass('active-feedback');
              $(ele).find('.btn-negtive .ast-thumbdown').addClass('active-feedback');
              $(ele).find('.help-improve-arrow').removeClass('hide')
              if (data.feedbackDetails.length > 0 || data.comment.length > 0) {
                  $(ele).find('.explore-more-negtive-data').removeClass('hide');
                  let btnChipNegtive = $(ele).find('.btn-chip-negtive');
                  btnChipNegtive.each((i, eles) => {
                      data.feedbackDetails.includes(eles.innerHTML) ?
                          ($(eles).addClass('active-chip'),$(eles).attr('data-chip-click', 'true')) : $(eles).attr('data-chip-click', 'false');
                  });
                  $(ele).find('.input-block-optional .input-text').attr('value', data.comment);
                  $(ele).find('.input-block-optional .input-text').val(data.comment);
                  $(ele).find(`.ast-thumbdown`).attr('data-comment',`${data.comment}`)
                  $(ele).find(`.ast-thumbdown`).attr('data-feedbackdetails', data.feedbackDetails)
                  feedDataSet.comment = data.comment;
                  feedDataSet.feedbackdetails = data.feedbackDetails;
              } else {
                  $(ele).find('.btn-chip-negtive').removeClass('active-chip');
                  $(ele).find('.title-improve').removeClass('hide');
              }
          }
      })
  }


  addFeedbackHtmlToDom(headerUUids, lastElementBeforeNewMessage, dialogName, positionID, userIntentInput?, runForAgentBot?) {
    let dropDownData;
    let endOfDialoge;
    let taskIdOfDialog = $(`#dropDownData-${headerUUids}`).attr('data-task-id');
    if (runForAgentBot) {
      $(`#myBotTerminateAgentDialog-${headerUUids}.btn-danger`).remove();
      dropDownData = $(`#dropDownData-${headerUUids}`);
      endOfDialoge = $(`#MyBotaddRemoveDropDown-${headerUUids}`);
    } else {
      $(`#addRemoveDropDown-${headerUUids} .btn-danger`).remove();
      dropDownData = $(`#dropDownData-${headerUUids}`);
      endOfDialoge = $(`#addRemoveDropDown-${headerUUids}`);
    }
    let endofDialogeHtml = `
                    <div class="dilog-task-end" id="endTaks-${headerUUids}">
                    <div class="text-dialog-task-end">Dialog Task ended</div>
                               </div>
                               <div class="feedback-helpul-container" id="feedbackHelpfulContainer-${headerUUids}">
                                <div class="titles-content">
                                    <div class="title">Helpful?</div>
                                    <div class="btn-positive" id="feedbackup-${headerUUids}">
                                        <i class="ast-thumbup"
                                        id="feedbackup-${headerUUids}"
                                        data-feedbacklike="false"
                                        data-conv-id="${this.configObj.conversationId}"
                                        data-bot-id="${this.configObj.botid}" data-feedback="like"
                                        data-dialog-name="${dialogName}"
                                        data-user-input="${userIntentInput}"
                                        data-comment=""
                                        data-feedbackdetails="[]"
                                        data-task-id ="${taskIdOfDialog}"
                                        data-dialogId="${positionID}"></i>
                                        <span class="tootltip-tabs">Like</span>
                                    </div>
                                    <div class="btn-negtive" id="feedbackdown-${headerUUids}">
                                        <i class="ast-thumbdown"
                                        id="feedbackdown-${headerUUids}"
                                        data-feedbackdislike="false"
                                        data-conv-id="${this.configObj.conversationId}"
                                        data-bot-id="${this.configObj.botid}" data-feedback="dislike"
                                        data-dialog-name="${dialogName}"
                                        data-user-input="${userIntentInput}"
                                        data-comment=""
                                        data-feedbackdetails="[]"
                                        data-task-id ="${taskIdOfDialog}"
                                        data-dialogId="${positionID}"></i>
                                        <span class="tootltip-tabs">Dislike</span>
                                    </div>
                                    <div class="thanks-update hide">Thanks for the feedback!</div>
                                    <div class="help-improve-arrow hide">
                                        <div class="title-improve hide">Help us improve (optional)</div>
                                        <div class="arrow-icon" data-feedback-drop-down-opened="false" id="dropdownArrowFeedBack-${headerUUids}">
                                            <i class="ast-carrotup" data-feedback-drop-down-opened="false" id="dropdownArrowFeedBackIcon-${headerUUids}"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="explore-more-negtive-data hide">
                                    <div class="btns-group-negtive-chips" id="feedBackOptions-${headerUUids}">
                                        <div class="btn-chip-negtive" data-chip-click='false'>Wrong suggestions</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Incorrect intent</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Accidental click</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Time taking</div>
                                        <div class="btn-chip-negtive" data-chip-click='false'>Other</div>
                                    </div>
                                    <div class="input-block-optional">
                                        <div class="label-text">Additional comments (Optional)</div>
                                        <input type="text" placeholder="Type to add comment" class="input-text" id="feedBackComment-${headerUUids}"
                                        data-feedback-comment="true">
                                    </div>
                                    <button class="submit-btn" data-updateFlag="false"id="feedbackSubmit" disabled>Submit</button>
                                </div>
                            </div>

                    `;
    if (!document.getElementById('endTaks-' + headerUUids)) {
      endOfDialoge.append(endofDialogeHtml);
      $(`#overRideDiv-${headerUUids}`).remove();
    }
    $(`.customer-feeling-text`).addClass('bottom-95');
    // setTimeout(() => {
    //     headerUUids = undefined;
    // }, 100)
    this.designAlterService.UnCollapseDropdownForLastElement(lastElementBeforeNewMessage);
    ;
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

  // send and copy button related code
  preparePostMessageForSendAndCopy(evt, data, eventName, connectionDetails) {
    if(eventName == IdReferenceConst.COPYMSG){
      let ele = document.getElementById(`displayData-${evt.target.dataset.msgId}`) ? document.getElementById(`displayData-${evt.target.dataset.msgId}`) : document.getElementById(evt.target.dataset.msgId);
      data = (data && data !== '') ? data : (evt.target.parentNode.dataset.msgData && evt.target.parentNode.dataset.msgData !== '' ? evt.target.parentNode.dataset.msgData : ele.innerText)
    }

    let payload = data;

    let message : any = {
      method: (eventName == IdReferenceConst.SENDMSG) ? IdReferenceConst.SEND_METHOD : IdReferenceConst.COPY_METHOD,
      name: (eventName == IdReferenceConst.SENDMSG) ? IdReferenceConst.SENDMSG_REQUEST : IdReferenceConst.COPYMSG_REQUEST,
      conversationId: connectionDetails.conversationId,
      payload: payload
    };

    if (eventName == IdReferenceConst.SENDMSG) {
      window.parent.postMessage(message, '*');
    } else if (eventName == IdReferenceConst.COPYMSG) {
      parent.postMessage(message, '*');
    }

    let payloadForBE : any = {
      type: (eventName == IdReferenceConst.SENDMSG) ? IdReferenceConst.SEND_METHOD : IdReferenceConst.COPY_METHOD,
      name: (eventName == IdReferenceConst.SENDMSG) ? IdReferenceConst.SENDMSG_REQUEST : IdReferenceConst.COPYMSG_REQUEST,
      conversationId: connectionDetails.conversationId,
      payload: payload,
      botId: connectionDetails.botId,
      positionId: evt.target.dataset?.positionId
    };
    this.webSocketService.emitEvents(EVENTS.agent_send_or_copy, payloadForBE);
    this.highLightAndStoreFaqId(evt, data, connectionDetails);
  }

  removingSendCopyBtnForCall(connectionDetails) {
    if (connectionDetails.isCall && connectionDetails.isCall === 'true') {
      $(document.body).find('[id="sendMsg"], .copy-btn').remove();
    }
  }

  // faq related code
  highLightAndStoreFaqId(evt, data, connectionDetails) {
    let faqElementId = $(evt.target).parent().parent().attr('id');
    if (document.getElementById(faqElementId)) {
      let faqParentElementId = $(evt.target).parent().parent().parent().attr('id');
      let storedfaqId = faqParentElementId + '_' + faqElementId;
      document.getElementById(faqElementId).style.borderStyle = "solid";
      this.setSentFaqListInStorage(connectionDetails.conversationId, storedfaqId);
    }
  }

  setSentFaqListInStorage(convId, faqId) {
    let appState = this.localStorageService.getLocalStorageState();
    if (appState && appState[convId] && appState[convId][storageConst.FAQ_LIST].indexOf(faqId) == -1) {
      appState[convId][storageConst.FAQ_LIST].push(faqId);
      let storageObject: any = {
        [storageConst.FAQ_LIST]: appState[convId][storageConst.FAQ_LIST]
      }
      this.localStorageService.setLocalStorageItem(storageObject);
    }
  }

  //article related code
  getSampleSearchResponse() {
    return of(["agent_assist_agent_response", {
      "isSearch": true, "conversationId": this.configObj.conversationId, "botId": this.configObj.botid, "experience": "voice", "type": "text", "value": "How does COVID -19 spread?", "event": "agent_assist_agent_response", "volleyTone": [], "totalTone": [],
      "suggestions": {
        "dialogs": [{ "name": "Check Balance", "taskRefId": "" }], "faqs": [{ "question": "How does COVID -19 spread?", "taskRefId": "6328015fd044a360eb9d9590", "answer": "Covid spreads through tiny virus particles that get inside the body. The most common way for covid to enter the body is by being breathed in from infected air. This can happen when people stand close together. \r\n\r\nWhen a person breaths out, it’s not just air that leaves their nose or mouth. Tiny water droplets are also breathed out, and these can be infected with viruses like colds or covid. These water droplets can be breathed in by other people, or if they land on a surface that someone touches later, that person could catch coronavirus.\r\n\r\nThis is why wearing masks, social distancing and washing hands is so important. Wearing masks reduces the amount of water droplets that spread when you breath out. Social distancing can help keep you too far away from someone to breath in their air. Washing hands can help kill any viruses on your hands." }, { "question": "How can I get new password?", "taskRefId": "6328015fd044a360eb9d9590", "answer": "Login to application URL and click on forgot password button" }, { "question": "How can I get new password?", "taskRefId": "6328015fd044a360eb9d9590", "answer": "Login to application URL and click on forgot password button" }],
        "searchassist": { "data": [{ "title": "Operations security", "type": "page", "doc_url": "https://searchassist123.atlassian.net/wiki/spaces/SAMPLE/pages/d-824f15a6-a8f3-5472-b77e-2473a10d8139", "content": "IntroductionOperations security focus on the risks brought from the operation (or running through time to obtain a benefit) of the systems and applications. Hence, it is vital to ensure a continual security that keeps along the changes in the internal and external environments in order to ensure that new/evolving risks are taken into consideration in the operation of such systems and applications (for example, detect and patch new vulnerabilities affecting the assets, monitor for possible attacks and abnormal behaviour, perform changes in the assets in a secure way, maintain a secure configuration in the environment, etc). Altough backup of the important data and configurations would be a part of the operations security, it will be treated in the chapter Resilience and disaster recovery for IT systems and applications, as it is also an integral part for the disaster preparation and recovery efforts, as well as some segregation rules that are covered in the chapter Aspects of networking for systems and application security.Tasks to perform1.Document the processes for secure operationOperating procedures shall be documented in an operations manual by the Application/Service Manager. The operations manual should contain the following topics:Detailed architecture overview of all IT systems and applications required for the IT service.Overview of all interfaces.Responsibilities and deputy regulations for administrative tasks.Change management procedures.Configuration management.Vulnerability management.Patch management.Capacity management.Backup and recovery.Logging scheme.Escalation procedures.2.Hardening, vulnerability and patch managementHardening is the process of applying secure configurations to systems and applications in order to minimize the exposure area of that assets to the minimum required.Vulnerability management is the process to discover vulnerabilities in systems and applications (using manual processes like pentesting or by automated tools like vulnerability scanners) and manage them to fix the issues presented.Patching is the process to deploy security updates or fixes from vendors to correct vulnerabilities.The tool that has to be used for automated tracking of remediation of findings in IT assets is VURIOUS. Access to VURIOUS is only required when there are findings which needs remediation – in that case an account is automatically created and you can login. If there are no <span class = \"highlightText\">tickets</span> assigned to you or you have no role in VURIOUS, access is not possible. 2.1 HardeningSecure configuration is critical to avoid exposing too much from an asset (like unnecessary ports or services), having weak security options (like weak passwords) that could be circumvented, and other security concerns (like default accounts and passwords). Hence, IT systems and applications shall be configured securely according to Security Measure Plans which can be found on SFeRA. For applications/systems where such a Security Measure Plan does not exist yet, use the best practices recommended by each vendor (Oracle, Microsoft, Red Hat, SAP, etc) (SISP 12.1.1-05). 2.2 Vulnerability ManagementIT systems and applications connected to the SCM procure Corporate Network shall be scanned by the corporate scan service (called IPINS+) to uncover potential vulnerabilities in software components. Apart from network vulnerability scannings, the service allows to deploy an agent (QAgent) to improve the detection process in systems (from the network scanning some tests are not able to be performed like an agent with a server account could, thus allowing to discard some false positives that network scans would rise, and also the network scan could be prevented from checking all open ports due to FW filtering) (SISP 12-6-1-01). For ACP L2 or L3 assets, IT Security Audits (in case of performing them, only mandatory for ACP L3 assets, althought highly recommended for L2) shall be properly planned and agreed with the respective Asset Manager and Asset Owner of the IT system and application, and incorporated into the System Development Life Cycle of IT systems and applications. At least the following topics shall be carefully planned (SISP 12.7.1-01):2.3 Patch managementA subscription list will be created on the Security Vulnerability Monitoring (SVM) tool containing all the application components and base SW (like OS, DB, application/web server, etc) in order to receive notifications of new vendor security fixes and updates to be implemented on the applicable IT systems and applications (SVM priority wording: \\\"critical\\\" -> Prio 1, \\\"major\\\" -> Prio 2, \\\"minor\\\" -> Prio 3) (SISP 12.6.1-03, SISP PR001-0002, PR001-0011). The patching process will follow these steps:3.Change managementChanges in IT and Application assets can introduce new security issues when not correctly assessed and performed or be the cause for a security issue by themselves (like provoking unavailability). Hence, having a formal process that takes into account security is critical. A formal process to control and perform changes to IT systems and applications shall be defined and established. A formal change management process shall set the obligations to at least (SISP 12.1.2-01, SISP 12.1.2-03):Assess the potential impact of the change prior to implementation.Test the change in testing environments before deployment to production.Define a formal change approval procedure.Define fallback procedures.Document all steps.4.Capacity managementAn incorrect or non-existent management of capacity for systems can turn into availability problems as well as corruption of information (integrity).A capacity management process to ensure the capacity of IT systems and infrastructure shall be documented (Operations manual o document apart linked from the operations manual) and implemented. The capacity management process shall be used to:Set boundaries for acceptable service performance and availability,Monitor the usage of resources and send warning messages to the operations staff when a threshold is reached,Make projection for future resources requirements,Ensure the integrity and availability of IT systems and applications.Aspects like storage capacity, CPU load, network load and others deemed necessary to ensure the proper functioning of the systems should be monitored and alerts established with enough margin (when possible) to be able to solve the issue before it becomes an incident (SISP 12.1.3-01).", "link": "https://searchassist123.atlassian.net/wiki/rest/api/content/393229" }] }
      }, "endOfTask": true, "isPrompt": false, "userInput": "COVID-19"
    }])
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
        article.userInput = response.userInput;
      }
    }
    for (let faq of faqArray) {
      let faqObject : any = {
        question: faq.question,
        displayName: faq.displayName,
        answer: (faq.answer && faq.answer.length > 0) ? [] : false,
        showMoreButton: false,
        showLessButton: false,
        answerRender : faq.answer || false
      }
      if(faq.answer && faq.answer.length > 0){
        for(let ans of faq.answer){
          let object : any = {
            ans : ans,
            showMoreButton : false,
            showLessButton : false
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
      searchResponse.dialogs.push({ name: dialog.name, agentRunButton: false, childBotId : dialog.childBotId,
        childBotName : dialog.childBotName });
    }
    console.log(searchResponse, "searchresponse");

    return searchResponse;
  }

  formatFAQResponse(faqArray){
    let searchResponse = [];
    for (let faq of faqArray) {
      let faqObject : any = {
        question: faq.question,
        answer: (faq.answer && faq.answer.length > 0) ? [] : false
      }
      if(faq.answer && faq.answer.length > 0){
        for(let ans of faq.answer){
          let object : any = {
            ans : ans
          }
          faqObject.answer.push(object);
        }
      }
      searchResponse.push(faqObject);
    }
    return searchResponse;
  }

  checkEmptyObjectsInArray(arr){
    arr = arr.filter(
        obj => !(obj && Object.keys(obj).length === 0)
    );
    return arr;
  }

  //history related code
  async renderHistoryFeedBack(url) {
    const response = await $.ajax({
      method: 'GET',
      url: url
    });
    if (response.results) {
      return response.results;
    } else {
      console.log("error")
    }
  }

  formatHistoryResponseForFAQ(response){
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

  async renderingAgentHistoryMessage(connectionDetails) {
    console.log(this.configObj.autoBotId, connectionDetails.autoBotId,"agent history-----",this.configObj, connectionDetails);
    
    let url = `${this.configObj.agentassisturl}/agentassist/api/v1/agent-feedback/${this.configObj.conversationId}?interaction=mybot`;
    let feedBackResult = await this.renderHistoryFeedBack(url);
    if(this.configObj.fromSAT) {
      return this.getAgentHistoryData(`${this.configObj.agentassisturl}/agentassist/api/v1/conversations/${this.configObj.conversationId}/aa/messages?botId=${this.isEmptyStr(connectionDetails.autoBotId) ? connectionDetails.autoBotId: this.isEmptyStr(this.configObj.autoBotId) ? this.configObj.autoBotId : connectionDetails.botId}&agentHistory=true`)
      .then(response => {
        return { messages: response, feedbackDetails: feedBackResult }
      }).catch(err => {
        console.log("error", err)
        return err;
      });
    } else {
        return this.getAgentHistoryData(`${this.configObj.agentassisturl}/api/1.1/botmessages/agentassist/${this.isEmptyStr(connectionDetails.autoBotId)? connectionDetails.autoBotId: this.isEmptyStr(this.configObj.autoBotId) ? this.configObj.autoBotId: connectionDetails.botId}/history?convId=${this.configObj.conversationId}&agentHistory=true`)
        .then(response => {
          return { messages: response, feedbackDetails: feedBackResult }
        }).catch(err => {
          console.log("error", err)
          return err;
        });
      
     
    }
    // return this.getAgentHistoryData(`${this.configObj.agentassisturl}/api/1.1/botmessages/agentassist/${this.configObj.botid}/history?convId=${this.configObj.conversationId}&agentHistory=true`)
    //   .then(response => {
    //     return { messages: response, feedbackDetails: feedBackResult }
    //   }).catch(err => {
    //     console.log("error", err)
    //     return err;
    //   });
  }

  isEmptyStr(s){
    let str = s?.trim();
    str = str?.replaceAll('"', '').replaceAll("'", '');
    if(str && str.length>1 && str!==""){
      return true;
    }else{
      return false;
    }
  }

  checkAutoBotIdDefined(id){
    if(!id || id == 'undefined' || id == "null" || id == ""){
      return true;
    }else{
      return false;
    }
  }

  checkAutoBotId(id){
    if(id && id !== 'undefined' && id !== "null" && id !== ""){
      return true;
    }else{
      return false;
    }
  }

  async renderingHistoryMessage(connectionDetails) {
    console.log("------- history ---", this.configObj)
    let url = `${this.configObj.agentassisturl}/agentassist/api/v1/agent-feedback/${this.configObj.conversationId}?interaction=assist`;
    let feedBackResult = await this.renderHistoryFeedBack(url);
    if(this.configObj.fromSAT) {
      return this.getAgentHistoryData(`${this.configObj.agentassisturl}/agentassist/api/v1/conversations/${this.configObj.conversationId}/aa/messages?botId=${this.isEmptyStr(connectionDetails.autoBotId) ? connectionDetails.autoBotId: this.isEmptyStr(this.configObj.autoBotId) ? this.configObj.autoBotId : connectionDetails.botId}&agentHistory=false`)
      .then(response => {
        return { messages: response, feedbackDetails: feedBackResult }
      }).catch(err => {
        console.log("error", err)
        return err;
      });
    } else {
        return this.getAgentHistoryData(`${this.configObj.agentassisturl}/api/1.1/botmessages/agentassist/${this.isEmptyStr(connectionDetails.autoBotId) ? connectionDetails.autoBotId : this.isEmptyStr(this.configObj.autoBotId) ? this.configObj.autoBotId : connectionDetails.botId}/history?convId=${connectionDetails.conversationId}&agentHistory=false`)
        .then(response => {
          return { messages: response, feedbackDetails: feedBackResult }
        }).catch(err => {
          console.log("error", err)
          return err;
        });

    
    }
  }

  async getAgentHistoryData(url = '', data = {}) {
    let headersVal = {};
    if(this.configObj.fromSAT) {
        headersVal = {
            'Authorization': 'bearer' + ' ' + this.configObj.token,
            'eAD': false,
            'accountId': this.configObj.accountId
        }
    } else {
        headersVal = {
            'Authorization': this.grantResponseObj?.authorization.token_type + ' ' + this.getAccessToken()
        }
    }
    const response = await $.ajax({
        method: 'GET',
        url: url,
        headers: headersVal
    }) // parses JSON response into native JavaScript objects
    return response;
  }

  hideSendOrCopyButtons(parsedPayload, conatiner, smallTalk?, componentType?){
    let lastchild = $(conatiner).children().last();
    if(smallTalk){
      lastchild = $(conatiner);
    }

    if (!parsedPayload && componentType != 'dialogAct') {
        $(lastchild).find('.copy-btn').removeClass('hide')
    }
    if((!this.configObj.source || this.configObj.source !== 'smartassist-color-scheme') && parsedPayload){
        $(lastchild).find('.send-run-btn').addClass('hide')
    }

    if(this.isCallConversation == true){
      $(lastchild).find('.copy-btn').addClass('hide')
      $(lastchild).find('.send-run-btn').addClass('hide')
    }
  }

  //See more buttons update

  appendSeeMoreWrapper(faqs,ele, uniqueIndex , positionID){
    let seeMoreWrapper = `<div class="see-more-wrapper-info hide" id="seeMoreWrapper-${uniqueIndex}"></div>`;
    faqs.append(seeMoreWrapper);
    let faqIndex = 0;
    for(let ans of ele.answer){
        $(`#seeMoreWrapper-${uniqueIndex}`).append(`<div class="individual-data-text">
            <div class="desc-text-individual" id="desc-faq-${uniqueIndex+faqIndex.toString()}">${this.handleEmptyLine(ans, false)}</div>
            <div class="seemore-link-text hide" id="seeMore-${uniqueIndex+faqIndex.toString()}" data-see-more="true" data-actual-id="${uniqueIndex}">${ProjConstants.READ_MORE}</div>
            <div class="seemore-link-text hide" id="seeLess-${uniqueIndex+faqIndex.toString()}" data-see-less="true" data-actual-id="${uniqueIndex}">${ProjConstants.READ_LESS}</div>
            <div class="actions-send-copy">
                <div class="send-icon" data-msg-id="${uniqueIndex+faqIndex.toString()}"  data-msg-data="${ans}" data-position-id="${positionID}">
                    <i class="ast-ast-send" data-msg-id="${uniqueIndex+faqIndex.toString()}"  data-msg-data="${ans}" data-position-id="${positionID}"></i>
                </div>
                <div class="copy-icon" data-msg-id="${uniqueIndex+faqIndex.toString()}" data-msg-data="${ans}" data-position-id="${positionID}">
                    <i class="ast-copy" data-msg-id="${uniqueIndex+faqIndex.toString()}" data-msg-data="${ans}" data-position-id="${positionID}"></i>
                </div>
            </div>
        </div>`);
        faqIndex++;
    }
  }

  updateSeeMoreForArticles(articles){
    let articleSuggestionList = $('[id*="articleDivLib-"]');
    articleSuggestionList.each(function() {
        let elemID = this.id.split('-');
        elemID.shift();
        let actualId = elemID.join('-')
        this.updateSeeMoreButtonForAgent(actualId, this.projConstants.ARTICLE);
    });
  }

  updateSeeMoreButtonForAssist(id, type?, answer=[]) {
    let faqSourceTypePixel = 5;
    let titleElement = document.getElementById("title-" + id);
    let descElement = document.getElementById("desc-" + id);
    let divElement = document.getElementById('faqDiv-' + id);
    let seeMoreElement = document.getElementById('seeMore-' + id);
    let seeLessElement = document.getElementById('seeLess-' + id);
    let viewLinkElement;
    let snippetviewMsg;
    if(type == ProjConstants.SNIPPET){
      titleElement = document.getElementById("snippettitle-" + id);
      descElement = document.getElementById("snippetdesc-" + id);
      divElement = document.getElementById('snippetDiv-' + id);
      seeMoreElement = document.getElementById('snippetseeMore-' + id);
      snippetviewMsg = document.getElementById('snippetviewMsg-' + id);
     // viewLinkElement = document.getElementById('articleViewLink-' + id);
    }
    if (type == ProjConstants.ARTICLE) {
      titleElement = document.getElementById("articletitle-" + id);
      descElement = document.getElementById("articledesc-" + id);
      divElement = document.getElementById('articleDiv-' + id);
      seeMoreElement = document.getElementById('articleseeMore-' + id);
      seeLessElement = document.getElementById('articleseeLess-' + id);
      viewLinkElement = document.getElementById('articleViewLink-' + id);
    }
    if(type === ProjConstants.FAQ && answer.length > 1){
      $(seeMoreElement).removeClass('hide');
      $(seeLessElement).addClass('hide');
    }else if(titleElement && descElement && divElement) {
      titleElement.classList.add('no-text-truncate');
      descElement.classList.add('no-text-truncate');
      let divSectionHeight = descElement.clientHeight || 0;
      if (divSectionHeight > (24 + faqSourceTypePixel)) {
        $(seeMoreElement).removeClass('hide');
      } else {
        $(seeMoreElement).addClass('hide');
        if (type == ProjConstants.ARTICLE && viewLinkElement) {
          viewLinkElement.classList.remove('hide');
        }
        if(type == ProjConstants.SNIPPET && snippetviewMsg){
          snippetviewMsg.classList.remove('hide');
        }
      }
      titleElement.classList.remove('no-text-truncate');
      descElement.classList.remove('no-text-truncate');
    }
  }

  updateSeeMoreButtonForAgent(id, faq_or_article_obj, type, answer=[]) {
    let faqSourceTypePixel = 5;
    let titleElement = $("#titleLib-" + id);
    let descElement = $("#descLib-" + id);
    let sectionElement = $('#faqSectionLib-' + id);
    let divElement = $('#faqDivLib-' + id);
    let seeMoreElement = $('#seeMore-' + id);
    let seeLessElement = $('#seeLess-' + id);
    let snippetsendMsg;
    let viewLinkElement;
    if (type == ProjConstants.SNIPPET) {
      titleElement = $("#snippettitleLib-" + id);
      descElement = $("#snippetdescLib-" + id);
      sectionElement = $('#snippetSectionLib-' + id);
      divElement = $('#snippetDivLib-' + id);
      seeMoreElement = $('#snippetseeMore-' + id);
      snippetsendMsg = $('#snippetViewMsgLib-' + id);
    }
    if (type == ProjConstants.ARTICLE) {
      titleElement = $("#articletitleLib-" + id);
      descElement = $("#articledescLib-" + id);
      sectionElement = $('#articleSectionLib-' + id);
      divElement = $('#articleDivLib-' + id);
      seeMoreElement = $('#articleseeMore-' + id);
      viewLinkElement = $('#articleViewLinkLib-' + id);
    }
    if(type === ProjConstants.FAQ && answer.length > 1){
      faq_or_article_obj.showLessButton = false;
      faq_or_article_obj.showMoreButton = true;
    }else if(titleElement && descElement && sectionElement && divElement) {
      $(titleElement).css({ "overflow": "inherit", "white-space": "normal", "text-overflow": "unset" });
      $(descElement).css({ "overflow": "inherit", "text-overflow": "unset", "display": "block", "white-space": "normal" });
      let faqSectionHeight = $(sectionElement).css("height");
      let divSectionHeight = $(descElement).css("height") || '0px';
      faqSectionHeight = parseInt(faqSectionHeight?.slice(0, faqSectionHeight.length - 2));
      divSectionHeight = parseInt(divSectionHeight?.slice(0, divSectionHeight.length - 2));
      if (divSectionHeight > (24 + faqSourceTypePixel)) {
        faq_or_article_obj.showLessButton = faq_or_article_obj.showLessButton ? faq_or_article_obj.showLessButton : false;
        faq_or_article_obj.showMoreButton = faq_or_article_obj.showLessButton ? false : true;
      } else {
        faq_or_article_obj.showLessButton = false;
        faq_or_article_obj.showMoreButton = false;
        if (type == ProjConstants.ARTICLE && viewLinkElement && viewLinkElement.classList) {
          viewLinkElement.classList.remove('hide');
        }
        if (type == ProjConstants.SNIPPET && snippetsendMsg && snippetsendMsg.classList) {
          snippetsendMsg.classList.remove('hide');
        }
      }
      $(titleElement).css({ "overflow": "hidden", "white-space": "nowrap", "text-overflow": "ellipsis" });
      $(descElement).css({ "overflow": "hidden", "text-overflow": "ellipsis", "display": "-webkit-box" });
    }
  }
  HandleClickAndSendRequest(tab, connectionObj, e) {
    if (JSON.parse(localStorage.getItem('innerTextValue'))) {
      if (this.activeTab == ProjConstants.ASSIST) {

        let assistRequestParams = 
        {
          "conversationId": connectionObj.conversationId,
          "query": JSON.parse(localStorage.getItem('innerTextValue')),
          "botId": connectionObj.botId,
          "agentId": "",
          "experience": this.isCallConversation === true ? 'voice' : 'chat',
          "positionId": this.currentPositionId,
          "entities": [],
          "check": true,
          "autoBotId": connectionObj.autoBotId
      }
        this.webSocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
        this.isAgentSentRequestOnClick = true;
        localStorage.setItem('innerTextValue', null);
        this.currentPositionId = "";
      } else if (this.activeTab == ProjConstants.MYBOT) {

        let agent_assist_agent_request_params = 
        {
          "isSearch": false,
          "conversationId": connectionObj.conversationId,
          "query": JSON.parse(localStorage.getItem('innerTextValue')),
          "botId": connectionObj.botId,
          "experience": this.isCallConversation === true ? 'voice' : 'chat',
          "positionId": this.currentPositionIdOfMyBot,
          "autoBotId": connectionObj.autoBotId
      }
        this.webSocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
        this.isMyBotAgentSentRequestOnClick = true;
        localStorage.setItem('innerTextValue', null);
        this.currentPositionIdOfMyBot = "";
      }
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  replaceDoubleQuot(val) {
    val = val.replaceAll('"', "&quot;");
    // val = encodeURI(val);
    return val;
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

  handleEmptyLine(answer, quotflag){
    let eleanswer = '';
    if(answer != undefined && answer != null){
        eleanswer = answer.replace(/(\r\n|\n|\r)/gm, "<br>");
        eleanswer = this.replaceLtGt(eleanswer, quotflag)
        eleanswer = this.aaHelpers.convertMDtoHTML(eleanswer, "bot", eleanswer)
        if(quotflag) {
          eleanswer = this.replaceLtGt(eleanswer, quotflag)
        }
        return eleanswer;

    }
    return eleanswer
  }

  replaceLtGt2(htmlStr) {
    htmlStr = htmlStr.replaceAll("&lt;", "<");
    htmlStr = htmlStr.replaceAll("&gt;", ">");
    htmlStr = htmlStr.replaceAll("&quot;", '"');
    return htmlStr;
  }

  handleEmptyLine2(answer){
    let eleanswer = '';
    if(answer != undefined && answer != null){
        eleanswer = answer.replace(/(\r\n|\n|\r)/gm, "<br>");
        // eleanswer = this.replaceLtGt2(eleanswer);
        eleanswer = this.aaHelpers.convertMDtoHTML(eleanswer, "bot", eleanswer)
        return eleanswer;
    }
    // eleanswer = this.replaceLtGt2(eleanswer)
    return eleanswer
  }

  agent_run_click(dialog, isSearchFlag) {
    if (!this.isMyBotAutomationOnGoing) {
      let connectionDetails: any = Object.assign({}, this.configObj);
      connectionDetails.value = dialog.intentName;
      connectionDetails.isSearch = isSearchFlag;
      if (!isSearchFlag) {
        connectionDetails.intentName = dialog.intentName;
        connectionDetails.botId = dialog.botId;
      }
      connectionDetails.positionId = dialog.positionId;
      connectionDetails.childBotId = dialog.childBotId;
      connectionDetails.childBotName = dialog.childBotName;
      let agent_assist_agent_request_params = this.prepareAgentAssistAgentRequestParams(connectionDetails);
      this.webSocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    }
  }

  CustomTempClickEvents(tab, connectionObj) {
    let mythis = this;
    $('.agent-assist-chat-container.kore-chat-window').on('click', '.botResponseAttachments', function (event) {
      window.open($(this).attr('fileid'), '_blank');
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn,.viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv').on('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn, .viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv', function (e) {

      mythis.templateRenderClassService.AgentChatInitialize.bindEvents(true, e);
      mythis.HandleClickAndSendRequest(tab, connectionObj, e);
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .callendar-tabs .month-tab').on('click', '.advanced-list-wrapper .callendar-tabs .month-tab', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option .option-input').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .option .option-input', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top').on('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });

    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .main-title-text-block .search-block .search_icon').on('click', '.advanced-list-wrapper .main-title-text-block .search-block .search_icon', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .main-title-text-block .search-block .close_icon').on('click', '.advanced-list-wrapper .main-title-text-block .search-block .close_icon', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .main-title-text-block .search-block .input_text').on("keyup", '.advanced-list-wrapper .main-title-text-block .search-block .input_text', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .main-title-text-block .filter-sort-block .sort-icon').on("click", '.advanced-list-wrapper .main-title-text-block .filter-sort-block .sort-icon', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .see-more-data').on("click", '.advanced-list-wrapper .see-more-data', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .close-btn').on("click", '.advanced-list-wrapper .close-btn', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-btn').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-btn', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-button-info .close_btn,.filter-icon .close_btn').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-inner-content .inner-btns-acc .more-button-info .close_btn,.filter-icon .close_btn', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .accor-header-top .btn_block.dropdown,.filter-icon').on("click", '.advanced-list-wrapper .multiple-accor-rows .accor-header-top .btn_block.dropdown,.filter-icon', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', ".advancelisttemplate .TaskPickerContainer .close-button").on('click', ".advancelisttemplate .TaskPickerContainer .close-button", function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .multiple-accor-rows .inner-acc-table-sec .table-sec .column-table-more').on("click", '.advanced-list-wrapper .multiple-accor-rows .inner-acc-table-sec .table-sec .column-table-more', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });

    $('.agent-assist-chat-container.kore-chat-window').off('click', '.advanced-list-wrapper .button_,.advanced-list-wrapper .inner-btns-acc .button_,.advanced-list-wrapper .tags-data .tag-name,.advanced-list-wrapper .btn_group .submitBtn,.advanced-list-wrapper .btn_group .cancelBtn,.advanced-list-wrapper .details-content .text-info,.advancelisttemplate .inner-btns-acc .button_,.advancelisttemplate .filter-icon .button_').on("click", '.advanced-list-wrapper .button_,.advanced-list-wrapper .inner-btns-acc .button_,.advanced-list-wrapper .tags-data .tag-name,.advanced-list-wrapper .btn_group .submitBtn,.advanced-list-wrapper .btn_group .cancelBtn,.advanced-list-wrapper .details-content .text-info,.advancelisttemplate .inner-btns-acc .button_,.advancelisttemplate .filter-icon .button_', function (e) {
      mythis.HandleClickAndSendRequest(tab, connectionObj, e)
    });
  }
}
