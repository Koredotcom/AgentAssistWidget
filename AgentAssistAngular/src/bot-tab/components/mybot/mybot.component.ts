import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MybotDataService } from 'src/bot-tab/services/mybot-data.service';
import { ProjConstants, ImageFilePath, ImageFileNames, IdReferenceConst, storageConst } from 'src/common/constants/proj.cnts';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { RemoveSpecialCharPipe } from 'src/common/pipes/remove-special-char.pipe';
import { ReplaceQuotStringWithDoubleQuotPipe } from 'src/common/pipes/replace-quot-string-with-double-quot.pipe';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { DesignAlterService } from 'src/common/services/design-alter.service';
import { EVENTS } from 'src/common/helper/events';
import * as $ from 'jquery';
import { RawHtmlPipe } from 'src/common/pipes/raw-html.pipe';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { LocalStorageService } from 'src/common/services/local-storage.service';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent implements OnInit {

  @Output() scrollToBottomEvent = new EventEmitter();
  @Output() handlePopupEvent = new EventEmitter();
  @ViewChild('mybotautomation') mybotautomation: ElementRef;

  subscriptionsList: Subscription[] = [];
  isFirstMessagOfDialogInMyBot = false;
  projConstants: any = ProjConstants;
  imageFileNames: any = ImageFileNames;
  imageFilePath: string = ImageFilePath;

  connectionDetails: any;
  interruptDialog: any = {};
  scrollAtEnd: boolean = true;
  myBotDataResponse: any = {};
  myBotDropdownHeaderUuids: any;
  myBotDialogPositionId: string;
  isMybotInputResponseClick: boolean = false;
  mybotEmptyState : boolean = true;
  dialogName : string;
  isHistoryApiCalled = false;
  interruptDialogFlag = false;

  constructor(public handleSubjectService: HandleSubjectService,
    public randomUUIDPipe: RandomUUIDPipe,
    public mybotDataService: MybotDataService,
    public removeSpecialCharPipe: RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe: ReplaceQuotStringWithDoubleQuotPipe,
    public sanitizeHtmlPipe: SanitizeHtmlPipe,
    private templateRenderClassService: TemplateRenderClassService,
    public commonService: CommonService,
    public websocketService: WebSocketService,
    public designAlterService: DesignAlterService,
    public rawHtmlPipe: RawHtmlPipe,
    private localStorageService: LocalStorageService,
    private koreGenerateuuidPipe: KoreGenerateuuidPipe) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents() {

    let subscription1 = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {
      this.handleSubjectService.setLoader(true);
      if (runEventObj) {
        if (runEventObj.agentRunButton && !this.commonService.isMyBotAutomationOnGoing) {
          this.runDialogFormyBotTab(runEventObj);
        } else if (runEventObj.agentRunButton && this.commonService.isMyBotAutomationOnGoing) {
          this.interruptDialog = runEventObj;
          this.handlePopupEvent.emit({ status: true, type: this.projConstants.INTERRUPT });
        }
      }
      this.handleSubjectService.setLoader(false);
    });

    let subscription2 = this.websocketService.agentAssistAgentResponse$.subscribe((response: any) => {
      this.handleSubjectService.setLoader(true);
      if (response && !response.isSearch) {
        // this.designAlterService.displayCustomerFeels(response, response.conversationId, response.botId, this.connectionDetails.source);
        this.processMybotDataResponse(response);
        this.viewCustomTempAttachment();
      }
      this.handleSubjectService.setLoader(false);
    });

    let subscription3 = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {
      if (endoftaskresponse && this.myBotDialogPositionId == endoftaskresponse.positionId) {
        this.dialogTerminatedOrIntrupptedInMyBot();
        this.viewCustomTempAttachment();
      }
      if(this.interruptDialogFlag) {
        this.getAgentInputValue(this.interruptDialog.name, this.projConstants.INTENT);
        this.interruptDialogFlag = false;
    }
    })

    let subscription4 = this.handleSubjectService.terminateClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.MYBOT) {
        this.getAgentInputValue(this.projConstants.DISCARD_ALL);
        this.dialogTerminatedOrIntrupptedInMyBot();
      }
    });

    let subscription5 = this.handleSubjectService.interruptClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.MYBOT) {
        this.getAgentInputValue(this.projConstants.DISCARD_ALL);
        this.dialogTerminatedOrIntrupptedInMyBot();
        this.runDialogFormyBotTab(this.interruptDialog);
        this.interruptDialogFlag = true;
      }
    });



    let subscription6 = this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
      }
      if(this.commonService.checkAutoBotId(this.connectionDetails?.autoBotId) && !this.isHistoryApiCalled){
        this.callHistoryApi();
      }
    });

    let subscription7 = this.websocketService.agentFeedbackResponse$.subscribe((data) => {
      if (this.commonService.isUpdateFeedBackDetailsFlag && data) {
        this.commonService.UpdateFeedBackDetails(data, 'agentAutoContainer')
      }
    })

    let subscription8 = this.handleSubjectService.autoBotIdSubject$.subscribe((data)=>{
      if(this.commonService.checkAutoBotId(data['autoBotId'])){
        this.connectionDetails['autoBotId'] = data['autoBotId'];
        if(!this.isHistoryApiCalled){this.callHistoryApi()}
      }
      if(!this.isHistoryApiCalled){this.callHistoryApi()}
    })

    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);
    this.subscriptionsList.push(subscription5);
    this.subscriptionsList.push(subscription6);
    this.subscriptionsList.push(subscription7);
    this.subscriptionsList.push(subscription8);
  }

  callHistoryApi(){
    this.isHistoryApiCalled = true;
    let respons: any = this.commonService.renderingAgentHistoryMessage(this.connectionDetails);
    respons.then((res) => {
      if (res && res.messages) {
        this.renderHistoryMessages(res.messages, res.feedbackDetails)
      }
    })
  }
  //running dialogue and mybot data response code.
  processMybotDataResponse(data) {
    let isTemplateRender = false;
    // data = this.commonService.confirmationNodeRenderDataTransform(data);
    let results: any = this.templateRenderClassService.getResponseUsingTemplate(data, this.commonService.configObj);
    this.commonService.currentPositionIdOfMyBot = this.myBotDialogPositionId;
    let sendMsgData = encodeURI(JSON.stringify(results));
    let myBotuuids = this.koreGenerateuuidPipe.transform();
    let agentInputId = this.randomUUIDPipe.transform();
    if (this.commonService.isMyBotAutomationOnGoing && data.buttons && !data.value.includes('Customer has waited') && (this.myBotDialogPositionId && !data.positionId || (data.positionId == this.myBotDialogPositionId))) {
      if (this.isFirstMessagOfDialogInMyBot) {
        $(`#dropDownData-${this.myBotDropdownHeaderUuids}`).attr('data-task-id', data.uniqueTaskId)
      }
      this.isFirstMessagOfDialogInMyBot = false;
      let runInfoContent = document.getElementById(IdReferenceConst.DROPDOWNDATA + `-${this.myBotDropdownHeaderUuids}`);
      $('#inputFieldForMyBot').remove();
      if (this.isMybotInputResponseClick) {
        let userQueryHtml = this.mybotDataService.userQueryTemplate(this.imageFilePath, this.imageFileNames, myBotuuids, data);
        $(runInfoContent).append(userQueryHtml);
        let entityHtml = document.getElementById(IdReferenceConst.USERINPUT + `-${myBotuuids}`);
        let entityDisplayName = this.myBotDataResponse.entityDisplayName ? this.myBotDataResponse.entityDisplayName : this.myBotDataResponse.entityName;
        if (data.userInput && !data.isErrorPrompt && entityDisplayName) {
          $(entityHtml).append(`<div class="order-number-info">${entityDisplayName} : ${this.sanitizeHtmlPipe.transform(data.userInput)}</div>`);
        } else {
          if (data.isErrorPrompt && entityDisplayName) {
            let entityType = data.entityType;
            let errorTemplate = this.mybotDataService.mybotErrorTemplate(this.imageFilePath, this.imageFileNames, entityDisplayName, entityType);
            $(entityHtml).append(errorTemplate);
          }
        }
        this.isMybotInputResponseClick = false;
      }
      this.myBotDataResponse = {};
      if (data.entityName) {
        this.myBotDataResponse = Object.assign({}, data);
      }

      let askToUserHtml = this.mybotDataService.askUserTemplate(results,data,myBotuuids, sendMsgData, this.myBotDialogPositionId, data.buttons[0].value);
      let tellToUserHtml = this.mybotDataService.tellToUserTemplate(results,data,myBotuuids, sendMsgData, this.myBotDialogPositionId, data.buttons[0].value);

      let agentInputEntityName = ProjConstants.ENTER_DETAILS;
      if (data.entityDisplayName || data.entityName) {
        agentInputEntityName = data.entityDisplayName ? data.entityDisplayName : data.entityName
      }

      let agentInputToBotHtml = this.mybotDataService.agentInputToBotTemplate(agentInputEntityName, agentInputId, this.connectionDetails, this.myBotDialogPositionId);

      if (data.isPrompt) {
        $(runInfoContent).append(askToUserHtml);
        this.commonService.hideSendOrCopyButtons(results.parsedPayload, runInfoContent, false, data.componentType)
        $(runInfoContent).append(agentInputToBotHtml);
        document.getElementById(`agentInput-${agentInputId}`).focus();
        runInfoContent.querySelector(`#agentInput-${agentInputId}`).addEventListener('keypress', (e: any) => {
          let key = e.which || e.keyCode || 0;
          if (key === 13) {
            this.getAgentInputValue(e.target.value);
            this.isMybotInputResponseClick = true;
          }
        });
      } else {
        $(runInfoContent).append(tellToUserHtml);
        this.commonService.hideSendOrCopyButtons(results.parsedPayload, runInfoContent, false, data.componentType)

      }

      if(!this.commonService.smallTalkTemplateRenderCheck(data, results)){
        isTemplateRender = true;
      }else{
        isTemplateRender = false;
        this.commonService.hideSendOrCopyButtons(results.parsedPayload, runInfoContent, false, data.componentType);
      }

      // let result = this.templateRenderClassService.getResponseUsingTemplate(data);

      if (this.commonService.isMyBotAgentSentRequestOnClick && !this.myBotDropdownHeaderUuids) {
        let mybotContainer = $('#myBotAutomationBlock');
        let botResHtml = `
            <div class="collapse-acc-data before-none" id='smallTalk-${myBotuuids}'>
              <div class="steps-run-data">
                  <div class="icon_block">
                      <i class="ast-agent"></i>
                  </div>
                <div class="run-info-content" >
                  <div class="title">${data.promptTitle}</div>
                  <div class="agent-utt">
                      <div class="title-data" id="displayData-${myBotuuids}">${data.buttons[0].value}</div>
                      <div class="action-links">
                          <button class="send-run-btn" id="sendMsg" data-msg-id="${myBotuuids}"  data-msg-data="${data.buttons[0].value}" data-text-type="sentence">Send</button>
                          <div class="copy-btn" data-msg-id="${myBotuuids}" data-msg-data="${data.buttons[0].value}" data-text-type="sentence">
                              <i class="ast-copy" data-msg-id="${myBotuuids}" data-msg-data="${data.buttons[0].value}" data-text-type="sentence"></i>
                          </div>
                      </div>
                      <div class="warning-template hide"  id="warningTemp">
                          <img src="${this.imageFilePath}${this.imageFileNames['infoIcon']}">
                          <span class="warning-text">Templates are not supported, visit your bot builder to disable it.</span>
                      </div>
                  </div>
                </div>
          </div>
         </div>`;
        mybotContainer.append(botResHtml);
        this.commonService.isMyBotAgentSentRequestOnClick = false;
      }
    }

    if (!this.commonService.isMyBotAutomationOnGoing && this.myBotDropdownHeaderUuids && data.buttons && (this.myBotDialogPositionId && !data.positionId || data.positionId == this.myBotDialogPositionId)) {
      // $('#myBotAutomationBlock .empty-data-no-agents').addClass('hide');
      let msgStringify = JSON.stringify(results);
      let newTemp = encodeURI(msgStringify);
      let dynamicBlockDiv = $('#myBotAutomationBlock');
      data.buttons?.forEach((ele, i) => {
        let botResHtml = this.mybotDataService.smallTalkTemplateForTemplatePayload(ele, myBotuuids,data, results,newTemp);
        let titleData = ``;
        let actionLinkTemplate = ``;
        if(this.commonService.smallTalkTemplateRenderCheck(data, results)){
            isTemplateRender = false;
            titleData = `<div class="title-data" ><ul class="chat-container" id="displayData-${myBotuuids}"></ul></div>`;
            let sendData = results?.parsedPayload ? newTemp : data.buttons[0].value;
            actionLinkTemplate = this.smallTalkActionLinkTemplate(myBotuuids, sendData);
        }else{
            titleData = `<div class="title-data" id="displayData-${myBotuuids}">${ele.value}</div>`;
            actionLinkTemplate = this.smallTalkActionLinkTemplate(myBotuuids, data.buttons[0].value)
            isTemplateRender = true;
            results.parsedPayload = null;
        }
        dynamicBlockDiv.append(botResHtml);
        $(`#smallTalk-${myBotuuids} .agent-utt`).append(titleData);
        $(`#smallTalk-${myBotuuids} .agent-utt`).append(actionLinkTemplate);
        setTimeout(() => {
          if (data.entityName) {
            this.myBotDataResponse = {};
            this.myBotDataResponse = Object.assign({}, data);
          }
        }, 10);
        $(`.override-input-div`).remove();
        if (data.isPrompt) {
          this.smallTalkInputTemplate(myBotuuids, data);
        }
        this.commonService.hideSendOrCopyButtons(results.parsedPayload, `#smallTalk-${myBotuuids} .agent-utt`, 'smallTalk')
      });
    }

    let renderedMessage = !isTemplateRender ? this.templateRenderClassService.AgentChatInitialize.renderMessage(results) : '';

    if (renderedMessage && renderedMessage[0]) {
      // let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(results)[0].innerHTML;
      // let a = document.getElementById(IdReferenceConst.displayData + `-${myBotuuids}`);
      // if (a) {
      //   a.innerHTML = a.innerHTML + html;
      //   this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.MYBOTAUTOMATIONBLOCK);
      //   this.scrollToBottom();
      // }

      let obj = this.templateRenderClassService.AgentChatInitialize.renderMessage(results)[0];
      let a = document.getElementById(IdReferenceConst.displayData + `-${myBotuuids}`);
      if (a) {
        a.appendChild(obj);
        this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.MYBOTAUTOMATIONBLOCK);
        this.scrollToBottom();
      }
    }


  }

  smallTalkActionLinkTemplate(uuids,sendData){
    let actionLinkTemplate =  ` <div class="action-links">
    <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-msg-data="${sendData}" data-text-type="sentence">Send</button>
    <div class="copy-btn hide" data-msg-id="${uuids}" data-msg-data="${sendData}" data-text-type="sentence">
        <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${sendData}" data-text-type="sentence"></i>
    </div>
  </div>`;
  return actionLinkTemplate;
  }

  smallTalkInputTemplate(myBotuuids, data){
    let agentInputEntityName = ProjConstants.ENTER_DETAILS;
    if (data.entityDisplayName || data.entityName) {
      agentInputEntityName = data.entityDisplayName ? data.entityDisplayName : data.entityName
    }
    let agentInputToBotHtml = this.mybotDataService.agentInputToBotTemplate(agentInputEntityName, myBotuuids, this.connectionDetails, this.myBotDialogPositionId);
    if(document.getElementById(`smallTalk-${myBotuuids}`)){
      let runInfoContent = document.getElementById(`smallTalk-${myBotuuids}`);
      $(runInfoContent).append(agentInputToBotHtml);
        document.getElementById(`agentInput-${myBotuuids}`).focus();
        runInfoContent.querySelector(`#agentInput-${myBotuuids}`).addEventListener('keypress', (e: any) => {
          let key = e.which || e.keyCode || 0;
          if (key === 13) {
            this.getAgentInputValue(e.target.value);
            this.isMybotInputResponseClick = true;
          }
        });
        $(`#smallTalk-${myBotuuids}`).append(runInfoContent);
    }

  }


  runDialogFormyBotTab(data) {
    this.mybotEmptyState = false;
    this.isFirstMessagOfDialogInMyBot = true;
    this.collapseOldDialoguesInMyBot();
    this.myBotDialogPositionId = data.positionId;
    this.commonService.isMyBotAutomationOnGoing = true;
    let agentBotuuids = this.randomUUIDPipe.transform();
    this.myBotDropdownHeaderUuids = agentBotuuids;
    let storageObject: any = {
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT]: this.commonService.isMyBotAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    this._createRunTemplateContainerForMyTab(agentBotuuids, data.name, this.myBotDialogPositionId)
    let addRemoveDropDown = document.getElementById(IdReferenceConst.MYBOTADDREMOVEDROPDOWN + `-${agentBotuuids}`);
    addRemoveDropDown?.classList.remove('hide');
    document.getElementById(IdReferenceConst.NO_AUTO_RUNNING) ? document.getElementById(IdReferenceConst.NO_AUTO_RUNNING).classList.add('hide') : '';
    this.scrollToBottom();
  }

  _createRunTemplateContainerForMyTab(agentBotuuids, intentName, dialogId) {
    this.dialogName = intentName;
    let dynamicBlock = document.getElementById(IdReferenceConst.MYBOTAUTOMATIONBLOCK);
    let dropdownHtml = this.mybotDataService.createDialogTaskAccordionTemplate(agentBotuuids, intentName);
    this.mybotautomation.nativeElement.innerHTML += dropdownHtml;
    this.clickEvents(IdReferenceConst.MYBOTTERMINATE, agentBotuuids);
    // this.clickEvents(IdReferenceConst.DROPDOWN_HEADER, agentBotuuids);
  }

  //input value from mybot
  getAgentInputValue(value, intent?) {

    if (value) {
      let connectionDetails: any = Object.assign({}, this.connectionDetails);
      connectionDetails.value = value;
      connectionDetails.isSearch = false;
      connectionDetails.positionId = this.myBotDialogPositionId;
      connectionDetails.childBotName = this.commonService?.childBotDetails?.childBotName || '';
      connectionDetails.childBotId = this.commonService?.childBotDetails?.childBotId || '';
      if (this.connectionDetails?.interactiveLanguage && typeof this.connectionDetails?.interactiveLanguage == 'string' && this.connectionDetails?.interactiveLanguage != "''") {
        connectionDetails['language'] = this.connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
      }
      if (intent) {
        connectionDetails.intentName = value;
        connectionDetails.childBotName = this.commonService.childBotDetails?.childBotName || '';
      connectionDetails.childBotId = this.commonService.childBotDetails?.childBotId || '';
      }
      let agent_assist_agent_request_params = this.commonService.prepareAgentAssistAgentRequestParams(connectionDetails);
      this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    }
  }

  //terminate code
  dialogTerminatedOrIntrupptedInMyBot() {
    this.handleSubjectService.setLoader(true)
    this.commonService.isMyBotAutomationOnGoing = false;
    let storageObject: any = {
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT]: this.commonService.isMyBotAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    if (this.myBotDialogPositionId) {
      this.commonService.addFeedbackHtmlToDom(this.myBotDropdownHeaderUuids, this.commonService.scrollContent[ProjConstants.MYBOT].lastElementBeforeNewMessage, this.dialogName, this.myBotDialogPositionId, this.commonService.userIntentInput, 'runForAgentBot');
    }
    this.handleSubjectService.setLoader(false);
  }

  //old dialogues styling
  collapseOldDialoguesInMyBot() {
    if ($(`#myBotAutomationBlock .collapse-acc-data`).length > 0) {
      let listItems = $("#myBotAutomationBlock .collapse-acc-data");
      listItems.each(function (idx, collapseElement) {
        if (!collapseElement.id.includes('smallTalk') && collapseElement.id.includes('dropDownData')) {
          collapseElement.classList.add('hide');
        }
      });
    }
  }

  scrollToBottom() {
    this.scrollToBottomEvent.emit(true);
  }

  //click events in mybot
  terminateButtonClick(uuid) {
    document.getElementById(IdReferenceConst.MYBOTTERMINATE + '-' + uuid).addEventListener('click', (event) => {
      this.handleSubjectService.setLoader(true);
      this.handlePopupEvent.emit({ status: true, type: this.projConstants.TERMINATE });
    });
  }

  clickEvents(eventName, uuid?) {
    if (eventName == IdReferenceConst.MYBOTTERMINATE) {
      this.terminateButtonClick(uuid)
    } else if (eventName == IdReferenceConst.DROPDOWN_HEADER) {
      // this.designAlterService.handleDropdownToggle(uuid);
    }
  }


  //rendering history code
  renderHistoryMessages(response, feedBackResult) {
    if (response && response.length > 0) {
        this.mybotEmptyState = false;
    }
    // document.getElementById("loader").style.display = "none";
    let previousId;
    let previousTaskName, currentTaskName, previousTaskPositionId, currentTaskPositionId;
    let convId = this.commonService.configObj.conversationid;
    let botId = this.commonService.configObj.botid;

    let resp = response.length > 0 ? response : undefined;
    resp?.forEach((res, index) => {
      // res = this.commonService.confirmationNodeRenderForHistoryDataTransform(res);
      if ((!res.agentAssistDetails?.suggestions && !res.agentAssistDetails?.ambiguityList && !res.agentAssistDetails?.ambiguity) && res.type == 'outgoing') {

        let positionID = 'dg-'+ this.koreGenerateuuidPipe.transform();
        currentTaskPositionId = res?.agentAssistDetails?.positionId ?  res?.agentAssistDetails?.positionId : ((res.tN != currentTaskName) ? positionID : currentTaskPositionId);
        currentTaskName = (res.tN) ? res.tN  : currentTaskName;

        let historyData = $('#myBotAutomationBlock');
        let userInputHtml;
        if (res.agentAssistDetails.userInput) {
          userInputHtml = `<div class="agent-utt-info" id="agentUttInfo-${res._id}">
                              <div class="user-img">
                                  <img src="${this.imageFilePath}${this.imageFileNames['USERICON']}">
                              </div>
                              <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                          </div>`;
        }
        let dropdownHtml = `

                  <div class="dialog-task-accordiaon-info" id="MyBotaddRemoveDropDown-${res._id}" >
                      <div class="accordion-header" id="dropDownHeader-${res._id}"
                      data-drop-down-opened="false">
                          <div class="icon-info">
                              <i class="ast-rule"></i>
                          </div>
                          <div class="header-text" id="dropDownTitle-${res._id}">${res.tN}</div>
                          <i class="ast-carrotup" id="dialogueArrow-${res._id}"></i>
                          <button class="btn-danger hide" id="myBotTerminateAgentDialog-${res._id}">Terminate</button>

                      </div>
                      <div class="collapse-acc-data hide" id="dropDownData-${res._id}">


                      </div>

                  `

        if ((previousTaskPositionId && currentTaskPositionId !== previousTaskPositionId) ||  (currentTaskPositionId == previousTaskPositionId && currentTaskName != previousTaskName)) {
          let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === previousTaskPositionId);
          this.commonService.addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, true, previousTaskPositionId);
          if (previousIdFeedBackDetails) {
            this.commonService.UpdateFeedBackDetails(previousIdFeedBackDetails, 'agentAutoContainer');
            if (previousIdFeedBackDetails.feedback == 'dislike' && (previousIdFeedBackDetails.feedbackDetails.length == 0 && previousIdFeedBackDetails.comment.length == 0)) {
              $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).removeClass('hide');
            } else {
              $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).addClass('hide');
            }
          }

          if((currentTaskPositionId == previousTaskPositionId && currentTaskName != previousTaskName)){
            previousId = undefined;
          }else{
            previousId = undefined;
            previousTaskPositionId = undefined;
            previousTaskName = undefined;
          }

        }

        if (res.tN && !previousId && previousTaskPositionId !== currentTaskPositionId) {
          let divExist = $(`#MyBotaddRemoveDropDown-${res._id}`);
          previousTaskName = currentTaskName;
          previousTaskPositionId = currentTaskPositionId;
          if (divExist.length >= 1) {
          } else {
            historyData.append(userInputHtml);
            historyData.append(dropdownHtml);
            previousId = res._id;
            previousTaskPositionId = currentTaskPositionId;
            this.clickEvents(IdReferenceConst.MYBOTTERMINATE, previousId);
            // this.clickEvents(IdReferenceConst.DROPDOWN_HEADER, previousId);
          }
        }

        if (res.agentAssistDetails.entityName && res.agentAssistDetails.entityResponse && res.agentAssistDetails.entityValue) {
          let runInfoContent = $(`#dropDownData-${previousId}`);
          let data = {};
          data['userInput'] = res.agentAssistDetails.entityValue;
          let userQueryHtml = this.mybotDataService.userQueryTemplate(this.imageFilePath, this.imageFileNames, res._id, data);
          runInfoContent.append(userQueryHtml);
          let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
          let entityDisplayName = '';
          if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
            let entityValueType = typeof res.agentAssistDetails.entityValue;
            let entityValue = (entityValueType == 'object') ? JSON.stringify(res.agentAssistDetails.entityValue) : this.sanitizeHtmlPipe.transform(res.agentAssistDetails.entityValue);
            entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${entityValue}</div>`);
          } else {
            if (res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
              let entityType = res.agentAssistDetails.entityType;
              let entityHtmls = this.mybotDataService.mybotErrorTemplate(this.imageFilePath, this.imageFileNames, entityDisplayName, entityType);
              entityHtml.append(entityHtmls);
            }
          }
        }
        if (res.agentAssistDetails?.entityName) {
          this.myBotDataResponse = res.agentAssistDetails;
          this.myBotDataResponse.entityDisplayName = this.myBotDataResponse.newEntityDisplayName;
          this.myBotDataResponse.entityName = this.myBotDataResponse.newEntityName;
        }

        let _msgsResponse : any = this.templateRenderClassService.getResponseUsingTemplateForHistory(res);
        let parsedPayload : any = _msgsResponse.parsedPayload;

        if(_msgsResponse.message.length > 0){
          let msgStringify = JSON.stringify(_msgsResponse);
          let newTemp = encodeURI(msgStringify);

          if((previousTaskName != currentTaskName && previousTaskPositionId == currentTaskPositionId)){
            let dynamicBlockDiv = $('#myBotAutomationBlock');

            let botResHtml = this.mybotDataService.smallTalkTemplateForTemplatePayload(res, res._id,res, {parsedPayload : parsedPayload},newTemp);
            let titleData = ``;
            let actionLinkTemplate = ``;
            if(this.commonService.smallTalkHistoryRenderCheck(parsedPayload,res)){
                // isTemplateRender = false;
                titleData = `<div class="title-data" ><ul class="chat-container" id="displayData-${res._id}"></ul></div>`;
                let sendData = _msgsResponse?.parsedPayload ? newTemp : res.components[0].data.text;
                actionLinkTemplate = this.smallTalkActionLinkTemplate(res._id, sendData);
                dynamicBlockDiv.append(botResHtml);
                $(`#smallTalk-${res._id} .agent-utt`).append(titleData);
                $(`#smallTalk-${res._id} .agent-utt`).append(actionLinkTemplate);

                let obj = this.templateRenderClassService.AgentChatInitialize.renderMessage(_msgsResponse)[0]
                let a = document.getElementById(IdReferenceConst.displayData + `-${res._id}`);
                a.appendChild(obj);
            }else{
                // isTemplateRender = true;
                titleData = `<div class="title-data" id="displayData-${res._id}">${res.components[0].data.text}</div>`;
                actionLinkTemplate = this.smallTalkActionLinkTemplate(res._id, res.components[0].data.text);
                dynamicBlockDiv.append(botResHtml);
                $(`#smallTalk-${res._id} .agent-utt`).append(titleData);
                $(`#smallTalk-${res._id} .agent-utt`).append(actionLinkTemplate);
                parsedPayload = null;
            }
            this.commonService.hideSendOrCopyButtons(parsedPayload, `#smallTalk-${res._id} .agent-utt`, 'smallTalk')
          }

          if ((res.agentAssistDetails?.isPrompt === true || res.agentAssistDetails?.isPrompt === false) && previousTaskName === currentTaskName && previousTaskPositionId == currentTaskPositionId) {
            let runInfoContent = $(`#dropDownData-${previousId}`);
            let askToUserHtml = this.mybotDataService.askUserTemplate(_msgsResponse, res,res._id, newTemp, currentTaskPositionId, res.components[0].data.text, true);
            let tellToUserHtml = this.mybotDataService.tellToUserTemplate(_msgsResponse, res,res._id, newTemp, currentTaskPositionId, res.components[0].data.text, true);


            if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT)) {
              this.commonService.isMyBotAutomationOnGoing = true;
              this.commonService.noAutomationrunninginMyBot = false;
              this.myBotDropdownHeaderUuids = previousId;
              $('#inputFieldForMyBot').remove();
              let storageObject: any = {
                [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT]: this.commonService.isMyBotAutomationOnGoing
              }
              this.localStorageService.setLocalStorageItem(storageObject);
              let terminateButtonElement = document.getElementById('myBotTerminateAgentDialog-' + previousId);
              $(`#myBotTerminateAgentDialog-${previousId}`).attr('data-position-id', previousTaskPositionId);
              terminateButtonElement.classList.remove('hide');
              this.myBotDialogPositionId = previousTaskPositionId;
            }

            let agentInputEntityName = 'EnterDetails';
            if (res.agentAssistDetails?.newEntityDisplayName || res.agentAssistDetails?.newEntityName) {
              agentInputEntityName = res.agentAssistDetails.newEntityDisplayName ? res.agentAssistDetails.newEntityDisplayName : res.agentAssistDetails.newEntityName
            }
            let agentInputId = this.randomUUIDPipe.transform();
            let agentInputToBotHtml = `
                        <div class="steps-run-data">
                            <div class="icon_block">
                                <i class="ast-agent"></i>
                            </div>
                            <div class="run-info-content">
                            <div class="title">Input</div>
                            <div class="agent-utt enter-details-block">
                            <div class="title-data" ><span class="enter-details-title">${agentInputEntityName} : </span>
                            <input type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${agentInputId}" data-conv-id="${convId}" data-bot-id="${botId}"  data-mybot-input="true">
                            </div>
                            </div>
                            </div>
                        </div>`;


            let nextResponse = resp[index + 1];
            if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {

              if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT)) {
                // $("#inputFieldForMyBot").remove();
                $(`#terminateAgentDialog-${previousId}`).removeClass('hide');
                $(`#terminateAgentDialog-${previousId}`).attr('data-position-id', previousTaskPositionId);
                this.myBotDialogPositionId = previousTaskPositionId;
              }

              runInfoContent.append(askToUserHtml);
              this.commonService.hideSendOrCopyButtons(parsedPayload, runInfoContent)
              if (!nextResponse || (nextResponse.status != 'received' && nextResponse.status != 'incoming')) {
                runInfoContent.append(agentInputToBotHtml);
                document.getElementById(`agentInput-${agentInputId}`).focus();
                runInfoContent.find(`#agentInput-${agentInputId}`).on('keypress', (e: any) => {
                  let key = e.which || e.keyCode || 0;
                  if (key === 13) {
                    this.getAgentInputValue(e.target.value);
                    this.isMybotInputResponseClick = true;
                  }
                });
              }

            } else {
              runInfoContent.append(tellToUserHtml);
              this.commonService.hideSendOrCopyButtons(parsedPayload, runInfoContent);
            }

            // if(res && res.agentAssistDetails && res.agentAssistDetails.componentType == 'dialogAct' && (res.agentAssistDetails?.srcChannel != 'msteams' && res.agentAssistDetails?.srcChannel != 'rtm')){
            // }
            if(this.commonService.smallTalkHistoryRenderCheck(parsedPayload,res)){
              // let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(_msgsResponse)[0].innerHTML;
              // let a = document.getElementById(IdReferenceConst.displayData + `-${res._id}`);
              // a.innerHTML = a?.innerHTML + html;
              let obj = this.templateRenderClassService.AgentChatInitialize.renderMessage(_msgsResponse)[0]
              let a = document.getElementById(IdReferenceConst.displayData + `-${res._id}`);
              a.appendChild(obj);
              this.commonService.hideSendOrCopyButtons(parsedPayload, runInfoContent, false, res.agentAssistDetails?.componentType)
            }

          }
        }

        if (resp.length - 1 == index && (!res.agentAssistDetails?.entityRequest && !res.agentAssistDetails?.entityResponse) && currentTaskPositionId == previousTaskPositionId) {
          let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === previousTaskPositionId);
          this.commonService.addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, true, previousTaskPositionId);
          if (previousIdFeedBackDetails) {
            this.commonService.UpdateFeedBackDetails(previousIdFeedBackDetails, 'agentAutoContainer');
            if (previousIdFeedBackDetails.feedback == 'dislike' && (previousIdFeedBackDetails.feedbackDetails.length == 0 && previousIdFeedBackDetails.comment.length == 0)) {
              $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).removeClass('hide');
            } else {
              $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).addClass('hide');
            }
          }
          previousId = undefined;
          previousTaskPositionId = undefined;
          previousTaskName = undefined;
        }

      }
    });
    if (this.commonService.isMyBotAutomationOnGoing) {
      $(`#myBotAutomationBlock .collapse-acc-data.hide`)[$(`#myBotAutomationBlock .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
    }
    this.scrollToBottom();
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.MYBOTAUTOMATIONBLOCK);
  }

  viewCustomTempAttachment(){
    this.commonService.CustomTempClickEvents(this.projConstants.MYBOT, this.connectionDetails)
  }


}
