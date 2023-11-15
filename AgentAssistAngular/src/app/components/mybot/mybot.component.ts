import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent {

  @Output() maxMinButtonClick = new EventEmitter();
  @ViewChild('collapseTab', {static: false}) private collapseTab: ElementRef;
  @ViewChild('terminateCanvas', {static : false}) private canvas : ElementRef<HTMLDivElement>

  
  connectionDetails: any = {};
  subs = new SubSink();
  projConstants: any = ProjConstants;
  renderResponseType: any = RenderResponseType;
  maxButton : boolean = false;


  dialogName: string;
  myBotDialogPositionId: string;
  currentRunningStep: string;
  smallTalkUuids : any;

  myBotDropdownHeaderUuids: any;
  mybotResponseArray: any = [];
  myBotDataResponse: any = {};
  terminateClick: boolean = false;

  interruptDialog: any;
  showInterruptPopup: boolean = false;
  interruptDialogList : any = [];
  interruptRun : boolean = false;

  showListView : boolean = false;

  showRestart : boolean = false;

  mybotEmptyState : boolean = true;

  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService,
    private websocketService : WebSocketService, private templateRenderClassService : TemplateRenderClassService,
    private koreGenerateuuidPipe : KoreGenerateuuidPipe, private randomUUIDPipe : RandomUuidPipe,
    private handleSubjectService : HandleSubjectService, private localStorageService : LocalStorageService,
    private offcanvasService: NgbOffcanvas){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  scrollToBottom = () => {
    setTimeout(() => {
      try {
        this.collapseTab.nativeElement.scrollTop = this.collapseTab.nativeElement.scrollHeight;
      } catch (err) {}
    }, 1000);
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
      console.log(runEventObj, 'run event obj **********', this.rootService.isMyBotAutomationOnGoing);
      
      if (runEventObj) {
        if (runEventObj.agentRunButton && !this.rootService.isMyBotAutomationOnGoing) {
          if(runEventObj.from == this.projConstants.INTERRUPT){
            this.interruptDialogList.splice(runEventObj.index, 1);
            this.updateInterruptDialogList();
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
        this.dialogTerminatedOrIntrupptedInMyBot();
        if (this.interruptRun) {
          this.interruptRun = false;
          this.runDialogFormyBotTab(this.interruptDialog);
        }
        this.viewCustomTempAttachment();
      }
    })



  }

  getInterruptDialogList(){
    let appState = this.localStorageService.getLocalStorageState();    
    this.interruptDialogList = appState[this.connectionDetails.conversationId][storageConst.MYBOT_INTERRUPT_DIALOG_LIST]
  }

  updateInterruptDialogList(){
    let storageObject: any = {
      [storageConst.MYBOT_INTERRUPT_DIALOG_LIST]: this.interruptDialogList
    }
    this.localStorageService.setLocalStorageItem(storageObject);    
  }


  processMybotDataResponse(data) {
    data = this.rootService.confirmationNodeRenderDataTransform(data);
    let results: any = this.templateRenderClassService.getResponseUsingTemplate(data, this.rootService.connectionDetails);
    let msgStringify = JSON.stringify(results);
    let newTemp = encodeURI(msgStringify);

    this.rootService.currentPositionIdOfMyBot = this.myBotDialogPositionId;
    let myBotuuids = this.koreGenerateuuidPipe.transform();
    if (this.rootService.isMyBotAutomationOnGoing && data.buttons && !data.value.includes('Customer has waited') && (this.myBotDialogPositionId && !data.positionId || (data.positionId == this.myBotDialogPositionId))) {

      this.myBotDataResponse = {};
      if (data.entityName) {
        this.myBotDataResponse = Object.assign({}, data);
      }

      let renderResponse = {
        data: data,
        type: this.renderResponseType.AUTOMATION,
        uuid: myBotuuids,
        result: results,
        temp: newTemp,
        connectionDetails: this.connectionDetails,
        proactiveModeStatus: false,
        toggleOverride: data.isPrompt ? true : false,
        responseType: this.renderResponseType.ASSISTRESPONSE,
        hideOverrideDiv: true,
        errorCount: 0,
        value : data?.buttons[0]?.value
      }

      this.currentRunningStep = data.entityDisplayName ? data.entityDisplayName : data.entityName;

      this.mybotResponseArray.map(arrEle => {
        if (arrEle.uuid && arrEle.uuid == this.myBotDropdownHeaderUuids && arrEle.type == this.renderResponseType.AUTOMATION) {
          arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
          if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
            arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].disableInput = data.isErrorPrompt ? false : true;
            if (data.isErrorPrompt) {
              arrEle.automationsArray[arrEle.automationsArray.length - 1].errorCount += 1;
            } else {
              arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
            }
          } else {
            arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
          }

        }
      });

      this.mybotResponseArray = structuredClone(this.mybotResponseArray);    
    }

    if (!this.rootService.isMyBotAutomationOnGoing && this.myBotDropdownHeaderUuids && data.buttons && (this.myBotDialogPositionId && !data.positionId || data.positionId == this.myBotDialogPositionId)) {

      let renderResponse: any = {
        data: data,
        type: this.renderResponseType.SMALLTALK,
        uuid: myBotuuids,
        result: results,
        temp: newTemp,
        connectionDetails: this.connectionDetails,
        proactiveModeStatus: false,
        title: data.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
        isTemplateRender: this.smallTalkTemplateRenderCheck(data, results),
        value: data?.buttons[0]?.value,
        sendData: results?.parsedPayload ? newTemp : data?.buttons[0]?.value,
        dialogId: this.myBotDialogPositionId,
        responseType: this.renderResponseType.ASSISTRESPONSE,
        hideOverrideDiv: true,
        toggleOverride: data.isPrompt ? true : false
      }
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
    this.scrollToBottom();
  }

  runDialogFormyBotTab(data) {
    this.mybotEmptyState = false;
    this.myBotDialogPositionId = data.positionId;
    this.rootService.currentPositionIdOfMyBot = this.myBotDialogPositionId;
    this.rootService.isMyBotAutomationOnGoing = true;
    let agentBotuuids = this.randomUUIDPipe.transform();
    this.myBotDropdownHeaderUuids = agentBotuuids;
    let storageObject: any = {
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT]: this.rootService.isMyBotAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);

    let renderResponse = {
      data: data,
      type: this.renderResponseType.AUTOMATION,
      uuid: this.myBotDropdownHeaderUuids,
      dialogId: this.myBotDialogPositionId,
      dialogName: this.dialogName,
      connectionDetails: this.connectionDetails,
      showAutomation: true
    }
    this.mybotResponseArray.push(renderResponse);
    this.mybotResponseArray = [...this.mybotResponseArray];
    this.mybot_run_click(data, true)
  }

  openOffCanvas(){
    console.log("open off canvas");
    
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
        this.mybot_run_click({ intentName: this.projConstants.DISCARD_ALL }, true)
      } 
      if(!this.terminateClick){
        this.closeOffCanvas();
      }
    } else if (popupObject.type == this.projConstants.INTERRUPT) {
      this.showInterruptPopup = popupObject.status;
      if (this.showInterruptPopup) {
        this.showInterruptPopup = false;
        // this.dialogTerminatedOrIntruppted();
        this.interruptRun = true;
        this.mybot_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.myBotDialogPositionId)
      } else if (popupObject.runLater) {
        this.showInterruptPopup = false;
        let index = this.interruptDialogList.findIndex(obj => obj.name === this.interruptDialog.name);
        if (index < 0) {
          this.interruptDialogList.push(this.interruptDialog);
          this.updateInterruptDialogList();
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
    }
  }

  mybot_run_click(dialog, intent?) {
    if (dialog) {
      this.dialogName = dialog.intentName;
      let connectionDetails: any = Object.assign({}, this.connectionDetails);
      connectionDetails.value = dialog.intentName;
      connectionDetails.isSearch = false;
      connectionDetails.positionId = this.myBotDialogPositionId;
      connectionDetails.childBotName = this.rootService?.childBotDetails.childBotName;
      connectionDetails.childBotId = this.rootService?.childBotDetails.childBotId;
      if (this.connectionDetails?.interactiveLanguage && typeof this.connectionDetails?.interactiveLanguage == 'string' && this.connectionDetails?.interactiveLanguage != "''") {
        connectionDetails['language'] = this.connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
      }
      if (intent) {
        connectionDetails.intentName = dialog.intentName;
        connectionDetails.childBotName = this.rootService.childBotDetails.childBotName;
      connectionDetails.childBotId = this.rootService.childBotDetails.childBotId;
      }
      let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
      this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    }
  }

  dialogTerminatedOrIntrupptedInMyBot() {
    this.rootService.isMyBotAutomationOnGoing = false;
    let storageObject: any = {
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT]: this.rootService.isMyBotAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
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
    this.dialogName = null;
    let renderResponse: any = {
      type: this.renderResponseType.FEEDBACK,
      uuid: this.myBotDropdownHeaderUuids,
      connectionDetails: this.connectionDetails,
      dialogName: this.dialogName,
      dialogPositionId: this.myBotDialogPositionId,
      // userIntentInput: this.rootService.userIntentInput,
      submitForm: feedbackData?.feedback ? true : false,
      feedback: feedbackData?.feedback ? feedbackData.feedback : '',
      feedbackDetails: feedbackData?.feedbackDetails?.length ? feedbackData.feedbackDetails : []
    }

    this.mybotResponseArray.push(renderResponse);
    this.mybotResponseArray = [...this.mybotResponseArray];
  }


  smallTalkTemplateRenderCheck(data, results) {
    if (results.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))) {
      return true;
    }
    return false;
  }

  restartClickEvent(){
    this.showRestart = true;
  }

  terminateDialog() {
    this.openOffCanvas();
    this.terminateClick = true;
  }

  getmybotData(params) {
    let feedback = this.mybotFeedback(params);
    let history = this.mybotHistory(params);
    this.handleSubjectService.setLoader(true);
    forkJoin([feedback, history]).pipe(finalize(()=> {this.handleSubjectService.setLoader(false)})).subscribe(res => {
      console.log(res, "feedback");
      let feedbackData = res[0]?.results || [];
      let historyData = res[1] || [];
      // let historyData = this.rootService.getMockData();
      this.renderHistoryMessages(historyData, feedbackData);
    });
  }

  mybotHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.mybotHistorySA' : 'get.mybotHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { historyAPiCall: 'true', botId : botId }, params.agentassisturl)
  }

  mybotFeedback(params) {
    return this.serviceInvoker.invoke('get.mybotFeedback', { tab: 'mybot', conversationId: params.conversationId }, {}, {botId : params.botId }, params.agentassisturl);
  }

  minMaxButtonClick(){
    console.log("min max button click");
    this.maxButton = !this.maxButton;
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

      res = this.rootService.confirmationNodeRenderForHistoryDataTransform(res);
      res = this.rootService.formatHistoryResonseToNormalRender(res);
      // this.removeOrAddOverRideDivForPreviousResponse(true);


      if ((!res.suggestions && !res.ambiguityList && !res.ambiguity) && res.type == 'outgoing') {
        
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
        }

        currentTaskPositionId = res.positionId ? res.positionId :  ((res.intentName != currentTaskName) ? null : currentTaskPositionId);
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
            this.mybotResponseArray.push(renderResponse);
            this.mybotResponseArray = [...this.mybotResponseArray];

            if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
              this.myBotDialogPositionId = previousTaskPositionId;
              this.rootService.currentPositionId = this.myBotDialogPositionId;
            }
            
          }
        }
        

        //process user messages
        if (res.entityName && res.entityResponse && (res.entityValue || res.userInput)) {
             res.userInput = res.userInput ? res.userInput : res.entityValue;
             this.processUserMessagesForHistory(res);
        }
       
        if (res.entityName) {
          this.myBotDataResponse = Object.assign({}, res);
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
              toggleOverride: false,
              responseType: this.renderResponseType.ASSISTRESPONSE,
              value : res?.components[0]?.data?.text,
            }

            if (res.isPrompt) {
              renderResponse.toggleOverride = false;
              renderResponse.hideOverrideDiv = false;
            }

            this.mybotResponseArray.map(arrEle => {
              if (arrEle.uuid && arrEle.uuid == previousId) {
                arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
                if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
                  arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
                  arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
                }
                arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
              }
            });

            this.mybotResponseArray = structuredClone(this.mybotResponseArray);

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
              toggleOverride: false,
              title: res.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
              isTemplateRender: this.smallTalkTemplateRenderCheck(res, result),
              value: res?.components[0]?.data?.text,
              sendData: result?.parsedPayload ? newTemp : res?.components[0]?.data?.text,
              responseType: this.renderResponseType.ASSISTRESPONSE
            }
            renderResponse.template = this.rootService.getTemplateHtml(renderResponse.isTemplateRender, result);

            this.mybotResponseArray.push(renderResponse);
            this.mybotResponseArray = [...this.mybotResponseArray];
          }
        }
      } 
      
      this.processLastEntityNodeForHistory();

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
    this.scrollToBottom();
  }

  processUserMessagesForHistory(data) {    
    if (this.mybotResponseArray?.length >= 1 && this.mybotResponseArray[this.mybotResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
      && this.mybotResponseArray[this.mybotResponseArray.length - 1]?.data?.isPrompt) {
      if (data.userInput) {
        this.mybotResponseArray[this.mybotResponseArray.length - 1].entityValue = data.userInput;
      }
    } else if (this.mybotResponseArray?.length >= 1) {
      this.mybotResponseArray.map(arrEle => {
        if (arrEle.uuid && arrEle.uuid == this.myBotDropdownHeaderUuids) {
          arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
          if (data.userInput && arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
            arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
            arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
            if (data.userInput) {
              arrEle.automationsArray[arrEle.automationsArray.length - 1].entityValue = data.userInput;
              arrEle.automationsArray[arrEle.automationsArray.length - 1].userInput = ProjConstants.YES;
            }
          }
          arrEle.automationsArray = [...arrEle.automationsArray];
        }
      });
    }
    this.mybotResponseArray = structuredClone(this.mybotResponseArray);
  }

  processLastEntityNodeForHistory(){
    if (this.mybotResponseArray.length >=1) {
      this.mybotResponseArray.map((arrEle, actualarrayIndex) => {
        if (arrEle.uuid && arrEle?.automationsArray?.length) {
            arrEle?.automationsArray.forEach((element, index) => {
              if((index !== arrEle.automationsArray.length - 1) || (actualarrayIndex > 0 && actualarrayIndex != this.mybotResponseArray.length -1)){
                element.disableInput = true;
              }
            });
          arrEle.automationsArray = [...arrEle.automationsArray];
        }else if(arrEle.type == this.projConstants.SMALLTALK && actualarrayIndex != this.mybotResponseArray.length){
          arrEle.disableInput = true;
        }
      });
    }
    this.mybotResponseArray = structuredClone(this.mybotResponseArray);
  }
  

  automationFlagUpdateForSmallTalk(previousId, flag){
    this.smallTalkUuids = flag ? previousId : null;
  }


  automationFlagUpdate(previousId, flag) {
    if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
      this.rootService.isMyBotAutomationOnGoing = flag;
      this.myBotDropdownHeaderUuids = previousId;
      let storageObject: any = {
        [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.rootService.isMyBotAutomationOnGoing
      }
      this.localStorageService.setLocalStorageItem(storageObject);
    }
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

  viewCustomTempAttachment(){
    this.websocketService.CustomTempClickEvents(this.projConstants.MYBOT, this.connectionDetails)
  }




}
