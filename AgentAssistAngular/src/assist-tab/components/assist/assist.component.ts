import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants, ImageFilePath, ImageFileNames, IdReferenceConst, storageConst, coachingConst } from 'src/common/constants/proj.cnts';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { RawHtmlPipe } from 'src/common/pipes/raw-html.pipe';
import { RemoveSpecialCharPipe } from 'src/common/pipes/remove-special-char.pipe';
import { ReplaceQuotStringWithDoubleQuotPipe } from 'src/common/pipes/replace-quot-string-with-double-quot.pipe';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { CommonService } from 'src/common/services/common.service';
import { DesignAlterService } from 'src/common/services/design-alter.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import * as $ from 'jquery';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';
import { AssistService } from 'src/assist-tab/services/assist.service';
import { HtmlEntityPipe } from 'src/common/pipes/html-entity.pipe';
import { EVENTS } from 'src/common/helper/events';
import { LocalStorageService } from 'src/common/services/local-storage.service';
import { ReplaceTextWithTagPipe } from 'src/common/pipes/replace-text-with-tag.pipe';
import { RemoveTagFromStringPipe } from 'src/common/pipes/remove-tag-from-string.pipe';
@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss'],
  providers: [RandomUUIDPipe]
})
export class AssistComponent implements OnInit {

  @Output() scrollToBottomEvent = new EventEmitter();
  @ViewChild('dynamicBlockRef') dynamicBlockRef: ElementRef;
  @Output() handlePopupEvent = new EventEmitter();
  @Output() newButtonScrollClickEvents = new EventEmitter();

  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;
  imageFileNames: any = ImageFileNames;
  imageFilePath: string = ImageFilePath;
  idReferenceConst: any = IdReferenceConst;

  dialogName: string;
  dialogPositionId: string;

  connectionDetails: any;
  welcomeMsgResponse: any;
  dropdownHeaderUuids: any;
  interruptDialog: any = {};
  agentAssistResponse: any = {};
  waitingTimeForUUID: number = 1000;
  proactiveModeStatus: boolean;
  isFirstMessagOfDialog: boolean = false;
  answerPlaceableIDs : any = [];
  isHistoryApiCalled = false;
  smallTalkOverrideBtnId : string;
  faqManualClick : boolean = false;
  userBotSessionDetails;
  interactiveLangaugeDetails = 'en';
  isGuidedChecklistApiSuccess = false;
  isChecklistOpened = false;
  checklists= [];

  constructor(private templateRenderClassService: TemplateRenderClassService,
    public handleSubjectService: HandleSubjectService,
    public randomUUIDPipe: RandomUUIDPipe,
    public removeSpecialCharPipe: RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe: ReplaceQuotStringWithDoubleQuotPipe,
    public sanitizeHtmlPipe: SanitizeHtmlPipe,
    public commonService: CommonService, public websocketService: WebSocketService,
    public designAlterService: DesignAlterService, public rawHtmlPipe: RawHtmlPipe,
    public koreGenerateuuidPipe: KoreGenerateuuidPipe, public assisttabService: AssistService,
    public htmlEntityPipe: HtmlEntityPipe, private localStorageService: LocalStorageService,
    private removeTagFromString : RemoveTagFromStringPipe, private replaceTextwithTag : ReplaceTextWithTagPipe) {
  }

  ngOnInit(): void {
    this.subscribeEvents();
    this.scrollToBottom();
    if(this.connectionDetails.interactiveLanguage !== '') {
      this.interactiveLangaugeDetails = this.connectionDetails.interactiveLanguage;
    }

  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents() {
    let subscription1 = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {

      if (runEventObj) {
        if (runEventObj && !runEventObj?.agentRunButton && !this.commonService.isAutomationOnGoing) {
          this.runDialogForAssistTab(runEventObj);
        } else if (runEventObj && !runEventObj?.agentRunButton && this.commonService.isAutomationOnGoing) {
          this.interruptDialog = runEventObj;
          this.handlePopupEvent.emit({ status: true, type: this.projConstants.INTERRUPT });
        }
      }
    });

    let subscription2 = this.websocketService.agentAssistResponse$.subscribe((response: any) => {
      console.log("------------resposne of agent request")
      if (response && Object.keys(response).length > 0) {
        if(this.commonService.checkAutoBotIdDefined(this.connectionDetails?.autoBotId)){
          this.connectionDetails['autoBotId'] = response?.autoBotId ? response.autoBotId: undefined;
          this.handleSubjectService.setAutoBotIdFromAgentResponse({autoBotId: response?.autoBotId ? response.autoBotId: undefined});
          // if(!this.isHistoryApiCalled) {this.callHistoryApi()}
        }
        if(this.commonService.checkAutoBotIdDefined(this.commonService.configObj?.autoBotId)){
          this.commonService.configObj['autoBotId'] = response?.autoBotId;
        }

        console.log("ater adding autobotid from response----------------------------,", this.connectionDetails, this.commonService.configObj)
        this.updateAgentAssistResponse(response, this.connectionDetails.botId, this.connectionDetails.conversationId);
        this.viewCustomTempAttachment()
      }
    });

    let subscription3 = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {
      if (endoftaskresponse && (this.dialogPositionId == endoftaskresponse.positionId || (endoftaskresponse.author && endoftaskresponse.author.type == 'USER'))) {
        this.dialogTerminatedOrIntruppted();
        this.viewCustomTempAttachment();
      }
    })

    let subscription4 = this.handleSubjectService.terminateClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.ASSIST) {

        this.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
        this.dialogTerminatedOrIntruppted();
      }
    });

    let subscription5 = this.handleSubjectService.interruptClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.ASSIST) {
        this.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
        this.dialogTerminatedOrIntruppted();
        this.runDialogForAssistTab(this.interruptDialog);
      }

    });

    let subscription6 = this.websocketService.agentAssistUserMessageResponse$.subscribe((response: any) => {
      if (response && response.botId) {
        if (!this.commonService.isAutomationOnGoing && !this.proactiveModeStatus) {
          return;
        } else {
          this.updateNumberOfMessages();
          this.processUserMessages(response, response.conversationId, response.botId);
          this.viewCustomTempAttachment()
        }

      }
    });

    let subscription7 = this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
        let appState = this.localStorageService.getLocalStorageState();
        this.proactiveModeStatus = appState[this.connectionDetails.conversationId][storageConst.PROACTIVE_MODE]
        if(!this.isHistoryApiCalled){
          this.callHistoryApi();
        }
      }
    });

    let subscription8 = this.websocketService.userMessageResponse$.subscribe((userMsgResponse: any) => {
      console.log("user message response");

    });

    let subscription9 = this.handleSubjectService.activeTabSubject.subscribe((response) => {
      if (response && response == this.projConstants.ASSIST) {
        setTimeout(() => {
          this.assisttabService.updateSeeMoreOnAssistTabActive();
          this.handleClickEventsAfterTabShift();
        }, 1000);
      }
    });

    let subscription10 = this.handleSubjectService.restoreClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.ASSIST) {
        this.handleRestoreConfirmClickEvent();
      }
    })

    let subscription11 = this.websocketService.agentFeedbackResponse$.subscribe((data) => {
      if (this.commonService.isUpdateFeedBackDetailsFlag) {
        this.commonService.UpdateFeedBackDetails(data, 'dynamicBlock')
      }
    });

    let subscription12 = this.handleSubjectService.overridebtnClickEventSubject.subscribe((response: any) => {
      if (response && response.data) {
        let actualId = response.data.id.split('-');
        actualId.shift();
        let id = actualId.join('-');
        if (response.override) {
          this.clickEvents(IdReferenceConst.OVERRIDE_BTN, id, this.dialogPositionId);
        } else if (response.cancelOverride) {
          this.clickEvents(IdReferenceConst.CANCEL_OVERRIDE_BTN, id, this.dialogPositionId);
        }
      }
    });

    let subscription13 = this.handleSubjectService.proactiveModeSubject.subscribe((response: any) => {
      console.log("proactive mode subject", response);
      if (response != null && response != undefined) {
        this.proactiveModeStatus = response;
        let dropdownHeaderUuids = this.smallTalkOverrideBtnId ? this.smallTalkOverrideBtnId : this.dropdownHeaderUuids;
        console.log(dropdownHeaderUuids, 'dropdown header uuids');

        if (response) {
          $(`.override-input-div`).removeClass('hide');
          this.handleCancelOverrideBtnClick(dropdownHeaderUuids, this.dialogPositionId);
          $(`#overRideBtn-${dropdownHeaderUuids}`).removeClass('hide');
        } else {
          if (document.getElementById(`overRideBtn-${dropdownHeaderUuids}`)) {
            if (document.getElementById(`inputFieldForAgent`)) {
              $(`#inputFieldForAgent`).remove();
            }
            if (document.getElementById(`overRideBtn-${dropdownHeaderUuids}`)) {
              $(`#overRideBtn-${dropdownHeaderUuids}`).addClass('hide');
              $(`#cancelOverRideBtn-${dropdownHeaderUuids}`).addClass('hide');
            }
            this.handleOverridBtnClick(dropdownHeaderUuids, this.dialogPositionId);
          }else{
            this.handleProactiveDisableEvent(this.dialogPositionId);
          }
        }
      }
    });

    let subscription14 = this.websocketService.socketConnectFlag$.subscribe((response) => {
      if (response) {
        this.guidedListAPICall(
          this.commonService.configObj.agentassisturl, 
          this.commonService.configObj.instanceBotId ? 
            this.commonService.configObj.instanceBotId : 
            this.commonService.configObj.botid, 
          this.commonService.configObj.accessToken, 
          this.commonService.configObj.accountId)
      }
    });

    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);
    this.subscriptionsList.push(subscription5);
    this.subscriptionsList.push(subscription6);
    this.subscriptionsList.push(subscription7);
    this.subscriptionsList.push(subscription8);
    this.subscriptionsList.push(subscription9);
    this.subscriptionsList.push(subscription10);
    this.subscriptionsList.push(subscription11);
    this.subscriptionsList.push(subscription12);
    this.subscriptionsList.push(subscription13);
    this.subscriptionsList.push(subscription14);
  }

  callHistoryApi(){
    this.isHistoryApiCalled = true;
    this.handleSubjectService.setLoader(true);
    let shouldProcessResponse = true;
    let respons : any = this.commonService.renderingHistoryMessage(this.connectionDetails);
    respons.then((res) => {
      if(res && res.messages){
        this.handleSubjectService.setLoader(false);
        this.renderHistoryMessages(res.messages, res.feedbackDetails)
      }
      if (res && res.messages && res.messages.length > 0 && this.connectionDetails.conversationId) {
        shouldProcessResponse = false;
      }else{
        shouldProcessResponse = true;
      }
      this.commonEmitEvents(shouldProcessResponse);
    }).catch((err) => {
      this.handleSubjectService.setLoader(false);
      this.commonEmitEvents(shouldProcessResponse);
    });
  }

  commonEmitEvents(shouldProcessResponse){
    let parsedCustomData: any = {};
    let agent_user_details = {...this.localStorageService.agentDetails, ...this.localStorageService.userDetails};
    let welcomeMessageParams: any = {
      'waitTime': 2000,
      'userName': parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'user',
      'id': this.connectionDetails.conversationId,
      "isSendWelcomeMessage": shouldProcessResponse,
      'agentassistInfo' : agent_user_details,
      'botId': this.connectionDetails.botId,
      'sendMenuRequest': true,
      'uId': this.userBotSessionDetails?.userId || '',
      'sId': this.userBotSessionDetails?.sessionId || '',
      'experience' : (this.connectionDetails.isCall && this.connectionDetails.isCall === "true") ?  ProjConstants.VOICE : ProjConstants.CHAT,
    }
    if(this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      welcomeMessageParams['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      welcomeMessageParams['autoBotId'] = '';
    }
    if (this.connectionDetails?.interactiveLanguage !== null && typeof this.connectionDetails?.interactiveLanguage !== 'undefined' && this.connectionDetails?.interactiveLanguage !== "''") {
      welcomeMessageParams['language'] = this.connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    this.websocketService.emitEvents(EVENTS.welcome_message_request, welcomeMessageParams);


    if(!this.isGuidedChecklistApiSuccess && this.commonService.primaryChecklist.length > 0) {
      this.sendChecklistEvent();
    }
  }

  checkListData:any = {}
  guidedListAPICall(agentAssistUrl, botId, accessToken, accountId) {
    let headersVal = {
      'Authorization': 'bearer' + ' ' + accessToken,
      "AccountId": accountId !== '' ? accountId : '',
      'iid' : botId
  }
    $.ajax({
      url: `${agentAssistUrl}/agentassist/api/v1/agentcoachingconfiguration/checklist/${botId}/activeChecklists`,
      type: 'get',
      headers: headersVal,
      dataType: 'json',
      success:  (data) => {
        if(data.checklists.length > 0 ) {
          this.checkListData = data;
          this.commonService.primaryChecklist = data.checklists.filter(check => check.type === "primary");
          this.commonService.dynamicChecklist = data.checklists.filter(check => check.type === "dynamic");
          // this.commonService.guidedChecklistObj = data;
        }
        if(!this.isGuidedChecklistApiSuccess && this.commonService.primaryChecklist.length > 0) {
          this.sendChecklistEvent();
        }
      },
      error:  (err)=> {
          console.error("Unable to fetch the details with the provided data", err);
      }
  });
  }

  sendChecklistEvent() {
    // checklist_opened
    // let checklistArr = [];
    this.handleSubjectService.userHistoryDataSubject$.subscribe((res : any) => {
      console.log(res, "response inside checklist");
      // if(res && res.length > 0){
      //   checklistArr = res;
      // }
    });
    let checklistParams: any = {
      "payload": {
          "event": "checklist_opened",
          "conversationId": this.connectionDetails.conversationId,
          "ccVersion": this.checkListData?.ccVersion,
          "accountId": this.checkListData?.accountId,
          "botId": this.commonService.configObj.instanceBotId,
          "agentInfo": {
              "agentId": "", // mendatory field
              //any other fields
          },
          "checklist": {
            "_id": this.commonService.primaryChecklist[0]._id,
              //any other fields
          },
          "timestamp": 0,
          "context": {}
      }
    }
    this.isGuidedChecklistApiSuccess = true;
    this.websocketService.emitEvents(EVENTS.checklist_opened, checklistParams);
    this.isChecklistOpened = true;
    this.checklists.push(this.commonService.primaryChecklist[0]);
  }


  //dialogue click and agent response handling code.
  AgentAssist_run_click(dialog, dialogPositionId, intent?) {
    let connectionDetails: any = Object.assign({}, this.connectionDetails);
    connectionDetails.value = dialog.intentName;
    if (dialog.intentName && intent) {
      connectionDetails.intentName = dialog.intentName;
    }
    connectionDetails.positionId = dialogPositionId;
    connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
    connectionDetails.childBotId = dialog.childBotId;
    connectionDetails.childBotName = dialog.childBotName;
    if(dialog.userInput){
     connectionDetails.userInput = dialog.userInput;
    }
    let assistRequestParams = this.commonService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
  }

  runDialogForAssistTab(data, idTarget?, runInitent?) {
    this.collapseOldDialoguesInAssist();
    this.isFirstMessagOfDialog = true;
    let uuids = this.koreGenerateuuidPipe.transform();
    this.dropdownHeaderUuids = uuids;
    this.commonService.isAutomationOnGoing = true;
    let storageObject: any = {
      // [storageConst.AUTOMATION_GOING_ON]: this.commonService.isAutomationOnGoing,
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.commonService.isAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    let dialogId = this.randomUUIDPipe.transform(IdReferenceConst.positionId);
    this.dialogPositionId = dialogId;
    if (runInitent) {
      this.dialogPositionId = data?.positionId;
    }
    this.assisttabService._createRunTemplateContiner(uuids, data.intentName);
    this.dialogName = data.intentName;
    if (idTarget) {
      let ids = idTarget.split('-');
      ids.shift();
      let joinedIds = ids.join('-');
      let dialogID = document.getElementById(`suggestionId-${joinedIds}`);
      if (dialogID) {
        dialogID.style.borderStyle = "solid";
      }
    }
    // $(`${!data.useCaseList}` ? '.dialog-task-run-sec' : '.content-dialog-task-type .type-info-run-send').each((i, ele) => {
    //   let id = ele.id?.split('-');
    //   id.shift();
    //   if (joinedIds.includes(id.join('-'))) {
    //     idsOfDropDown = ele.id;
    //   }
    // });

    let addRemoveDropDown = document.getElementById(`addRemoveDropDown-${uuids}`);
    addRemoveDropDown?.classList.remove('hide');
    $(`#endTaks-${uuids}`).removeClass('hide');
    if (!runInitent) {
      this.AgentAssist_run_click(data, this.dialogPositionId, this.projConstants.INTENT);
    }
    setTimeout(() => {
      this.clickEvents(IdReferenceConst.ASSISTTERMINATE, uuids);
      // this.clickEvents(IdReferenceConst.DROPDOWN_HEADER, uuids);
      this.scrollToBottom();
    }, 1000);
  }

  processUserMessages(data, conversationId, botId) {
    if(this.commonService.isAutomationOnGoing){
      let _id = this.randomUUIDPipe.transform();
      let resultMsgResponse = this.templateRenderClassService.getMessageResponseForUserMessages(data, botId)
      let titleText = '';
      let userQueryHtml = '';
      $("#inputFieldForAgent").remove();
      if (this.commonService.OverRideMode) {
        titleText = "YouEntered -";
        userQueryHtml = this.assisttabService.userQueryTemplate(titleText, this.imageFilePath, this.imageFileNames, _id, data);
      } else {
        titleText = "Customer Said -"
        userQueryHtml = this.assisttabService.userQueryTemplate(titleText, this.imageFilePath, this.imageFileNames, _id, data);
      }
      let addUserQueryTodropdownData = document.getElementById(`dropDownData-${this.dropdownHeaderUuids}`);
      addUserQueryTodropdownData.innerHTML = addUserQueryTodropdownData.innerHTML + userQueryHtml;
      let entityHtml = $(`#dropDownData-${this.dropdownHeaderUuids}`).find(`#userInput-${_id}`);
      let entityDisplayName = this.agentAssistResponse.entityDisplayName ? this.agentAssistResponse.entityDisplayName : this.agentAssistResponse.entityName;
      if (this.agentAssistResponse.newEntityDisplayName || this.agentAssistResponse.newEntityName) {
        entityDisplayName = this.agentAssistResponse.newEntityDisplayName ? this.agentAssistResponse.newEntityDisplayName : this.agentAssistResponse.newEntityName;
      }
      if (data.entityValue && !data.isErrorPrompt && entityDisplayName) {
        entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${this.sanitizeHtmlPipe.transform(data.entityValue)}</div>`);
      } else {
        if (data.isErrorPrompt && entityDisplayName) {
          let entityType = data.entityType;
          let entityHtmls = this.assisttabService.errorTemplate(this.imageFilePath, this.imageFileNames, entityDisplayName, entityType);
          entityHtml.append(entityHtmls);
        }
      }

      if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
        this.scrollToBottom();
      }
      let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(resultMsgResponse)[0].innerHTML;
      this.commonService.removingSendCopyBtnForCall(this.connectionDetails);
    }else{
      $("#inputFieldForAgent").remove();
      let dynamicBlockDiv = $('#dynamicBlock');
      let uuids = this.koreGenerateuuidPipe.transform();
      let botResHtml = this.assisttabService.getUserMsgSmallTalkTemplate(uuids,data);
      let titleData = `<div class="title-data" id="displayData-${uuids}">${this.sanitizeHtmlPipe.transform(data.userInput)}</div>`
      dynamicBlockDiv.append(botResHtml);
      $(`#smallTalk-${uuids} .agent-utt`).append(titleData);
    }
  }

  updateAgentAssistResponse(data, botId, conversationId) {
    // let shouldProcessResponse = false;
    // let appState = this.localStorageService.getLocalStorageState();
    // if (appState[this.connectionDetails.conversationId]) {
    //   // if incoming data belongs to welcome message do nothing
    //   if (!data.suggestions && data.buttons?.length > 1) {
    //     if (appState[this.connectionDetails.conversationId][storageConst.IS_WELCOMEMSG_PROCESSED]  && document.getElementsByClassName('.welcome-msg').length > 0) {
    //       return;
    //     }
    //   }
    //   shouldProcessResponse = true;
    // } else {
    //   shouldProcessResponse = true;
    // }
    // if (!shouldProcessResponse) {
    //   return;
    // }
    if (!(this.commonService.isAutomationOnGoing && data.suggestions)) {
      this.updateNumberOfMessages();
    }

    let overRideObj = {
      "agentId": "",
      "botId": botId,
      "conversationId": conversationId,
      "query": "",
      'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
      "enable_override_userinput": false
    }
    if (this.commonService.OverRideMode && this.proactiveModeStatus) {
      this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj)
      this.commonService.OverRideMode = false;
    }
    // this.designAlterService.displayCustomerFeels(data, conversationId, botId, this.connectionDetails.source);

    this.commonService.updateAgentAssistState(conversationId, this.projConstants.ASSIST, data);
    this.processAgentAssistResponse(data, botId);
  }

  uuids = this.koreGenerateuuidPipe.transform();
  processAgentAssistResponse(data, botId) {
    console.log("process agent assist response", data, this.proactiveModeStatus);
    this.smallTalkOverrideBtnId = null;
    let isTemplateRender = false;
    data = this.commonService.confirmationNodeRenderDataTransform(data);
    if(this.commonService.isAutomationOnGoing && this.dropdownHeaderUuids && data.suggestions?.dialogs?.length > 0) {
      this.dialogTerminatedOrIntruppted();
    }
    if (!this.commonService.isAutomationOnGoing && !this.proactiveModeStatus && !data.sendMenuRequest) {
      return;
    }
    let automationSuggestions = $('#dynamicBlock .dialog-task-accordiaon-info');

    if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length == 0) {
      data.suggestions = false;
    } else if (this.designAlterService.emptyDeep(data.suggestions)) {
      data.suggestions = false;
    }

    let uuids = this.koreGenerateuuidPipe.transform();
    let responseId = uuids;
    if (!this.commonService.isAutomationOnGoing && data.intentName && !data.suggestions && !this.commonService.isInitialDialogOnGoing) {
      let isInitialTaskRanORNot;
      let appState = this.localStorageService.getLocalStorageState();
      if (appState[this.connectionDetails.conversationId]) {
        isInitialTaskRanORNot = appState[this.connectionDetails.conversationId][storageConst.INITIALTASK_GOING_ON]
      }
      if (!isInitialTaskRanORNot) {
        this.runDialogForAssistTab(data, `onInitDialog-123456`, "onInitRun");
      }
    }
    if (this.commonService.isCallConversation === true && data.suggestions) {
      let buldHtml = `
        <div class="buld-count-utt" id="buldCount-${uuids}">
                    <i class="ast-bulb" id="buldCountAst-${uuids}"></i>
                    <span class="count-number" id="buldCountNumber-${uuids}">${(data.suggestions.dialogs?.length || 0) + (data.suggestions.faqs?.length || 0) + (data.suggestions.searchassist?.snippets?.length || 0) + (this.commonService.formatSearchResponse(data)?.articles?.length || 0)}</span>
                </div>`;

      let attrs = $('#scriptContainer .other-user-bubble .bubble-data');
      $(attrs).last().attr('id', uuids)
      attrs.each((i, data) => {
        if (data.id === uuids) {
          $(`#${data.id}`).append(buldHtml);
        }
      });
    }
    if (!this.commonService.isAutomationOnGoing && data.suggestions && this.answerPlaceableIDs.length == 0) {
      // $('#welcomeMsg').addClass('hide');
      let dynamicBlock = document.getElementById('dynamicBlock');
      let suggestionsblock = $('#dynamicBlock .dialog-task-run-sec');
      if (suggestionsblock.length >= 0) {
        suggestionsblock.each((i, ele) => {
          $('#dynamicBlock .agent-utt-info').each((i, elem) => {
            let elemID = elem.id.split('-');
            elemID.shift();
            if (ele.id.includes(elemID.join('-'))) {
              let foundIndex = this.commonService.automationNotRanArray.findIndex((ele) => ele.id === elem.id);
              if (foundIndex == -1) {
                this.commonService.automationNotRanArray.push({ name: elem.innerText.trim(), id: elem.id });
                // let storageObject: any = {
                //   [storageConst.AUTOMATION_NOTRAN_ARRAY]: this.commonService.automationNotRanArray
                // }
                // this.localStorageService.setLocalStorageItem(storageObject, this.projConstants.ASSIST);
              }

            }
          })
        })
      }
      this.commonService.userIntentInput = data.userInput;
      let htmls = this.assisttabService.agentUttInfoTemplate(data, responseId, this.imageFilePath, this.imageFileNames)

      dynamicBlock.innerHTML = dynamicBlock.innerHTML + htmls;

      if (data.type === 'intent' || data.type === 'text') {
        let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
        automationSuggestions.classList.remove('hide');
      }

      if (data.suggestions) {

          if(data.suggestions?.searchassist?.snippets?.length > 0){
            let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
            automationSuggestions.classList.remove('hide');
            let dialogAreaHtml = this.assisttabService.getSnippetAreaTemplate(responseId, data, this.imageFilePath, this.imageFileNames)
            automationSuggestions.innerHTML += dialogAreaHtml;
            data.suggestions?.searchassist?.snippets?.forEach((ele, index) => {
                let articleSuggestions = document.getElementById(`snippetsSuggestions-${responseId}`);

                let articleHtml = `
                <div class="type-info-run-send" id="snippetDiv-${uuids+index}">
                    <div class="left-content" id="snippetSection-${uuids+index}">
                        <div class="title-text" title="${ele.title}" id="snippettitle-${uuids+index}">${ele.title}</div>
                    </div>

                </div>`;

                articleSuggestions.innerHTML += articleHtml;
                let articles = $(`.type-info-run-send #snippetSection-${uuids+index}`);

                        let a = $(`#snippetDiv-${uuids + index}`);
                        let articleActionHtml = `
                        <button class="know-more-btn hide" id="snippetviewMsg-${uuids+index}" data-msg-id="snippet-${uuids + index}" data-msg-data="${ele.page_url}"><a style="color: #FFFFFF;" href="${ele.page_url}" target="_blank">Know more</a></button>

                    `;
                    articles.append(`<div class="desc-text" id="snippetdesc-${uuids + index}">${ele.content}</div>`);
                    articles.append(articleActionHtml);
                    let articlestypeInfo = $(`.type-info-run-send #snippetSection-${uuids + index}`);
                    let seeMoreButtonHtml = `
                <button class="ghost-btn hide" id="snippetseeMore-${uuids + index}" data-snippet-see-more="true">${this.projConstants.READ_MORE}</button>
                <button class="ghost-btn hide" id="snippetseeLess-${uuids + index}" data-snippet-see-less="true">${this.projConstants.READ_LESS}</button>
                `;
                    articlestypeInfo.append(seeMoreButtonHtml);
                    setTimeout(() => {
                        this.commonService.updateSeeMoreButtonForAssist(uuids + index,'snippet');
                    }, 1000);
            })
          }


        if (data.suggestions.dialogs?.length > 0) {

          let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
          let dialogAreaHtml = this.assisttabService.getDialogAreaTemplate(responseId, data, this.imageFilePath, this.imageFileNames);
          automationSuggestions.innerHTML += dialogAreaHtml;
        }

        if (data.suggestions.faqs?.length > 0) {
          let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
          let faqAreaHtml = this.assisttabService.getFaqAreaTemplate(responseId, data, this.imageFilePath, this.imageFileNames);
          automationSuggestions.innerHTML += faqAreaHtml;
        }

        data.suggestions.dialogs?.forEach((ele, index) => {
          ele.entities?.length > 0 ? (this.commonService.entitiestValueArray = ele.entities) : '';
          ele.name = ele.name || ele.usecaseName;
          ele.userInput = data.userInput;
          let dialogSuggestions = document.getElementById(`dialogSuggestions-${responseId}`);
          let dialogsHtml = this.assisttabService.dialogTypeInfoTemplate(uuids, index, ele);
          dialogSuggestions.innerHTML += dialogsHtml;
          if (ele.entities?.length > 0) {
            this.commonService.previousEntitiesValue = JSON.stringify(ele.entities);
            let entitesDiv = `<div class="entity-values-container" id="entitesDiv-${uuids}">
                    <fieldset class="fieldsets">
                        <legend>ENTITY VALUES</legend>
                        </fieldset>
                <div class="edit-values-btn" id="entityEdit-${uuids}">Edit Values</div>
                <div class="edit-values-btn restore hide" id="restorebtn-${uuids}">Restore Values</div>
            </div>`;
            dialogSuggestions.innerHTML += entitesDiv;
            let enentiesDomDiv = $(`#entitesDiv-${uuids}`).find('.fieldsets');
            ele.entities?.forEach((eleData, i) => {

              let eachEntitiesDiv = `
                     <div class="entity-row-data" id="enityNameAndValue-${i}">
                        <div class="label-data">${eleData.name}</div>
                        <div class="edited-status hide">
                            <i class="ast-edited"></i>
                            <span>edited</span>
                        </div>
                        <div class="entity-input-content-data">
                            <div class="entity-value" id="initialentityValue-${i}" >${eleData.value}</div>
                            <div class="entity-input">
                                <input type="text" id="entityValue-${i}"
                                 value='${eleData.value}'>
                            </div>
                        </div>
                    </div>`;
              enentiesDomDiv.append(eachEntitiesDiv);
              this.keyUpEvents(IdReferenceConst.ENTITY_VALUE, i);

            });
            let entiteSaveAndCancelDiv = `<div class="save-reset-cancel hide" id='saveAndCancel-${uuids}'>
                 <div class="save-reset-disabled" >
                     <i class="ast-check-right  disabled-color"></i>
                     <span id='savebtn-${uuids}'>Save</span>
                 </div>
                 <div class="cancel-btn" id="cancelBtn-${uuids}">Cancel</div>
             </div>`;
            enentiesDomDiv.append(entiteSaveAndCancelDiv);
          }
          this.clickEvents(IdReferenceConst.ASSIST_RUN_BUTTON, uuids + index, this.dialogPositionId, ele);
          this.clickEvents(IdReferenceConst.AGENT_RUN_BTN, uuids + index, this.dialogPositionId, ele);
          this.clickEvents(IdReferenceConst.ENTITY_EDIT, uuids + index);
          this.clickEvents(IdReferenceConst.EDIT_CANCEL_BTN, uuids + index);
          this.clickEvents(IdReferenceConst.RESTORE_BTN, uuids + index);
          this.clickEvents(IdReferenceConst.SAVE_BTN, uuids + index);
        });

        data.suggestions.faqs?.forEach((ele, index) => {

          let faqsSuggestions = document.getElementById(`faqsSuggestions-${responseId}`);

          let faqHtml = this.assisttabService.faqTypeInfoTemplate(uuids, index, ele)

          faqsSuggestions.innerHTML += faqHtml;
          let faqs = $(`.type-info-run-send #faqSection-${uuids + index}`);
          let positionID = 'dg-' + this.koreGenerateuuidPipe.transform();

          if (!ele.answer  || ele.answer.length <= 0) {
            let checkHtml = `
        <i class="ast-carrotup" id="check-${uuids + index}" data-intent-name="${ele.displayName}"
        data-check="true" data-position-id="${positionID}"></i>`;
            $(`#faqDiv-${uuids + index}`).addClass('is-dropdown-show-default');
            document.getElementById(`title-${uuids + index}`).insertAdjacentHTML('beforeend', checkHtml);
            this.clickEvents(IdReferenceConst.CHECK, uuids + index, positionID, {intentName : ele.displayName, positionID : positionID, question: ele.question});
          } else {
            let a = $(`#faqDiv-${uuids + index}`);
            let answerSanitized = (ele.answer[0]);
            // if text only not template cond need to add
            answerSanitized = this.commonService.replaceDoubleQuot(answerSanitized);
            let faqActionHtml = `<div class="action-links">
            <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids+index}" data-msg-data="${answerSanitized}" data-position-id="${positionID}">Send</button>
            <div class="copy-btn" data-msg-id="${uuids+index}" data-msg-data="${answerSanitized}" data-position-id="${positionID}">
                <i class="ast-copy" data-msg-id="${uuids+index}" data-msg-data="${answerSanitized}" data-position-id="${positionID}"></i>
            </div>
            </div>`;
            a.append(faqActionHtml);
            this.commonService.hideSendAndCopyBtnsforCallconversation(a);
            console.log('handle2: ', this.commonService.handleEmptyLine2(ele.answer[0]))
            faqs.append(`<div class="desc-text" id="desc-${uuids + index}">${this.commonService.handleEmptyLine2(ele.answer[0])}</div>`);

            if(ele.answer && ele.answer.length > 1){
              this.commonService.appendSeeMoreWrapper(faqs, ele, uuids+index, positionID);
            }

            let faqstypeInfo = $(`.type-info-run-send #faqSection-${uuids + index}`);
            let seeMoreButtonHtml = `
                <button class="ghost-btn hide" id="seeMore-${uuids + index}" data-see-more="true" data-msg-answer="${ele.answer?.length > 1 ? ele.answer : null}">${ele.answer?.length > 1 ? (this.projConstants.READ_MORE_EXPAND) : this.projConstants.READ_MORE}</button>
                <button class="ghost-btn hide" id="seeLess-${uuids + index}" data-see-less="true" data-msg-answer="${ele.answer?.length > 1 ? ele.answer : null}">${this.projConstants.READ_LESS}</button>
                `;
            faqstypeInfo.append(seeMoreButtonHtml);
            setTimeout(() => {
              this.commonService.updateSeeMoreButtonForAssist(uuids + index,ProjConstants.FAQ,ele.answer);
            }, 100);
          }

          if (data.suggestions.faqs.length === 1 && !ele.answer) {
            setTimeout(() => {
              this.faqManualClick = true;
              document.getElementById(`check-${uuids + index}`).click();
              // $(`#check-${uuids + index}`).addClass('hide');
            }, 600);
            $(`#faqDiv-${uuids + index}`).removeClass('is-dropdown-show-default');
          }
          // this.clickEvents(IdReferenceConst.SENDMSG, uuids + index, this.dialogPositionId, ele);
          // this.clickEvents(IdReferenceConst.COPYMSG, uuids + index, this.dialogPositionId, ele);
        });

        if (data?.suggestions?.searchassist && Object.keys(data.suggestions.searchassist).length > 0) {
          data.suggestions = this.commonService.formatSearchResponse(data);
          if (data.suggestions.articles?.length > 0) {
            let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
            let articleAreaHtml = this.assisttabService.getArticleAreaTemplate(responseId, data, this.imageFilePath, this.imageFileNames);
            automationSuggestions.innerHTML += articleAreaHtml;
          }

          data.suggestions.articles?.forEach((ele, index) => {
            let articleSuggestions = document.getElementById(`articleSuggestions-${responseId}`);

            let articleHtml = this.assisttabService.articleTypeInfoTemplate(uuids, index, ele);

            articleSuggestions.innerHTML += articleHtml;
            let articles = $(`.type-info-run-send #articleSection-${uuids + index}`);
            // if (!ele.content) {
            //   let checkHtml = `
            //             <i class="ast-carrotup" data-conv-id="${data.conversationId}"
            //             data-bot-id="${botId}" data-intent-name="${ele.title}"
            //             data-check="true" id="articlecheck-${uuids + index}"></i>`;
            //   articles.append(checkHtml);
            // } else {
              ele.content = this.removeTagFromString.transform(ele.content);
              let a = $(`#articleDiv-${uuids + index}`);
              let answerSanitized = this.commonService.handleEmptyLine(ele.content, true);
              let articleActionHtml = `<div class="action-links">
                            <button class="send-run-btn" id="sendMsg" data-msg-id="article-${uuids + index}" data-msg-data="${answerSanitized}">Send</button>
                            <div class="copy-btn" data-msg-id="article-${uuids + index}" data-msg-data="${answerSanitized}">
                                <i class="ast-copy" data-msg-id="article-${uuids + index}" data-msg-data="${answerSanitized}"></i>
                            </div>
                        </div>`;
              if(ele.content){
                a.append(articleActionHtml);
                this.commonService.hideSendAndCopyBtnsforCallconversation(a)
              }
              if(data.userInput){
                ele.content = this.replaceTextwithTag.transform(ele.content, data.userInput);
              }
              articles.append(`<div class="desc-text" id="articledesc-${uuids + index}">${ele.content}</div>`);
              if (ele.link) {
                let fullArticleLinkHtml = `<div class="link-view-full-article hide" id="articleViewLink-${uuids + index}"><a href="${ele.link}" target="_blank">View Full Article</a></div>`
                document.getElementById(`articledesc-${uuids + index}`).insertAdjacentHTML('beforeend', fullArticleLinkHtml);
              }

              let articlestypeInfo = $(`.type-info-run-send #articleSection-${uuids + index}`);
              let seeMoreButtonHtml = `
                    <button class="ghost-btn hide" id="articleseeMore-${uuids + index}" data-article-see-more="true">${this.projConstants.READ_MORE}</button>
                    <button class="ghost-btn hide" id="articleseeLess-${uuids + index}" data-article-see-less="true">${this.projConstants.READ_LESS}</button>
                    `;
              articlestypeInfo.append(seeMoreButtonHtml);
              ele.answer = ele.content;
              ele.question = ele.title;
              setTimeout(() => {
                this.commonService.updateSeeMoreButtonForAssist(uuids + index, this.projConstants.ARTICLE);
              }, 1000);
            // }
          })

        }

        this.handleSeeMoreButton(responseId, data.suggestions.articles, this.projConstants.ARTICLE);
        this.handleSeeMoreButton(responseId, data.suggestions.faqs, this.projConstants.FAQ);

      }
      setTimeout(() => {
        this.updateNewMessageUUIDList(responseId);
      }, this.waitingTimeForUUID);
      this.collapseOldDialoguesInAssist();
    } else {
      if (data.type === 'text' && data.suggestions) {
        let faqAnswerIdsPlace;

          data.suggestions.faqs.forEach((ele) => {

            faqAnswerIdsPlace = this.answerPlaceableIDs.find(ele => ele.inputQuestion == data.suggestions?.faqs[0].question);

            if (faqAnswerIdsPlace) {
            let splitedanswerPlaceableID = faqAnswerIdsPlace.id.split('-');
            splitedanswerPlaceableID.shift();

            let faqDiv = $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`);
            let faqSection = $(`#dynamicBlock #faqSection-${splitedanswerPlaceableID.join('-')}`);
            let answerSanitized = this.commonService.handleEmptyLine(ele.answer[0], true);
            let faqaction = `<div class="action-links">
            <button class="send-run-btn" id="sendMsg" data-msg-id="${splitedanswerPlaceableID.join('-')}"  data-msg-data="${answerSanitized}">Send</button>
            <div class="copy-btn" data-msg-id="${splitedanswerPlaceableID.join('-')}" data-msg-data="${answerSanitized}">
            <i class="ast-copy" data-msg-id="${splitedanswerPlaceableID.join('-')}" data-msg-data="${answerSanitized}"></i>
                </div>
                </div>`;

            faqDiv.append(faqaction);

            $(`#${faqAnswerIdsPlace.id}`).html(this.commonService.handleEmptyLine(ele.answer[0], false));
            $(`#${faqAnswerIdsPlace.id}`).attr('data-answer-render', 'true');
            let faqs = $(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')}`);
            this.commonService.hideSendAndCopyBtnsforCallconversation(faqDiv);

            if(ele.answer && ele.answer.length > 1){
              this.commonService.appendSeeMoreWrapper(faqSection, ele, splitedanswerPlaceableID.join('-'), splitedanswerPlaceableID.join('-'));
            }

          let seeMoreButtonHtml = `
          <button class="ghost-btn hide" id="seeMore-${splitedanswerPlaceableID.join('-')}" data-see-more="true" data-msg-answer="${ele.answer?.length > 1 ? ele.answer : null}">${ele.answer?.length > 1 ? (this.projConstants.READ_MORE_EXPAND) : this.projConstants.READ_MORE}</button>
          <button class="ghost-btn hide" id="seeLess-${splitedanswerPlaceableID.join('-')}" data-see-less="true" data-msg-answer="${ele.answer?.length > 1 ? ele.answer : null}">${this.projConstants.READ_LESS}</button>
          `;
                  faqs.append(seeMoreButtonHtml);
            setTimeout(() => {
              this.commonService.updateSeeMoreButtonForAssist(splitedanswerPlaceableID.join('-'), this.projConstants.FAQ, ele.answer);
            }, 1000);
            this.handleSeeMoreButtonForAmbiguityFAQ(splitedanswerPlaceableID.join('-'), ele, this.projConstants.FAQ);
            if(this.faqManualClick && this.answerPlaceableIDs.length == 1){
              $(`#check-${splitedanswerPlaceableID.join('-')}`).addClass('hide');
              this.faqManualClick = false;
            }
          }
        });
        if (faqAnswerIdsPlace) {
          let index = this.answerPlaceableIDs.indexOf(faqAnswerIdsPlace);
          this.answerPlaceableIDs.splice(index, 1);
        }
      }
      if (data.suggestions) {
        automationSuggestions.length >= 1 ? (automationSuggestions[automationSuggestions.length - 1].classList.remove('hide')) : ''
      }
      if(!this.commonService.isAutomationOnGoing && ((this.dialogPositionId != data.positionId) && !data.entityName)){
        this.collapseOldDialoguesInAssist();
      }
    }

    let result: any = this.templateRenderClassService.getResponseUsingTemplate(data, this.commonService.configObj);
    this.commonService.currentPositionId = this.dialogPositionId;
    if (this.commonService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (this.dialogPositionId && !data.positionId || (data.positionId == this.dialogPositionId))) {
      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);
      if (this.proactiveModeStatus) {
        $(`#overRideBtn-${this.dropdownHeaderUuids}`).removeClass('hide');
      } else {
        $(`#overRideBtn-${this.dropdownHeaderUuids}`).addClass('hide');
      }
      $(`#cancelOverRideBtn-${this.dropdownHeaderUuids}`).addClass('hide');
      $("#inputFieldForAgent").remove();
      let runInfoContent = $(`#dropDownData-${this.dropdownHeaderUuids}`);
      if (this.isFirstMessagOfDialog) {
        $(`#dropDownData-${this.dropdownHeaderUuids}`).attr('data-task-id', data.uniqueTaskId)
      }
      this.isFirstMessagOfDialog = false;
      setTimeout(() => {
        if (data.entityName) {
          this.agentAssistResponse = {};
          this.agentAssistResponse = Object.assign({}, data);
        }
      }, 10);
      let askToUserHtml = this.assisttabService.askUserTemplate(uuids, newTemp, this.dialogPositionId, data.srcChannel, data.buttons[0].value, data.componentType)
/// componentType === 'dialogAct' means its confirmation node or else not
      let tellToUserHtml = this.assisttabService.tellToUserTemplate(uuids, newTemp, this.dialogPositionId, data.srcChannel, data.buttons[0].value, data.componentType)
      if (data.isPrompt) {
        runInfoContent.append(askToUserHtml);
        if (!this.proactiveModeStatus) {
          this.handleOverridBtnClick('overRideBtn-' + this.dropdownHeaderUuids, this.dialogPositionId, true);
        } else {
          $(`.override-input-div`).removeClass('hide');
        }
        this.commonService.hideSendOrCopyButtons(result.parsedPayload, runInfoContent, false, data.componentType);
      } else {
        $(`.override-input-div`).addClass('hide');
        $(runInfoContent).append(tellToUserHtml);
        this.commonService.hideSendOrCopyButtons(result.parsedPayload, runInfoContent, false, data.componentType);
      }
      if(data && data.componentType == 'dialogAct' && (data.srcChannel != 'msteams' && data.srcChannel != 'rtm')){
        console.log("inside dialogact and channel");
        isTemplateRender = true;
      }else{
        isTemplateRender = false;
        this.commonService.hideSendOrCopyButtons(result.parsedPayload, runInfoContent, false, data.componentType);
      }
      setTimeout(() => {
        this.updateNewMessageUUIDList(this.dropdownHeaderUuids);
      }, this.waitingTimeForUUID);
    }

    if (this.commonService.isAutomationOnGoing && !data.suggestions && !result.parsePayLoad) {
//      this.welcomeMsgResponse = data;
      if (this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages == 1) {
        this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages = 0;
      }
      this.scrollToBottom();
    }

    if (!this.commonService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (this.dialogPositionId && !data.positionId || data.positionId == this.dialogPositionId)) {
      $('#dynamicBlock .empty-data-no-agents').addClass('hide');
      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);
      let dynamicBlockDiv = $('#dynamicBlock');
      data.buttons?.forEach((ele, i) => {
        let botResHtml = this.assisttabService.smallTalkTemplateForTemplatePayload(ele, uuids,data, result,newTemp);
        let titleData = ``;
        let actionLinkTemplate = ``;
        if(this.smallTalkTemplateRenderCheck(data, result)){
            isTemplateRender = false;
            titleData = `<div class="title-data" ><ul class="chat-container" id="displayData-${uuids}"></ul></div>`;
            let sendData = result?.parsedPayload ? newTemp : data.buttons[0].value;
            actionLinkTemplate = this.smallTalkActionLinkTemplate(uuids, sendData);
        }else{
            titleData = `<div class="title-data" id="displayData-${uuids}">${ele.value}</div>`;
            actionLinkTemplate = this.smallTalkActionLinkTemplate(uuids, data.buttons[0].value)
            isTemplateRender = true;
            result.parsedPayload = null;
        }
        dynamicBlockDiv.append(botResHtml);
        $(`#smallTalk-${uuids} .agent-utt`).append(titleData);
        $(`#smallTalk-${uuids} .agent-utt`).append(actionLinkTemplate);
        setTimeout(() => {
          if (data.entityName) {
            this.agentAssistResponse = {};
            this.agentAssistResponse = Object.assign({}, data);
          }
        }, 10);
        $(`.override-input-div`).remove();
        if (data.isPrompt) {
          this.smallTalkOverrideButtonTemplate(uuids);
        }
        this.commonService.hideSendOrCopyButtons(result.parsedPayload, `#smallTalk-${uuids} .agent-utt`, 'smallTalk')
      });
    }

    if (!this.commonService.isAutomationOnGoing && !this.dropdownHeaderUuids && !data.suggestions && !result.parsePayLoad) {
      $('#dynamicBlock .empty-data-no-agents').addClass('hide');
      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);
      let dynamicBlockDiv = $('#dynamicBlock');
      if(data?.buttons?.length == 1){
        let botResHtml = this.assisttabService.smallTalkTemplateForTemplatePayload(data.buttons[0], uuids, data, result,newTemp);
        let titleData = ``;
        let actionLinkTemplate = ``;
        if(this.smallTalkTemplateRenderCheck(data, result)){
            isTemplateRender = false;
            titleData = `<div class="title-data" ><ul class="chat-container" id="displayData-${uuids}"></ul></div>`;
            let sendData = result?.parsedPayload ? newTemp : data.buttons[0].value;
            actionLinkTemplate = this.smallTalkActionLinkTemplate(uuids, sendData);
        }else{
            actionLinkTemplate = this.smallTalkActionLinkTemplate(uuids, data.buttons[0].value)
            titleData = `<div class="title-data" id="displayData-${uuids}">${data.buttons[0].value}</div>`
            isTemplateRender = true;
            result.parsedPayload = null;
        }
        dynamicBlockDiv.append(botResHtml);
        $(`#smallTalk-${uuids} .agent-utt`).append(titleData);
        $(`#smallTalk-${uuids} .agent-utt`).append(actionLinkTemplate);
        $(`.override-input-div`).remove();
        if (data.isPrompt) {
          this.smallTalkOverrideButtonTemplate(uuids);
        }
        this.commonService.hideSendOrCopyButtons(result.parsedPayload, `#smallTalk-${uuids} .agent-utt`, 'smallTalk')
      }

      setTimeout(() => {
        this.updateNewMessageUUIDList(uuids);
      }, this.waitingTimeForUUID);
    }

    if (data.buttons?.length > 1 && data.sendMenuRequest) {
      this.welcomeMsgResponse = data;
    }

    let renderedMessage = !isTemplateRender ? this.templateRenderClassService.AgentChatInitialize.renderMessage(result) : '';
    if (renderedMessage && renderedMessage[0]) {
      let obj = this.templateRenderClassService.AgentChatInitialize.renderMessage(result)[0];
      let a = document.getElementById(IdReferenceConst.displayData + `-${uuids}`);
      if (a) {
        a.appendChild(obj);
      }
    }

    if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
      this.scrollToBottom();
    }
    this.commonService.removingSendCopyBtnForCall(this.connectionDetails);
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
  }

  smallTalkActionLinkTemplate(uuids,sendData){
    let actionLinkTemplate =  ` <div class="action-links">
    <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-msg-data="${sendData}">Send</button>
    <div class="copy-btn hide" data-msg-id="${uuids}" data-msg-data="${sendData}">
        <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${sendData}"></i>
    </div>
  </div>`;
  return actionLinkTemplate;
  }

  smallTalkOverrideButtonTemplate(uuids){
    this.smallTalkOverrideBtnId = uuids;
    let overrideTemplate = this.assisttabService.overrideTemplate(uuids);
    $(`#smallTalk-${uuids}`).append(overrideTemplate);
    if (!this.proactiveModeStatus) {
      this.handleOverridBtnClick('overRideBtn-' + this.dropdownHeaderUuids, this.dialogPositionId, true);
    } else {
      $(`.override-input-div`).removeClass('hide');
    }
  }

  smallTalkTemplateRenderCheck(data,result){
    if(result.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))){
      return true;
    }
    return false;
  }

  smallTalkHistoryRenderCheck(parsedPayload,res){
    if(parsedPayload && res.agentAssistDetails && ((res.agentAssistDetails?.componentType === 'dialogAct' && (res.agentAssistDetails?.srcChannel == 'msteams' || res.agentAssistDetails?.srcChannel == 'rtm')) || (res.agentAssistDetails?.componentType != 'dialogAct'))){
      return true;
    }
    return false
  }

  //dialog terminate code
  dialogTerminatedOrIntruppted() {
    this.commonService.isAutomationOnGoing = false;
    this.commonService.isInitialDialogOnGoing = true;
    this.commonService.OverRideMode = false;
    let storageObject: any = {
      // [storageConst.AUTOMATION_GOING_ON]: this.commonService.isAutomationOnGoing,
      [storageConst.INITIALTASK_GOING_ON]: this.commonService.isInitialDialogOnGoing,
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.commonService.isAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    if (this.dialogPositionId) {
      this.commonService.addFeedbackHtmlToDom(this.dropdownHeaderUuids, this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage, this.dialogName, this.dialogPositionId, this.commonService.userIntentInput);
    }
    if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
      this.scrollToBottom();
    }
    // this.dropdownHeaderUuids = undefined;
  }

  handleSeeMoreButtonForAmbiguityFAQ(responseId,faq, type){
    if (faq.answer) {
      let dataObj : any = {
        question : faq.question,
        answer : faq.answer,
        type : type
      }
      setTimeout(() => {
        this.clickEvents(IdReferenceConst.SEEMORE_BTN, responseId, '', dataObj)
      }, 1000);
    }
  }

  // handling seemoe button
  handleSeeMoreButton(responseId, array, type) {

    if (array && responseId && type) {
      let index = 0;
      for (let item of array) {
        let id = responseId + index;
        this.commonService.updateSeeMoreButtonForAssist(id, type, (type == ProjConstants.FAQ) ? item.answer : []);
        index++;
        if (item.answer) {
          let dataObj : any = {
            question : item.question,
            answer : item.answer,
            type : type
          }
          setTimeout(() => {
            this.clickEvents(IdReferenceConst.SEEMORE_BTN, id, '', dataObj)
          }, 1000);
        }
      }
    }
  }

  handleSeeMoreButtonForHistory(responseId, array, type) {

    if (array && responseId && type) {
      let index = 0;
      for (let item of array) {
        let id = responseId + index;
        // item.answer = item.components[0].text;
        this.commonService.updateSeeMoreButtonForAssist(id, type, (type == ProjConstants.FAQ) ? item.answer : []);
        index++;
        if (item.answer) {
          let dataObj : any = {
            question : item.question,
            answer : item.answer,
            type : type
          }
          setTimeout(() => {
            this.clickEvents(IdReferenceConst.SEEMORE_BTN, id, '', dataObj)
          }, 1000);
        }
      }
    }
  }

  // new messages count and rendering code
  updateNewMessageUUIDList(responseId) {
    if (!this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
      if (this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages) {
        if (this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedMessagesUUIDlist.indexOf(responseId) == -1) {
          this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedMessagesUUIDlist.push(responseId);
          this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList = this.getActualRenderedIdList();
        } else {
          this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList = this.getActualRenderedIdList()
        }
      }
      this.addUnreadMessageHtml();
    }
  }

  getActualRenderedIdList() {
    let normalIdsList = ['addRemoveDropDown', 'automationSuggestions', 'smallTalk'];
    let actualRenderedIdList = [];
    for (let uuid of this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedMessagesUUIDlist) {
      for (let name of normalIdsList) {
        let childIdList = [];
        childIdList = this.getChildRenderedIdList(name + '-' + uuid, uuid, name);
        actualRenderedIdList = actualRenderedIdList.concat(childIdList);
      }
    }
    //removing duplicates
    actualRenderedIdList = actualRenderedIdList.filter((c, index) => {
      return actualRenderedIdList.indexOf(c) === index;
    });
    return actualRenderedIdList;
  }

  addUnreadMessageHtml() {
    if (!this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd && this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages) {
      $('.unread-msg').remove();
      let unreadHtml = ` <div class="unread-msg last-msg-white-bg">
        <div class="text-dialog-task-end">Unread Messages</div>
                   </div>`;
      this.designAlterService.UnCollapseDropdownForLastElement(this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage);
      for (let i = 0; i < this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList.length; i++) {
        if (document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i])) {
          let elements: any = document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i]);
          if (elements.className == 'content-dialog-task-type' && (elements.id.includes('dialogSuggestions') || elements.id.includes('faqsSuggestions') || elements.id.includes('articleSuggestions'))) {
            let agentUttInfoId = this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i].split('-');
            agentUttInfoId.shift();
            agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
            if (document.getElementById(agentUttInfoId)) {
              elements = document.getElementById(agentUttInfoId);
            }
            elements?.insertAdjacentHTML('beforeBegin', unreadHtml);
          } else if (elements.id.includes('stepsrundata') && this.commonService.scrollContent[ProjConstants.ASSIST]?.lastElementBeforeNewMessage?.id?.includes('stepsrundata')) {
            elements = document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST]?.lastElementBeforeNewMessage?.id);
            elements?.insertAdjacentHTML('afterend', unreadHtml);
          }
          break;
        }
      }
    }
  }

  getChildRenderedIdList(id, uuid, name) {
    let childIdList = [];
    let dynamicBlockElement = document.getElementById(id);
    if (dynamicBlockElement) {
      if (dynamicBlockElement.className == 'dialog-task-run-sec') {
        let dialogueSuggestionId = 'dialogSuggestions-' + uuid;
        let faqSuggestionId = 'faqsSuggestions-' + uuid;
        let articleSuggestionId = 'articleSuggestions-' + uuid;
        if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(dialogueSuggestionId) == -1) {
          childIdList.push(dialogueSuggestionId);
        }
        if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(faqSuggestionId) == -1) {
          childIdList.push(faqSuggestionId);
        }
        if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(articleSuggestionId) == -1) {
          childIdList.push(articleSuggestionId);
        }
      } else {
        if (dynamicBlockElement.className == 'dialog-task-accordiaon-info') {
          let stepsrunList: any = dynamicBlockElement.querySelectorAll('.steps-run-data');
          for (let node of stepsrunList) {
            if (node.id) {
              if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(node.id) == -1) {
                childIdList.push(node.id);
              }
            }
          }
          if (childIdList.indexOf(this.commonService.scrollContent[ProjConstants.ASSIST]?.lastElementBeforeNewMessage?.id) != -1) {
            childIdList.splice(0, childIdList.indexOf(this.commonService.scrollContent[ProjConstants.ASSIST]?.lastElementBeforeNewMessage?.id) + 1);
          }
        } else {
          let actualParentId = name + '-' + uuid;
          if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(actualParentId) == -1) {
            childIdList.push(actualParentId);
          }
        }
      }
    }
    return childIdList;
  }

  updateNumberOfMessages() {
    if (this.commonService.activeTab == this.projConstants.ASSIST) {
      if (this.proactiveModeStatus) {
        this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages += 1;
        $(".scroll-bottom-btn").addClass("new-messages");
        $(".scroll-bottom-btn span").text(this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages + ' new');
        if (this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages == 1) {
          this.removeWhiteBackgroundToSeenMessages();
        }
        this.newButtonScrollClickEvents.emit(true);
      }
    }
  }

  //old messages styling
  removeWhiteBackgroundToSeenMessages() {
    let beforeLastElementArray: any = document.getElementById(IdReferenceConst.DYNAMICBLOCK).querySelectorAll('.last-msg-white-bg');
    for (let ele of beforeLastElementArray) {
      $(ele).removeClass("last-msg-white-bg");
    }
  }

  collapseOldDialoguesInAssist() {
    if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd && this.commonService.activeTab == this.projConstants.ASSIST) {
      if ($(`#dynamicBlocksData .collapse-acc-data`).length > 0) {
        let listItems = $("#dynamicBlocksData .collapse-acc-data");
        listItems.each(function (idx, collapseElement) {
          if (!collapseElement.id.includes('smallTalk') && collapseElement.id.includes('dropDownData')) {
            collapseElement.classList.add('hide');
          }
        });
      }
    }
  }

  scrollToBottom() {
    if (this.commonService.activeTab == this.projConstants.ASSIST) {
      this.scrollToBottomEvent.emit(true);
    }
  }

  keyUpEvents(eventName, id) {
    if (eventName == IdReferenceConst.ENTITY_VALUE) {
      this.handleEntityValueKeyUpEvent(id);
    }
  }

  handleEntityValueKeyUpEvent(id) {
    document.getElementById(IdReferenceConst.ENTITY_VALUE + '-' + id).addEventListener('keyup', (event: any) => {

      let targetid = event.target.id.split('-');
      event.target.dataset.eachvalue = $(`#${event.target.id}`).val();
      this.commonService.entitiestValueArray[targetid[1]]['editedValue'] = $(`#${event.target.id}`).val();
      $('.ast-check-right.disabled-color').removeClass('disabled-color');
      $('.save-reset-disabled').removeClass('save-reset-disabled').addClass('save-reset');

    })
  }

  //click events related code.
  clickEvents(eventName, uuid?, dialogId?, data?) {
    if (this.commonService.activeTab != this.projConstants.ASSIST) {
      let clickObject: any = {
        eventName: eventName,
        uuid: uuid || null,
        dialogId: dialogId || null,
        data: data
      }
      this.commonService.clickEventObjectsBeforeTabShift.push(clickObject);
    } else {
      if (eventName == IdReferenceConst.ASSISTTERMINATE) {
        this.terminateButtonClick(uuid)
      } else if (eventName == IdReferenceConst.OVERRIDE_BTN) {
        this.handleOverridBtnClick(uuid, dialogId);
      } else if (eventName == IdReferenceConst.CANCEL_OVERRIDE_BTN) {
        this.handleCancelOverrideBtnClick(uuid, dialogId);
      } else if (eventName == IdReferenceConst.DROPDOWN_HEADER) {
        // this.designAlterService.handleDropdownToggle(uuid);
      } else if (eventName == IdReferenceConst.ASSIST_RUN_BUTTON) {
        // this.handleRunButtonClick(uuid, data);
      } else if (eventName == IdReferenceConst.ENTITY_EDIT) {
        this.handleEntityEditClick(uuid);
      } else if (eventName == IdReferenceConst.EDIT_CANCEL_BTN) {
        this.handleEditCancelBtnClick(uuid);
      } else if (eventName == IdReferenceConst.RESTORE_BTN) {
        this.handleRestoreBtnClick(uuid);
      } else if (eventName == IdReferenceConst.SAVE_BTN) {
        this.handleSaveBtnClick(uuid);
      } else if (eventName == IdReferenceConst.AGENT_RUN_BTN) {
        // this.handleMybotRunClick(uuid, data);
      } else if (eventName == IdReferenceConst.SEEMORE_BTN) {
        this.handleSeeMoreLessClickEvents(uuid, data);
      } else if (eventName == IdReferenceConst.CHECK){
          setTimeout(() => {
            this.handleFaqArrowClick(uuid, dialogId, data);
          }, 500);
      }
    }
  }

  handleFaqArrowClick(uuid, positionId, data){
    let target : any = {
      id : 'check-' + uuid
    }
    let checkElement = document.getElementById(IdReferenceConst.CHECK + '-' + uuid);
    if(checkElement){
      checkElement.addEventListener('click', (event) => {
        if (!$(`#${target.id}`).attr("data-answer-render")) {
            let faq = $(`#dynamicBlock .type-info-run-send #faqSection-${uuid}`);
            let answerHtml = `<div class="desc-text" id="desc-${uuid}"></div>`
            faq.append(answerHtml);
            $(`#dynamicBlock #${target.id}`).attr('data-answer-render', 'false');
            // faqDiv.append(faqaction);
            this.answerPlaceableIDs.push({id:`desc-${uuid}`, input: data.intentName, inputQuestion: data.question, positionId: data.positionId});
            $(`#dynamicBlock #${target.id}`).addClass('rotate-carrot');
            $(`#dynamicBlock #faqDiv-${uuid}`).addClass('is-dropdown-open');
            this.AgentAssist_run_click(data, data.positionId);
            return
        }
        if ($(`#dynamicBlock .type-info-run-send #faqSection-${uuid} .ast-carrotup.rotate-carrot`).length <= 0) {
            $(`#dynamicBlock #${target.id}`).addClass('rotate-carrot');
            $(`#dynamicBlock #faqDiv-${uuid}`).addClass('is-dropdown-open');
            $(`#dynamicBlock #faqDiv-${uuid} .action-links`).removeClass('hide');
            $(`#dynamicBlock #desc-${uuid}`).removeClass('hide');
            setTimeout(() => {
              this.commonService.updateSeeMoreButtonForAssist(uuid);
            }, 1000);
        } else {
            $(`#dynamicBlock #${target.id}`).removeClass('rotate-carrot');
            $(`#dynamicBlock #faqDiv-${uuid} .action-links`).addClass('hide');
            $(`#dynamicBlock #faqDiv-${uuid}`).removeClass('is-dropdown-open');
            $(`#dynamicBlock #desc-${uuid}`).addClass('hide');
            $(`#dynamicBlock #seeMore-${uuid}`).addClass('hide');
            $(`#dynamicBlock #seeLess-${uuid}`).addClass('hide');
        }
      });
    }
  }

  handleClickEventsAfterTabShift() {
    let clickObjectArray = Object.assign([], this.commonService.clickEventObjectsBeforeTabShift);
    for (let obj of clickObjectArray) {
      this.clickEvents(obj.eventName, obj.uuid, obj.dialogId, obj.data)
    }
    this.commonService.clickEventObjectsBeforeTabShift = [];
  }

  handleMybotRunClick(uuid, data) {
    let runDialogueObject: any = {
      agentRunButton: true,
      name: data.name,
      intentName: data.name,
      searchFrom: this.projConstants.ASSIST,
      positionId: this.randomUUIDPipe.transform(IdReferenceConst.positionId),
      childBotId : data.childBotId,
      childBotName : data.childBotName
    }
    document.getElementById(IdReferenceConst.AGENT_RUN_BTN + '-' + uuid)?.addEventListener('click', (event) => {
      this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
      this.commonService.agent_run_click(runDialogueObject, false);
      this.handleSubjectService.setRunButtonClickEvent(runDialogueObject);
    })
  }

  terminateButtonClick(uuid) {
    document.getElementById(IdReferenceConst.ASSISTTERMINATE + '-' + uuid)?.addEventListener('click', (event) => {
      this.handlePopupEvent.emit({ status: true, type: this.projConstants.TERMINATE });
    });


  }

  handleProactiveDisableEvent(dialogId,noEmit?){
    let overRideObj: any = {
      "agentId": "",
      "botId": this.connectionDetails.botId,
      "conversationId": this.connectionDetails.conversationId,
      "query": "",
      "enable_override_userinput": true,
      'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
      "positionId": dialogId
    }
    if (!noEmit) {
      this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj);
    }
  }

  handleOverridBtnClick(uuid, dialogId, noEmit?) {
    this.handleProactiveDisableEvent(dialogId, noEmit);
    let runInfoContent: any = document.getElementById(`dropDownData-${this.dropdownHeaderUuids}`);
    if(document.getElementById(`smallTalk-${uuid}`)){
      runInfoContent = document.getElementById(`smallTalk-${uuid}`);
    }
    let agentInputId = this.randomUUIDPipe.transform();
    let agentInputEntityName = 'EnterDetails';
    if (this.agentAssistResponse.newEntityDisplayName || this.agentAssistResponse.newEntityName) {
      agentInputEntityName = this.agentAssistResponse.newEntityDisplayName ? this.agentAssistResponse.newEntityDisplayName : this.agentAssistResponse.newEntityName;
    } else if (this.agentAssistResponse.entityDisplayName || this.agentAssistResponse.entityName) {
      agentInputEntityName = this.agentAssistResponse.entityDisplayName ? this.agentAssistResponse.entityDisplayName : this.agentAssistResponse.entityName;
    }
    $('#inputFieldForAgent').remove();
    let agentInputToBotHtml = this.assisttabService.agentInputToBotTemplate(agentInputEntityName, agentInputId);
    if(document.getElementById(`smallTalk-${uuid}`)){
      document.getElementById(`overRideDiv-${uuid}`).insertAdjacentHTML('beforebegin', agentInputToBotHtml);
    }else{
      $(runInfoContent).append(agentInputToBotHtml);
    }
    if (document.getElementById('agentInput-' + agentInputId)) {
      document.getElementById('agentInput-' + agentInputId).focus();
      runInfoContent.querySelector(`#agentInput-${agentInputId}`).addEventListener('keypress', (e: any) => {
        let key = e.which || e.keyCode || 0;
        if (key === 13) {
          this.AgentAssist_run_click({ intentName: this.sanitizeHtmlPipe.transform(e.target.value) }, this.dialogPositionId);
        }
      });
    }
    if (this.proactiveModeStatus) {
      $(`#overRideBtn-${uuid}`).addClass('hide');
      $(`#cancelOverRideBtn-${uuid}`).removeClass('hide');
    }
    this.commonService.OverRideMode = true;
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
    this.scrollToBottom();
  }

  handleCancelOverrideBtnClick(uuid, dialogId) {
    let overRideObj: any = {
      "agentId": "",
      "botId": this.connectionDetails.botId,
      "conversationId": this.connectionDetails.conversationId,
      "query": "",
      "enable_override_userinput": false,
      'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
      "positionId": dialogId
    }
    this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj);
    $(`#overRideBtn-${uuid}`).removeClass('hide');
    $(`#cancelOverRideBtn-${uuid}`).addClass('hide');
    $('#inputFieldForAgent').remove();
    this.commonService.OverRideMode = false;
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
    this.scrollToBottom();
  }

  handleRunButtonClick(uuid, data) {
    document.getElementById(IdReferenceConst.ASSIST_RUN_BUTTON + '-' + uuid)?.addEventListener('click', (event) => {
      let runEventObj: any = {
        agentRunButton: false,
        intentName: data.name,
        childBotId : data.childBotId,
        childBotName : data.childBotName
      }
      this.handleSubjectService.setRunButtonClickEvent(runEventObj);
    });
  }

  updateSeeMoreButtonForFAQAgent(actualId, answerArray){
    let index = 0;
    for(let ans of answerArray){
        let id = actualId+index;
        let faqSourceTypePixel = 5;
        let descElement =  $("#desc-faq-" + id);
        let seeMoreElement = $('#seeMore-' + id);
        let seeLessElement = $('#seeLess-' + id);
        $(descElement).css({"display" : "block"});
        if(descElement){
            let divSectionHeight = $(descElement).css("height")  || '0px';
            divSectionHeight = parseInt(divSectionHeight?.slice(0,divSectionHeight.length-2));
            if(divSectionHeight > (24 + faqSourceTypePixel)){
                $(seeMoreElement).removeClass('hide');
                $(seeLessElement).addClass('hide');
            }else{
                $(seeMoreElement).addClass('hide');
            }
            $(descElement).css({"display" : "-webkit-box"});
        }
        index++;
        let dataObj : any = {
          answer : [ans],
          type : this.projConstants.FAQ
        }
        this.handleSeeMoreLessClickEventsForFaq(id, dataObj)
    }
}

  handleSeeMoreLessClickEventsForFaq(id, data){
    let seeMoreElement = document.getElementById('seeMore-' + id);
    let seeLessElement = document.getElementById('seeLess-' + id);
    let descElement = document.getElementById("desc-faq-" + id);
    seeMoreElement.addEventListener('click', (event: any) => {
      event.target.classList.add('hide');
      seeLessElement.classList.remove('hide');
      $(descElement).css({"display" : "block"})
    });
    seeLessElement.addEventListener('click', (event: any) => {
      event.target.classList.add('hide');
      seeMoreElement.classList.remove('hide');
      $(descElement).css({"display" : "-webkit-box"})
    });
  }

  handleSeeMoreLessClickEvents(id, data) {
    let seeMoreElement = document.getElementById('seeMore-' + id);
    let seeLessElement = document.getElementById('seeLess-' + id);
    let titleElement = document.getElementById("title-" + id);
    let descElement = document.getElementById("desc-" + id);
    let seeMoreWrapper = document.getElementById("seeMoreWrapper-" + id);
    let faqDiv = $(`.type-info-run-send#faqDiv-${id}`)

    if (data.type == this.projConstants.ARTICLE) {
      seeMoreElement = document.getElementById('articleseeMore-' + id);
      seeLessElement = document.getElementById('articleseeLess-' + id);
      titleElement = document.getElementById("articletitle-" + id);
      descElement = document.getElementById("articledesc-" + id);
    }
    seeMoreElement.addEventListener('click', (event: any) => {
      event.target.classList.add('hide');
      seeLessElement.classList.remove('hide');
      if(titleElement){
        titleElement.classList.add('no-text-truncate');
      }
      if (data.type == this.projConstants.FAQ && seeMoreWrapper && data.answer && data.answer.length > 1) {
          descElement.classList.add('hide');
          seeMoreWrapper.classList.remove('hide');
          seeLessElement.classList.add('show-less-btn');
          seeLessElement.innerText = this.projConstants.CLOSE;
          titleElement.innerText = data.question;
          faqDiv.find(`#sendMsg, .copy-btn`).each((i, ele) => {
            ele.classList.add('hide')
          });
          setTimeout(() => {
            this.updateSeeMoreButtonForFAQAgent(id, data.answer);
          }, 100);

      } else {
        descElement.classList.add('no-text-truncate');
      }
    });
    seeLessElement.addEventListener('click', (event: any) => {
      event.target.classList.add('hide');
      seeMoreElement.classList.remove('hide');
      if(titleElement){
        titleElement.classList.remove('no-text-truncate');
      }
      if (data.type == this.projConstants.FAQ && seeMoreWrapper && data.answer && data.answer.length > 1) {
          if(seeMoreWrapper) seeMoreWrapper.classList.add('hide');
          descElement.classList.remove('hide');
          titleElement.innerText = data.question + " 1/" + data.answer.length;
          faqDiv.find(`#sendMsg, .copy-btn`).each((i, ele) => {
            ele.classList.remove('hide')
        });
      } else {
        if(descElement) descElement.classList.remove('no-text-truncate');
      }
    });
  }

  //restore popup related click events
  handleEntityEditClick(id) {
    if (document.getElementById(IdReferenceConst.ENTITY_EDIT + '-' + id)) {
      document.getElementById(IdReferenceConst.ENTITY_EDIT + '-' + id).addEventListener('click', (event) => {
        $(`#entitesDiv-${id}`).addClass('edit-entity-rules');
        $(`#saveAndCancel-${id}`).removeClass('hide');
      });
    }
  }

  handleEditCancelBtnClick(id) {
    if (document.getElementById(IdReferenceConst.EDIT_CANCEL_BTN + '-' + id)) {
      document.getElementById(IdReferenceConst.EDIT_CANCEL_BTN + '-' + id).addEventListener('click', (event) => {
        $(`#entitesDiv-${id}`).removeClass('edit-entity-rules');
        $(`#saveAndCancel-${id}`).addClass('hide');
        this.commonService.entitiestValueArray.forEach((e, i) => {
          $(`#entityValue-${i}`).val(e.value);
        });
        $('.ast-check-right').addClass('disabled-color')
        $('.save-reset').removeClass('save-reset').addClass('save-reset-disabled');
      });
    }
  }

  handleRestoreBtnClick(id) {
    if (document.getElementById(IdReferenceConst.RESTORE_BTN + '-' + id)) {
      document.getElementById(IdReferenceConst.RESTORE_BTN + '-' + id).addEventListener('click', (event) => {
        this.handlePopupEvent.emit({ status: true, type: this.projConstants.RESTORE });
      });
    }
  }

  handleSaveBtnClick(id) {
    if (document.getElementById(IdReferenceConst.SAVE_BTN + '-' + id)) {
      document.getElementById(IdReferenceConst.SAVE_BTN + '-' + id).addEventListener('click', (event) => {
        this.commonService.entitiestValueArray.forEach((e, i) => {
          if (e.editedValue) {
            e.value = e.editedValue;
            delete e.editedValue;
            $(`#enityNameAndValue-${i}`).find('.edited-status').removeClass('hide');
            $(`#initialentityValue-${i}`).html(e.value);
          }
        });
        $(`#entitesDiv-${id}`).removeClass('edit-entity-rules');
        $(`#saveAndCancel-${id}`).addClass('hide');
        $(`.edit-values-btn.restore`).removeClass('hide');
        this.commonService.isRestore = false;
        $('.ast-check-right').addClass('disabled-color')
        $('.save-reset').removeClass('save-reset').addClass('save-reset-disabled');
      });
    }
  }

  handleRestoreConfirmClickEvent() {
    this.commonService.isRestore = true;
    this.commonService.entitiestValueArray = JSON.parse(this.commonService.previousEntitiesValue);
    JSON.parse(this.commonService.previousEntitiesValue).forEach((e, i) => {
      $(`#enityNameAndValue-${i}`).find('.edited-status').addClass('hide');
      $(`#initialentityValue-${i}`).html(e.value);
      $(`#entityValue-${i}`).val(e.value);
      $(`.edit-values-btn.restore`).addClass('hide');
    });
  }

  renderHistoryMessages(response, feedBackResult) {
    let historyFaqIDs = [];

    let previousId;
    let previousTaskPositionId, currentTaskPositionId, currentTaskName, previousTaskName;
    let resp = response.length > 0 ? response : undefined;

    resp = this.commonService.formatHistoryResponseForFAQ(resp);
    resp?.forEach((res, index) => {
      res = this.commonService.confirmationNodeRenderForHistoryDataTransform(res);
      if ((res.agentAssistDetails?.suggestions || res.agentAssistDetails?.ambiguityList) && res.type == 'outgoing' && !res.agentAssistDetails?.faqResponse) {
        let uniqueID = res._id;
        let historyDataHtml = $('#dynamicBlock');

        let htmls = `
                        <div class="agent-utt-info" id="agentUttInfo-${uniqueID}">
                            <div class="user-img">
                                <img src="${this.imageFilePath}${this.imageFileNames['USERICON']}">
                            </div>
                            <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                        </div>
                        <div class="dialog-task-run-sec" id="automationSuggestions-${uniqueID}">
                        </div>`;

        historyDataHtml.append(htmls);
        let automationSuggestions = document.getElementById(`automationSuggestions-${uniqueID}`);
        if (res.agentAssistDetails?.ambiguityList?.dialogs?.length > 0 || res.agentAssistDetails?.suggestions?.dialogs?.length > 0) {


          let dialogAreaHtml = `<div class="task-type" id="dialoguesArea">
              <div class="img-block-info">
                  <img src="${this.imageFilePath}${this.imageFileNames['DIALOG_TASK']}">
              </div>
              <div class="content-dialog-task-type" id="dialogSuggestions-${uniqueID}">
                <div class="type-with-img-title">Dialog task (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.dialogs?.length : res.agentAssistDetails?.ambiguityList.dialogs?.length})</div>
              </div>
            </div>`;
          automationSuggestions.innerHTML += dialogAreaHtml;
        }
        if (res.agentAssistDetails?.ambiguityList?.faqs?.length > 0 || res.agentAssistDetails?.suggestions?.faqs?.length > 0) {
          let dialogAreaHtml = `<div class="task-type" id="faqssArea">
            <div class="img-block-info">
                <img src="${this.imageFilePath}${this.imageFileNames['FAQ_SUGGESTION']}">
            </div>
            <div class="content-dialog-task-type" id="faqsSuggestions-${uniqueID}">
                <div class="type-with-img-title">FAQ (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.faqs.length : res.agentAssistDetails.ambiguityList.faqs.length})</div>

            </div>
        </div>`;
          automationSuggestions.innerHTML += dialogAreaHtml;
        }
        let dialogsss = (res.agentAssistDetails?.suggestions) ? (res.agentAssistDetails?.suggestions?.dialogs) : (res.agentAssistDetails?.ambiguityList?.dialogs);
        dialogsss?.forEach((ele, index) => {

          let dialogSuggestions = document.getElementById(`dialogSuggestions-${uniqueID}`);
          let dialogsHtml = `
                <div class="type-info-run-send">
                    <div class="left-content">
                        <div class="title-text" id="automation-${uniqueID + index}">${ele.name}</div>
                    </div>
                    <div class="action-links">
                        <button class="send-run-btn" data-conv-id="${this.commonService.configObj.conversationid}"
                        data-bot-id="${res.botId}" data-intent-name="${ele.name}"
                        data-history-run="true" id="run-${uniqueID + index}" data-child-bot-id="${ele.childBotId}" data-child-bot-name="${ele.childBotName}"
                        data-dialog-run='${JSON.stringify(ele)}'>RUN</button>
                        <div class="elipse-dropdown-info" id="showRunForAgentBtn-${uniqueID + index}">
                            <div class="elipse-icon" id="elipseIcon-${uniqueID + index}">
                                <i class="ast-overflow" id="overflowIcon-${uniqueID + index}"></i>
                            </div>
                            <div class="dropdown-content-elipse" id="runAgtBtn-${uniqueID + index}" data-dialog-run='${JSON.stringify(ele)}'>
                                <div class="list-option" data-conv-id="${this.commonService.configObj.conversationid}"
                                data-bot-id="${res.botId}" data-intent-name="${ele.name}" data-child-bot-id="${ele.childBotId}" data-child-bot-name="${ele.childBotName}"
                                 id="agentSelect-${uniqueID + index}"
                                data-exhaustivelist-run="true" data-dialog-run='${JSON.stringify(ele)}'>Run with Agent Inputs</div>
                            </div>
                    </div>
                </div>`;
          dialogSuggestions.innerHTML += dialogsHtml;
          this.clickEvents(IdReferenceConst.ASSIST_RUN_BUTTON, uniqueID + index, this.dialogPositionId, ele);
          this.clickEvents(IdReferenceConst.AGENT_RUN_BTN, uniqueID + index, this.dialogPositionId, ele);
        });
        let faqss = (res.agentAssistDetails?.suggestions) ? (res.agentAssistDetails?.suggestions?.faqs) : (res.agentAssistDetails?.ambiguityList?.faqs);
        faqss?.forEach((ele, index) => {

          let faqsSuggestions = document.getElementById(`faqsSuggestions-${uniqueID}`);
          historyFaqIDs.push(uniqueID + index);
          let faqHtml = `
                <div class="type-info-run-send" id="faqDiv-${uniqueID + index}">
                    <div class="left-content" id="faqSection-${uniqueID + index}">
                        <div class="title-text" id="title-${uniqueID + index}" title="${ele.displayName ? ele.displayName : ele.question}">${ ele.displayName ? ele.displayName : ele.question}</div>


                    </div>

                </div>`;

          faqsSuggestions.innerHTML += faqHtml;
          let faqs = $(`.type-info-run-send #faqSection-${uniqueID + index}`);
          if (!ele.answer) {
            let checkHtml = `
                    <i class="ast-carrotup" data-conv-id="${this.commonService.configObj.conversationid}"
                    data-bot-id="${res.botId}" data-intent-name="${ele.displayName}"
                    data-check="true" id="check-${uniqueID + index}" data-position-id="${uniqueID + index}"></i>`;
            // faqs.append(checkHtml);
            // $(`#title-${uniqueID}`).addClass('noPadding');
            $(`#faqDiv-${uniqueID + index}`).addClass('is-dropdown-show-default');
            document.getElementById(`title-${uniqueID + index}`).insertAdjacentHTML('beforeend', checkHtml);
            this.clickEvents(IdReferenceConst.CHECK, uniqueID + index, uniqueID + index, {intentName : ele.question, positionID : uniqueID + index, question : ele.question});

          } else {
            let a = $(`#faqDiv-${uniqueID + index}`);
            let answerSanitized = this.commonService.handleEmptyLine(ele.answer[0], true);

            let faqActionHtml = `<div class="action-links">
                    <button class="send-run-btn" id="sendMsg" data-msg-id="${uniqueID + index}"  data-msg-data="${answerSanitized}">Send</button>
                    <div class="copy-btn" data-msg-id="${uniqueID + index}" data-msg-data="${answerSanitized}">
                        <i class="ast-copy" data-msg-id="${uniqueID + index}" data-msg-data="${answerSanitized}"></i>
                    </div>
                </div>`;
            a.append(faqActionHtml);
            faqs.append(`<div class="desc-text" id="desc-${uniqueID + index}">${this.commonService.handleEmptyLine(ele.answer[0], false)}</div>`);
            this.commonService.hideSendAndCopyBtnsforCallconversation(faqs);

            if(ele.answer && ele.answer.length > 1){
              this.commonService.appendSeeMoreWrapper(faqs, ele, uniqueID+index, uniqueID+index);
          }

            let faqstypeInfo = $(`.type-info-run-send #faqSection-${uniqueID + index}`);
            let seeMoreButtonHtml = `
                          <button class="ghost-btn hide" id="seeMore-${uniqueID + index}" data-see-more="true">${ele.answer?.length > 1 ? (this.projConstants.READ_MORE_EXPAND) : this.projConstants.READ_MORE}</button>
                          <button class="ghost-btn hide" id="seeLess-${uniqueID + index}" data-see-less="true">${this.projConstants.READ_LESS}</button>
                          `;
            faqstypeInfo.append(seeMoreButtonHtml);
            setTimeout(() => {
              this.commonService.updateSeeMoreButtonForAssist(uniqueID, this.projConstants.FAQ, ele.answer);
            }, 1000);
            // this.clickEvents(IdReferenceConst.CHECK, uniqueID + index, uniqueID + index, {intentName : ele.question, positionID : uniqueID + index});
          }

        });
        this.handleSeeMoreButtonForHistory(uniqueID, faqss, this.projConstants.FAQ);
        uniqueID = undefined;
      }
      if ((res.agentAssistDetails?.suggestions || res.agentAssistDetails?.ambiguityList) && res.type == 'outgoing' && res.agentAssistDetails?.faqResponse && res.agentAssistDetails?.positionId) {
        historyFaqIDs?.forEach((ele, i) => {
          let eleid = ele.slice(0, ele.length - 1);
          res.agentAssistDetails.suggestions?.faqs?.forEach((eles, j) => {
            if ($(`#faqsSuggestions-${eleid} #title-${ele}`).text().trim() == eles.question) {
              let valOfDiv = $(`#faqsSuggestions-${eleid} #desc-${ele}`).text().trim();
              if (valOfDiv == '' && !valOfDiv)
                this.assisttabService.historyFaqSuggestionsContainer(eleid, ele, res);
            }
          });
          this.handleSeeMoreButtonForHistory(eleid, res.agentAssistDetails.suggestions?.faqs, this.projConstants.FAQ);
        })
      }

      if ((res.agentAssistDetails?.suggestions || res.agentAssistDetails?.ambiguityList) && res.type == 'outgoing' && res.agentAssistDetails?.faqResponse && !res.agentAssistDetails?.positionId) {
        let historyDataHtml = $('#dynamicBlock');
        let uniqueID = res._id;
        let htmls = `
                     <div class="agent-utt-info" id="agentUttInfo-${uniqueID}">
                         <div class="user-img">
                             <img src="${this.imageFilePath}${this.imageFileNames['USERICON']}">
                         </div>
                         <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                     </div>
                     <div class="dialog-task-run-sec" id="automationSuggestions-${uniqueID}">
                     </div>`;

        historyDataHtml.append(htmls);
        let automationSuggestions = document.getElementById(`automationSuggestions-${uniqueID}`);
        if (res.agentAssistDetails?.ambiguityList?.faqs?.length > 0 || res.agentAssistDetails?.suggestions?.faqs?.length > 0) {
          let dialogAreaHtml = `<div class="task-type" id="faqssArea">
    <div class="img-block-info">
        <img src="${this.imageFilePath}${this.imageFileNames['FAQ_SUGGESTION']}">
    </div>
    <div class="content-dialog-task-type" id="faqsSuggestions-${uniqueID}">
        <div class="type-with-img-title">FAQ (${res.agentAssistDetails?.suggestions ? res.agentAssistDetails?.suggestions.faqs.length : res.agentAssistDetails.ambiguityList.faqs.length})</div>

    </div>
</div>`;
          automationSuggestions.innerHTML += dialogAreaHtml;
        }
        let faqss = (res.agentAssistDetails?.suggestions) ? (res.agentAssistDetails?.suggestions?.faqs) : (res.agentAssistDetails?.ambiguityList?.faqs);
        faqss?.forEach((ele, index) => {
          ele.answer = res.components[0].data.text;
          let faqsSuggestions = document.getElementById(`faqsSuggestions-${uniqueID}`);
          let faqHtml = `
                <div class="type-info-run-send" id="faqDiv-${uniqueID + index}">
                    <div class="left-content" id="faqSection-${uniqueID + index}">
                        <div class="title-text" id="title-${uniqueID + index}" title="${ele.displayName ? ele.displayName : ele.question}">${ ele.displayName ? ele.displayName : ele.question}</div>
                    </div>
                </div>`;
          faqsSuggestions.innerHTML += faqHtml;
          let faqs = $(`.type-info-run-send #faqSection-${uniqueID + index}`);
          let a = $(`#faqDiv-${uniqueID + index}`);
          let answerSanitized = this.commonService.handleEmptyLine(res.components[0].data.text[0], true);
          let faqActionHtml = `<div class="action-links">
                    <button class="send-run-btn" id="sendMsg" data-msg-id="${uniqueID + index}"  data-msg-data="${answerSanitized}">Send</button>
                    <div class="copy-btn" data-msg-id="${uniqueID + index}" data-msg-data="${answerSanitized}">
                        <i class="ast-copy" data-msg-id="${uniqueID + index}" data-msg-data="${answerSanitized}"></i>
                    </div>
                </div>`;

          a.append(faqActionHtml);
          faqs.append(`<div class="desc-text" id="desc-${uniqueID + index}">${this.commonService.handleEmptyLine(res.components[0].data.text[0], false)}</div>`);
          this.commonService.hideSendAndCopyBtnsforCallconversation(faqs);

          if(res.components[0].data.text && res.components[0].data.text.length > 1){
            this.commonService.appendSeeMoreWrapper(faqs, ele, uniqueID + index, uniqueID + index);
        }

          let faqstypeInfo = $(`.type-info-run-send #faqSection-${uniqueID + index}`);
          let seeMoreButtonHtml = `
                          <button class="ghost-btn hide" id="seeMore-${uniqueID + index}" data-see-more="true">${res.components[0].data.text?.length > 1 ? (this.projConstants.READ_MORE_EXPAND) : this.projConstants.READ_MORE}</button>
                          <button class="ghost-btn hide" id="seeLess-${uniqueID + index}" data-see-less="true">${this.projConstants.READ_LESS}</button>
                          `;
          faqstypeInfo.append(seeMoreButtonHtml);
          setTimeout(() => {
            this.commonService.updateSeeMoreButtonForAssist(uniqueID + index, this.projConstants.FAQ,res.components[0].data.text);
          }, 1000);
          this.clickEvents(IdReferenceConst.CHECK, uniqueID + index, uniqueID + index, {intentName : ele.question, positionID : uniqueID + index});
        })
        this.handleSeeMoreButtonForHistory(uniqueID, faqss, this.projConstants.FAQ);

        setTimeout(() => {
          uniqueID = undefined;
        }, 1000)

      }

      if ((!res.agentAssistDetails?.suggestions && !res.agentAssistDetails?.ambiguityList && !res.agentAssistDetails?.ambiguity) && res.type == 'outgoing') {

        let positionID = 'dg-'+ this.koreGenerateuuidPipe.transform();
        currentTaskPositionId = res?.agentAssistDetails?.positionId ?  res?.agentAssistDetails?.positionId : ((res.tN != currentTaskName) ? positionID : currentTaskPositionId);
        currentTaskName = (res.tN) ? res.tN  : currentTaskName;


        let historyData = $('#dynamicBlock');
        let userInputHtml;
        if (res.agentAssistDetails.userInput && res?.agentAssistDetails?.positionId) {
          userInputHtml = `<div class="agent-utt-info" id="agentUttInfo-${res._id}">
                            <div class="user-img">
                                <img src="${this.imageFilePath}${this.imageFileNames['USERICON']}">
                            </div>
                            <div class="text-user" >${res.agentAssistDetails.userInput}</div>
                        </div>`;
        }
        let dropdownHtml = `

                                    <div class="dialog-task-accordiaon-info" id="addRemoveDropDown-${res._id}" >
                                        <div class="accordion-header" id="dropDownHeader-${res._id}"
                                        data-drop-down-opened="true">
                                            <div class="icon-info">
                                                <i class="ast-rule"></i>
                                            </div>
                                            <div class="header-text" id="dropDownTitle-${res._id}">${res.tN}</div>
                                            <i class="ast-carrotup" id="dialogueArrow-${res._id}"></i>
                                            <button class="btn-danger hide" id="terminateAgentDialog-${res._id}">Terminate</button>
                                        </div>
                                        <div class="collapse-acc-data hide" id="dropDownData-${res._id}">
                                        <div class="override-input-div hide" id="overRideDiv-${res._id}">
                                        <button class="override-input-btn hide" id="overRideBtn-${res._id}">Override Input</button>
                                        <button class="cancel-override-input-btn hide" id="cancelOverRideBtn-${res._id}">Cancel Override</button>
                                        </div>

                                        </div>
                                    `;

        if ((previousTaskPositionId && currentTaskPositionId !== previousTaskPositionId) ||  (currentTaskPositionId == previousTaskPositionId && currentTaskName != previousTaskName)) {
          let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === previousTaskPositionId);
          this.commonService.addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, false, previousTaskPositionId);
          if (previousIdFeedBackDetails) {
            this.commonService.UpdateFeedBackDetails(previousIdFeedBackDetails, 'dynamicBlock');
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
          let divExist = $(`#addRemoveDropDown-${res._id}`);
          previousTaskPositionId = currentTaskPositionId;
          previousTaskName = currentTaskName;
          if (divExist.length >= 1) {
            console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
          } else {
            historyData.append(userInputHtml);
            historyData.append(dropdownHtml);
            previousId = res._id;
            previousTaskPositionId = currentTaskPositionId;
            // setTimeout(()=>{

            // this.clickEvents(IdReferenceConst.DROPDOWN_HEADER, previousId);
            this.clickEvents(IdReferenceConst.ASSISTTERMINATE, previousId);
            // }, 10000)

          }
        }
        if (res.agentAssistDetails.entityName && res.agentAssistDetails.entityResponse && res.agentAssistDetails.entityValue && res.agentAssistDetails.userInput) {
          let runInfoContent = $(`#dropDownData-${previousId}`);
          let userQueryHtml = `
                            <div class="steps-run-data">
                                <div class="icon_block_img">
                                    <img src="${this.imageFilePath}${this.imageFileNames['USERICON']}">
                                </div>
                                <div class="run-info-content" id="userInput-${res._id}">
                                    <div class="title">Customer Said - </div>
                                    <div class="agent-utt">
                                        <div class="title-data">"${this.sanitizeHtmlPipe.transform(res.agentAssistDetails.userInput)}"</div>
                                    </div>

                                </div>
                            </div>`;
          runInfoContent.append(userQueryHtml);
          let entityHtml = $(`#dropDownData-${previousId}`).find(`#userInput-${res._id}`);
          let entityDisplayName = this.agentAssistResponse.newEntityDisplayName ? this.agentAssistResponse.newEntityDisplayName : this.agentAssistResponse.newEntityName;
          if (res.agentAssistDetails.entityValue && !res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
            let entityValueType = typeof res.agentAssistDetails.entityValue;
            let entityValue = (entityValueType == 'object') ? JSON.stringify(res.agentAssistDetails.entityValue) : this.sanitizeHtmlPipe.transform(res.agentAssistDetails.entityValue);
            entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${entityValue}</div>`);
          } else {
            if (res.agentAssistDetails.isErrorPrompt && entityDisplayName) {
              let entityType = this.agentAssistResponse.newEntityType;
              let entityHtmls = `<div class="order-number-info">${entityDisplayName} :
                                            <span style="color:red">Value unidentified</span>
                                            <span style="font-size: 12px; line-height: 18px; color: #202124; padding-left: 10px"> { Expected Format: ${entityType} }<span>
                                        </div>`
                                        // <div>
                                        //     <img src="${this.imageFilePath}${this.imageFileNames['WARNING']}" style="padding-right: 8px;">
                                        //     <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                                        // </div>`
              entityHtml.append(entityHtmls);
            }
          }
        }
        if (res.agentAssistDetails?.entityName) {
          this.agentAssistResponse = res.agentAssistDetails;
        }


        let _msgsResponse : any = this.templateRenderClassService.getResponseUsingTemplateForHistory(res);
        let parsedPayload : any = _msgsResponse.parsedPayload;
        if(_msgsResponse.message.length > 0){
          let msgStringify = JSON.stringify(_msgsResponse);
          let newTemp = encodeURI(msgStringify);
          if((previousTaskName != currentTaskName && previousTaskPositionId == currentTaskPositionId)){
            let dynamicBlockDiv = $('#dynamicBlock');

            let botResHtml = this.assisttabService.smallTalkTemplateForTemplatePayload(res, res._id,res, {parsedPayload : parsedPayload},newTemp);
            let titleData = ``;
            let actionLinkTemplate = ``;
            if(this.smallTalkHistoryRenderCheck(parsedPayload,res)){
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

            let askToUserHtml = this.assisttabService.askUserTemplate(res._id, newTemp, previousTaskPositionId,res.agentAssistDetails?.srcChannel, res.components[0].data.text, res.agentAssistDetails?.componentType);
            let tellToUserHtml = this.assisttabService.tellToUserTemplate(res._id, newTemp, previousTaskPositionId, res.agentAssistDetails?.srcChannel, res.components[0].data.text, res.agentAssistDetails?.componentType);

            if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
              this.commonService.isAutomationOnGoing = true;
              this.dropdownHeaderUuids = previousId;
              let storageObject: any = {
                [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.commonService.isAutomationOnGoing
              }
              this.localStorageService.setLocalStorageItem(storageObject);
            }
            if (res.agentAssistDetails.isPrompt || res.agentAssistDetails.entityRequest) {
              if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
                $(`#overRideBtn-${previousId}`).removeClass('hide');
                $(`#cancelOverRideBtn-${previousId}`).addClass('hide');
                $("#inputFieldForAgent").remove();
                $(`#terminateAgentDialog-${previousId}`).removeClass('hide');
                $('#dynamicBlock .override-input-div').addClass('hide');
                $(`#overRideDiv-${previousId}`).removeClass('hide');
                $(`#overRideBtn-${previousId}`).attr('data-position-id', previousTaskPositionId);
                $(`#terminateAgentDialog-${previousId}`).attr('data-position-id', previousTaskPositionId);
                this.dialogPositionId = previousTaskPositionId;
              }
              runInfoContent.append(askToUserHtml);

              this.commonService.hideSendOrCopyButtons(parsedPayload, runInfoContent, false, res.agentAssistDetails?.componentType)
            } else {
              runInfoContent.append(tellToUserHtml);
              this.commonService.hideSendOrCopyButtons(parsedPayload, runInfoContent, false, res.agentAssistDetails?.componentType)
            }
            if(res && res.agentAssistDetails && res.agentAssistDetails.componentType == 'dialogAct' && (res.agentAssistDetails?.srcChannel != 'msteams' && res.agentAssistDetails?.srcChannel != 'rtm')){
              // console.log("inside dialogact and channel");

            }else{
              let obj = this.templateRenderClassService.AgentChatInitialize.renderMessage(_msgsResponse)[0]
              let a = document.getElementById(IdReferenceConst.displayData + `-${res._id}`);
              a.appendChild(obj);
              this.commonService.hideSendOrCopyButtons(parsedPayload, runInfoContent, false, res.agentAssistDetails?.componentType)
            }
          }
        }
        let shouldProcessResponse = false;
        var appStateStr = localStorage.getItem('agentAssistState') || '{}';
        var appState = JSON.parse(appStateStr);
        // if (appState[_conversationId]) {
        //     // if incoming data belongs to welcome message do nothing
        //     // if (!data.suggestions && data.buttons?.length > 1) {
        //         if (appState[_conversationId].isWelcomeProcessed) {
        //             shouldProcessResponse = false;

        //         }else {
        //             shouldProcessResponse = true;
        //         }
        //     // }

        // }
        let isPromtFlag;
        if ((res.agentAssistDetails?.isPrompt == true)) {
          isPromtFlag = "true";
        } else if (res.agentAssistDetails?.isPrompt == false) {
          isPromtFlag = "false";
        }
        if (!parsedPayload && !res.tN && !shouldProcessResponse && !isPromtFlag) {
          let dynamicBlockDiv = $('#dynamicBlock');
          res.components?.forEach((ele, i) => {
            if (res.components?.length > 1) {
              this.welcomeMsgResponse = res.components;
            } else {
              if(res.components?.length && res.components[0]?.data?.text !== '') {
                let botResHtml = this.assisttabService.historySmallTalkTemplate(res.components[0], res._id);
                dynamicBlockDiv.append(botResHtml);
              }


            }
          });
        }
      }

      if ((resp.length - 1 == index && (!res.agentAssistDetails?.entityRequest && !res.agentAssistDetails?.entityResponse) && currentTaskPositionId == previousTaskPositionId)) {
        let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === currentTaskPositionId);
        this.commonService.addFeedbackHtmlToDomForHistory(res, res.botId, res?.agentAssistDetails?.userInput, previousId, false, previousTaskPositionId);
        if (previousIdFeedBackDetails) {
          this.commonService.UpdateFeedBackDetails(previousIdFeedBackDetails, 'dynamicBlock');
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

    });
    if (this.commonService.isAutomationOnGoing) {
      $(`#dynamicBlock .collapse-acc-data.hide`)[$(`#dynamicBlock .collapse-acc-data.hide`).length - 1]?.classList.remove('hide');
    }
    this.scrollToBottom();
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);

  }

  viewCustomTempAttachment(){
    this.commonService.CustomTempClickEvents(this.projConstants.ASSIST, this.connectionDetails)
  }

}
