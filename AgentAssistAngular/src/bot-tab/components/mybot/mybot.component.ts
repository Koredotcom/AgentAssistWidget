import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MybotDataService } from 'src/bot-tab/services/mybot-data.service';
import { ProjConstants, ImageFilePath, ImageFileNames, IdReferenceConst, ConnectionDetails } from 'src/common/constants/proj.cnts';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { RemoveSpecialCharPipe } from 'src/common/pipes/remove-special-char.pipe';
import { ReplaceQuotStringWithDoubleQuotPipe } from 'src/common/pipes/replace-quot-string-with-double-quot.pipe';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { DesignAlterService } from 'src/common/services/design-alter.service';

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent implements OnInit {

  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;
  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  isMybotInputResponseClick: boolean = false;
  myBotDataResponse: any = {};
  myBotDropdownHeaderUuids: any;
  myBotDialogPositionId: string;
  scrollAtEnd: boolean = true;
  connectionDetails: any = ConnectionDetails;

  constructor(public handleSubjectService: HandleSubjectService, public randomUUIDPipe: RandomUUIDPipe,
    public mybotDataService: MybotDataService, public removeSpecialCharPipe: RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe: ReplaceQuotStringWithDoubleQuotPipe,
    public sanitizeHtmlPipe: SanitizeHtmlPipe, private templateRenderClassService: TemplateRenderClassService,
    public commonService: CommonService, public websocketService: WebSocketService,
    public designAlterService : DesignAlterService) { }

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
      if (runEventObj.agentRunButton) {
        console.log(runEventObj, "run event obj");
        this.runDialogFormyBotTab(runEventObj);
      }
    });
    let subscription2 = this.websocketService.agentAssistAgentResponse$.subscribe((response: any) => {
      if (response && !response.isSearch) {
        console.log(response);
        this.commonService.isMyBotAutomationOnGoing = true;
        this.processMybotDataResponse(response, this.connectionDetails.botId);

      }
    })
    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);

  }

  processMybotDataResponse(data, botId) {
    console.log(data, "data");

    let myBotuuids = this.randomUUIDPipe.transform();

    let agentInputId = this.randomUUIDPipe.transform();
    if (this.commonService.isMyBotAutomationOnGoing && data.buttons && !data.value.includes('Customer has waited')) {
      let runInfoContent = document.getElementById(IdReferenceConst.DROPDOWNDATA + `-${this.myBotDropdownHeaderUuids}`);
      if (this.isMybotInputResponseClick) {

        let userQueryHtml = this.mybotDataService.userQueryTemplate(myBotuuids, data);

        runInfoContent.innerHTML = runInfoContent.innerHTML + userQueryHtml;

        let entityHtml = document.getElementById(IdReferenceConst.USERINPUT + `-${myBotuuids}`);
        let entityDisplayName = this.myBotDataResponse.entityDisplayName ? this.myBotDataResponse.entityDisplayName : this.myBotDataResponse.entityName;
        if (data.userInput && !data.isErrorPrompt && entityDisplayName) {
          entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${this.sanitizeHtmlPipe.transform(data.userInput)}</div>`);
        } else {
          if (data.isErrorPrompt && entityDisplayName) {
            let entityHtmls = this.mybotDataService.mybotErrorTemplate(entityDisplayName);
            entityHtml.append(entityHtmls);
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
        runInfoContent.innerHTML = runInfoContent.innerHTML + askToUserHtml;
        runInfoContent.innerHTML = runInfoContent.innerHTML + agentInputToBotHtml;
      } else {
        runInfoContent.innerHTML = runInfoContent.innerHTML + tellToUserHtml;

      }
    }

    let result = this.templateRenderClassService.getResponseUsingTemplate(data);
    console.log(result, "this.result");
    console.log(this.templateRenderClassService.AgentChatInitialize.renderMessage(result), "rendermessage");

    let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(result)[0].innerHTML;
    let a = document.getElementById(IdReferenceConst.displayData + `-${myBotuuids}`);
    a.innerHTML = a.innerHTML + html;
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd);
  }

  runDialogFormyBotTab(data) {
    console.log(data, "data in ise mybot");
    
    var dialogId = this.randomUUIDPipe.transform(IdReferenceConst.positionId);
    this.myBotDialogPositionId = dialogId;
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
    let dropdownHtml = this.mybotDataService.createDialogTaskAccordionTemplate(agentBotuuids, intentName, dialogId);
    dynamicBlock.innerHTML += dropdownHtml;
  }

  getAgentInputValue(value){
    console.log("agent input value",value);
    
  }



}
