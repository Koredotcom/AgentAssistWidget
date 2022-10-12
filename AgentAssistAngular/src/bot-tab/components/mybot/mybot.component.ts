import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MybotDataService } from 'src/bot-tab/services/mybot-data.service';
import { ProjConstants, ImageFilePath, ImageFileNames, IdReferenceConst } from 'src/common/constants/proj.cnts';
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

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent implements OnInit {

  @Output() scrollToBottomEvent = new EventEmitter();
  @ViewChild('mybotautomation') mybotautomation: ElementRef;
  @Output() handleTerminatePopup = new EventEmitter();

  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;
  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  isMybotInputResponseClick: boolean = false;
  myBotDataResponse: any = {};
  myBotDropdownHeaderUuids: any;
  myBotDialogPositionId: string;
  scrollAtEnd: boolean = true;
  connectionDetails: any;
  interruptDialog: any = {};
  lastElementBeforeNewMessage : any;

  constructor(public handleSubjectService: HandleSubjectService, public randomUUIDPipe: RandomUUIDPipe,
    public mybotDataService: MybotDataService, public removeSpecialCharPipe: RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe: ReplaceQuotStringWithDoubleQuotPipe,
    public sanitizeHtmlPipe: SanitizeHtmlPipe, private templateRenderClassService: TemplateRenderClassService,
    public commonService: CommonService, public websocketService: WebSocketService,
    public designAlterService: DesignAlterService, public rawHtmlPipe: RawHtmlPipe) { }

  ngOnInit(): void {
    let response = this.commonService.renderingAgentHistoryMessage();
    response.then((res)=>{
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx history response", res);
      this.renderHistoryMessages(res.messages, res.feedbackDetails)
    })
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents() {

    let subscription1 = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {
      if (runEventObj.agentRunButton && !this.commonService.isMyBotAutomationOnGoing) {
        console.log(runEventObj, "run event obj");
        this.runDialogFormyBotTab(runEventObj);
        // this.scrollToBottom();
      } else if (runEventObj.agentRunButton && this.commonService.isMyBotAutomationOnGoing) {
        this.interruptDialog = runEventObj;
        console.log(this.interruptDialog, "interrupt dialog");

        this.handleTerminatePopup.emit({ status: true, type: this.projConstants.INTERRUPT });
      }
    });

    let subscription2 = this.websocketService.agentAssistAgentResponse$.subscribe((response: any) => {
      console.log(this.commonService.isMyBotAutomationOnGoing, "inside response");
      if (response && !response.isSearch) {
        console.log(response);
        this.processMybotDataResponse(response);
      }
    });

    let subscription3 = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {
      console.log(endoftaskresponse, "endof task");
      if (endoftaskresponse && this.myBotDialogPositionId == endoftaskresponse.positionId) {
        this.dialogTerminatedOrIntrupptedInMyBot();
      }
    })

    let subscription4 = this.handleSubjectService.terminateClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.MYBOT) {
        console.log(response, "inside subject mybot");
        this.getAgentInputValue(this.projConstants.DISCARD_ALL);
        this.dialogTerminatedOrIntrupptedInMyBot();
      }
    });

    let subscription5 = this.handleSubjectService.interruptClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.MYBOT) {
        console.log(response, "inside interrupt mybot component");
        this.getAgentInputValue(this.projConstants.DISCARD_ALL);
        this.dialogTerminatedOrIntrupptedInMyBot();
        this.runDialogFormyBotTab(this.interruptDialog);
        this.getAgentInputValue(this.interruptDialog.name, this.projConstants.INTENT);
      }
    });

    let subscription6 = this.handleSubjectService.connectDetailsSubject.subscribe((response : any)=>{
      if(response){
        this.connectionDetails = response;
        console.log("connection details, 'inside assist tab");
        
      }
    });
    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);
    this.subscriptionsList.push(subscription5);
    this.subscriptionsList.push(subscription6);
  }

  processMybotDataResponse(data) {
    let myBotuuids = this.randomUUIDPipe.transform();
    let agentInputId = this.randomUUIDPipe.transform();
    if (this.commonService.isMyBotAutomationOnGoing && data.buttons && !data.value.includes('Customer has waited') && data.positionId == this.myBotDialogPositionId) {
      let runInfoContent = document.getElementById(IdReferenceConst.DROPDOWNDATA + `-${this.myBotDropdownHeaderUuids}`);
      if (this.isMybotInputResponseClick) {
        let userQueryHtml = this.mybotDataService.userQueryTemplate(this.imageFilePath, this.imageFileNames, myBotuuids, data);
        $(runInfoContent).append(userQueryHtml);
        let entityHtml = document.getElementById(IdReferenceConst.USERINPUT + `-${myBotuuids}`);
        let entityDisplayName = this.myBotDataResponse.entityDisplayName ? this.myBotDataResponse.entityDisplayName : this.myBotDataResponse.entityName;
        if (data.userInput && !data.isErrorPrompt && entityDisplayName) {
          $(entityHtml).append(`<div class="order-number-info">${entityDisplayName} : ${this.sanitizeHtmlPipe.transform(data.userInput)}</div>`);
        } else {
          if (data.isErrorPrompt && entityDisplayName) {
            let errorTemplate = this.mybotDataService.mybotErrorTemplate(this.imageFilePath, this.imageFileNames, entityDisplayName);
            $(entityHtml).append(errorTemplate);
          }
        }
        this.isMybotInputResponseClick = false;
      }
      this.myBotDataResponse = {};
      if (data.entityName) {
        this.myBotDataResponse = Object.assign({}, data);
      }

      let askToUserHtml = this.mybotDataService.askUserTemplate(myBotuuids);
      let tellToUserHtml = this.mybotDataService.tellToUserTemplate(myBotuuids);

      let agentInputEntityName = ProjConstants.ENTER_DETAILS;
      if (data.entityDisplayName || data.entityName) {
        agentInputEntityName = data.entityDisplayName ? data.entityDisplayName : data.entityName
      }

      let agentInputToBotHtml = this.mybotDataService.agentInputToBotTemplate(agentInputEntityName, agentInputId);

      if (data.isPrompt) {
        $(runInfoContent).append(askToUserHtml);
        $(runInfoContent).append(agentInputToBotHtml);
        document.getElementById(`agentInput-${agentInputId}`).focus();
        runInfoContent.querySelector(`#agentInput-${agentInputId}`).addEventListener('keypress', (e: any) => {
          let key = e.which || e.keyCode || 0;
          if (key === 13) {
            this.getAgentInputValue(e.target.value);
            this.isMybotInputResponseClick = true;
            console.log("enter clicked");
          }
        });
      } else {
        $(runInfoContent).append(tellToUserHtml);
      }
      let result = this.templateRenderClassService.getResponseUsingTemplate(data);
      let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(result)[0].innerHTML;
      let a = document.getElementById(IdReferenceConst.displayData + `-${myBotuuids}`);
      a.innerHTML = a.innerHTML + html;
      this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.MYBOTAUTOMATIONBLOCK);
    }

  }

  runDialogFormyBotTab(data) {
    console.log(data, "data in ise mybot");
    this.myBotDialogPositionId = data.positionId;
    this.commonService.isMyBotAutomationOnGoing = true;
    let agentBotuuids = this.randomUUIDPipe.transform();
    this.myBotDropdownHeaderUuids = agentBotuuids;
    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
    var appState = JSON.parse(appStateStr);
    if (appState[this.connectionDetails.conversationId]) {
      appState[this.connectionDetails.conversationId]['automationGoingOnAfterRefreshMyBot'] = this.commonService.isMyBotAutomationOnGoing
      localStorage.setItem('agentAssistState', JSON.stringify(appState))
    }

    this._createRunTemplateContainerForMyTab(agentBotuuids, data.name, this.myBotDialogPositionId)
    let addRemoveDropDown = document.getElementById(IdReferenceConst.MYBOTADDREMOVEDROPDOWN + `-${agentBotuuids}`);
    addRemoveDropDown?.classList.remove('hide');
  }

  _createRunTemplateContainerForMyTab(agentBotuuids, intentName, dialogId) {
    let dynamicBlock = document.getElementById(IdReferenceConst.MYBOTAUTOMATIONBLOCK);
    let dropdownHtml = this.mybotDataService.createDialogTaskAccordionTemplate(agentBotuuids, intentName);
    this.mybotautomation.nativeElement.innerHTML += dropdownHtml;
    this.clickEvents(IdReferenceConst.MYBOTTERMINATE, agentBotuuids);
    this.clickEvents(IdReferenceConst.DROPDOWN_HEADER,agentBotuuids);
  }

  getAgentInputValue(value, intent?) {
    console.log("agent input value mybot request", value);
    if (value) {
      let connectionDetails: any = Object.assign({}, this.connectionDetails);
      connectionDetails.value = value;
      connectionDetails.isSearch = false;
      connectionDetails.positionId = this.myBotDialogPositionId;
      if (intent) {
        connectionDetails.intentName = value;
      }
      let agent_assist_agent_request_params = this.commonService.prepareAgentAssistAgentRequestParams(connectionDetails);
      this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    }
  }


  dialogTerminatedOrIntrupptedInMyBot() {
    let appStateStr: any = localStorage.getItem('agentAssistState') || '{}';
    let appState: any = JSON.parse(appStateStr);
    this.commonService.isMyBotAutomationOnGoing = false;
    if (appState[this.connectionDetails.conversationId]) {
      appState[this.connectionDetails.conversationId]['automationGoingOnAfterRefreshMyBot'] = this.commonService.isMyBotAutomationOnGoing;
      localStorage.setItem('agentAssistState', JSON.stringify(appState))
    }
    this.commonService.addFeedbackHtmlToDom(this.myBotDropdownHeaderUuids, this.lastElementBeforeNewMessage, 'runForAgentBot',);
  }

  terminateButtonClick(uuid) {
    document.getElementById(IdReferenceConst.MYBOTTERMINATE + '-' + uuid).addEventListener('click', (event) => {
      console.log(event);
      console.log("terminate click");
      this.handleTerminatePopup.emit({ status: true, type: this.projConstants.TERMINATE });
    });
  }

  clickEvents(eventName, uuid?) {
    if (eventName == IdReferenceConst.MYBOTTERMINATE) {
      this.terminateButtonClick(uuid)
    }else if(eventName == IdReferenceConst.DROPDOWN_HEADER){
      this.designAlterService.handleDropdownToggle(uuid);
    }
  }

  scrollToBottom() {
    this.scrollToBottomEvent.emit(true);
  }

  collapseOldDialoguesInMyBot() {
    if ($(`#myBotAutomationBlock .collapse-acc-data`).length > 0) {
      let listItems = $("#myBotAutomationBlock .collapse-acc-data");
      listItems.each(function (idx, collapseElement) {
        console.log(collapseElement.classList, "classlist", collapseElement.id);
        if (!collapseElement.id.includes('smallTalk') && collapseElement.id.includes('dropDownData')) {
          collapseElement.classList.add('hide');
        }
      });
    }
}

  renderHistoryMessages(response, feedBackResult){
      if(response.length > 0){
          $('#noAutoRunning').addClass('hide');
      }
      // document.getElementById("loader").style.display = "none";
      let previousId;
      let previousTaskName, currentTaskName, previousTaskPositionId, currentTaskPositionId;
      let convId = this.commonService.configObj.conversationid;
      let botId = this.commonService.configObj.botid;

          let resp = response.length > 0 ? response : undefined;
  resp?.forEach((res, index) => {
              
              if ((!res.agentAssistDetails?.suggestions && !res.agentAssistDetails?.ambiguityList && !res.agentAssistDetails?.ambiguity) && res.type == 'outgoing') {
                  let _msgsResponse = {
                      "type": "bot_response",
                      "from": "bot",
                      "message": [],
                      "messageId": res._id,
                      "botInfo": {
                          "chatBot": "sample Bot",
                          "taskBotId": res.botId
                      },
                      "createdOn": "2022-03-21T07:56:18.225Z",
                      "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
                      "traceId": "873209019a5adc26",
                      "createdOnTimemillis": res._id
                  }
                  currentTaskName = res.tN ? res.tN : currentTaskName;
                  currentTaskPositionId = res?.agentAssistDetails?.positionId ? res?.agentAssistDetails?.positionId : currentTaskPositionId;
                  let historyData = $('#myBotAutomationBlock');
                  let userInputHtml;
                  if (res.agentAssistDetails.userInput) {
                      userInputHtml = `<div class="agent-utt-info" id="agentUttInfo-${res._id}">
                              <div class="user-img">
                                  <img src="./images/userIcon.svg">
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
                                              <i class="ast-carrotup"></i>
                                              <button class="btn-danger hide" id="myBotTerminateAgentDialog-${res._id}">Terminate</button>

                                          </div>
                                          <div class="collapse-acc-data hide" id="dropDownData-${res._id}">
                                              
                                              
                                          </div>
                                          
                                      `;

                  if (previousTaskPositionId && currentTaskPositionId !== previousTaskPositionId ) {
                       let previousIdFeedBackDetails = feedBackResult.find((ele)=> ele.positionId === previousTaskPositionId);
                       this.commonService.addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, true, previousTaskPositionId);
                      if(previousIdFeedBackDetails) {
                          this.commonService.UpdateFeedBackDetails(previousIdFeedBackDetails, 'agentAutoContainer');
                          if(previousIdFeedBackDetails.feedback == 'dislike' && (previousIdFeedBackDetails.feedbackDetails.length == 0 && previousIdFeedBackDetails.comment.length == 0)){
                              $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).removeClass('hide');
                          }else {
                              $(`#feedbackHelpfulContainer-${previousId} .explore-more-negtive-data`).addClass('hide');
                          }
                      }    
                      previousId = undefined;
                      previousTaskPositionId = undefined;
                      previousTaskName = undefined;
                  }

                  if (res.tN && !previousId && previousTaskPositionId !== currentTaskPositionId) {
                      let divExist = $(`#MyBotaddRemoveDropDown-${res._id}`);
                      previousTaskName = currentTaskName;
                      previousTaskPositionId = currentTaskPositionId;
                      if (divExist.length >= 1) {
                          console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
                      } else {
                          historyData.append(userInputHtml);
                          historyData.append(dropdownHtml);
                          previousId = res._id;
                          previousTaskPositionId = currentTaskPositionId;
                      }
                  }
                  if (res.agentAssistDetails.entityName && res.agentAssistDetails.entityResponse && res.agentAssistDetails.entityValue) {
                      let runInfoContent = $(`#dropDownData-${previousId}`);
                      let userQueryHtml = `
                              <div class="steps-run-data">
                                  <div class="icon_block_img">
                                      <img src="./images/userIcon.svg">
                                  </div>
                                  <div class="run-info-content" id="userInput-${res._id}">
                                      <div class="title">Customer Said - </div>
                                      <div class="agent-utt">
                                          <div class="title-data">"${this.sanitizeHtmlPipe.transform(res.agentAssistDetails.entityValue)}"</div>
                                      </div>
                                      
                                  </div>
                              </div>`;
                      runInfoContent.append(userQueryHtml);
                      let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
                     let entityDisplayName = '';
                      if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
                          entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${this.sanitizeHtmlPipe.transform(res.agentAssistDetails.entityValue)}</div>`);
                      } else {
                          if (res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
                              let entityHtmls = `<div class="order-number-info">${entityDisplayName} : 
                                              <span style="color:red">Value unidentified</span>
                                          </div>
                                          <div>
                                              <img src="./images/warning.svg" style="padding-right: 8px;">
                                              <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                                          </div>`
                              entityHtml.append(entityHtmls);
                          }
                      }
                  }
                  if(res.agentAssistDetails?.entityName){
                       this.myBotDataResponse = res.agentAssistDetails;
                       this.myBotDataResponse.entityDisplayName = this.myBotDataResponse.newEntityDisplayName;
                       this.myBotDataResponse.entityName = this.myBotDataResponse.newEntityName;
                  }
                  let parsedPayload;
                  res.components?.forEach((elem) => {
                      let payloadType = (elem.data?.text).replace(/(&quot\;)/g, "\"");

                      try {
                          if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                              let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                              parsedPayload = JSON.parse(withoutSpecials);
                          }
                      }catch(error){
                          if(payloadType.text){
                              let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                              parsedPayload = withoutSpecials;
                          }
                      }

                      let body = {};
                      body['type'] = elem.cT;
                      if (!parsedPayload) {
                          body['component'] = {
                              "type": elem.cT,
                              "payload": {
                                  "type": elem.cT,
                                  "text": elem.data.text
                              }
                          };
                          body['cInfo'] = {
                              "body": elem.data.text
                          };

                      } else {
                          body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
                          if (parsedPayload?.type === 'message') {
                              body['cInfo'] = {
                                  "body": ''
                              };
                          } else if (parsedPayload?.text) {
                              body['cInfo'] = {
                                  "body": parsedPayload.text
                              };
                          } else {
                              body['cInfo'] = {
                                  "body": parsedPayload
                              };
                          }

                      }

                      _msgsResponse.message.push(body);
                  });
                  if((res.agentAssistDetails?.isPrompt === true || res.agentAssistDetails?.isPrompt === false)  && previousTaskName === currentTaskName && previousTaskPositionId == currentTaskPositionId) {
                  let runInfoContent = $(`#dropDownData-${previousId}`);
                  let askToUserHtml = `
                          <div class="steps-run-data">
                                      <div class="icon_block">
                                          <i class="ast-agent"></i>
                                      </div>
                                      <div class="run-info-content" >
                                      <div class="title">Ask customer</div>
                                      <div class="agent-utt">
                                          <div class="title-data"><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                          
                                      </div>
                                      </div>
                                  </div>
                          `;
                  let tellToUserHtml = `
                          <div class="steps-run-data">
                                      <div class="icon_block">
                                          <i class="ast-agent"></i>
                                      </div>
                                      <div class="run-info-content" >
                                      <div class="title">Tell Customer</div>
                                      <div class="agent-utt">
                                          <div class="title-data" ><ul class="chat-container" id="displayData-${res._id}"></ul></div>
                                          
                                      </div>
                                      </div>
                                  </div>
                          `;
                      var appStateStr = localStorage.getItem('agentAssistState') || '{}';
                      var appState = JSON.parse(appStateStr);  
                      // if(appState[_conversationId]['automationGoingOnAfterRefreshMyBot']) {
                      //     isMyBotAutomationOnGoing = true;
                      //     noAutomationrunninginMyBot = false;
                      //     myBotDropdownHeaderUuids = previousId;
                      //     $('#inputFieldForMyBot').remove();
                      //     appState[_conversationId]['automationGoingOnAfterRefreshMyBot'] = isMyBotAutomationOnGoing;
                      //     localStorage.setItem('agentAssistState', JSON.stringify(appState));
                      //     let terminateButtonElement = document.getElementById('myBotTerminateAgentDialog-' + previousId);
                      //     $(`#myBotTerminateAgentDialog-${previousId}`).attr('data-position-id', previousTaskPositionId);
                      //     terminateButtonElement.classList.remove('hide');
                      //     myBotDialogPositionId = previousTaskPositionId;
                      // }

                      let agentInputEntityName = 'EnterDetails';
                      if(res.agentAssistDetails?.newEntityDisplayName || res.agentAssistDetails?.newEntityName){
                          agentInputEntityName = res.agentAssistDetails.newEntityDisplayName ? res.agentAssistDetails.newEntityDisplayName : res.agentAssistDetails.newEntityName
                      }
                      
                      let agentInputToBotHtml = `
                      <div class="steps-run-data">
                          <div class="icon_block">
                              <i class="ast-agent"></i>
                          </div>
                          <div class="run-info-content">
                          <div class="title">Input</div>
                          <div class="agent-utt enter-details-block">
                          <div class="title-data" ><span class="enter-details-title">${agentInputEntityName} : </span>
                          <input type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${Math.floor(Math.random() * 100)}" data-conv-id="${convId}" data-bot-id="${botId}"  data-mybot-input="true">
                          </div>
                          </div>
                          </div>
                      </div>`

                 
                  let nextResponse = resp[index+1];
                  if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {
                      runInfoContent.append(askToUserHtml);
                      if(!nextResponse || (nextResponse.status != 'received' && nextResponse.status != 'incoming')){
                          runInfoContent.append(agentInputToBotHtml);
                      }
                      
                  } else {
                      runInfoContent.append(tellToUserHtml);
                  }
                } 
                this.templateRenderClassService.AgentChatInitialize.renderMessage(_msgsResponse, res._id, `dropDownData-${previousId}`);
              }
              
          });
      this.scrollToBottom();
      this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.MYBOTAUTOMATIONBLOCK);

  }
}
