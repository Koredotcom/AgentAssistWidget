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

  constructor(public handleSubjectService: HandleSubjectService, public randomUUIDPipe: RandomUUIDPipe,
    public mybotDataService: MybotDataService, public removeSpecialCharPipe: RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe: ReplaceQuotStringWithDoubleQuotPipe,
    public sanitizeHtmlPipe: SanitizeHtmlPipe, private templateRenderClassService: TemplateRenderClassService,
    public commonService: CommonService, public websocketService: WebSocketService,
    public designAlterService: DesignAlterService, public rawHtmlPipe: RawHtmlPipe) { }

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
    this.commonService.addFeedbackHtmlToDom(this.myBotDropdownHeaderUuids, 'runForAgentBot',);
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

}
