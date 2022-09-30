import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MybotDataService } from 'src/bot-tab/services/mybot-data.service';
import { ProjConstants, ImageFilePath, ImageFileNames, IdReferenceConst } from 'src/common/constants/proj.cnts';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { RemoveSpecialCharPipe } from 'src/common/pipes/remove-special-char.pipe';
import { ReplaceQuotStringWithDoubleQuotPipe } from 'src/common/pipes/replace-quot-string-with-double-quot.pipe';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';

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
  isMyBotAutomationOnGoing: boolean = false;
  myBotDataResponse: any = {};
  myBotDropdownHeaderUuids: any;
  myBotDialogPositionId: string;
  _conversationId: string;

  constructor(public handleSubjectService: HandleSubjectService, public randomUUIDPipe: RandomUUIDPipe,
    public mybotDataService: MybotDataService, public removeSpecialCharPipe: RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe: ReplaceQuotStringWithDoubleQuotPipe,
    public sanitizeHtmlPipe: SanitizeHtmlPipe, private templateRenderClassService: TemplateRenderClassService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents() {
    let subscription = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {
      console.log(runEventObj, "run event obj");
      this.runDialogFormyBotTab(runEventObj);
    });
    this.subscriptionsList.push(subscription);
  }

  processMybotDataResponse(data, convId, botId) {
    let myBotuuids = this.randomUUIDPipe.transform();
    let _msgsResponse = this.mybotDataService.getMybotMsgResponse(myBotuuids, botId);

    data.buttons?.forEach((elem) => {
      let msgBody = this.mybotDataService.prepareMybotMsgBody(elem)
      _msgsResponse.message.push(msgBody);
    });

    let agentInputId = this.randomUUIDPipe.transform();
    if (this.isMyBotAutomationOnGoing && data.buttons && !data.value.includes('Customer has waited')) {
      let sendMsgData = encodeURI(JSON.stringify(_msgsResponse));
      let runInfoContent = document.getElementById('#' + IdReferenceConst.DROPDOWNDATA + `-${this.myBotDropdownHeaderUuids}`);
      if (this.isMybotInputResponseClick) {

        let userQueryHtml = this.mybotDataService.userQueryTemplate(myBotuuids, data);

        runInfoContent.append(userQueryHtml);
        let entityHtml = document.getElementById('#' + IdReferenceConst.USERINPUT +`-${myBotuuids}`);
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
        runInfoContent.append(askToUserHtml);
        runInfoContent.append(agentInputToBotHtml);
      } else {
        runInfoContent.append(tellToUserHtml);
      }
    }

    let result = this.templateRenderClassService.getResponseUsingTemplate(_msgsResponse);
    console.log(result, "this.result");
    let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(result)[0].innerHTML;
    let a = document.getElementById(IdReferenceConst.DROPDOWNDATA + `-${this.myBotDropdownHeaderUuids}`);
    a.innerHTML = a.innerHTML + html;
  }

  runDialogFormyBotTab(data) {
    if (data?.payload) {
      data = data.payload.info;
    }
    var dialogId = 'dg-' + (Math.random() + 1).toString(36).substring(2);
    this.myBotDialogPositionId = dialogId;
    // AgentAssistPubSub.publish('searched_Automation_details', { conversationId: data.convId, botId: data.botId, value: data.intentName, isSearch: false, intentName: data.intentName, "positionId": this.myBotDialogPositionId });
    this.isMyBotAutomationOnGoing = true;
    let agentBotuuids = Math.floor(Math.random() * 100);
    this.myBotDropdownHeaderUuids = agentBotuuids;
    var appStateStr = localStorage.getItem('agentAssistState') || '{}';
    var appState = JSON.parse(appStateStr);
    if (appState[this._conversationId]) {
      appState[this._conversationId]['automationGoingOnAfterRefreshMyBot'] = this.isMyBotAutomationOnGoing
      localStorage.setItem('agentAssistState', JSON.stringify(appState))
    }

    this._createRunTemplateContainerForMyTab(agentBotuuids, data.intentName, this.myBotDialogPositionId)
    let addRemoveDropDown = document.getElementById(IdReferenceConst.MYBOTADDREMOVEDROPDOWN + `-${agentBotuuids}`);
    addRemoveDropDown?.classList.remove('hide');
  }

  _createRunTemplateContainerForMyTab(agentBotuuids, intentName, dialogId) {
    let dynamicBlock = document.getElementById(IdReferenceConst.MYBOTAUTOMATIONBLOCK);
    let dropdownHtml = this.mybotDataService.createDialogTaskAccordionTemplate(agentBotuuids, intentName, dialogId);
    dynamicBlock.innerHTML += dropdownHtml;
  }

}
