import { Component, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent {

  @Output() maxMinButtonClick = new EventEmitter();
  
  connectionDetails: any = {};
  loader: boolean = false;
  subs = new SubSink();
  projConstants: any = ProjConstants;
  renderResponseType: any = RenderResponseType;
  maxButton : boolean = false;


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

  showListView : boolean = false;

  showRestart : boolean = false;

  mybotEmptyState : boolean = true;

  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService,
    private websocketService : WebSocketService, private templateRenderClassService : TemplateRenderClassService,
    private koreGenerateuuidPipe : KoreGenerateuuidPipe, private randomUUIDPipe : RandomUuidPipe,
    private handleSubjectService : HandleSubjectService, private localStorageService : LocalStorageService){

  }

  ngOnInit(): void {
    
    this.subscribeEvents();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
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
        // this.viewCustomTempAttachment();
      }
    });

    this.subs.sink = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {
      console.log(runEventObj, 'run event obj **********', this.rootService.isMyBotAutomationOnGoing);
      
      if (runEventObj) {
        if (runEventObj.agentRunButton && !this.rootService.isMyBotAutomationOnGoing) {
          this.runDialogFormyBotTab(runEventObj);
        } else if (runEventObj.agentRunButton && this.rootService.isMyBotAutomationOnGoing) {
          this.interruptDialog = runEventObj;
          this.showInterruptPopup = true;
        }
      }
    });

    this.subs.sink = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {
      if (endoftaskresponse && (endoftaskresponse.intType == 'myBot' || endoftaskresponse.positionId === this.myBotDialogPositionId)) {
        this.dialogTerminatedOrIntrupptedInMyBot();
        // this.viewCustomTempAttachment();
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
      
      // if (this.rootService.isMybotInputResponseClick) {
      //   let entityDisplayName = this.myBotDataResponse.entityDisplayName ? this.myBotDataResponse.entityDisplayName : this.myBotDataResponse.entityName;
      //   let renderResponse = {
      //     uuid: this.randomUUIDPipe.transform(),
      //     data: data,
      //     type: this.renderResponseType.AUTOMATION,
      //     connectionDetails: this.connectionDetails,
      //     proactiveModeStatus: false,
      //     responseType: this.renderResponseType.USERMSG,
      //     titleText: 'YouEntered -',
      //     entityDisplayName: entityDisplayName,
      //     noTemplateRender: true,
      //     hideOverrideDiv: true
      //   }

      //   this.mybotResponseArray.map(arrEle => {

      //     if (arrEle.uuid && arrEle.uuid == this.myBotDropdownHeaderUuids) {

      //       arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
      //       if (arrEle.automationsArray[arrEle.automationsArray.length - 1] && arrEle.automationsArray[arrEle.automationsArray.length - 1]?.data?.isPrompt) {
      //         arrEle.automationsArray[arrEle.automationsArray.length - 1].hideOverrideDiv = true;
      //         arrEle.automationsArray[arrEle.automationsArray.length - 1].toggleOverride = false;
      //       }
      //       arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
      //     }
      //   });
      //   this.mybotResponseArray = structuredClone(this.mybotResponseArray)
      //   this.rootService.isMybotInputResponseClick = false;
      // }

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

      console.log(this.mybotResponseArray, 'mybot response array');
      


      // if (this.rootService.isMyBotAgentSentRequestOnClick && !this.myBotDropdownHeaderUuids) {
      //   let renderResponse: any = {
      //     data: data,
      //     type: this.renderResponseType.SMALLTALK,
      //     uuid: myBotuuids,
      //     result: results,
      //     temp: newTemp,
      //     connectionDetails: this.connectionDetails,
      //     proactiveModeStatus: false,
      //     title: data.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
      //     isTemplateRender: this.smallTalkTemplateRenderCheck(data, results),
      //     value: data?.buttons[0]?.value,
      //     sendData: results?.parsedPayload ? newTemp : data?.buttons[0]?.value,
      //     dialogId: this.myBotDialogPositionId,
      //     responseType: this.renderResponseType.ASSISTRESPONSE,
      //     hideOverrideDiv: true,
      //     toggleOverride: data.isPrompt ? true : false,
      //   }
      //   renderResponse.template = this.rootService.getTemplateHtml(renderResponse.isTemplateRender, results);

      //   if (this.mybotResponseArray?.length > 1 && this.mybotResponseArray[this.mybotResponseArray.length - 1]?.type == this.renderResponseType.SMALLTALK
      //     && this.mybotResponseArray[this.mybotResponseArray.length - 1]?.data?.isPrompt) {
      //     this.mybotResponseArray[this.mybotResponseArray.length - 1].toggleOverride = false;
      //   }

      //   this.mybotResponseArray.push(renderResponse);
      //   this.mybotResponseArray = [...this.mybotResponseArray];
      //   this.rootService.isMyBotAgentSentRequestOnClick = false;
      //   setTimeout(() => {
      //     if (data.entityName) {
      //       this.myBotDataResponse = {};
      //       this.myBotDataResponse = Object.assign({}, data);
      //     }
      //   }, 10);
      // }
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
      // renderResponse.template = this.rootService.getTemplateHtml(renderResponse.isTemplateRender, results);

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
  }

  runDialogFormyBotTab(data) {
    this.mybotEmptyState = false;
    this.myBotDialogPositionId = data.positionId;
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

  handlePopupEvent(popupObject) {
    if (popupObject.type == this.projConstants.TERMINATE) {
      this.terminateClick = popupObject.status;
      if (this.terminateClick) {
        this.terminateClick = false;
        this.mybot_run_click({ intentName: this.projConstants.DISCARD_ALL }, true)
      } 
    } else if (popupObject.type == this.projConstants.INTERRUPT) {
      this.showInterruptPopup = popupObject.status;
      if (this.showInterruptPopup) {
        this.showInterruptPopup = false;
        this.mybot_run_click({ intentName: this.projConstants.DISCARD_ALL }, true)
        this.dialogTerminatedOrIntrupptedInMyBot();
        this.runDialogFormyBotTab(this.interruptDialog);
      } else if (popupObject.runLater) {
        this.showInterruptPopup = false;
        this.interruptDialogList.push({name : this.interruptDialog});
        this.updateInterruptDialogList();
      }
    } else if(popupObject.type == this.projConstants.LISTVIEW){
       this.showListView = popupObject.status;
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
    this.terminateClick = true;
  }

  getmybotData(params) {
    let feedback = this.mybotFeedback(params);
    let history = this.mybotHistory(params);
    forkJoin([feedback, history]).subscribe(res => {
      console.log(res, "feedback");
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
}
