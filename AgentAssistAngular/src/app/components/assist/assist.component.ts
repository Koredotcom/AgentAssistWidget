import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { forkJoin } from 'rxjs';
import { SubSink } from 'subsink';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { EVENTS } from 'src/app/helpers/events';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProjConstants, RenderResponseType, storageConst } from 'src/app/proj.const';
import { KoreGenerateuuidPipe } from 'src/app/pipes/kore-generateuuid.pipe';
import { RandomUuidPipe } from 'src/app/pipes/random-uuid.pipe';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { TemplateRenderClassService } from 'src/app/services/template-render-class.service';
import { chatWindow } from '@koredev/kore-web-sdk';

@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss']
})
export class AssistComponent implements OnInit, OnDestroy {

  @Output() maxButtonClick = new EventEmitter();
  @Input() maxButton: boolean;

  connectionDetails: any = {};
  loader: boolean = false;
  subs = new SubSink();
  proactiveModeStatus: boolean;
  projConstants: any = ProjConstants;
  renderResponseType: any = RenderResponseType;


  dialogName: string;
  dialogPositionId: string;

  welcomeMsgResponse: any;
  dropdownHeaderUuids: any;
  assistResponseArray: any = [];
  agentAssistResponse: any = {};
  currentRunningStep: string;
  terminateClick: boolean = false;
  interruptDialog: any;
  showInterruptPopup: boolean = false;

  constructor(private rootService: RootService, private serviceInvoker: ServiceInvokerService,
    private websocketService: WebSocketService, private localStorageService: LocalStorageService,
    private koreGenerateuuidPipe: KoreGenerateuuidPipe, private randomUUIDPipe: RandomUuidPipe,
    private handleSubjectService: HandleSubjectService, private templateRenderClassService: TemplateRenderClassService) {

  }

  ngOnInit(): void {

    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


  subscribeEvents() {
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if (res) {
        this.connectionDetails = this.rootService.getConnectionDetails();
        this.getAssistData(this.connectionDetails);
        let appState = this.localStorageService.getLocalStorageState();
        this.proactiveModeStatus = appState[this.connectionDetails.conversationId][storageConst.PROACTIVE_MODE]
      }
    });

    this.subs.sink = this.websocketService.agentAssistResponse$.subscribe((response: any) => {
      console.log("------------resposne of agent request", response)
      if (response && Object.keys(response).length > 0) {
        if (this.rootService.checkAutoBotIdDefined(this.connectionDetails?.autoBotId)) {
          this.connectionDetails['autoBotId'] = response?.autoBotId ? response.autoBotId : undefined;
        }
        this.updateAgentAssistResponse(response, this.connectionDetails.botId, this.connectionDetails.conversationId);
        // this.viewCustomTempAttachment()
      }
    });

    this.subs.sink = this.websocketService.agentAssistUserMessageResponse$.subscribe((response: any) => {
      if (response && response.botId) {
        if (!this.rootService.isAutomationOnGoing && !this.proactiveModeStatus) {
          return;
        } else {
          this.processUserMessages(response);
        }

      }
    });

    this.subs.sink = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {
      if (runEventObj) {
        if (runEventObj && !runEventObj?.agentRunButton && !this.rootService.isAutomationOnGoing) {
          this.runDialogForAssistTab(runEventObj);
        } else if (runEventObj && !runEventObj?.agentRunButton && this.rootService.isAutomationOnGoing) {
          this.showInterruptPopup = true;
          this.interruptDialog = runEventObj;
          // this.handlePopupEvent.emit({ status: true, type: this.projConstants.INTERRUPT });
        }
      }
    });

    this.subs.sink = this.handleSubjectService.proactiveModeSubject.subscribe((response: any) => {
      if (response != null && response != undefined) {
        this.proactiveModeStatus = response;
        this.handleProactiveDisableEvent(this.dialogPositionId);
        this.handleAutomationSmallTalkOverrideMode();
      }
    });

    this.subs.sink = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {
      console.log(endoftaskresponse, this.dialogPositionId, "end of task resposne *************");
      // if (endoftaskresponse && (this.dialogPositionId == endoftaskresponse.positionId || (endoftaskresponse.author && endoftaskresponse.author.type == 'USER'))) {
      this.dialogTerminatedOrIntruppted();
      // this.viewCustomTempAttachment();
      // }
    })

  }

  handleProactiveDisableEvent(dialogId) {
    let overRideObj: any = {
      "agentId": "",
      "botId": this.connectionDetails.botId,
      "conversationId": this.connectionDetails.conversationId,
      "query": "",
      "enable_override_userinput": !this.proactiveModeStatus,
      'experience': this.connectionDetails.isCallConversation === true ? 'voice' : 'chat',
      "positionId": dialogId
    }
    this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj);
  }

  updateAgentAssistResponse(data, botId, conversationId) {
    this.makeOverrideEvent(botId, conversationId, false)
    this.processAgentAssistResponse(data, botId);
  }

  makeOverrideEvent(botId, conversationId, flag) {
    let overRideObj = {
      "agentId": "",
      "botId": botId,
      "conversationId": conversationId,
      "query": "",
      'experience': this.connectionDetails.isCallConversation === true ? 'voice' : 'chat',
      "enable_override_userinput": flag
    }
    if (this.rootService.OverRideMode && this.proactiveModeStatus && !this.rootService.manualAssistOverrideMode) {
      this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj)
      this.rootService.OverRideMode = false;
    }
  }

  processUserMessages(data) {
    this.assistResponseArray.map(arrEle => {
      if (arrEle.uuid && arrEle.uuid == this.dropdownHeaderUuids) {
        arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
        if (data.userInput && arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
          if (data.userInput) {
            let userInput = arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].entityValue = data.userInput;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput = userInput ? userInput : ProjConstants.YES;
          }
        }
        arrEle.automationsArray = [...arrEle.automationsArray];
      }
    });
  }

  processAgentAssistResponse(data, botId) {
    let renderResponse: any = {};
    let isTemplateRender = false;

    data = this.rootService.confirmationNodeRenderDataTransform(data);

    if (this.rootService.isAutomationOnGoing && this.dropdownHeaderUuids && data.suggestions?.dialogs?.length > 0) {
      this.dialogTerminatedOrIntruppted();
    }

    if (!this.rootService.isAutomationOnGoing && !this.proactiveModeStatus && !data.sendMenuRequest) {
      return;
    }

    this.removeOrAddOverRideDivForPreviousResponse(true);

    if (!data.suggestions || (data.suggestions && Object.keys(data.suggestions).length == 0)) {
      data.suggestions = false;
    }

    let uuids = this.koreGenerateuuidPipe.transform();
    let responseId = uuids;

    if (!this.rootService.isAutomationOnGoing && data.intentName && !data.suggestions && !this.rootService.isInitialDialogOnGoing) {
      let isInitialTaskRanORNot;
      let appState = this.localStorageService.getLocalStorageState();
      if (appState[this.connectionDetails.conversationId]) {
        isInitialTaskRanORNot = appState[this.connectionDetails.conversationId][storageConst.INITIALTASK_GOING_ON]
      }
      if (!isInitialTaskRanORNot) {
        this.runDialogForAssistTab(data, `onInitDialog-123456`, "onInitRun");
      }
    }

    if (this.connectionDetails.isCallConversation === true && data.suggestions) {
      this.handleSubjectService.setCallConversationSuggestions({ data: data, uuid: uuids });
    }

    if (!this.rootService.isAutomationOnGoing && data.suggestions) {

      if (this.rootService.suggestionsAnswerPlaceableIDs.length == 0) {

        renderResponse = {
          data: data,
          type: this.renderResponseType.SUGGESTIONS,
          uuid: responseId,
          searchResponse: this.rootService.formatSearchResponse(data),
          connectionDetails: this.connectionDetails
        }
        this.assistResponseArray.push(renderResponse);
        this.assistResponseArray = structuredClone(this.assistResponseArray);
      } else {
        let faqAnswerIdsPlace = this.rootService.suggestionsAnswerPlaceableIDs.find(ele => ele.input == data.suggestions?.faqs[0].question);

        if (faqAnswerIdsPlace) {
          this.updateSearchResponse(data, faqAnswerIdsPlace);
        }
      }
    }



    let result: any = this.templateRenderClassService.getResponseUsingTemplate(data, this.connectionDetails);
    this.rootService.currentPositionId = this.dialogPositionId;
    if (this.rootService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (this.dialogPositionId && !data.positionId || (data.positionId == this.dialogPositionId))) {


      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);

      renderResponse = {
        data: data,
        type: this.renderResponseType.AUTOMATION,
        uuid: responseId,
        result: result,
        temp: newTemp,
        connectionDetails: this.connectionDetails,
        proactiveModeStatus: this.proactiveModeStatus,
        toggleOverride: false,
        responseType: this.renderResponseType.ASSISTRESPONSE,
        errorCount: 0,
      }

      if (data.isPrompt && !this.proactiveModeStatus) {
        renderResponse.toggleOverride = true;
        renderResponse.hideOverrideDiv = true;
      }

      this.currentRunningStep = data.entityDisplayName ? data.entityDisplayName : data.entityName;

      this.assistResponseArray.map(arrEle => {
        if (arrEle.uuid && arrEle.uuid == this.dropdownHeaderUuids) {
          arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
          if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
            arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = this.rootService.manualAssistOverrideMode;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].disableInput = data.isErrorPrompt ? false : true;
            if (data.isErrorPrompt) {
              arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = false;
              arrEle.automationsArray[arrEle.automationsArray.length - 1].errorCount += 1;
            } else {
              arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
            }
          } else {
            arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
          }

        }
      });

      this.assistResponseArray = structuredClone(this.assistResponseArray)
      setTimeout(() => {
        if (data.entityName) {
          this.agentAssistResponse = {};
          this.agentAssistResponse = Object.assign({}, data);
        }
      }, 10);
    }

    // small talk with templates
    if (!this.rootService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (this.dialogPositionId && !data.positionId || data.positionId == this.dialogPositionId)) {
      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);
      renderResponse = {
        data: data,
        type: this.renderResponseType.SMALLTALK,
        uuid: responseId,
        result: result,
        temp: newTemp,
        connectionDetails: this.connectionDetails,
        proactiveModeStatus: this.proactiveModeStatus,
        toggleOverride: false,
        title: data.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
        isTemplateRender: this.smallTalkTemplateRenderCheck(data, result),
        value: data?.buttons[0]?.value,
        sendData: result?.parsedPayload ? newTemp : data?.buttons[0]?.value,
        dialogId: this.dialogPositionId,
        responseType: this.renderResponseType.ASSISTRESPONSE
      }
      // renderResponse.template = this.commonService.getTemplateHtml(renderResponse.isTemplateRender, result);

      if (data.isPrompt && !this.proactiveModeStatus) {
        renderResponse.toggleOverride = true;
        renderResponse.hideOverrideDiv = true;
      }

      if (this.assistResponseArray?.length > 1 && this.assistResponseArray[this.assistResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
        && this.assistResponseArray[this.assistResponseArray.length - 1]?.data?.isPrompt) {
        this.assistResponseArray[this.assistResponseArray.length - 1].toggleOverride = false;
        this.assistResponseArray[this.assistResponseArray.length - 1].disableInput = true;
      }

      setTimeout(() => {
        if (data.entityName) {
          this.agentAssistResponse = {};
          this.agentAssistResponse = Object.assign({}, data);
        }
      }, 10);

      this.assistResponseArray.push(renderResponse);
      this.assistResponseArray = [...this.assistResponseArray];
    }
    // small talk with templates end

    // small talk without templates
    if (!this.rootService.isAutomationOnGoing && !this.dropdownHeaderUuids && !data.suggestions && !result.parsePayLoad) {

      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);
      if (data.buttons?.length > 1) {
        this.welcomeMsgResponse = data;
      } else {

        renderResponse = {
          data: data,
          type: this.renderResponseType.SMALLTALK,
          uuid: responseId,
          result: result,
          temp: newTemp,
          connectionDetails: this.connectionDetails,
          proactiveModeStatus: this.proactiveModeStatus,
          toggleOverride: false,
          title: data.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
          isTemplateRender: this.smallTalkTemplateRenderCheck(data, result),
          value: data?.buttons[0]?.value,
          sendData: result?.parsedPayload ? newTemp : data?.buttons[0]?.value,
          responseType: this.renderResponseType.ASSISTRESPONSE
        }
        // renderResponse.template = this.commonService.getTemplateHtml(renderResponse.isTemplateRender, result);

        if (data.isPrompt && !this.proactiveModeStatus) {
          renderResponse.toggleOverride = true;
          renderResponse.hideOverrideDiv = true;
        }

        if (this.assistResponseArray?.length > 1 && this.assistResponseArray[this.assistResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
          && this.assistResponseArray[this.assistResponseArray.length - 1]?.data?.isPrompt) {
          this.assistResponseArray[this.assistResponseArray.length - 1].toggleOverride = false;
          this.assistResponseArray[this.assistResponseArray.length - 1].disableInput = true
        }

        this.assistResponseArray.push(renderResponse);
        this.assistResponseArray = [...this.assistResponseArray];
      }
    }

    if (data.buttons?.length > 1 && data.sendMenuRequest) {
      this.welcomeMsgResponse = data;
    }
  }


  runDialogForAssistTab(data, idTarget?, runInitent?) {
    let uuids = this.koreGenerateuuidPipe.transform();
    this.dropdownHeaderUuids = uuids;
    this.rootService.isAutomationOnGoing = true;
    let storageObject: any = {
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.rootService.isAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    let dialogId = this.randomUUIDPipe.transform('positionId');
    this.dialogPositionId = dialogId;
    if (runInitent) {
      this.dialogPositionId = data?.positionId;
    }
    this.dialogName = data.intentName;

    let renderResponse = {
      data: data,
      type: this.renderResponseType.AUTOMATION,
      uuid: uuids,
      dialogId: this.dialogPositionId,
      dialogName: this.dialogName,
      connectionDetails: this.connectionDetails,
      showAutomation: true
    }
    this.assistResponseArray.push(renderResponse);
    this.assistResponseArray = [...this.assistResponseArray];
    if (!runInitent) {
      this.AgentAssist_run_click(data, this.dialogPositionId, this.projConstants.INTENT);
    }
  }

  //dialogue click and agent response handling code.
  AgentAssist_run_click(dialog, dialogPositionId, intent?) {
    this.assistTabDialogforDashboard(dialog, intent);
    let connectionDetails: any = Object.assign({}, this.connectionDetails);
    connectionDetails.value = dialog.intentName;
    if (dialog.intentName && intent) {
      connectionDetails.intentName = dialog.intentName;
    }
    connectionDetails.positionId = dialogPositionId;
    // connectionDetails.entities = this.rootService.isRestore ? JSON.parse(this.rootService.previousEntitiesValue) : this.rootService.entitiestValueArray
    connectionDetails.entities = this.rootService.entitiestValueArray
    connectionDetails.childBotId = dialog.childBotId;
    connectionDetails.childBotName = dialog.childBotName;
    if (dialog.userInput) {
      connectionDetails.userInput = dialog.userInput;
    }
    let assistRequestParams = this.rootService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
  }

  assistTabDialogforDashboard(dialog, intent?) {
    let payloadForBE: any = Object.assign({}, this.connectionDetails);
    if (dialog.intentName && intent) {
      payloadForBE.intentName = dialog.intentName;
      payloadForBE.title = dialog.intentName;
    }
    payloadForBE.type = 'dialog';
    payloadForBE.input = dialog.userInput;
    payloadForBE.sessionId = this.rootService.assistTabSessionId;
    this.websocketService.emitEvents(EVENTS.agent_send_or_copy, payloadForBE)
  }


  updateSearchResponse(response, faqAnswerIdsPlace) {
    response.suggestions.faqs = this.rootService.formatFAQResponse(response.suggestions.faqs);
    let index = this.rootService.suggestionsAnswerPlaceableIDs.findIndex(suggestion => {
      return suggestion.input == faqAnswerIdsPlace.input
    });


    let accumulator = response.suggestions.faqs.reduce((acc, faq) => {
      if (faq.question == faqAnswerIdsPlace.input) {
        acc[faq.question] = faq;
        return acc;
      }
    }, {});

    if (index >= 0) {
      this.rootService.suggestionsAnswerPlaceableIDs.splice(index, 1);
      this.assistResponseArray[faqAnswerIdsPlace.assistSuggestion].searchResponse.faqs?.forEach(faq => {
        if (accumulator[faq.question] && accumulator[faq.question].answer) {
          faq.answer = accumulator[faq.question].answer;
          faq.toggle = true;
          faq.showMoreButton = false,
            faq.showLessButton = false
        }
      });
      this.assistResponseArray[faqAnswerIdsPlace.assistSuggestion].faqArrowClickResponse = true;
      this.assistResponseArray = structuredClone(this.assistResponseArray);
    }

  }

  smallTalkTemplateRenderCheck(data, result) {
    if (result.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))) {
      return true;
    }
    return false;
  }

  handleAutomationSmallTalkOverrideMode() {
    let assistResponse = this.assistResponseArray[this.assistResponseArray.length - 1];
    if (assistResponse) {
      if (assistResponse.type == this.renderResponseType.SMALLTALK) {

      } else if (assistResponse.type == this.renderResponseType.AUTOMATION) {
        let assistResponseArray = assistResponse.automationsArray;
        if (!this.proactiveModeStatus && assistResponseArray?.length > 0 && assistResponseArray[assistResponseArray.length - 1]?.data?.isPrompt) {
          assistResponseArray[assistResponseArray.length - 1].toggleOverride = true;
          assistResponseArray[assistResponseArray.length - 1].hideOverrideDiv = true;
        } else if (this.proactiveModeStatus && assistResponseArray?.length > 0 && assistResponseArray[assistResponseArray.length - 1]?.data?.isPrompt) {
          assistResponseArray[assistResponseArray.length - 1].toggleOverride = false;
          assistResponseArray[assistResponseArray.length - 1].hideOverrideDiv = false;
        }
      }
      this.assistResponseArray = structuredClone(this.assistResponseArray);
    }
  }

  //dialog terminate code
  dialogTerminatedOrIntruppted() {
    this.rootService.isAutomationOnGoing = false;
    this.rootService.isInitialDialogOnGoing = true;
    this.rootService.OverRideMode = false;
    let storageObject: any = {
      // [storageConst.AUTOMATION_GOING_ON]: this.commonService.isAutomationOnGoing,
      [storageConst.INITIALTASK_GOING_ON]: this.rootService.isInitialDialogOnGoing,
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.rootService.isAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    if (this.dialogPositionId) {
      this.filterAutomationByPositionId();
      this.prepareFeedbackData();
    }
  }

  filterAutomationByPositionId() {
    this.assistResponseArray.map(arrEle => {
      if (arrEle.dialogId && arrEle.dialogId == this.dialogPositionId) {
        arrEle.endAutomation = true;
      }
    });
    this.assistResponseArray = structuredClone(this.assistResponseArray);
  }

  removeOrAddOverRideDivForPreviousResponse(flag) {
    if (flag) {
      if (this.assistResponseArray?.length > 1 && this.assistResponseArray[this.assistResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
        && this.assistResponseArray[this.assistResponseArray.length - 1]?.data?.isPrompt) {
        this.assistResponseArray[this.assistResponseArray.length - 1].toggleOverride = false;
        this.assistResponseArray[this.assistResponseArray.length - 1].hideOverrideDiv = true;
        this.assistResponseArray = structuredClone(this.assistResponseArray);
      } else if (this.assistResponseArray?.length > 1) {
        this.assistResponseArray.map(arrEle => {
          if (arrEle.uuid && arrEle.uuid == this.dropdownHeaderUuids && arrEle.type == this.renderResponseType.AUTOMATION) {
            arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
            if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
              arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
              arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
              arrEle.automationsArray[arrEle.automationsArray.length - 1].disableInput = true;
            }
            arrEle.automationsArray = [...arrEle.automationsArray];
          }
        });
      }
    } else {
      this.assistResponseArray.map(arrEle => {
        if (arrEle.uuid && arrEle.uuid == this.dropdownHeaderUuids && arrEle.type == this.renderResponseType.AUTOMATION) {
          arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
          if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
            arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = false;
            //  arrEle.automationsArray[arrEle.automationsArray.length -1].toggleOverride = true; 
            arrEle.automationsArray[arrEle.automationsArray.length - 1].disableInput = false;
          }
          arrEle.automationsArray = [...arrEle.automationsArray];
        }
      });
    }
  }

  prepareFeedbackData(feedbackData?) {
    this.dialogName = null;
    this.currentRunningStep = null;
    this.rootService.manualAssistOverrideMode = false;
    let renderResponse: any = {
      type: this.renderResponseType.FEEDBACK,
      uuid: this.dropdownHeaderUuids,
      connectionDetails: this.connectionDetails,
      dialogName: this.dialogName,
      dialogPositionId: this.dialogPositionId,
      submitForm: feedbackData?.feedback ? true : false,
      feedback: feedbackData?.feedback ? feedbackData.feedback : '',
      feedbackDetails: feedbackData?.feedbackDetails?.length ? feedbackData.feedbackDetails : []
    }
    this.assistResponseArray.push(renderResponse);
    this.assistResponseArray = [...this.assistResponseArray];
  }


  minimizeToggle() {
    this.maxButton = !this.maxButton;
    this.maxButtonClick.emit(this.maxButton);
  }

  terminateDialog() {
    this.terminateClick = true;
  }


  handlePopupEvent(popupObject) {
    if (popupObject.type == this.projConstants.TERMINATE) {
      this.terminateClick = popupObject.status;
      if (this.terminateClick) {
        this.terminateClick = false;
        this.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
      } else if (popupObject.override) {
        this.terminateClick = false;
        this.rootService.OverRideMode = true;
        this.makeOverrideEvent(this.connectionDetails.botId, this.connectionDetails.conversationId, true);
        this.rootService.manualAssistOverrideMode = true;
        this.removeOrAddOverRideDivForPreviousResponse(false);
      }
    } else if (popupObject.type == this.projConstants.INTERRUPT) {
      this.showInterruptPopup = popupObject.status;
      if (this.showInterruptPopup) {
        this.showInterruptPopup = false;
        this.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
        this.dialogTerminatedOrIntruppted();
        this.runDialogForAssistTab(popupObject.dialog);
      } else if (popupObject.saveLater) {

      }
    }
  }

  getAssistData(params) {
    this.loader = true;
    let feedback = this.assistFeedback(params);
    let history = this.assistHistory(params);
    forkJoin([feedback, history]).subscribe(res => {
      this.loader = false;
    });
  }

  assistHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.assistHistorySA' : 'get.assistHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { historyAPiCall: 'true', botId: botId }, params.agentassisturl);
  }

  assistFeedback(params) {
    return this.serviceInvoker.invoke('get.assistFeedback', { tab: 'assist', botId: params.botId }, {}, { botId: params.botId }, params.agentassisturl);
  }

  updateFeedbackProperties(data, index) {
    this.assistResponseArray[index] = data;
  }

}
