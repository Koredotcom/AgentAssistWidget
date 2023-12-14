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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss']
})
export class AssistComponent implements OnInit, OnDestroy {

  @Output() maxButtonClick = new EventEmitter();
  @Input() maxButton: boolean;

  @ViewChild('content', { static: false }) private content: ElementRef<HTMLDivElement>
  @ViewChild('collapseTab', { static: false }) private collapseTab: ElementRef;
  @ViewChild('terminateCanvas', {static : false}) private canvas : ElementRef<HTMLDivElement>
  @ViewChild('summeryModalpopupContent', {static : false}) private summaryPopupContent : ElementRef<HTMLDivElement>

  connectionDetails: any = {};
  subs = new SubSink();
  proactiveModeStatus: boolean;
  projConstants: any = ProjConstants;
  renderResponseType: any = RenderResponseType;


  dialogName: string;
  dialogPositionId: string;

  welcomeMsgResponse: any = {};
  dropdownHeaderUuids: any;

  assistResponseArray: any = [];
  // agentAssistResponse: any = {};
  currentRunningStep: string;
  terminateClick: boolean = false;

  interruptDialog: any;
  showInterruptPopup: boolean = false;
  interruptDialogList: any = [];
  interruptRun: boolean = false;
  restartDialogName : any;
  restartEntityList : any;

  showListView: boolean = false;

  showRestart: boolean = false;
  terminateDailogTemp:any;

  summaryText: string = '';
  showSummaryPopup: boolean = false;
  showErrorPrompt : boolean = false;
  summaryPopupModal : any;
  showSpinner : boolean = true;

  assistRespType(index, respType) {
    return respType?.data?._id;
  };


  constructor(public rootService: RootService, private serviceInvoker: ServiceInvokerService,
    private websocketService: WebSocketService, private localStorageService: LocalStorageService,
    private koreGenerateuuidPipe: KoreGenerateuuidPipe, private randomUUIDPipe: RandomUuidPipe,
    private handleSubjectService: HandleSubjectService, private templateRenderClassService: TemplateRenderClassService,
    public modalService: NgbModal, private offcanvasService: NgbOffcanvas,
    private commonService : CommonService) {

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
        this.viewCustomTempAttachment();
      }
    });

    this.subs.sink = this.websocketService.agentAssistUserMessageResponse$.subscribe((response: any) => {
      if (response && response.botId) {
        if (!this.rootService.isAutomationOnGoing && !this.proactiveModeStatus) {
          return;
        } else {
          this.processUserMessages(response);
          this.viewCustomTempAttachment();
        }
      }
    });

    this.subs.sink = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {
      if (runEventObj) {
        if(runEventObj && !runEventObj?.agentRunButton){
          this.spinnerUpdate();
        }                
        if (runEventObj && !runEventObj?.agentRunButton && !this.rootService.isAutomationOnGoing) {
          if (runEventObj.from == this.projConstants.INTERRUPT) {
            this.interruptDialogList.splice(runEventObj.index, 1);
            this.commonService.updateInterruptDialogList(this.interruptDialogList, this.projConstants.ASSIST);
          }
          this.runDialogForAssistTab(runEventObj);
        } else if (runEventObj && !runEventObj?.agentRunButton && this.rootService.isAutomationOnGoing) {
          this.showInterruptPopup = true;
          this.interruptDialog = runEventObj;
          this.openOffCanvas();
          // this.handlePopupEvent({ status: true, type: this.projConstants.INTERRUPT });
        }
      }
    });

    this.subs.sink = this.handleSubjectService.proactiveModeSubject.subscribe((response: any) => {
      if (response != null && response != undefined) {
        this.proactiveModeStatus = response;
        if(!this.rootService.manualAssistOverrideMode || !response){
          this.handleProactiveDisableEvent(this.dialogPositionId);
        }
      }
    });

    this.subs.sink = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {      
      if (endoftaskresponse && (endoftaskresponse.positionId === this.dialogPositionId) || (!endoftaskresponse?.positionId)) {
        if(this.showListView){
          this.handlePopupEvent({type : this.projConstants.LISTVIEW, status : false});
        }
        this.dialogTerminatedOrIntruppted();        
        if (this.interruptRun) {
          this.interruptRun = false;
          let index = this.interruptDialogList.findIndex(obj => obj.name === this.interruptDialog.name);
          index = index < 0 ? 0 : index;
          this.commonService.dialogueRunClick(this.interruptDialog,index, false)
        }
        if(this.showRestart){
          this.handlePopupEvent({type : this.projConstants.RESTART, status : false});
          this.commonService.restartDialogueRunClick(this.restartDialogName, false);
          this.restartDialogName = null;
          this.showRestart = false;
          this.makeOverrideEvent(false)
        }
        this.viewCustomTempAttachment();
      }
    });

    this.subs.sink = this.handleSubjectService.summaryPopupSubject.subscribe((data) => {
      this.summeryModalpopup(data);
    });

    this.subs.sink = this.rootService.activeTab$.subscribe(tab => {
      if(tab == ProjConstants.ASSIST && !this.rootService.bulbClick){
        this.scrollToBottom();
      }
      this.rootService.bulbClick = false;
    });

    this.websocketService.responseResolutionCommentsResponse$.subscribe((data: any) => {
      if (data) {
        this.handleSubjectService.setSummaryPopup(data);
      }
    });
  }

  spinnerUpdate(){
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 10000);
  }

  getAssistData(params) {
    let feedback = this.commonService.assistFeedback(params);
    let history = this.commonService.assistHistory(params);
    this.handleSubjectService.setLoader(true);
    forkJoin([feedback, history]).pipe(finalize(() => { this.showSpinner = false; })).subscribe(res => {
      let feedbackData = res[0]?.results || [];
      let historyData = res[1] || [];
      this.renderHistoryMessages(historyData, feedbackData);
    });
  }


  getInterruptDialogList() {
    let appState = this.localStorageService.getLocalStorageState();
    this.interruptDialogList = appState[this.connectionDetails.conversationId][storageConst.INTERRUPT_DIALOG_LIST]
  }

  handleProactiveDisableEvent(dialogId) {
    this.websocketService.handleOverrideMode(!this.proactiveModeStatus, dialogId);
  }

  updateAgentAssistResponse(data, botId, conversationId) {
    this.makeOverrideEvent(false)
    this.processAgentAssistResponse(data, botId);
  }

  makeOverrideEvent(flag) {
    if (this.rootService.OverRideMode && this.proactiveModeStatus && !this.rootService.manualAssistOverrideMode) {
      this.websocketService.handleOverrideMode(flag, null);
    }
  }

  overModeContinue(flag){
    this.websocketService.handleOverrideMode(flag, null);
  }

  processUserMessages(data) {    
    if(this.assistResponseArray?.length && this.assistResponseArray[this.assistResponseArray.length -1]?.type == this.renderResponseType.SMALLTALK &&
      this.assistResponseArray[this.assistResponseArray.length -1]?.data?.isPrompt){
      this.assistResponseArray = this.commonService.processUserMessagesForSmalltalk(data, this.assistResponseArray, true, false);
    }else if(this.assistResponseArray.length){
      this.showErrorPrompt = data.isErrorPrompt ? true : false;
      this.assistResponseArray = this.commonService.processUserMessagesForAutomation(data, this.assistResponseArray, true, false, this.showErrorPrompt, this.rootService.dropdownHeaderUuids)
    }    
    this.assistResponseArray = structuredClone(this.assistResponseArray);
  }

  processUserMessagesForHistory(data) {        
    if (this.assistResponseArray?.length >= 1 && this.assistResponseArray[this.assistResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
      && this.assistResponseArray[this.assistResponseArray.length - 1]?.data?.isPrompt) {
      this.assistResponseArray = this.commonService.processUserMessagesForSmalltalk(data, this.assistResponseArray, false, false, 'history');
    } else if (this.assistResponseArray?.length >= 1) {
      this.showErrorPrompt = data.isErrorPrompt ? true : false;
      this.assistResponseArray = this.commonService.processUserMessagesForAutomation(data, this.assistResponseArray, true, false, this.showErrorPrompt, this.rootService.dropdownHeaderUuids);
      this.assistResponseArray = structuredClone(this.assistResponseArray);
    }
    this.assistResponseArray = structuredClone(this.assistResponseArray);
  }

  processAgentAssistResponse(data, botId) {
    let renderResponse: any = {};
    // let isTemplateRender = false;

    data = this.rootService.confirmationNodeRenderDataTransform(data);

    if (this.rootService.isAutomationOnGoing && this.rootService.dropdownHeaderUuids && data.suggestions?.dialogs?.length > 0) {
      this.dialogTerminatedOrIntruppted();
    }

    if (!this.rootService.isAutomationOnGoing && !this.proactiveModeStatus && !data.sendMenuRequest) {
      return;
    }

    if (!data.sendMenuRequest) {
      this.assistResponseArray = this.commonService.removeOrAddOverRideDivForPreviousResponse(this.assistResponseArray,true);
      this.assistResponseArray = [...this.assistResponseArray];
    }

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
        renderResponse = this.commonService.formatSuggestionRenderResponse(data, responseId);
        this.assistResponseArray.push(renderResponse);
        this.assistResponseArray = structuredClone(this.assistResponseArray);
      } else {
        let faqAnswerIdsPlace = this.rootService.suggestionsAnswerPlaceableIDs.find(ele => ele.input == data.suggestions?.faqs[0].question);
        if (faqAnswerIdsPlace) {
          this.assistResponseArray = this.commonService.updateSearchResponse(this.assistResponseArray, data, faqAnswerIdsPlace)
          this.assistResponseArray = structuredClone(this.assistResponseArray);
        }
      }
    }

    let result: any = this.templateRenderClassService.getResponseUsingTemplate(data);
    this.rootService.currentPositionId = this.dialogPositionId;
    let msgStringify = JSON.stringify(result);
    let newTemp = encodeURI(msgStringify);    

    if (this.rootService.isAutomationOnGoing && this.rootService.dropdownHeaderUuids && data.buttons && !data.sendMenuRequest && (this.dialogPositionId && !data.positionId || (data.positionId == this.dialogPositionId))) {
      this.showSpinner = false;
      renderResponse = this.commonService.formatAutomationRenderResponse(data,responseId, result, newTemp, this.dialogPositionId)
      if (data.isPrompt && (!this.proactiveModeStatus || this.rootService.manualAssistOverrideMode)) {
        renderResponse.toggleOverride = true;
        renderResponse.hideOverrideDiv = true;
      }
      this.currentRunningStep = data.entityDisplayName ? data.entityDisplayName : data.entityName;
      let previousEntityNodes = this.commonService.getPreviousEntityNodesAndValues(this.assistResponseArray,data);
      renderResponse = this.commonService.formatAssistAutomation(renderResponse);
      this.assistResponseArray = this.commonService.formatRunningLastAutomationEntityNode(this.assistResponseArray, data, this.showErrorPrompt, renderResponse, this.rootService.dropdownHeaderUuids, this.projConstants.ASSIST, previousEntityNodes);
      this.assistResponseArray = structuredClone(this.assistResponseArray);      
    }

    // small talk with templates
    if (!this.rootService.isAutomationOnGoing && this.rootService.dropdownHeaderUuids && data.buttons && !data.sendMenuRequest && (this.dialogPositionId && !data.positionId || data.positionId == this.dialogPositionId)) {
      renderResponse = this.commonService.formatSmallTalkRenderResponse(data, responseId, result, newTemp, this.dialogPositionId)
      if (data.isPrompt && !this.proactiveModeStatus) {
        renderResponse.toggleOverride = true;
        renderResponse.hideOverrideDiv = true;
      }
      this.assistResponseArray = this.commonService.formatRunningLastSmallTalkEntityNode(this.assistResponseArray, renderResponse);
      this.assistResponseArray = [...this.assistResponseArray];
    }

    // small talk without templates
    if (!this.rootService.isAutomationOnGoing && !this.rootService.dropdownHeaderUuids && !data.suggestions && !result.parsePayLoad && !data.sendMenuRequest) {
      renderResponse = this.commonService.formatSmallTalkRenderResponse(data, responseId, result, newTemp, this.dialogPositionId)
      if (data.isPrompt && !this.proactiveModeStatus) {
        renderResponse.toggleOverride = true;
        renderResponse.hideOverrideDiv = true;
      }
      this.assistResponseArray = this.commonService.formatRunningLastSmallTalkEntityNode(this.assistResponseArray, renderResponse);
      this.assistResponseArray = [...this.assistResponseArray];
    }

    if(this.rootService.isAgentSentRequestOnClick){
      this.rootService.setAssistTemplateClick(false);
    }

    if (data.buttons?.length > 1 && data.sendMenuRequest) {
      this.welcomeMsgResponse = data;
      this.scrollToBottom();
    }else{
      this.scrollToBottomRuntime();
    }
    
  }


  runDialogForAssistTab(data, runInitent?) {
    let uuids = this.koreGenerateuuidPipe.transform();
    this.rootService.dropdownHeaderUuids = uuids;
    this.commonService.updateLocalStorageForAssist(true);
    let dialogId = this.randomUUIDPipe.transform('positionId');
    this.dialogPositionId = dialogId;
    if (runInitent) {
      this.dialogPositionId = data?.positionId;
    }
    this.dialogName = data.intentName;
    this.grayoutOldFeedbacks();
    let renderResponse = this.commonService.formatDialogRunRenderResponse(data, uuids, this.dialogPositionId, this.dialogName);
    this.assistResponseArray.push(renderResponse);
    this.assistResponseArray = [...this.assistResponseArray];
    this.rootService.currentPositionId = this.dialogPositionId;
    if (!runInitent) {
      this.commonService.AgentAssist_run_click(data, this.dialogPositionId, this.projConstants.INTENT);
    }
  }

  grayoutOldFeedbacks(){
    this.assistResponseArray.forEach(element => {
      if(element.type == this.renderResponseType.FEEDBACK){
        element.oldFeedback = true;
      }
    });
  }

  //dialog terminate code
  dialogTerminatedOrIntruppted() {
    this.commonService.updateLocalStorageForAssist(false, true);
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

  prepareFeedbackData(feedbackData?) {
    if (this.assistResponseArray) {
      let automation = {
        dropdownHeaderUuids : this.rootService.dropdownHeaderUuids,
        dialogName : this.dialogName,
        dialogPositionId : this.dialogPositionId
      }
      this.assistResponseArray = this.commonService.prepareFeedbackData(this.assistResponseArray, automation, feedbackData);
      this.assistResponseArray = [...this.assistResponseArray];
      this.dialogName = null;
      this.currentRunningStep = null;
    }
  }

  minimizeToggle() {
    this.maxButtonClick.emit(this.maxButton);
  }

  terminateDialog() {
    this.openOffCanvas();
    this.terminateClick = true;
	}

  openOffCanvas(){    
		this.offcanvasService.open(this.canvas, { position: 'bottom', keyboard:false, backdropClass: 'backdrop-off-canvas-terminate', panelClass: 'termincateOffCanvas', backdrop:'static' });
  }

  closeOffCanvas(){
    this.offcanvasService.dismiss();
  }

  summeryModalpopup(data){
    this.summaryText = data;
    this.summaryPopupModal = this.modalService.open(this.summaryPopupContent ,{windowClass: 'modal-full-window-popup', centered: true, backdrop:'static', keyboard:false});
  }

  closeSummaryPopup(){
    this.summaryPopupModal.close();
  }

  handlePopupEvent(popupObject) {
    if (popupObject.type == this.projConstants.TERMINATE) {
      this.terminateClick = popupObject.status;
      if (this.terminateClick) {
        this.terminateClick = false;
        this.commonService.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
      } else if (popupObject.override) {
        this.terminateClick = false;
        this.overModeContinue(true);
        this.rootService.manualAssistOverrideMode = true;
        this.assistResponseArray = this.commonService.removeOrAddOverRideDivForPreviousResponse(this.assistResponseArray,false);
        this.assistResponseArray = [...this.assistResponseArray];
      }
      if(!this.terminateClick){
        this.closeOffCanvas();
      }
    } else if (popupObject.type == this.projConstants.INTERRUPT) {
      this.showSpinner = false;
      this.showInterruptPopup = popupObject.status;
      if (this.showInterruptPopup) {
        this.showInterruptPopup = false;
        // this.dialogTerminatedOrIntruppted();
        this.interruptRun = true;
        this.commonService.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
      } else if (popupObject.runLater) {
        this.showInterruptPopup = false;
        let index = this.interruptDialogList.findIndex(obj => obj.name === this.interruptDialog.name);
        if (index < 0) {
          this.interruptDialog.from = this.projConstants.INTERRUPT;
          this.interruptDialogList.push(this.interruptDialog);
          this.commonService.updateInterruptDialogList(this.interruptDialogList, this.projConstants.ASSIST);
        }
      }
      if(!this.showInterruptPopup){
        this.closeOffCanvas();
      }
    } else if (popupObject.type == this.projConstants.LISTVIEW) {
      this.showListView = popupObject.status;
      if(!this.showListView){
        this.closeOffCanvas();
      }else{
        this.openOffCanvas();
      }
    } else if (popupObject.type == this.projConstants.RESTART) {
      this.showRestart = popupObject.status;
      if(!this.showRestart){
        this.makeOverrideEvent(false)
        this.closeOffCanvas();
      }else{
        this.restartDialogName = this.dialogName;
        this.assistResponseArray[this.assistResponseArray.length - 1].restart = true;
        this.commonService.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
        // if(popupObject.inputType == this.projConstants.STARTOVER){
        // }else if(popupObject.inputType == this.projConstants.RESTART_INPUTS){
        // }
        if(popupObject.entityList.length){
          this.rootService.entitiestValueArray = popupObject.entityList
        }
      }
    } else if (popupObject.type == this.projConstants.SUMMARY) {
      if(popupObject.status){
        this.rootService.activeTab = this.projConstants.ASSIST;
        this.summaryText = popupObject.summaryText || '';
        this.showSummaryPopup = popupObject.status;
        if (popupObject.summary) {
          let message = {
            name: "agentAssist.conversation_summary",
            conversationId: this.connectionDetails.conversationId,
            payload: {
              "summary": [
                {
                  'summary_text': popupObject.editedSummary || '',
                }
              ]
            }
          };
          window.parent.postMessage(message, '*');
        }
      }
      this.closeSummaryPopup();
    }
  }

  restartClickEvent() {
    this.openOffCanvas();
    this.showRestart = true;
    this.overModeContinue(true);
    // this.showSummaryPopup = true;
    // this.modalService.open(this.content);
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
      if(res.type == 'outgoing'){
        res = this.rootService.formatHistoryResonseToNormalRender(res);
        res = this.rootService.confirmationNodeRenderForHistoryDataTransform(res);

        if ((res.suggestions || res.ambiguityList) && res.faqResponse) {
  
          res.suggestions.faqs.forEach(faq => {
            faq.answer = res?.buttons[0]?.value
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
  
        if ((res.suggestions || res.ambiguityList) && !res.faqResponse) {
          renderResponse = this.commonService.formatSuggestionRenderResponse(res, res._id);
          this.assistResponseArray.push(renderResponse);
          this.assistResponseArray = structuredClone(this.assistResponseArray);
        }
  
        if ((!res.suggestions && !res.ambiguityList && !res.ambiguity)) {
          if (res.endOfTask && previousId) {
            let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === currentTaskPositionId);
  
            this.filterAutomationByPositionId();
            this.prepareFeedbackData(previousIdFeedBackDetails);
            this.commonService.automationFlagUpdateForAssist(previousId, false);

            this.commonService.updateOverrideStatusOfAutomation(this.assistResponseArray,previousId);
            previousId = undefined;
            previousTaskName = currentTaskName;
            previousTaskPositionId = currentTaskPositionId;
            currentTaskName = null;
            currentTaskPositionId = null;
          } 

          currentTaskPositionId = res.positionId ? res.positionId : previousTaskPositionId;

          // if(res.positionId){
          //   currentTaskPositionId = res.positionId
          // }else if((res.entityName && res.entityResponse && (res.entityValue || res.userInput)) || res.endOfTask){
          //   // condition is for endoftask small talk should be part of dialogue only.
          //   currentTaskPositionId = previousTaskPositionId;
          // }else if(res.intentName != currentTaskName){
          //   currentTaskPositionId = null;
          // }
  
          // currentTaskPositionId = res.positionId ? res.positionId : ((res.intentName != currentTaskName) ? null : currentTaskPositionId);
          currentTaskName = (res.intentName) ? res.intentName : currentTaskName;
          this.dialogPositionId = currentTaskPositionId;
          this.rootService.currentPositionId = this.dialogPositionId;
          this.dialogName = currentTaskName
          let uuids = this.koreGenerateuuidPipe.transform();          
          
          if (res.intentName && !previousId && previousTaskPositionId !== currentTaskPositionId && !res.endOfTask) {
            // update postionids and dialogue start
  
            let automationUUIDCheck = this.assistResponseArray.findIndex((automation) => {
              if (automation.uuid == res._id) {
                return true;
              }
              return false;
            });
  
            if (automationUUIDCheck == -1) {
              previousId = res._id;
              this.commonService.automationFlagUpdateForAssist(previousId, true);
              previousTaskPositionId = currentTaskPositionId;
              previousTaskName = currentTaskName;
              this.grayoutOldFeedbacks();
              let renderResponse =  this.commonService.formatDialogRunRenderResponse(res, previousId, currentTaskPositionId, currentTaskName);

              this.assistResponseArray.push(renderResponse);
              this.assistResponseArray = [...this.assistResponseArray];
              if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
                this.dialogPositionId = previousTaskPositionId;
                this.rootService.currentPositionId = this.dialogPositionId;
              }
            }
          }
          //process user messages
          // if (res.entityName && res.entityResponse && (res.entityValue || res.userInput)) {
          if(res.entityValue || res.userInput){
            res.userInput = res.userInput ? res.userInput : res.entityValue;
            this.processUserMessagesForHistory(res);
          }
        
          let result: any = this.templateRenderClassService.getResponseUsingTemplate(res,true);
          this.rootService.currentPositionId = currentTaskPositionId;
          let msgStringify = JSON.stringify(result);
          let newTemp = encodeURI(msgStringify);
  
          if (result.message.length > 0) {
            // automation
            if (previousTaskName === currentTaskName && previousTaskPositionId == currentTaskPositionId) {
              let responseId = res?.buttons && res?.buttons[0]?._id ? (res?.buttons && res?.buttons[0]?._id) : uuids;
              renderResponse = this.commonService.formatAutomationRenderResponse(res,responseId, result, newTemp, currentTaskPositionId);
              if (res.isPrompt && !this.proactiveModeStatus) {
                renderResponse.toggleOverride = true;
                renderResponse.hideOverrideDiv = true;
              }
              this.currentRunningStep = res.newEntityDisplayName ? res.newEntityDisplayName : res.newEntityName;
              renderResponse = this.commonService.formatAssistAutomation(renderResponse);
              this.assistResponseArray = this.commonService.formatRunningLastAutomationEntityNode(this.assistResponseArray, res, this.showErrorPrompt, renderResponse, this.rootService.dropdownHeaderUuids, this.projConstants.ASSIST);
              // this.assistResponseArray = this.commonService.updateOverrideStatusOfAutomation(this.assistResponseArray, previousId, renderResponse);
              this.assistResponseArray = structuredClone(this.assistResponseArray);
            } else if ((previousTaskName != currentTaskName)) {
              //small talk after dialogue terminate   
              this.dialogName = null;           
              renderResponse = this.commonService.formatSmallTalkRenderResponse(res, uuids, result, newTemp, previousId)
              this.assistResponseArray.push(renderResponse);
              this.assistResponseArray = [...this.assistResponseArray];
            }
          }
        }
        this.assistResponseArray = this.commonService.processLastEntityNodeForHistory(this.assistResponseArray);
        this.assistResponseArray = structuredClone(this.assistResponseArray);
        // feedback, for tellcustomer as end of node
        if ((resp.length - 1 == index && (!res.entityRequest && !res.entityResponse) && previousTaskPositionId && currentTaskPositionId == previousTaskPositionId)) {
          let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === currentTaskPositionId);
          this.filterAutomationByPositionId();
          this.prepareFeedbackData(previousIdFeedBackDetails);
          this.commonService.automationFlagUpdateForAssist(previousId, false)
          this.commonService.updateOverrideStatusOfAutomation(this.assistResponseArray,previousId);
          previousId = undefined;
          previousTaskName = currentTaskName;
          previousTaskPositionId = currentTaskPositionId;
          currentTaskName = null;
          currentTaskPositionId = null;
        }
      } 
    });    
    this.scrollToBottom();
  }


  viewCustomTempAttachment(){
    this.websocketService.CustomTempClickEvents(this.projConstants.ASSIST, this.connectionDetails)
  }

  dialogueRunClick(dialog, i, flag){
    this.commonService.dialogueRunClick(dialog, i, flag);
  }

  scrollToBottomRuntime = () => {
    if(this.collapseTab?.nativeElement){
      this.collapseTab.nativeElement.classList.add('pB');
      setTimeout(() => {
        try {
          this.collapseTab.nativeElement.scrollTop = this.collapseTab.nativeElement.scrollHeight + 90;
        } catch (err) { }
      }, 0);
    }
  }

  scrollToBottom(){
    if(this.collapseTab?.nativeElement){
      setTimeout(() => {
        this.collapseTab.nativeElement.scrollTop = this.collapseTab.nativeElement.scrollHeight;
      }, 10);
    }
  }
}
