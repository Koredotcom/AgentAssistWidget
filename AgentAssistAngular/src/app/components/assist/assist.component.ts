import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss']
})
export class AssistComponent implements OnInit, OnDestroy {

  @Output() maxButtonClick = new EventEmitter();
  @Input() maxButton: boolean;

  @ViewChild('content', {static: false}) private content: ElementRef<HTMLDivElement>

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
  smallTalkUuids : any;

  interruptDialog: any;
  showInterruptPopup: boolean = false;
  interruptDialogList : any = [];

  showListView : boolean = false;

  showRestart : boolean = false;

  summaryText: string = '';
  showSummaryPopup: boolean = false;


  constructor(private rootService: RootService, private serviceInvoker: ServiceInvokerService,
    private websocketService: WebSocketService, private localStorageService: LocalStorageService,
    private koreGenerateuuidPipe: KoreGenerateuuidPipe, private randomUUIDPipe: RandomUuidPipe,
    private handleSubjectService: HandleSubjectService, private templateRenderClassService: TemplateRenderClassService,
    public modalService : NgbModal) {

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
        this.proactiveModeStatus = appState[this.connectionDetails.conversationId][storageConst.PROACTIVE_MODE];
        this.getInterruptDialogList();
      }
    });

    this.subs.sink = this.websocketService.agentAssistResponse$.subscribe((response: any) => {
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
          if(runEventObj.from == this.projConstants.INTERRUPT){
            this.interruptDialogList.splice(runEventObj.index, 1);
            this.updateInterruptDialogList();
          }
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
      if (endoftaskresponse && (endoftaskresponse.intType == 'assist' || endoftaskresponse.positionId === this.dialogPositionId || !endoftaskresponse.positionId)) {
      this.dialogTerminatedOrIntruppted();
      // this.viewCustomTempAttachment();
      }
    });

    this.subs.sink = this.handleSubjectService.summaryPopupSubject.subscribe((data)=> {
      this.handlePopupEvent({ status: true, type: this.projConstants.SUMMARY, summaryText: data });
    })
  }

  getInterruptDialogList(){
    let appState = this.localStorageService.getLocalStorageState();    
    this.interruptDialogList = appState[this.connectionDetails.conversationId][storageConst.INTERRUPT_DIALOG_LIST]
    
  }

  updateInterruptDialogList(){
    let storageObject: any = {
      [storageConst.INTERRUPT_DIALOG_LIST]: this.interruptDialogList
    }
    this.localStorageService.setLocalStorageItem(storageObject);    
  }

  handleProactiveDisableEvent(dialogId) {
    this.websocketService.handleOverrideMode(!this.proactiveModeStatus, dialogId);
  }

  updateAgentAssistResponse(data, botId, conversationId) {
    this.makeOverrideEvent(botId, conversationId, false)
    this.processAgentAssistResponse(data, botId);
  }

  makeOverrideEvent(botId, conversationId, flag) {
    if (this.rootService.OverRideMode && this.proactiveModeStatus && !this.rootService.manualAssistOverrideMode) {
      this.websocketService.handleOverrideMode(flag, null);
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

  processUserMessagesForHistory(data, respIndex, index) {     
    if (this.assistResponseArray?.length >= 1 && this.assistResponseArray[this.assistResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
      && this.assistResponseArray[this.assistResponseArray.length - 1]?.data?.isPrompt) {
        if(data.userInput){
          this.assistResponseArray[this.assistResponseArray.length - 1].entityValue = data.userInput;
          this.assistResponseArray[this.assistResponseArray.length - 1].disableInput = (respIndex == index) ? false : true;
        }
    } else if (this.assistResponseArray?.length >= 1) {
      this.assistResponseArray.map(arrEle => {
        if (arrEle.uuid && arrEle.uuid == this.dropdownHeaderUuids) {
          arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
          if (data.userInput && arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
            arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
            if (data.userInput) {
              let userInput = arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput;
              arrEle.automationsArray[arrEle.automationsArray.length - 1].entityValue = data.userInput;
              arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput = ProjConstants.YES;
              arrEle.automationsArray[arrEle.automationsArray.length - 1].disableInput = (respIndex == index) ? false : true;

            }
          }
          arrEle.automationsArray = [...arrEle.automationsArray];
        }
      });
    }
    this.assistResponseArray = structuredClone(this.assistResponseArray);
    if(respIndex == index){
      console.log(this.assistResponseArray, "this.assistResponseArray");
    }
    
    
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
        this.runDialogForAssistTab(data, "onInitRun");
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
    if (this.rootService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.sendMenuRequest && (this.dialogPositionId && !data.positionId || (data.positionId == this.dialogPositionId))) {


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
        value : data?.buttons[0]?.value
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
    if (!this.rootService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.sendMenuRequest && (this.dialogPositionId && !data.positionId || data.positionId == this.dialogPositionId)) {
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
    if (!this.rootService.isAutomationOnGoing && !this.dropdownHeaderUuids && !data.suggestions && !result.parsePayLoad && !data.sendMenuRequest) {

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

    if (data.buttons?.length > 1 && data.sendMenuRequest) {
      this.welcomeMsgResponse = data;
    }
  }


  runDialogForAssistTab(data, runInitent?) {
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
    this.rootService.currentPositionId = this.dialogPositionId;
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
        this.assistResponseArray[this.assistResponseArray.length - 1].disableInput = true;
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
    if(this.assistResponseArray){
      let type = this.assistResponseArray[this.assistResponseArray.length -1]?.type;
      console.log(type, "type *********",this.dialogPositionId);
      
      if(type == this.renderResponseType.AUTOMATION){
        this.rootService.manualAssistOverrideMode = false;
        let renderResponse: any = {
          type: this.renderResponseType.FEEDBACK,
          uuid: this.dropdownHeaderUuids,
          connectionDetails: this.connectionDetails,
          dialogName: this.dialogName,
          dialogPositionId: this.dialogPositionId,
          submitForm: feedbackData?.feedback ? true : false,
          feedback: feedbackData?.feedback ? feedbackData.feedback : '',
          feedbackDetails: feedbackData?.feedbackDetails?.length ? feedbackData.feedbackDetails : [],
          comment : feedbackData?.comment ? feedbackData?.comment : ''
        }
        this.assistResponseArray.push(renderResponse);
        this.assistResponseArray = [...this.assistResponseArray];
        this.dialogName = null;
        this.currentRunningStep = null;
      }
    }
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
        this.runDialogForAssistTab(this.interruptDialog);
      } else if (popupObject.runLater) {
        this.showInterruptPopup = false;
        let index = this.interruptDialogList.findIndex(obj => obj.name === this.interruptDialog.name);
        if(index < 0){
          this.interruptDialogList.push(this.interruptDialog);
          this.updateInterruptDialogList();
        }
      }
    } else if(popupObject.type == this.projConstants.LISTVIEW){
       this.showListView = popupObject.status;
    } else if (popupObject.type == this.projConstants.SUMMARY) {
      this.rootService.activeTab == this.projConstants.ASSIST;
      this.summaryText = popupObject.summaryText || '';
      this.showSummaryPopup = popupObject.status;
      if (popupObject.summary) {
        let message = {
          name: "agentAssist.conversation_summary",
          conversationId: this.connectionDetails.conversationId,
          payload: {
            "summary" : [
              {
                'summary_text': popupObject.editedSummary || '',
              }
            ]
          }
        };
        console.log(message, "message****");
        
        window.parent.postMessage(message, '*');
      }
    }
  }

  restartClickEvent(){
    this.showSummaryPopup = true;
    this.showRestart = true;
    this.modalService.open(this.content);
  }

  getAssistData(params) {
    this.loader = true;
    let feedback = this.assistFeedback(params);
    let history = this.assistHistory(params);
    forkJoin([feedback, history]).subscribe(res => {
      this.loader = false;
      let feedbackData = res[0]?.results || [];
      let historyData = res[1] || [];
      // let historyData = this.rootService.getMockData();
      this.renderHistoryMessages(historyData, feedbackData);
    });
  }

  assistHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.assistHistorySA' : 'get.assistHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { historyAPiCall: 'true', botId: botId }, params.agentassisturl);
  }

  assistFeedback(params) {
    return this.serviceInvoker.invoke('get.assistFeedback', { tab: 'assist', conversationId: params.conversationId }, {}, { botId: params.botId }, params.agentassisturl);
  }

  updateFeedbackProperties(data, index) {
    this.assistResponseArray[index] = data;
  }

  renderHistoryMessages(response, feedBackResult) {

    let previousId;
    let previousTaskPositionId, currentTaskPositionId, currentTaskName, previousTaskName;
    let resp = response.length > 0 ? response : undefined;
    let renderResponse: any = {};

    resp = this.rootService.formatHistoryResponseForFAQ(resp);
    resp?.forEach((res, index) => {

      res = this.rootService.confirmationNodeRenderForHistoryDataTransform(res);
      res = this.rootService.formatHistoryResonseToNormalRender(res);
      // this.removeOrAddOverRideDivForPreviousResponse(true);
      
      if ((res.suggestions || res.ambiguityList) && res.type == 'outgoing' && res.faqResponse) {

        res.suggestions.faqs.forEach(faq => {
          faq.answer = res?.components[0]?.data?.text
        });

        res.suggestions.faqs = this.rootService.formatFAQResponse(res.suggestions.faqs);

        let faqQuestionList = res?.suggestions?.faqs?.reduce((acc, faq) => {
          acc[faq.question] = faq;
          return acc;
        }, {});

        let inx = null;
        this.assistResponseArray.forEach((assistResp, index) => {
          if (assistResp.type == this.renderResponseType.SUGGESTIONS && assistResp?.searchResponse?.faqs) {
            assistResp.searchResponse.faqs.forEach(faq => {

              if (faqQuestionList[faq.question]) {
                if (!faq.answer) {
                  faq.answer = faqQuestionList[faq.question].answer;
                  faq.toggle = true;
                  faq.showMoreButton = false,
                    faq.showLessButton = false,
                    inx = index;
                }
              }
            });
          }
        });

        if (typeof inx == 'number') {
          this.assistResponseArray[inx].faqArrowClickResponse = true;
        }
        this.assistResponseArray = structuredClone(this.assistResponseArray);
      }

      if ((res.suggestions || res.ambiguityList) && res.type == 'outgoing' && !res.faqResponse) {
        renderResponse = {
          data: res,
          type: this.renderResponseType.SUGGESTIONS,
          uuid: res._id,
          searchResponse: this.rootService.formatSearchResponse(res),
          connectionDetails: this.connectionDetails
        }
        this.assistResponseArray.push(renderResponse);
        this.assistResponseArray = structuredClone(this.assistResponseArray);
      }


      if ((!res.suggestions && !res.ambiguityList && !res.ambiguity) && res.type == 'outgoing') {

        currentTaskPositionId = res.positionId ? res.positionId :  ((res.intentName != currentTaskName) ? null : currentTaskPositionId);
        currentTaskName = (res.intentName) ? res.intentName : currentTaskName;
        this.dialogPositionId = currentTaskPositionId;
        this.rootService.currentPositionId = this.dialogPositionId;
        this.dialogName = currentTaskName
        let uuids = this.koreGenerateuuidPipe.transform();
        
        if(res.endOfTask && previousId){                  
          let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === currentTaskPositionId);
          
          this.filterAutomationByPositionId();
          this.prepareFeedbackData(previousIdFeedBackDetails);
          this.automationFlagUpdate(previousId,false);
          this.automationFlagUpdateForSmallTalk(previousId, false);

          this.updateOverrideStatusOfAutomation(previousId);
          previousId = undefined;
          previousTaskName = currentTaskName;
          previousTaskPositionId = currentTaskPositionId;
          currentTaskName = null;
          currentTaskPositionId = null;
        }else if (res.intentName && !previousId && previousTaskPositionId !== currentTaskPositionId && !res.endOfTask) {
          // update postionids and dialogue start
          
          let automationUUIDCheck = this.assistResponseArray.findIndex((automation) => {
            if (automation.uuid == res._id) {
              return true;
            }
            return false;
          });
          // previousTaskPositionId = currentTaskPositionId;
          // previousTaskName = currentTaskName;

          if (automationUUIDCheck == -1) {
            previousId = res._id;
            this.automationFlagUpdate(previousId,true);
            previousTaskPositionId = currentTaskPositionId;
            previousTaskName = currentTaskName;
            let renderResponse = {
              data: res,
              type: this.renderResponseType.AUTOMATION,
              uuid: previousId,
              dialogId: currentTaskPositionId,
              dialogName: currentTaskName,
              connectionDetails: this.connectionDetails,
              showAutomation: true,
              value : res?.components[0]?.data?.text
            }
            this.assistResponseArray.push(renderResponse);
            this.assistResponseArray = [...this.assistResponseArray];

            if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
              this.dialogPositionId = previousTaskPositionId;
              this.rootService.currentPositionId = this.dialogPositionId;
            }
            
          }
        }
        

        //process user messages
        if (res.entityName && res.entityResponse && (res.entityValue || res.userInput)) {
             res.userInput = res.userInput ? res.userInput : res.entityValue;
             this.processUserMessagesForHistory(res,resp.length - 1, index);
        }
       
        if (res.entityName) {
          this.agentAssistResponse = Object.assign({}, res);
        }
        
        let result: any = this.templateRenderClassService.getResponseUsingTemplateForHistory(res);
        
        this.rootService.currentPositionId = currentTaskPositionId;
        let msgStringify = JSON.stringify(result);
        let newTemp = encodeURI(msgStringify);
        
        if (result.message.length > 0) {
          // automation
          
          if (previousTaskName === currentTaskName && previousTaskPositionId == currentTaskPositionId) {
          
            renderResponse = {
              data: res,
              type: this.renderResponseType.AUTOMATION,
              uuid: res.components && res.components[0]?._id ? (res.components && res.components[0]?._id) : uuids,
              result: result,
              temp: newTemp,
              connectionDetails: this.connectionDetails,
              proactiveModeStatus: this.proactiveModeStatus,
              toggleOverride: false,
              responseType: this.renderResponseType.ASSISTRESPONSE,
              value : res?.components[0]?.data?.text
            }

            if (res.isPrompt && !this.proactiveModeStatus) {
              renderResponse.toggleOverride = true;
              renderResponse.hideOverrideDiv = true;
            }

            this.assistResponseArray.map(arrEle => {
              if (arrEle.uuid && arrEle.uuid == previousId) {
                arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
                if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
                  arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
                  arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
                }
                arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
              }
            });

            this.assistResponseArray = structuredClone(this.assistResponseArray);

          }else if((previousTaskName != currentTaskName)){
          //small talk after dialogue terminate
            this.automationFlagUpdateForSmallTalk(previousId, true);
            renderResponse = {
              data: res,
              type: this.renderResponseType.SMALLTALK,
              uuid: uuids,
              result: result,
              temp: newTemp,
              connectionDetails: this.connectionDetails,
              proactiveModeStatus: this.proactiveModeStatus,
              toggleOverride: false,
              title: res.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
              isTemplateRender: this.smallTalkTemplateRenderCheck(res, result),
              value: res?.components[0]?.data?.text,
              sendData: result?.parsedPayload ? newTemp : res?.components[0]?.data?.text,
              responseType: this.renderResponseType.ASSISTRESPONSE
            }
            renderResponse.template = this.rootService.getTemplateHtml(renderResponse.isTemplateRender, result);

            this.assistResponseArray.push(renderResponse);
            this.assistResponseArray = [...this.assistResponseArray];
          }
        }
      }      

      // feedback, for tellcustomer as end of node
      if ((resp.length - 1 == index && (!res.entityRequest && !res.entityResponse) && previousTaskPositionId && currentTaskPositionId == previousTaskPositionId)) {
        let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === currentTaskPositionId);
        this.filterAutomationByPositionId();
        this.prepareFeedbackData(previousIdFeedBackDetails);
        this.automationFlagUpdate(previousId,false)
        this.updateOverrideStatusOfAutomation(previousId);
        previousId = undefined;
        previousTaskName = currentTaskName;
        previousTaskPositionId = currentTaskPositionId;
        currentTaskName = null;
        currentTaskPositionId = null;
      }

    });

  }

  updateOverrideStatusOfAutomation(previousId){
    this.assistResponseArray.map(arrEle => {
      if (arrEle.uuid && arrEle.uuid == previousId) {
        arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
        if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
        }
      }
    });
    this.assistResponseArray = structuredClone(this.assistResponseArray);
  }

  automationFlagUpdateForSmallTalk(previousId, flag){
    this.smallTalkUuids = flag ? previousId : null;
  }

  automationFlagUpdate(previousId,flag){
    if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
      this.rootService.isAutomationOnGoing = flag;
      this.dropdownHeaderUuids = previousId;
      let storageObject: any = {
        [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.rootService.isAutomationOnGoing
      }
      this.localStorageService.setLocalStorageItem(storageObject);
    }
  }


  //interrupt run click

  dialogueRunClick(dialog, index) {
    dialog.positionId = this.randomUUIDPipe.transform('positionId');
    dialog.intentName = dialog.name;
    dialog.userInput = dialog.name;
    dialog.agentRunButton = false;
    dialog.from = this.projConstants.INTERRUPT;
    dialog.index = index
    this.handleSubjectService.setRunButtonClickEvent(dialog);
  }

}
