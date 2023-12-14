import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { forkJoin } from 'rxjs';
import { SubSink } from 'subsink';
import { ProjConstants, RenderResponseType, storageConst } from 'src/app/proj.const';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { TemplateRenderClassService } from 'src/app/services/template-render-class.service';
import { KoreGenerateuuidPipe } from 'src/app/pipes/kore-generateuuid.pipe';
import { RandomUuidPipe } from 'src/app/pipes/random-uuid.pipe';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EVENTS } from 'src/app/helpers/events';
import { finalize} from 'rxjs/operators';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent {

  @Input() maxButton;
  @Output() maxMinButtonClick = new EventEmitter();
  @ViewChild('collapseTab', {static: false}) private collapseTab: ElementRef;
  @ViewChild('terminateCanvas', {static : false}) private canvas : ElementRef<HTMLDivElement>;

  
  connectionDetails: any = {};
  subs = new SubSink();
  projConstants: any = ProjConstants;
  renderResponseType: any = RenderResponseType;


  dialogName: string;
  myBotDialogPositionId: string;
  currentRunningStep: string;

  myBotDropdownHeaderUuids: any;
  mybotResponseArray: any = [];
  myBotDataResponse: any = {};
  terminateClick: boolean = false;

  interruptDialog: any;
  showInterruptPopup: boolean = false;
  interruptDialogList : any = [];
  interruptRun : boolean = false;
  restartDialogName : any;
  restartEntityList : any;

  showListView : boolean = false;

  showRestart : boolean = false;

  mybotEmptyState : boolean = true;
  showErrorPrompt : boolean = false;
  showSpinner : boolean = false;

  assistRespType(index, respType) {
    return respType?.data?._id;
  };

  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService,
    private websocketService : WebSocketService, private templateRenderClassService : TemplateRenderClassService,
    private koreGenerateuuidPipe : KoreGenerateuuidPipe, private randomUUIDPipe : RandomUuidPipe,
    private handleSubjectService : HandleSubjectService, private localStorageService : LocalStorageService,
    private offcanvasService: NgbOffcanvas, private commonService : CommonService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  scrollToBottomRuntime = () => {
    this.collapseTab.nativeElement.classList.add('pB');
    setTimeout(() => {
      try {
        this.collapseTab.nativeElement.scrollTop = this.collapseTab.nativeElement.scrollHeight + 90;
      } catch (err) { }
    }, 0);
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.collapseTab.nativeElement.scrollTop = this.collapseTab.nativeElement.scrollHeight;
      } catch (err) { }
    }, 10);
  }

  subscribeEvents(){
    
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.getmybotData(this.connectionDetails);
        this.getInterruptDialogList();
      }
    });

    this.subs.sink = this.websocketService.agentAssistAgentResponse$.subscribe((response: any) => {
      if (response && !response.isSearch) {
        this.processMybotDataResponse(response);
        this.viewCustomTempAttachment();
      }
    });

    this.subs.sink = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {      
      if (runEventObj) {
        if(runEventObj.agentRunButton){
          this.spinnerUpdate();
        }
        if (runEventObj.agentRunButton && !this.rootService.isMyBotAutomationOnGoing) {
          if(runEventObj.from == this.projConstants.INTERRUPT){
            this.interruptDialogList.splice(runEventObj.index, 1);
            this.commonService.updateInterruptDialogList(this.interruptDialogList, this.projConstants.MYBOT)
          }
          this.runDialogFormyBotTab(runEventObj);
        } else if (runEventObj.agentRunButton && this.rootService.isMyBotAutomationOnGoing) {
          this.interruptDialog = runEventObj;
          this.showInterruptPopup = true;
          this.openOffCanvas();
        }
      }
    });

    this.subs.sink = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {
      if (endoftaskresponse && (endoftaskresponse.intType == 'myBot' || endoftaskresponse.positionId === this.myBotDialogPositionId)) {
        if(this.showListView){
          this.handlePopupEvent({type : this.projConstants.LISTVIEW, status : false});
        }
        this.dialogTerminatedOrIntrupptedInMyBot();
        if (this.interruptRun) {
          this.interruptRun = false;
          let index = this.interruptDialogList.findIndex(obj => obj.name === this.interruptDialog.name);
          index = index < 0 ? 0 : index;
          this.commonService.dialogueRunClick(this.interruptDialog,index, true)
        }
        if(this.showRestart){
          this.handlePopupEvent({type : this.projConstants.RESTART, status : false});
          this.commonService.restartDialogueRunClick(this.restartDialogName, true);
          this.restartDialogName = null;
          this.showRestart = false;
        }
        this.viewCustomTempAttachment();
      }
    });

    this.subs.sink = this.rootService.activeTab$.subscribe(tab => {
      if(tab == ProjConstants.MYBOT){
        this.scrollToBottom();
      }
    });

  }

  spinnerUpdate(){
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 10000);
  }

  getInterruptDialogList(){
    let appState = this.localStorageService.getLocalStorageState();    
    this.interruptDialogList = appState[this.connectionDetails.conversationId][storageConst.MYBOT_INTERRUPT_DIALOG_LIST]
  }


  processMybotDataResponse(data) {
    data = this.rootService.confirmationNodeRenderDataTransform(data);
    let results: any = this.templateRenderClassService.getResponseUsingTemplate(data);
    let msgStringify = JSON.stringify(results);
    let newTemp = encodeURI(msgStringify);

    this.rootService.currentPositionIdOfMyBot = this.myBotDialogPositionId;
    let myBotuuids = this.koreGenerateuuidPipe.transform();
    //automation
    if (this.rootService.isMyBotAutomationOnGoing && data.buttons && !data.value.includes('Customer has waited') && (this.myBotDialogPositionId && !data.positionId || (data.positionId == this.myBotDialogPositionId))) {
      this.showSpinner = false;
      this.myBotDataResponse = {};
      if (data.entityName) {
        this.myBotDataResponse = Object.assign({}, data);
      }
      let renderResponse : any = this.commonService.formatAutomationRenderResponse(data, myBotuuids, results, newTemp, this.myBotDialogPositionId);
      renderResponse.toggleOverride = data.isPrompt ? true : false;
      renderResponse.hideOverrideDiv =  true;
      this.currentRunningStep = data.entityDisplayName ? data.entityDisplayName : data.entityName;
      let previousEntityNodes = this.commonService.getPreviousEntityNodesAndValues(this.mybotResponseArray,data);
      this.showErrorPrompt = data.isErrorPrompt ? true : false;
      renderResponse = this.commonService.formatAssistAutomation(renderResponse);
      this.mybotResponseArray = this.commonService.formatRunningLastAutomationEntityNode(this.mybotResponseArray, data, this.showErrorPrompt, renderResponse, this.rootService.myBotDropdownHeaderUuids, this.projConstants.MYBOT, previousEntityNodes)
      this.mybotResponseArray = structuredClone(this.mybotResponseArray);
    }

    //small talk
    if (!this.rootService.isMyBotAutomationOnGoing && this.rootService.myBotDropdownHeaderUuids && data.buttons && (this.myBotDialogPositionId && !data.positionId || data.positionId == this.myBotDialogPositionId)) {
      let renderResponse = this.commonService.formatSmallTalkRenderResponse(data, myBotuuids, results, newTemp, this.myBotDialogPositionId);
      renderResponse.hideOverrideDiv = true;
      renderResponse.toggleOverride = data.isPrompt ? true : false;
      renderResponse.template = this.rootService.getTemplateHtml(renderResponse.isTemplateRender, results);

      if (this.mybotResponseArray?.length > 1 && this.mybotResponseArray[this.mybotResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
        && this.mybotResponseArray[this.mybotResponseArray.length - 1]?.data?.isPrompt) {
        this.mybotResponseArray[this.mybotResponseArray.length - 1].toggleOverride = false;
      }

      this.mybotResponseArray.push(renderResponse);
      this.mybotResponseArray = [...this.mybotResponseArray];
      // this.rootService.isMyBotAgentSentRequestOnClick = false;
      setTimeout(() => {
        if (data.entityName) {
          this.myBotDataResponse = {};
          this.myBotDataResponse = Object.assign({}, data);
        }
      }, 10);
    }

    if(this.rootService.isMyBotAgentSentRequestOnClick){
      this.rootService.setMyBotTemplateClick(false);
    }

    this.scrollToBottomRuntime();
  }

  runDialogFormyBotTab(data) {
    this.mybotEmptyState = false;
    this.myBotDialogPositionId = data.positionId;
    this.rootService.currentPositionIdOfMyBot = this.myBotDialogPositionId;
    let agentBotuuids = this.randomUUIDPipe.transform();
    this.rootService.myBotDropdownHeaderUuids = agentBotuuids;
    this.commonService.updateLocalStorageForMyBot(true);
    this.grayoutOldFeedbacks();
    let renderResponse = this.commonService.formatDialogRunRenderResponse(data, this.rootService.myBotDropdownHeaderUuids, this.myBotDialogPositionId, this.dialogName);
    this.mybotResponseArray.push(renderResponse);
    this.mybotResponseArray = [...this.mybotResponseArray];
    this.dialogName = data.intentName;
    this.commonService.mybot_run_click(data, this.myBotDialogPositionId, true)
  }

  openOffCanvas(){
		this.offcanvasService.open(this.canvas, { position: 'bottom', keyboard:false, backdropClass: 'backdrop-off-canvas-terminate', panelClass: 'termincateOffCanvas', backdrop:'static' });
  }

  closeOffCanvas(){
    this.offcanvasService.dismiss();
  }


  handlePopupEvent(popupObject) {
    if (popupObject.type == this.projConstants.TERMINATE) {
      this.terminateClick = popupObject.status;
      if (this.terminateClick) {
        this.terminateClick = false;
        this.commonService.mybot_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.myBotDialogPositionId)
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
        this.commonService.mybot_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.myBotDialogPositionId)
      } else if (popupObject.runLater) {
        this.showInterruptPopup = false;
        let index = this.interruptDialogList.findIndex(obj => obj.name === this.interruptDialog.name);
        if (index < 0) {
          this.interruptDialog.from = this.projConstants.INTERRUPT;
          this.interruptDialogList.push(this.interruptDialog);
          this.commonService.updateInterruptDialogList(this.interruptDialogList, this.projConstants.MYBOT)
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
        this.closeOffCanvas();
      }else{
        this.mybotResponseArray[this.mybotResponseArray.length - 1].restart = true;
        this.restartDialogName = this.dialogName;
        this.commonService.mybot_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.myBotDialogPositionId, true)
        // if(popupObject.inputType == this.projConstants.STARTOVER){
        // }else if(popupObject.inputType == this.projConstants.RESTART_INPUTS){
        // }
        if(popupObject.entityList.length){
          this.rootService.mybotEntitiestValueArray = popupObject.entityList
        }
      }
    }
  }

  dialogTerminatedOrIntrupptedInMyBot() {
    this.commonService.updateLocalStorageForMyBot(false);
    if (this.myBotDialogPositionId) {
      this.filterAutomationByPositionId();
      this.prepareFeedbackData();
    }
  }

  filterAutomationByPositionId() {
    this.mybotResponseArray.map(arrEle => {
      if (arrEle.dialogId && arrEle.dialogId == this.myBotDialogPositionId) {
        arrEle.endAutomation = true;
      }
    });
    this.mybotResponseArray = structuredClone(this.mybotResponseArray);
  }

  prepareFeedbackData(feedbackData?) {
    if (this.mybotResponseArray) {
      let automation = {
        dropdownHeaderUuids : this.rootService.myBotDropdownHeaderUuids,
        dialogName : this.dialogName,
        dialogPositionId : this.myBotDialogPositionId
      }
      this.mybotResponseArray = this.commonService.prepareFeedbackData(this.mybotResponseArray, automation, feedbackData);
      this.mybotResponseArray = [...this.mybotResponseArray];
      this.dialogName = null;
      this.currentRunningStep = null;
    }
  }


  smallTalkTemplateRenderCheck(data, results) {
    if (results.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))) {
      return true;
    }
    return false;
  }

  restartClickEvent() {
    this.openOffCanvas();
    this.showRestart = true;
  }

  terminateDialog() {
    this.openOffCanvas();
    this.terminateClick = true;
  }

  getmybotData(params) {
    let feedback = this.commonService.mybotFeedback(params);
    let history = this.commonService.mybotHistory(params);
    this.handleSubjectService.setLoader(true);
    forkJoin([feedback, history]).pipe(finalize(()=> {this.showSpinner = false})).subscribe(res => {
      let feedbackData = res[0]?.results || [];
      let historyData = res[1] || [];
      // let historyData = this.rootService.getMockData();
      this.renderHistoryMessages(historyData, feedbackData);
    });
  }

  minMaxButtonClick(){
    // this.maxButton = !this.maxButton;
    this.maxMinButtonClick.emit(true);
  }

  updateFeedbackProperties(data, index) {
    this.mybotResponseArray[index] = data;
  }

  renderHistoryMessages(response, feedBackResult) {

    let previousId;
    let previousTaskPositionId, currentTaskPositionId, currentTaskName, previousTaskName;
    let resp = response.length > 0 ? response : undefined;
    let renderResponse: any = {};

    resp = this.rootService.formatHistoryResponseForFAQ(resp);
    resp?.forEach((res, index) => {

      res = this.rootService.formatHistoryResonseToNormalRender(res);
      res = this.rootService.confirmationNodeRenderForHistoryDataTransform(res);
      // this.removeOrAddOverRideDivForPreviousResponse(true);


      if ((!res.suggestions && !res.ambiguityList && !res.ambiguity) && res.type == 'outgoing') {
        
        if(res.endOfTask && previousId){                  
          let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === currentTaskPositionId);
          
          this.filterAutomationByPositionId();
          this.prepareFeedbackData(previousIdFeedBackDetails);
          this.commonService.automationFlagUpdateForMybot(previousId,false);

          this.updateOverrideStatusOfAutomation(previousId);
          previousId = undefined;
          previousTaskName = currentTaskName;
          previousTaskPositionId = currentTaskPositionId;
          currentTaskName = null;
          currentTaskPositionId = null;
        }

        currentTaskPositionId = res.positionId ? res.positionId : previousTaskPositionId;
        // currentTaskPositionId = res.positionId ? res.positionId :  ((res.intentName != currentTaskName) ? null : currentTaskPositionId);
        currentTaskName = (res.intentName) ? res.intentName : currentTaskName;
        this.myBotDialogPositionId = currentTaskPositionId;
        this.rootService.currentPositionId = this.myBotDialogPositionId;
        this.dialogName = currentTaskName
        let uuids = this.koreGenerateuuidPipe.transform();
        
        if (res.intentName && !previousId && previousTaskPositionId !== currentTaskPositionId && !res.endOfTask) {
          // update postionids and dialogue start
          
          let automationUUIDCheck = this.mybotResponseArray.findIndex((automation) => {
            if (automation.uuid == res._id) {
              return true;
            }
            return false;
          });
          // previousTaskPositionId = currentTaskPositionId;
          // previousTaskName = currentTaskName;

          if (automationUUIDCheck == -1) {
            previousId = res._id;
            this.commonService.automationFlagUpdateForMybot(previousId,true);
            previousTaskPositionId = currentTaskPositionId;
            previousTaskName = currentTaskName;
            this.grayoutOldFeedbacks();
            let renderResponse =  this.commonService.formatDialogRunRenderResponse(res, previousId, currentTaskPositionId, currentTaskName);
            this.mybotResponseArray.push(renderResponse);
            this.mybotResponseArray = [...this.mybotResponseArray];

            if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
              this.myBotDialogPositionId = previousTaskPositionId;
              this.rootService.currentPositionId = this.myBotDialogPositionId;
            }
          }
        }

        //process user messages
        // if (res.entityName && res.entityResponse && (res.entityValue || res.userInput)) {
        if(res.entityValue || res.userInput){
            res.userInput = res.userInput ? res.userInput : res.entityValue;
            this.processUserMessagesForHistory(res);
        }
      
        if (res.entityName) {
          this.myBotDataResponse = Object.assign({}, res);
        }
        
        let result: any = this.templateRenderClassService.getResponseUsingTemplate(res);
        this.rootService.currentPositionId = currentTaskPositionId;
        let msgStringify = JSON.stringify(result);
        let newTemp = encodeURI(msgStringify);
        
        if (result.message.length > 0) {
          // automation
          
          if (previousTaskName === currentTaskName && previousTaskPositionId == currentTaskPositionId) {
            let responseId = res.buttons && res.buttons[0]?._id ? (res.buttons && res.buttons[0]?._id) : uuids
            renderResponse = this.commonService.formatAutomationRenderResponse(res,responseId, result, newTemp, currentTaskPositionId);
            if (res.isPrompt) {
              renderResponse.toggleOverride = false;
              renderResponse.hideOverrideDiv = true;
            }
            renderResponse = this.commonService.formatAssistAutomation(renderResponse);
            this.mybotResponseArray = this.commonService.formatRunningLastAutomationEntityNode(this.mybotResponseArray, res, this.showErrorPrompt, renderResponse, this.rootService.myBotDropdownHeaderUuids, this.projConstants.MYBOT);

            // this.mybotResponseArray = this.commonService.updateOverrideStatusOfAutomation(this.mybotResponseArray, previousId, renderResponse);
            this.mybotResponseArray = structuredClone(this.mybotResponseArray);

          }else if((previousTaskName != currentTaskName)){
          //small talk after dialogue terminate
            this.dialogName = null;
            renderResponse = this.commonService.formatSmallTalkRenderResponse(res, uuids, result, newTemp, previousId)
            this.mybotResponseArray.push(renderResponse);
            this.mybotResponseArray = [...this.mybotResponseArray];
          }
        }
      } 

      this.mybotResponseArray = this.commonService.processLastEntityNodeForHistory(this.mybotResponseArray);
      this.mybotResponseArray = structuredClone(this.mybotResponseArray);


      // feedback, for tellcustomer as end of node
      if ((resp.length - 1 == index && (!res.entityRequest && !res.entityResponse) && previousTaskPositionId && currentTaskPositionId == previousTaskPositionId)) {
        let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === currentTaskPositionId);
        this.filterAutomationByPositionId();
        this.prepareFeedbackData(previousIdFeedBackDetails);
        this.commonService.automationFlagUpdateForMybot(previousId,false)
        this.updateOverrideStatusOfAutomation(previousId);
        previousId = undefined;
        previousTaskName = currentTaskName;
        previousTaskPositionId = currentTaskPositionId;
        currentTaskName = null;
        currentTaskPositionId = null;
      }

    });
    this.scrollToBottom();
  }

  grayoutOldFeedbacks(){
    this.mybotResponseArray.forEach(element => {
      if(element.type == this.renderResponseType.FEEDBACK){
        element.oldFeedback = true;
      }
    });
  }

  processUserMessagesForHistory(data) { 
    console.log(this.mybotResponseArray, "mybot response array ***********");
       
    if (this.mybotResponseArray?.length >= 1 && this.mybotResponseArray[this.mybotResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
      && this.mybotResponseArray[this.mybotResponseArray.length - 1]?.data?.isPrompt) {
      this.mybotResponseArray = this.commonService.processUserMessagesForSmalltalk(data, this.mybotResponseArray, true, false, 'history');
    } else if (this.mybotResponseArray?.length >= 1) {
      this.showErrorPrompt = data.isErrorPrompt ? true : false;
      this.mybotResponseArray = this.commonService.processUserMessagesForAutomation(data, this.mybotResponseArray, true, false, this.showErrorPrompt, this.rootService.myBotDropdownHeaderUuids);
      this.mybotResponseArray = structuredClone(this.mybotResponseArray);
    }
    this.mybotResponseArray = structuredClone(this.mybotResponseArray);
  }
  


  updateOverrideStatusOfAutomation(previousId) {
    this.mybotResponseArray.map(arrEle => {
      if (arrEle.uuid && arrEle.uuid == previousId) {
        arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
        if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
          arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
          arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
        }
      }
    });
    this.mybotResponseArray = structuredClone(this.mybotResponseArray);
  }

  viewCustomTempAttachment(){
    this.websocketService.CustomTempClickEvents(this.projConstants.MYBOT, this.connectionDetails)
  }

  dialogueRunClick(dialog, i, flag){
    this.commonService.dialogueRunClick(dialog, i, flag);
  }

}
