import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants, ImageFilePath, ImageFileNames, IdReferenceConst, storageConst, RenderResponseType } from 'src/common/constants/proj.cnts';
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
  renderResponseType : any = RenderResponseType

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

  assistResponseArray : any = [];
  unreadUUID : any;

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
        // this.dialogTerminatedOrIntruppted();
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
      console.log(data, "inside agent feedback");
      if(this.commonService.isUpdateFeedBackDetailsFlag){

        this.updateFeedbackComponentData(data);
      }
    });

    // let subscription12 = this.handleSubjectService.overridebtnClickEventSubject.subscribe((response: any) => {
    //   if (response && response.data) {
    //     let actualId = response.data.id.split('-');
    //     actualId.shift();
    //     let id = actualId.join('-');
    //     if (response.override) {
    //       this.clickEvents(IdReferenceConst.OVERRIDE_BTN, id, this.dialogPositionId);
    //     } else if (response.cancelOverride) {
    //       this.clickEvents(IdReferenceConst.CANCEL_OVERRIDE_BTN, id, this.dialogPositionId);
    //     }
    //   }
    // });

    let subscription13 = this.handleSubjectService.proactiveModeSubject.subscribe((response: any) => {
      console.log("proactive mode subject", response);
      if (response != null && response != undefined) {
        this.proactiveModeStatus = response;
        this.handleProactiveDisableEvent(this.dialogPositionId);
        this.handleAutomationSmallTalkOverrideMode();
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
    // this.subscriptionsList.push(subscription12);
    this.subscriptionsList.push(subscription13);
  }

  handleAutomationSmallTalkOverrideMode(){
    let assistResponse = this.assistResponseArray[this.assistResponseArray.length-1];
    if(assistResponse){
      if(assistResponse.type == this.renderResponseType.SMALLTALK){

      }else if(assistResponse.type == this.renderResponseType.AUTOMATION){
        let assistResponseArray = assistResponse.automationsArray;
        if(!this.proactiveModeStatus && assistResponseArray?.length > 0 && assistResponseArray[assistResponseArray.length-1]?.data?.isPrompt){
          assistResponseArray[assistResponseArray.length-1].toggleOverride = true;
          assistResponseArray[assistResponseArray.length-1].hideOverrideDiv = true;
        }else if(this.proactiveModeStatus && assistResponseArray?.length > 0 && assistResponseArray[assistResponseArray.length-1]?.data?.isPrompt){
          assistResponseArray[assistResponseArray.length-1].toggleOverride = false;
          assistResponseArray[assistResponseArray.length-1].hideOverrideDiv = false;
        }
      }
      this.assistResponseArray = structuredClone(this.assistResponseArray);
    }
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
      'experience' : (this.connectionDetails.isCall && this.connectionDetails.isCall === "true") ?  ProjConstants.VOICE : ProjConstants.CHAT
    }
    if(this.connectionDetails?.autoBotId && this.connectionDetails?.autoBotId !== 'undefined') {
      welcomeMessageParams['autoBotId'] = this.connectionDetails.autoBotId;
    } else {
      welcomeMessageParams['autoBotId'] = '';
    }
    this.websocketService.emitEvents(EVENTS.welcome_message_request, welcomeMessageParams);
  }

  updateFeedbackComponentData(feedbackData){
    this.assistResponseArray.map(resp => {
      if(resp.type == this.renderResponseType.FEEDBACK && resp?.uuid == feedbackData?.taskId && resp?.dialogPositionId == feedbackData?.positionId){
        resp.feedbackResponse = feedbackData;
        resp.feedbackDetails = feedbackData.feedbackDetails;
        resp.submitForm = true;
      }
    });
    this.assistResponseArray = structuredClone(this.assistResponseArray);
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
    this.dialogName = data.intentName;

    let renderResponse = {
      data : data,
      type : this.renderResponseType.AUTOMATION,
      uuid : uuids,
      dialogId : this.dialogPositionId,
      dialogName : this.dialogName,
      connectionDetails : this.connectionDetails,
      showAutomation : true
    }
    this.assistResponseArray.push(renderResponse);
    this.assistResponseArray = [...this.assistResponseArray];
   
    // this.assisttabService._createRunTemplateContiner(uuids, data.intentName);
    
    // if (idTarget) {
    //   let ids = idTarget.split('-');
    //   ids.shift();
    //   let joinedIds = ids.join('-');
    //   let dialogID = document.getElementById(`suggestionId-${joinedIds}`);
    //   if (dialogID) {
    //     dialogID.style.borderStyle = "solid";
    //   }
    // }

    // let addRemoveDropDown = document.getElementById(`addRemoveDropDown-${uuids}`);
    // addRemoveDropDown?.classList.remove('hide');
    // $(`#endTaks-${uuids}`).removeClass('hide');
    if (!runInitent) {
      this.AgentAssist_run_click(data, this.dialogPositionId, this.projConstants.INTENT);
    }
    setTimeout(() => {
      // this.clickEvents(IdReferenceConst.ASSISTTERMINATE, uuids);
      // this.clickEvents(IdReferenceConst.DROPDOWN_HEADER, uuids);
      this.scrollToBottom();
    }, 1000);
  }

  processUserMessages(data, conversationId, botId) {

    let entityDisplayName = this.agentAssistResponse.entityDisplayName ? this.agentAssistResponse.entityDisplayName : this.agentAssistResponse.entityName;
    if (this.agentAssistResponse.newEntityDisplayName || this.agentAssistResponse.newEntityName) {
      entityDisplayName = this.agentAssistResponse.newEntityDisplayName ? this.agentAssistResponse.newEntityDisplayName : this.agentAssistResponse.newEntityName;
    }
    this.prepareUserMessageResponse(data,entityDisplayName); 
  }

  prepareUserMessageResponse(data,entityDisplayName){
    if(this.commonService.isAutomationOnGoing){
      let renderResponse = {
        uuid : this.randomUUIDPipe.transform(),
        data : data,
        type : this.renderResponseType.AUTOMATION,
        connectionDetails : this.connectionDetails,
        proactiveModeStatus : this.proactiveModeStatus,
        responseType : this.renderResponseType.USERMSG,
        titleText : this.commonService.OverRideMode ? 'YouEntered -' : 'Customer Said -',
        entityDisplayName : entityDisplayName,
        noTemplateRender : true
       } 
       
      this.assistResponseArray.map(arrEle => {
        console.log(arrEle, 'arrElement');
        
        if(arrEle.uuid && arrEle.uuid == this.dropdownHeaderUuids){
          console.log("inside if");
          
           arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
           if(arrEle.automationsArray[arrEle.automationsArray.length -1] && arrEle.automationsArray[arrEle.automationsArray.length -1]?.data?.isPrompt){
             arrEle.automationsArray[arrEle.automationsArray.length -1].hideOverrideDiv = true;
             arrEle.automationsArray[arrEle.automationsArray.length -1].toggleOverride = false; 
           }
           arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
        }
      });
      this.assistResponseArray = structuredClone(this.assistResponseArray)

      if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
        this.scrollToBottom();
      }
      this.commonService.removingSendCopyBtnForCall(this.connectionDetails);
    }else{
      let renderResponse = {
        uuid : this.randomUUIDPipe.transform(),
        data : data,
        type : this.renderResponseType.SMALLTALK,
        connectionDetails : this.connectionDetails,
        proactiveModeStatus : this.proactiveModeStatus,
        responseType : this.renderResponseType.USERMSG,
        titleText : this.commonService.OverRideMode ? 'YouEntered -' : 'Customer Said -',
        entityDisplayName : entityDisplayName,
        noTemplateRender : true
       }
       if(this.assistResponseArray?.length > 1 && this.assistResponseArray[this.assistResponseArray.length-1]?.type == this.renderResponseType.SMALLTALK
        &&  this.assistResponseArray[this.assistResponseArray.length-1]?.data?.isPrompt){
         this.assistResponseArray[this.assistResponseArray.length-1].hideOverrideDiv = true;
         this.assistResponseArray[this.assistResponseArray.length-1].toggleOverride = false;
       }

      this.assistResponseArray.push(renderResponse);
      this.assistResponseArray = [...this.assistResponseArray];
    }
  }

  updateAgentAssistResponse(data, botId, conversationId) {
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
    this.commonService.updateAgentAssistState(conversationId, this.projConstants.ASSIST, data);
    this.processAgentAssistResponse(data, botId);
  }

  removeOverRideDivForPreviousResponse(){

    if(this.assistResponseArray?.length > 1 && this.assistResponseArray[this.assistResponseArray.length-1]?.type == this.renderResponseType.SMALLTALK
      &&  this.assistResponseArray[this.assistResponseArray.length-1]?.data?.isPrompt){
       this.assistResponseArray[this.assistResponseArray.length-1].toggleOverride = false;
       this.assistResponseArray[this.assistResponseArray.length-1].hideOverrideDiv = true;
       this.assistResponseArray = structuredClone(this.assistResponseArray);
    }

  }

  processAgentAssistResponse(data, botId) {
    let renderResponse : any = {};
    this.smallTalkOverrideBtnId = null;
    let isTemplateRender = false;

    data = this.commonService.confirmationNodeRenderDataTransform(data);

    if(this.commonService.isAutomationOnGoing && this.dropdownHeaderUuids && data.suggestions?.dialogs?.length > 0) {
      this.dialogTerminatedOrIntruppted();
    }
    if (!this.commonService.isAutomationOnGoing && !this.proactiveModeStatus && !data.sendMenuRequest) {
      return;
    }

    this.removeOverRideDivForPreviousResponse();

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
      this.handleSubjectService.setCallConversationSuggestions({data : data, uuid : uuids});
      // let buldHtml = `
      //   <div class="buld-count-utt" id="buldCount-${uuids}">
      //               <i class="ast-bulb" id="buldCountAst-${uuids}"></i>
      //               <span class="count-number" id="buldCountNumber-${uuids}">${(data.suggestions.dialogs?.length || 0) + (data.suggestions.faqs?.length || 0) + (data.suggestions.searchassist?.snippets?.length || 0) + (this.commonService.formatSearchResponse(data)?.articles?.length || 0)}</span>
      //           </div>`;

      // let attrs = $('#scriptContainer .other-user-bubble .bubble-data');
      // console.log(attrs, '*********atrs');
      
      // $(attrs).last().attr('id', uuids)
      
      // attrs.each((i, data) => {
      //   console.log(i, '*************', data);
        
      //   if (data.id === uuids) {
      //     $(`#${data.id}`).append(buldHtml);
      //   }
      // });

    }
    
    if (!this.commonService.isAutomationOnGoing && data.suggestions) {
      console.log(this.commonService.suggestionsAnswerPlaceableIDs, "sugges answer placeable ids");
      
      if(this.commonService.suggestionsAnswerPlaceableIDs.length == 0){

        renderResponse = {
          data : data,
          type : this.renderResponseType.SUGGESTIONS,
          uuid : responseId,
          searchResponse : this.commonService.formatSearchResponse(data),
          connectionDetails : this.connectionDetails
        }
        this.assistResponseArray.push(renderResponse);
        this.assistResponseArray = structuredClone(this.assistResponseArray);
        // setTimeout(() => {
        //   this.updateNewMessageUUIDList(responseId);
        // }, this.waitingTimeForUUID);
        this.collapseOldDialoguesInAssist();
      }else{
        let faqAnswerIdsPlace = this.commonService.suggestionsAnswerPlaceableIDs.find(ele => ele.input == data.suggestions?.faqs[0].question);
        
        if(faqAnswerIdsPlace){
          // this.handleSubjectService.setFaqAmbiguitySubject(data, faqAnswerIdsPlace);
          this.updateSearchResponse(data,faqAnswerIdsPlace);
        }
      }
    }

    let result: any = this.templateRenderClassService.getResponseUsingTemplate(data, this.commonService.configObj);
    this.commonService.currentPositionId = this.dialogPositionId;
    if (this.commonService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (this.dialogPositionId && !data.positionId || (data.positionId == this.dialogPositionId))) {


      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);

      renderResponse = {
        data : data,
        type : this.renderResponseType.AUTOMATION,
        uuid : responseId,
        result : result,
        temp : newTemp,
        connectionDetails : this.connectionDetails,
        proactiveModeStatus : this.proactiveModeStatus,
        toggleOverride : false,
        responseType : this.renderResponseType.ASSISTRESPONSE
      } 

      if(data.isPrompt && !this.proactiveModeStatus){
        renderResponse.toggleOverride = true;
        renderResponse.hideOverrideDiv = true;
      }
       
      this.assistResponseArray.map(arrEle => {
        if(arrEle.uuid && arrEle.uuid == this.dropdownHeaderUuids){
           arrEle.automationsArray = arrEle.automationsArray ? arrEle.automationsArray : [];
           if(arrEle.automationsArray[arrEle.automationsArray.length -1] && arrEle.automationsArray[arrEle.automationsArray.length -1]?.data?.isPrompt){
             arrEle.automationsArray[arrEle.automationsArray.length -1].hideOverrideDiv = true;
             arrEle.automationsArray[arrEle.automationsArray.length -1].toggleOverride = false; 
           }
           arrEle.automationsArray = [...arrEle.automationsArray, renderResponse];
        }
      });

      this.assistResponseArray = structuredClone(this.assistResponseArray)
      this.isFirstMessagOfDialog = false;
      setTimeout(() => {
        if (data.entityName) {
          this.agentAssistResponse = {};
          this.agentAssistResponse = Object.assign({}, data);
        }
        // this.updateNewMessageUUIDList(this.dropdownHeaderUuids);
      }, 10);
    }

    // if (this.commonService.isAutomationOnGoing && !data.suggestions && !result.parsePayLoad) {
    //   if (this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages == 1) {
    //     this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages = 0;
    //   }
    //   this.scrollToBottom();
    // }
      // small talk with templates
    if (!this.commonService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (this.dialogPositionId && !data.positionId || data.positionId == this.dialogPositionId)) {
      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);
      renderResponse = {
        data : data,
        type : this.renderResponseType.SMALLTALK,
        uuid : responseId,
        result : result,
        temp : newTemp,
        connectionDetails : this.connectionDetails,
        proactiveModeStatus : this.proactiveModeStatus,
        toggleOverride : false,
        title : data.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
        isTemplateRender : this.smallTalkTemplateRenderCheck(data,result),
        value : data?.buttons[0]?.value,
        sendData : result?.parsedPayload ? newTemp : data?.buttons[0]?.value,
        dialogId : this.dialogPositionId,
        responseType : this.renderResponseType.ASSISTRESPONSE
      } 
      renderResponse.template = this.commonService.getTemplateHtml(renderResponse.isTemplateRender, result);

      if(data.isPrompt && !this.proactiveModeStatus){
        renderResponse.toggleOverride = true;
        renderResponse.hideOverrideDiv = true;
      }

      if(this.assistResponseArray?.length > 1 && this.assistResponseArray[this.assistResponseArray.length-1]?.type == this.renderResponseType.SMALLTALK
         &&  this.assistResponseArray[this.assistResponseArray.length-1]?.data?.isPrompt){
          this.assistResponseArray[this.assistResponseArray.length-1].toggleOverride = false;
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
    if (!this.commonService.isAutomationOnGoing && !this.dropdownHeaderUuids && !data.suggestions && !result.parsePayLoad) {

      let msgStringify = JSON.stringify(result);
      let newTemp = encodeURI(msgStringify);
      if(data.buttons?.length > 1){
        this.welcomeMsgResponse = data;
      }else{

        renderResponse = {
          data : data,
          type : this.renderResponseType.SMALLTALK,
          uuid : responseId,
          result : result,
          temp : newTemp,
          connectionDetails : this.connectionDetails,
          proactiveModeStatus : this.proactiveModeStatus,
          toggleOverride : false,
          title : data.isPrompt ? ProjConstants.ASK_CUSTOMER : ProjConstants.TELL_CUSTOMER,
          isTemplateRender : this.smallTalkTemplateRenderCheck(data,result),
          value : data?.buttons[0]?.value,
          sendData : result?.parsedPayload ? newTemp : data?.buttons[0]?.value,
          responseType : this.renderResponseType.ASSISTRESPONSE
        } 
        renderResponse.template = this.commonService.getTemplateHtml(renderResponse.isTemplateRender, result);
  
        if(data.isPrompt && !this.proactiveModeStatus){
          renderResponse.toggleOverride = true;
          renderResponse.hideOverrideDiv = true;
        }

        this.assistResponseArray.push(renderResponse);
        this.assistResponseArray = [...this.assistResponseArray];
        console.log("assistResponseArray", this.assistResponseArray)
      }
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
    this.updateNewMessageUUIDList(responseId);
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
      this.filterAutomationByPositionId();
      this.prepareFeedbackData();
      // this.commonService.addFeedbackHtmlToDom(this.dropdownHeaderUuids, this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage, this.dialogName, this.dialogPositionId, this.commonService.userIntentInput);  
    }
    if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
      this.scrollToBottom();
    }
    // this.dropdownHeaderUuids = undefined;
  }

  prepareFeedbackData(feedbackData?){
    let renderResponse : any = {
      type : this.renderResponseType.FEEDBACK,
      uuid : this.dropdownHeaderUuids,
      connectionDetails : this.connectionDetails,
      dialogName : this.dialogName,
      dialogPositionId : this.dialogPositionId,
      userIntentInput : this.commonService.userIntentInput,
      submitForm : feedbackData?.feedback ? true : false,
      feedback : feedbackData?.feedback ? feedbackData.feedback : '',
      feedbackDetails : feedbackData?.feedbackDetails?.length ? feedbackData.feedbackDetails : []
    } 
    
    this.assistResponseArray.push(renderResponse);
    this.assistResponseArray = [...this.assistResponseArray];
    console.log("assistResponseArray", this.assistResponseArray)
  }

  filterAutomationByPositionId(){
    this.assistResponseArray.map(arrEle => {
      if(arrEle.dialogId && arrEle.dialogId == this.dialogPositionId){
        arrEle.endAutomation = true;
      }
    });
    this.assistResponseArray = structuredClone(this.assistResponseArray);
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
        this.addUnreadMessageHtml();
      }
    }else{
      this.unreadUUID = null;
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

  // addUnreadMessageHtml() {
  //   if (!this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd && this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages) {
  //     $('.unread-msg').remove();
  //     let unreadHtml = ` <div class="unread-msg last-msg-white-bg">
  //       <div class="text-dialog-task-end">Unread Messages</div>
  //                  </div>`;
  //     // this.designAlterService.UnCollapseDropdownForLastElement(this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage);
  //     for (let i = 0; i < this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList.length; i++) {
  //       if (document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i])) {
  //         let elements: any = document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i]);
  //         if (elements.className == 'content-dialog-task-type' && (elements.id.includes('dialogSuggestions') || elements.id.includes('faqsSuggestions') || elements.id.includes('articleSuggestions'))) {
  //           let agentUttInfoId = this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i].split('-');
  //           agentUttInfoId.shift();
  //           agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
  //           if (document.getElementById(agentUttInfoId)) {
  //             elements = document.getElementById(agentUttInfoId);
  //           }
  //           elements?.insertAdjacentHTML('beforeBegin', unreadHtml);
  //         } else if (elements.id.includes('stepsrundata') && this.commonService.scrollContent[ProjConstants.ASSIST]?.lastElementBeforeNewMessage?.id?.includes('stepsrundata')) {
  //           elements = document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST]?.lastElementBeforeNewMessage?.id);
  //           elements?.insertAdjacentHTML('afterend', unreadHtml);
  //         }
  //         break;
  //       }
  //     }
  //   }
    
  // }

  addUnreadMessageHtml() {
    this.UnCollapseDropdownForLastElement();
    let newAddedMsgUuid = this.commonService.scrollContent[ProjConstants.ASSIST]?.newlyAddedMessagesUUIDlist[0];
    this.unreadUUID = newAddedMsgUuid ? newAddedMsgUuid : null;
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
        // $(".scroll-bottom-btn").addClass("new-messages");
        // $(".scroll-bottom-btn span").text(this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages + ' new');
        if (this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages == 1) {
          this.removeWhiteBackgroundToSeenMessages();
        }
        // this.newButtonScrollClickEvents.emit(true);
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
       this.assistResponseArray.forEach(response => {
        if(response.type == this.renderResponseType.AUTOMATION){
          response.showAutomation = false;
        }
      });
      this.assistResponseArray = structuredClone(this.assistResponseArray);
      
      // if ($(`#dynamicBlocksData .collapse-acc-data`).length > 0) {
      //   let listItems = $("#dynamicBlocksData .collapse-acc-data");
      //   listItems.each(function (idx, collapseElement) {
      //     if (!collapseElement.id.includes('smallTalk') && collapseElement.id.includes('dropDownData')) {
      //       collapseElement.classList.add('hide');
      //     }
      //   });
      // }
    }
  }

  UnCollapseDropdownForLastElement(){
    if(this.assistResponseArray.length && this.assistResponseArray[this.assistResponseArray.length-1].type == this.renderResponseType.AUTOMATION){
      this.assistResponseArray[this.assistResponseArray.length-1].showAutomation = true;
      this.assistResponseArray = structuredClone(this.assistResponseArray);
    }
  }

  scrollToBottom(flag?) {
    if (flag || (this.commonService.activeTab == this.projConstants.ASSIST && this.commonService.scrollContent[this.projConstants.ASSIST].scrollAtEnd)) {
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
        // this.terminateButtonClick(uuid)
      } else if (eventName == IdReferenceConst.OVERRIDE_BTN) {
        // this.handleOverridBtnClick(uuid, dialogId);
      } else if (eventName == IdReferenceConst.CANCEL_OVERRIDE_BTN) {
        // this.handleCancelOverrideBtnClick(uuid, dialogId);
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
        // this.handleSeeMoreLessClickEvents(uuid, data);
      } else if (eventName == IdReferenceConst.CHECK){
          // setTimeout(() => {
          //   this.handleFaqArrowClick(uuid, dialogId, data);
          // }, 500);
      }
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

  handleTerminatePopup(){
    this.handlePopupEvent.emit({ status: true, type: this.projConstants.TERMINATE });
  }

  handleProactiveDisableEvent(dialogId){
    let overRideObj: any = {
      "agentId": "",
      "botId": this.connectionDetails.botId,
      "conversationId": this.connectionDetails.conversationId,
      "query": "",
      "enable_override_userinput": !this.proactiveModeStatus,
      'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
      "positionId": dialogId
    }
    this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj);
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


  renderHistoryMessages(response, feedBackResult) {

    let previousId;
    let previousTaskPositionId, currentTaskPositionId, currentTaskName, previousTaskName;
    let resp = response.length > 0 ? response : undefined;
    let renderResponse: any = {};

    resp = this.commonService.formatHistoryResponseForFAQ(resp);
    resp?.forEach((res, index) => {

      res = this.commonService.confirmationNodeRenderForHistoryDataTransform(res);


      res = this.commonService.formatHistoryResonseToNormalRender(res);

      console.log(currentTaskPositionId, previousTaskPositionId, res, "current previous and res");

      this.removeOverRideDivForPreviousResponse();
      
      if ((res.suggestions || res.ambiguityList) && res.type == 'outgoing' && res.faqResponse) {

        res.suggestions.faqs.forEach(faq => {
          faq.answer = res?.components[0]?.data?.text
        });

        res.suggestions.faqs = this.commonService.formatFAQResponse(res.suggestions.faqs);

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
        console.log(this.assistResponseArray, "assist response array");
      }

      if ((res.suggestions || res.ambiguityList) && res.type == 'outgoing' && !res.faqResponse) {
        console.log(res, "result **********");

        renderResponse = {
          data: res,
          type: this.renderResponseType.SUGGESTIONS,
          uuid: res._id,
          searchResponse: this.commonService.formatSearchResponse(res),
          connectionDetails: this.connectionDetails
        }
        this.assistResponseArray.push(renderResponse);
        this.assistResponseArray = structuredClone(this.assistResponseArray);
      }

      console.log(res, "inside hisotyr");

      if ((!res.suggestions && !res.ambiguityList && !res.ambiguity) && res.type == 'outgoing') {

        let positionID = this.randomUUIDPipe.transform(IdReferenceConst.positionId);

        currentTaskPositionId = res.positionId ? res.positionId : ((res.intentName != currentTaskName) ? positionID : currentTaskPositionId);
        currentTaskName = (res.intentName) ? res.intentName : currentTaskName;
        let uuids = this.koreGenerateuuidPipe.transform();

        // feedback                            
        if ((previousTaskPositionId && currentTaskPositionId !== previousTaskPositionId) || (currentTaskPositionId == previousTaskPositionId && currentTaskName != previousTaskName && previousId)) {
          let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === previousTaskPositionId);
          console.log(previousIdFeedBackDetails, "previous id feedback details");
          
          this.filterAutomationByPositionId();
          this.prepareFeedbackData(previousIdFeedBackDetails);
          this.automationFlagUpdate(previousId,false);

          this.updateOverrideStatusOfAutomation(previousId);
          
          if ((currentTaskPositionId == previousTaskPositionId && currentTaskName != previousTaskName)) {
            previousId = undefined;
          } else {
            previousId = undefined;
            previousTaskPositionId = undefined;
            previousTaskName = undefined;
          }
        }

        // update postionids
        if (res.intentName && !previousId && previousTaskPositionId !== currentTaskPositionId) {
          let automationUUIDCheck = this.assistResponseArray.findIndex((automation) => {
            if (automation.uuid == res._id) {
              return true;
            }
          });
          console.log(automationUUIDCheck, 'automation uuid check');


          // let divExist = $(`#addRemoveDropDown-${res._id}`);
          // if (divExist.length >= 1) {
          //   console.log("---->>>>>>>>>>>>>>>>>>>>>already exsit===in the dom");
          // } 
          previousTaskPositionId = currentTaskPositionId;
          previousTaskName = currentTaskName;

          if (automationUUIDCheck == -1) {
            previousId = res._id;
            previousTaskPositionId = currentTaskPositionId;
            let renderResponse = {
              data: res,
              type: this.renderResponseType.AUTOMATION,
              uuid: previousId,
              dialogId: currentTaskPositionId,
              dialogName: currentTaskName,
              connectionDetails: this.connectionDetails,
              showAutomation: true
            }
            this.assistResponseArray.push(renderResponse);
            this.assistResponseArray = [...this.assistResponseArray];
          }
        }

        //process user messages
        if (res.entityName && res.entityResponse && res.entityValue && res.userInput) {

          let entityDisplayName = this.agentAssistResponse.newEntityDisplayName ? this.agentAssistResponse.newEntityDisplayName : this.agentAssistResponse.newEntityName;
          if (this.agentAssistResponse.newEntityDisplayName || this.agentAssistResponse.newEntityName) {
            entityDisplayName = this.agentAssistResponse.newEntityDisplayName ? this.agentAssistResponse.newEntityDisplayName : this.agentAssistResponse.newEntityName;
          }
          this.prepareUserMessageResponse(res,entityDisplayName); 
        }

        if (res.entityName) {
          this.agentAssistResponse = res;
        }

        let result: any = this.templateRenderClassService.getResponseUsingTemplateForHistory(res);
        this.commonService.currentPositionId = currentTaskPositionId;
        let msgStringify = JSON.stringify(result);
        let newTemp = encodeURI(msgStringify);

        if (result.message.length > 0) {

          //small talk after dialogue terminate
          if((previousTaskName != currentTaskName && previousTaskPositionId == currentTaskPositionId)){
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
            renderResponse.template = this.commonService.getTemplateHtml(renderResponse.isTemplateRender, result);

            // if (res.isPrompt && !this.proactiveModeStatus) {
            //   renderResponse.toggleOverride = true;
            //   renderResponse.hideOverrideDiv = true;
            // }

            this.assistResponseArray.push(renderResponse);
            this.assistResponseArray = [...this.assistResponseArray];
            console.log("assistResponseArray", this.assistResponseArray)
          }

          console.log(res, "before if conditon");

          // automation
          if ((res.isPrompt === true || res.isPrompt === false) && previousTaskName === currentTaskName && previousTaskPositionId == currentTaskPositionId) {

            this.automationFlagUpdate(previousId,true)

            if (res.isPrompt || res.entityRequest) {
              if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
                this.dialogPositionId = previousTaskPositionId;
              }
            }
            
            renderResponse = {
              data: res,
              type: this.renderResponseType.AUTOMATION,
              uuid: res.components && res.components[0]?._id ? (res.components && res.components[0]?._id) : uuids,
              result: result,
              temp: newTemp,
              connectionDetails: this.connectionDetails,
              proactiveModeStatus: this.proactiveModeStatus,
              toggleOverride: false,
              responseType: this.renderResponseType.ASSISTRESPONSE
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
            console.log(this.assistResponseArray, "assist response array inside automaiton");

          }

          // small talk outside automation ---------------------->
          let shouldProcessResponse = false;
          if (!result.parsedPayload && !res.intentName && !shouldProcessResponse && typeof res.isPrompt != 'boolean') {
            res.components?.forEach((ele, i) => {
              if (res.components?.length > 1) {
                this.welcomeMsgResponse = res.components;
              } else {
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
                renderResponse.template = this.commonService.getTemplateHtml(renderResponse.isTemplateRender, result);

                // if (res.isPrompt && !this.proactiveModeStatus) {
                //   renderResponse.toggleOverride = true;
                //   renderResponse.hideOverrideDiv = true;
                // }

                this.assistResponseArray.push(renderResponse);
                this.assistResponseArray = [...this.assistResponseArray];
                console.log("assistResponseArray", this.assistResponseArray)
              }
            });
          }
        }
      }

      // feedback
      if ((resp.length - 1 == index && (!res.entityRequest && !res.entityResponse) && currentTaskPositionId == previousTaskPositionId && previousTaskPositionId)) {
        let previousIdFeedBackDetails = feedBackResult.find((ele) => ele.positionId === currentTaskPositionId);
        this.filterAutomationByPositionId();
        this.prepareFeedbackData(previousIdFeedBackDetails);
        this.automationFlagUpdate(previousId,false)
        this.updateOverrideStatusOfAutomation(previousId);
        previousId = undefined;
        previousTaskPositionId = undefined;
        previousTaskName = undefined;
      }

    });
   
    this.scrollToBottom();
    // this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
  }

  automationFlagUpdate(previousId,flag){
    if (this.localStorageService.checkStorageItemWithInConvId(this.connectionDetails.conversationId, storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH)) {
      this.commonService.isAutomationOnGoing = flag;
      this.dropdownHeaderUuids = previousId;
      let storageObject: any = {
        [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH]: this.commonService.isAutomationOnGoing
      }
      this.localStorageService.setLocalStorageItem(storageObject);
    }
  }

  viewCustomTempAttachment(){
    this.commonService.CustomTempClickEvents(this.projConstants.ASSIST, this.connectionDetails)
  }

  updateFeedbackProperties(data, index){
    this.assistResponseArray[index] = data;
  }

  updateSearchResponse(response, faqAnswerIdsPlace){
    response.suggestions.faqs = this.commonService.formatFAQResponse(response.suggestions.faqs);

    console.log(faqAnswerIdsPlace, "faq answer id place");

    let index = this.commonService.suggestionsAnswerPlaceableIDs.findIndex(suggestion =>{
      return suggestion.input == faqAnswerIdsPlace.input
    });

    if(index >= 0){
      this.commonService.suggestionsAnswerPlaceableIDs.splice(index, 1);
    }
    
    let accumulator = response.suggestions.faqs.reduce((acc, faq) => {
      if (faq.question == faqAnswerIdsPlace.input) {
        acc[faq.question] = faq;
        return acc;
      }
    }, {});

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
    console.log(this.assistResponseArray, 'inside update search response');
        
  }
}
