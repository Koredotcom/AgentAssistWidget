import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EVENTS } from 'src/common/helper/events';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { classNamesConst, coachingConst, IdReferenceConst, ImageFileNames, ImageFilePath, ProjConstants, storageConst } from '../../../common/constants/proj.cnts'
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { CommonService } from 'src/common/services/common.service';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';
import { DesignAlterService } from 'src/common/services/design-alter.service';
import { LocalStorageService } from 'src/common/services/local-storage.service';
import { MockDataService } from 'src/common/services/mock-data.service';
import { CoachingActionStoreService } from 'src/app/coaching-action-store.service';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { EChartsOption } from 'echarts';
import { ChecklistsComponent } from 'src/assist-tab/components/checklists/checklists.component';
import { TitleCasePipe } from '@angular/common';
  // import { ServiceInvokerService } from 'src/common/services/service-invoker.service';
declare const $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('tabBody', { read: ElementRef }) public homescroll: ElementRef<any>;
  @ViewChild('psBottom') psBottom: PerfectScrollbarComponent;
  @ViewChild('overlayps') overlayps : PerfectScrollbarComponent;
  @ViewChild('overlayhint') overlayhint : PerfectScrollbarComponent;
  @ViewChild('checkList') checkList : ChecklistsComponent;

  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  projConstants: any = ProjConstants;
  isChecklistOpened = false;
  activeTab: string; // call conversation make transcript as active tab.
  scrollContainer: any;
  searchConentObject: any;
  searchText: string = '';
  summaryText: string = '';
  connectionDetails: any = {};
  showRestorePopup: boolean = false;
  showSummaryPopup: boolean = false;
  showTerminatePopup: boolean = false;
  showInterruptPopup: boolean = false;
  scrollbottomwaitingTime: number = 500;
  showSearchSuggestions: boolean = false;
  subscriptionsList: Subscription[] = [];
  proactiveModeEnabled: boolean = false;
  isLoader;
  isBackBtnClicked: boolean = false;
  showHistoryTab : boolean = false;
  convHistoryResponse : any;
  coachingConst : any = coachingConst;
  coachingNudges : any = [];
  coachingHints : any = [];
  sourceDesktop : any = this.commonService?.configObj?.source;
  chartOption: EChartsOption;
  initChartOption : EChartsOption;
  showFullSentiChart : boolean = false;
  sentiObject : any = coachingConst.SENTI_CHART_YAXIS_LIST;
  showSentiChart : boolean = false;
  mergeSentiOptions : any = {};
  currentPolarity : string;
  checkListData:any = {};
  clObjs: any = {};
  isGuidedChecklistApiSuccess = false;
  checklists= [];
  selectedPlayBook = '';
  avgHeight = 400;
  isGrab = false;
  @Input() aaSettings:any = {}
  constructor(
    public handleSubjectService: HandleSubjectService, 
    public websocketService: WebSocketService,
    public sanitizeHTMLPipe: SanitizeHtmlPipe, 
    public commonService: CommonService, 
    private koregenerateUUIDPipe: KoreGenerateuuidPipe,
    private designAlterService: DesignAlterService, 
    private localStorageService: LocalStorageService,
    private cdRef : ChangeDetectorRef,
    private randomUUIDPipe : RandomUUIDPipe,
    private titlecasePipe:TitleCasePipe
  ) {}
    

  ngOnInit(): void {
    // if(this.aaSettings?.isWidgetLandingEnabled[this.connectionDetails.isCall]?.isEnabled){
    //   this.activeTab = this.aaSettings?.isWidgetLandingEnabled[this.connectionDetails.isCall]?.tab?.toUpperCase();
    // }
    this.subscribeEvents();
    this.websocketService.sendCheckListOpened$.subscribe((data)=>{
      if(data){
        this.guidedListAPICall(
          this.commonService.configObj.agentassisturl,
          this.commonService.configObj.fromSAT ?
            this.commonService.configObj.instanceBotId :
            this.commonService.configObj.botid,
          this.commonService.configObj.accessToken,
          this.commonService.configObj.accountId)
      }
    })
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  ngAfterViewInit() {
    this.scrollContainer = document.getElementById(IdReferenceConst.HOMESCROLLBAR);
    this.setRealtimeIntialOptions();
  }

  handleNudgeData(data){
    let uQ = data.actionId;
    this.coachingNudges.unshift(data);
    setTimeout(() => {
      let inx = this.coachingNudges.findIndex((item)=> item.actionId === uQ);
      if(inx >= 0){
        this.coachingNudges.splice(inx, 1);
      }
    }, 7000);
  }

  closeNudge(uQ){
    let inx = this.coachingNudges.findIndex((item)=> item.actionId === uQ);
    if(inx >= 0){
      this.coachingNudges.splice(inx, 1);
    }
  }

  handleHintData(hintObject){
    let uQ = hintObject.actionId;
    this.coachingHints.unshift(hintObject);
    this.hintScrollBottom(true);
    if(hintObject?.message?.postAction !== 'doesnot_auto_close'){
      setTimeout(() => {
        let inx = this.coachingHints.findIndex((item)=> item.actionId === uQ);
        if(inx >= 0){
          this.coachingHints.splice(inx, 1);
        }
      }, (hintObject.message?.time < 900 ? hintObject.message?.time : 900) * 1000);
    }
  }

  closeHint(uQ){
    let inx = this.coachingHints.findIndex((item)=> item.actionId === uQ);
    if(inx >= 0){
      this.coachingHints.splice(inx, 1);
    }
  }

  hintAckPressed(data) {
    data["ackPressed"] = true;
    this.websocketService.emitEvents(EVENTS.agent_coaching_ackpress, data);
  }

  subscribeEvents() {
    let subscription1 = this.handleSubjectService.activeTabSubject.subscribe(tab => {
      this.commonService.activeTab = tab;
      this.activeTab = tab;
      this.tabActiveActivities(tab);
      setTimeout(() => {
        if (this.activeTab != this.projConstants.LIBRARY) {
          this.scrollToBottom(true);
        }else{
          this.tabScrollbarScrollTop();
        }
      }, this.scrollbottomwaitingTime);
    });

    let subscription2 = this.handleSubjectService.connectDetailsSubject.subscribe((urlParams: any) => {
      if (urlParams && urlParams?.token) {
        this.commonService.isCallConversation = (urlParams.isCall && urlParams.isCall == "true") ? true : false;
        
        this.connectionDetails = urlParams;
        this.eventListenerFromParent();
      }
    });

    let subscription3 = this.websocketService.responseResolutionCommentsResponse$.subscribe((data: any) => {
      if (data) {
        this.handleResponseResoultionComments(data);
      }

    });

    let subscription4 = this.handleSubjectService.summarySubmitClickEventSubject.subscribe((data: any) => {
      if (data) {
        this.handleSummarySubmitClickEvent(data);
      }
    });

    let subscription5 = this.handleSubjectService.isLoaderSetSubject.subscribe((val)=>{
      this.isLoader = val;
    });

    let subscription6 = this.handleSubjectService.userHistoryDataSubject$.subscribe((res : any) => {
      console.log(res, "response");
      if(res && res.messages.length > 0){
        this.convHistoryResponse = res;
        this.showHistoryTab = !(this.commonService.isCallConversation) ? true : false;
      }
    });

    let subscription7 = this.websocketService.agentCoachingResponse$.subscribe((data)=>{
      if(data?.action === 'hint'){
        this.handleHintData(data);
      }else if(data?.action === 'nudge'){
        this.handleNudgeData(data);
      }
    });

    let subscription8 = this.websocketService.realtimeSentimeResponse$.subscribe((data)=> {
      if(data && data.sentiment){
        this.handleRealtimeSentiResponse(data.sentiment);
      }
    });

    let subscription9 = this.handleSubjectService.agentAssistSettingsSubject.subscribe((settings: any) => {
      this.aaSettings = settings;
      this.localStorageService.initializeLocalStorageState();
      console.log(this.commonService.configObj);
      this.updateUIState(this.commonService.configObj.conversationid, this.commonService.configObj.isCallConversation);
      this.btnInit();
    })



    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);
    this.subscriptionsList.push(subscription5);
    this.subscriptionsList.push(subscription6);
    this.subscriptionsList.push(subscription7);
    this.subscriptionsList.push(subscription8);
    this.subscriptionsList.push(subscription9);
  }

  handleRealtimeSentiResponse(data){
    if(!this.commonService.realtimeSentiData[this.connectionDetails.conversationId]){
      this.commonService.realtimeSentiData[this.connectionDetails.conversationId] = [];
    }
    let polarity = coachingConst.SENTI_POLARITY_MAP[data?.polarity];
    if(data?.polarity > 0 && data?.polarity <=10){
      this.commonService.realtimeSentiData[this.connectionDetails.conversationId].push(polarity);
      this.formatRealtimeSentiChartData();
    }
  }

  formatRealtimeSentiChartData(){
    this.setSentimentAnalysisOption();
  }

  toggleSentiChart(){
    this.showFullSentiChart = !this.showFullSentiChart;
  }

  setSentimentAnalysisOption() {
    let chartData = this.chartOption.series[0].data;
    if(this.commonService.realtimeSentiData[this.connectionDetails.conversationId]?.length > 0){
      let polaritySum = 0;
      this.commonService.realtimeSentiData[this.connectionDetails.conversationId].forEach(ele =>{
        polaritySum += ele;
      })
      let average = polaritySum/this.commonService.realtimeSentiData[this.connectionDetails.conversationId].length;
      chartData.push([chartData.length, average]);
      this.updatePolarity(average);
    }
    this.mergeSentiOptions = {
      series: [
        {
          data: chartData,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2
          }
        }
      ]
    }
    this.showSentiChart = true;
  }

  updatePolarity(avg){
    let polarityStr = '';
    if(avg > 0){
      polarityStr = 'Positive'
    }else if(avg == 0 || avg >= -0.25){
      polarityStr = 'Neutral'
    }else if(avg < -0.25){
      polarityStr = 'Negative'
    }
    this.currentPolarity = polarityStr;
  }

  setRealtimeIntialOptions(){
    this.chartOption = this.commonService.getSentiAnalysisChartOptions(this.sentiObject);
    this.initChartOption = this.commonService.getInitialSentiChartOptions(this.sentiObject);
  }

  //summary popup related code
  handleResponseResoultionComments(data) {
    this.handlePopupEvent({ status: true, type: this.projConstants.SUMMARY, summaryText: data });
  }

  handleSummarySubmitClickEvent(response) {
    // let data = response.summaryText;
    // let editedSummaryText = response.editedSummary;
    // if (data?.summary != '') {
    //   data['summary'][0]['summary_text'] = editedSummaryText;
    // } else {
    //   data['summary'] = [];
    //   data['summary'].push({ 'summary_text': editedSummaryText });
    // }
    let message = {
      name: "agentAssist.conversation_summary",
      conversationId: this.connectionDetails.conversationId,
      payload: {
        "summary" : [
          {
            'summary_text': response.editedSummary || '',
          }
        ]
      }
    };
    window.parent.postMessage(message, '*');
  }

  // update state based on local storage.
  updateUIState(_convId, _isCallConv) {
    const isChatOrCall = _isCallConv === 'true' ? 'call' : 'chat';

    $('#dynamicBlock .empty-data-no-agents').addClass('hide');
    let appState = this.localStorageService.getLocalStorageState();
    let activeTab: any;
    if (_isCallConv == 'true') {
      $(`#scriptContainer .empty-data-no-agents`).removeClass('hide');
    }
    if (appState[_convId] && !appState[_convId][storageConst.CURRENT_TAB]) {
      let storageObject: any = {};
      
      if(this.aaSettings.isWidgetLandingEnabled ) {
        if(this.aaSettings.isWidgetLandingEnabled[isChatOrCall].isEnabled) {
          storageObject[storageConst.CURRENT_TAB] = (this.titlecasePipe.transform(this.aaSettings.isWidgetLandingEnabled[isChatOrCall].tab) || this.projConstants.ASSIST);
          activeTab = storageObject[storageConst.CURRENT_TAB];
        }
      }else{
        storageObject[storageConst.CURRENT_TAB] = isChatOrCall === 'call' ? this.projConstants.TRANSCRIPT : this.projConstants.ASSIST;
        activeTab = storageObject[storageConst.CURRENT_TAB];
      }
      this.localStorageService.setLocalStorageItem(storageObject, activeTab);
    } else if (appState[_convId] && appState[_convId][storageConst.CURRENT_TAB]) {
      activeTab = appState[_convId][storageConst.CURRENT_TAB];
    }
    this.handleSubjectService.setActiveTab(activeTab);
    // document.getElementById("loader").style.display = "none";
    this.hightLightFaqFromStoredList(_convId, this.projConstants.ASSIST);
    setTimeout(() => {
      this.setProactiveMode();
    }, 1000);
  }

  //event listeners from parent
  eventListenerFromParent() {

    if (!(window)._agentAssisteventListenerAdded) {
      window.addEventListener("message", (e: any) => {
        if (e.data.name === EVENTS.response_resolution_comments &&  e.data.conversationId == this.connectionDetails.conversationId) {
          this.handleResponseResoultionComments(e.data);
        }
        if (e.data.name == 'initial_data') {
          e.data?.data?.forEach((ele) => {
            let agent_assist_request = {
              'conversationId': ele.conversationId,
              'query': this.sanitizeHTMLPipe.transform(ele.value),
              'botId': ele.botId,
              'agentId': '',
              'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
              'positionId': ele?.positionId
            }
            if (ele?.intentName) {
              agent_assist_request['intentName'] = ele.value;
            }
            if (ele?.entities) {
              agent_assist_request['entities'] = ele.entities;
            } else {
              agent_assist_request['entities'] = [];
            }
            if(ele.conversationId === this.connectionDetails.conversationId){
              this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
            }
          })
        }
        if (e.data.name === 'agentAssist.endOfConversation' && (e.data.conversationId || e.data.conversationid)) {
          let currentEndedConversationId = e.data.conversationId || e.data.conversationid;
          if (this.localStorageService.checkConversationIdStateInStorage([currentEndedConversationId])) {
            let request_resolution_comments = {
              conversationId: e.data?.conversationId,
              userId: '',
              botId: this.connectionDetails.botId,
              sessionId: this.koregenerateUUIDPipe.transform(),
              chatHistory: e.data?.payload?.chatHistory
            }
            this.websocketService.emitEvents(EVENTS.request_resolution_comments, request_resolution_comments);
            this.websocketService.emitEvents(EVENTS.end_of_conversation, request_resolution_comments);
            this.localStorageService.deleteLocalStorageState(currentEndedConversationId);
          }
          return;
        }

        if (e.data.value) {
          let userInputData = e.data;
          let agent_assist_request = {
            'author': {
              "firstName": userInputData.author?.firstName,
              "lastName": userInputData.author?.lastName,
              "type": userInputData.author?.type
            },
            'botId': this.connectionDetails.botId,
            'conversationId': userInputData.conversationid,
            'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
            'query': this.sanitizeHTMLPipe.transform(userInputData.value),
          }
          let user_messsage = {
            "botId": this.connectionDetails.botId,
            "type": "text",
            "conversationId": userInputData.conversationid,
            "value": this.sanitizeHTMLPipe.transform(userInputData.value),
            "author": {
                "firstName": userInputData.author?.firstName,
                "lastName": userInputData.author?.lastName,
                "type": userInputData.author?.type
            },
            "event": "user_message"
         }
          if (this.commonService.isCallConversation === true) {
            this.handleSubjectService.setAgentOrTranscriptResponse(userInputData);
          } else {
            if (userInputData?.author?.type === 'USER') {
              if(this.commonService.OverRideMode) {
                this.websocketService.emitEvents(EVENTS.user_message, user_messsage);
              }else{
                this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
              }
            }
          }
        }
      });

      window.addEventListener('agentAssist.endOfConversation', function (e) {
        console.log("----endOfConversation event captured ", e)
      });
      window._agentAssisteventListenerAdded = true;
    }

  }

  //tab change code
  changeActiveTab(tab) {
    $(".scroll-bottom-show-btn").addClass('hiddenEle');
    this.handleSubjectService.setActiveTab(tab);
    let storageObject: any = {
      [storageConst.CURRENT_TAB]: tab
    }
    this.localStorageService.setLocalStorageItem(storageObject);
  }

  tabActiveActivities(tab) {
    let storageObject: any = {
      [storageConst.CURRENT_TAB]: tab
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    // $('#bodyContainer').addClass('if-suggestion-search');

  }

  //terminate popup
  handlePopupEvent(popupObject) {
    if (popupObject.type == this.projConstants.TERMINATE) {
      this.showTerminatePopup = popupObject.status;
      if (popupObject.terminate) {
        this.handleSubjectService.setTerminateClickEvent({ activeTab: this.activeTab })
      }
    } else if (popupObject.type == this.projConstants.INTERRUPT) {
      this.showInterruptPopup = popupObject.status;
      if (popupObject.interrupt) {
        this.handleSubjectService.setInterruptClickEvent({ activeTab: this.activeTab })
      }
    } else if (popupObject.type == this.projConstants.RESTORE) {
      this.showRestorePopup = popupObject.status;
      if (popupObject.restore) {
        this.handleSubjectService.setRestoreClickEvent({ activeTab: this.activeTab, status: popupObject.status });
      }
    } else if (popupObject.type == this.projConstants.SUMMARY) {
      this.summaryText = popupObject.summaryText || '';
      this.showSummaryPopup = popupObject.status;
      if (popupObject.summary) {
        this.handleSubjectService.setSummarySubmitClickEvent({ activeTab: this.activeTab, summaryText: popupObject.summaryText, editedSummary: popupObject.editedSummary });
      }
    }

  }

  //proactive tab toggle click
  proactiveToggle(proactiveModeEnabled) {
    this.proactiveModeEnabled = (proactiveModeEnabled == ProjConstants.PROACTIVE_INITIAL_MODE) ? true : proactiveModeEnabled;
    this.handleSubjectService.setProactiveModeStatus(proactiveModeEnabled);
    this.updateProactiveModeState(this.proactiveModeEnabled);
  }

  updateProactiveModeState(modeStatus){
    let storageObject: any = {
      [storageConst.PROACTIVE_MODE]: modeStatus
    }
    this.localStorageService.setLocalStorageItem(storageObject);
}

setProactiveMode(){
  let appState : any = this.localStorageService.getLocalStorageState();
  let convState = appState[this.connectionDetails.conversationId];
  if(this.connectionDetails.source == this.projConstants.SMARTASSIST_SOURCE && typeof convState[storageConst.PROACTIVE_MODE] != 'boolean'){
    convState[storageConst.PROACTIVE_MODE] =  this.aaSettings?.isProactiveEnabled || true;
  }
  let proactiveModeStatus = (typeof convState[storageConst.PROACTIVE_MODE] === 'boolean') ? this.aaSettings?.isProactiveEnabled : true;
  this.proactiveToggle(proactiveModeStatus);
}

  //highlight faq after refresh
  hightLightFaqFromStoredList(convId, currentTab) {
    let appState = this.localStorageService.getLocalStorageState();
    if (appState[convId] && !appState[convId][currentTab] && !appState[convId][currentTab][storageConst.FAQ_LIST]) {
      let storageObject: any = {};
      storageObject[currentTab][storageConst.FAQ_LIST] = [];
      this.localStorageService.setLocalStorageItem(storageObject);
    } else if (appState[convId] && appState[convId][currentTab] && appState[convId][currentTab][storageConst.FAQ_LIST]) {
      let selectedFaqList = appState[convId][currentTab][storageConst.FAQ_LIST];
      for (let item of selectedFaqList) {
        let faqElementId = item.split('_')[1];
        let faqParentElementId = item.split('_')[0];
        let faqParentElement = document.getElementById(faqParentElementId);
        if (faqParentElement) {
          let faqElement: any = faqParentElement.querySelector('#' + faqElementId);
          faqElement.style.borderStyle = "solid";
        }
      }
    }
  }

  //search bar related code.
  getSearchResults(value) {
    if(value){
      this.showSearchSuggestions = true;
      this.handleSubjectService.setSearchText({ searchFrom: this.commonService.activeTab, value: value });
    }
  }

  emptySearchTextCheck(value) {
    if (value == '') {
      this.closeSearchSuggestions(true);
    }else{
      this.getSearchResults(value)
    }
  }

  handleSearchClickEvent(eventObj) {
    if (eventObj.eventFrom == this.projConstants.AGENT_SEARCH) {
      this.isBackBtnClicked = true;
      this.closeSearchSuggestions(true);
      this.changeActiveTab(this.projConstants.LIBRARY);
      setTimeout(() => {
        this.handleSubjectService.setLibrarySearchTextFromAgentSearch(eventObj);
      }, 10);
    } else if (eventObj.eventFrom == this.projConstants.LIBRARY_SEARCH) {
      this.isBackBtnClicked = true;
      this.changeActiveTab(this.projConstants.ASSIST);
      this.searchText = eventObj.searchText;
      setTimeout(() => {
        this.getSearchResults(this.searchText)
      }, 10);
    }
  }

  closeSearchSuggestions(flag) {
    if (flag) {
      this.showSearchSuggestions = false;
      this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.ASSIST, value: undefined });
      this.websocketService.agentAssistAgentResponse$.next(null);
      if (document.getElementById(IdReferenceConst.overLaySuggestions)) {
        document.getElementById(IdReferenceConst.overLaySuggestions).classList.remove(classNamesConst.DISPLAY_BLOCK);
      }
    }
  }

  clearSearchText(){
    this.searchText = '';
    this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.ASSIST, value: undefined });
    this.websocketService.agentAssistAgentResponse$.next(null);
    this.showSearchSuggestions=false;
    if(this.isBackBtnClicked){
      setTimeout(() => {
        this.handleSubjectService.setLibrarySearchTextFromAgentSearch({ eventFrom: this.projConstants.ASSIST, searchText: undefined });
      }, 10);
      this.isBackBtnClicked = false;
    }
  }


  // scroll realted code.

  tabScrollbarScrollTop(){
    if(this.psBottom){
      this.psBottom.directiveRef.scrollToTop(0);
      setTimeout(() => {
        this.psBottom.directiveRef.update();
      }, this.scrollbottomwaitingTime);
    }
  }

  overlayScrollTop(flag){
    if(flag && this.overlayps){
      this.overlayps.directiveRef.scrollToTop(0);
      setTimeout(() => {
        this.overlayps.directiveRef.update();
      }, this.scrollbottomwaitingTime);
    }
  }
  scrollToBottom(flag) {
    if(flag){
      if (this.psBottom) {
        $(window).trigger('resize');
        this.psBottom.directiveRef.scrollToTop(this.homescroll.nativeElement.scrollHeight);
        $(".scroll-bottom-btn span").text('Scroll to bottom');
        $(".scroll-bottom-btn").removeClass("new-messages");
        setTimeout(() => {
          this.psBottom.directiveRef.update();
        }, this.scrollbottomwaitingTime);
      }
    }
  }

  hintScrollBottom(flag){
    if(flag && this.overlayhint){
      this.overlayhint.directiveRef.scrollToTop(0);
      setTimeout(() => {
        this.overlayhint.directiveRef.update();
      });
    }
  }

  onScrollEvent(event) {
    if (this.activeTab == this.projConstants.ASSIST || this.activeTab == this.projConstants.MYBOT || this.activeTab == this.projConstants.TRANSCRIPT || this.activeTab == this.projConstants.HISTORY) {
      if (event && event?.type) {
        if (event.type == this.projConstants.PS_Y_REACH_END) {
          this.commonService.scrollContent[this.activeTab].scrollAtEnd = true;
          this.commonService.checkDropdownCollapaseState(this.commonService.scrollContent[this.activeTab].lastElementBeforeNewMessage, this.activeTab);
          if (this.commonService.scrollContent[this.activeTab].scrollAtEnd) {
            this.commonService.updateScrollAtEndVariables(this.activeTab);
          } else {
            $(".scroll-bottom-show-btn").removeClass('hiddenEle');
          }
          let dynamicBlockId = this.commonService.tabNamevsId[this.activeTab];
          this.commonService.scrollContent[this.activeTab].lastElementBeforeNewMessage = this.designAlterService.getLastElement(dynamicBlockId);
          this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[this.activeTab].scrollAtEnd, dynamicBlockId);
        } else if (event.type == this.projConstants.PS_SCROLL_DOWN) {
          let dynamicBlockId = this.commonService.tabNamevsId[this.activeTab];
          let lastelement = this.designAlterService.getLastElement(dynamicBlockId);
          this.commonService.updateNewMessageCount(this.commonService.scrollContent[this.activeTab].lastElementBeforeNewMessage, this.activeTab);
          let scrollAtEnd = !this.designAlterService.isScrolledIntoView(lastelement) ? true : false;
          this.commonService.scrollContent[this.activeTab].scrollAtEnd = scrollAtEnd;
          if (scrollAtEnd) {
            $(".scroll-bottom-show-btn").addClass('hiddenEle');
            this.commonService.updateScrollAtEndVariables(this.activeTab);
            this.commonService.scrollContent[this.activeTab].lastElementBeforeNewMessage = this.designAlterService.getLastElement(dynamicBlockId);
            this.designAlterService.addWhiteBackgroundClassToNewMessage(scrollAtEnd, dynamicBlockId);
          }
        } else if (event.type == this.projConstants.PS_SCROLL_UP) {
          setTimeout(() => {
            this.updateScrollButton()
          }, 10);

        }
      }
    }

  }

  scrollClickEvents(emit) {
    let scrollbuttonId = this.commonService.tabNamevsScrollId[this.activeTab];
    document.getElementById(scrollbuttonId).removeEventListener('click', () => {
    });
    setTimeout(() => {
      document.getElementById(scrollbuttonId).addEventListener('click', (event) => {
        console.log("click event *************" );

        this.scrollToBottom(true);
      }, { once: true });
    }, 10);
  }

  updateScrollButton() {
    let dynamicBlockId = this.commonService.tabNamevsId[this.activeTab];
    let lastelement = this.designAlterService.getLastElement(dynamicBlockId);
    let scrollAtEnd = !this.designAlterService.isScrolledIntoView(lastelement) ? true : false;
    this.commonService.scrollContent[this.activeTab].scrollAtEnd = scrollAtEnd;
    if (!scrollAtEnd) {
      $(".scroll-bottom-show-btn").removeClass('hiddenEle');
      this.scrollClickEvents(true);
    } else {
      $(".scroll-bottom-show-btn").addClass('hiddenEle');
    }
    this.cdRef.detectChanges();
  }

  @HostListener('click', ['$event'])
  onClick(evt) {
    // console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
    let target: any = evt.target;
    if (target.id === 'sendMsg' || target.className === 'ast-ast-send' || target.className == 'send-icon') {
      let ele = document.getElementById(`displayData-${target.dataset.msgId}`) ? document.getElementById(`displayData-${target.dataset.msgId}`) : document.getElementById(target.dataset.msgId);
      let data = target.dataset?.msgData && target.dataset?.msgData !== '' ? target.dataset?.msgData : (target.parentNode.dataset?.msgData && target.parentNode.dataset?.msgData !== '' ? target.parentNode.dataset?.msgData : ele?.innerText);
      if(target.dataset?.textType === 'sentence') {
        this.connectionDetails['type'] = target.dataset?.textType;
      } else if(target.dataset?.textType === 'article') {
        this.connectionDetails.title = target.dataset?.title;
        this.connectionDetails.contentId = target.dataset?.contentId;
      } else if (target.dataset?.textType === 'faq') {
        this.connectionDetails.title = target.dataset?.title;
        this.connectionDetails.contentId = target.dataset?.taskRefId;
      }
      this.connectionDetails.sessionId = this.handleSubjectService.assistTabSessionId;
      if(data && data != 'Send'){
        data = this.commonService.replaceLtGt(data, true);
      this.commonService.preparePostMessageForSendAndCopy(evt, data, IdReferenceConst.SENDMSG, this.connectionDetails);
      }
      }
      if ((target.className == 'copy-btn' || target.className == 'ast-copy' || target.className == 'copy-icon')) {
      let ele = document.getElementById(`displayData-${target.dataset.msgId}`) ? document.getElementById(`displayData-${target.dataset.msgId}`) : document.getElementById(target.dataset.msgId);
      let data = target.dataset.msgData && target.dataset.msgData !== '' ? target.dataset.msgData : (target.parentNode.dataset.msgData && target.parentNode.dataset.msgData !== '' ? target.parentNode.dataset.msgData : ele?.innerText);
      if(target.dataset?.textType === 'sentence') {
        this.connectionDetails['type'] = target.dataset?.textType;
      } else if(target.dataset?.textType === 'article') {
        this.connectionDetails.title = target.dataset?.title;
        this.connectionDetails.contentId = target.dataset?.contentId;
      } else if (target.dataset?.textType === 'faq') {
        this.connectionDetails.title = target.dataset?.title;
        this.connectionDetails.contentId = target.dataset?.contentId;
      }
      this.connectionDetails.sessionId = this.handleSubjectService.assistTabSessionId;
      if(data && data != 'Send' && data != 'SEND'){
      this.commonService.preparePostMessageForSendAndCopy(evt, data, IdReferenceConst.COPYMSG, this.connectionDetails);
      }
      }
    if (target.id.split('-')[0] == 'buldCount' || target.className == 'ast-bulb' || target.className == 'count-number') {
      let bulbDiv;
      if ($('#scriptContainer .other-user-bubble .bubble-data .buld-count-utt').length > 0) {
        bulbDiv = $('#scriptContainer .other-user-bubble .bubble-data').find('.buld-count-utt, .buld-count-utt-after-click');
      } else {
        bulbDiv = $('#scriptContainer .other-user-bubble .bubble-data .buld-count-utt-after-click');
      }
      let bulbid = target.id.split('-');
      bulbid.shift();
      let idOfBuld = $(bulbDiv).last().attr('id').split('-');
      idOfBuld.shift();
      if (idOfBuld.join('-') === bulbid.join('-')) {
        this.handleSubjectService.setActiveTab(this.projConstants.ASSIST)
        this.designAlterService.scrollToEle(`automationSuggestions-${idOfBuld.join('-')}`)
      } else {
        this.handleSubjectService.setActiveTab(this.projConstants.ASSIST)
        let theElement = `automationSuggestions-${bulbid.join('-')}`;
        this.designAlterService.scrollToEle(theElement);
      }
      $(`#scriptContainer #buldCount-${bulbid.join('-')}`).removeClass('buld-count-utt').addClass('buld-count-utt-after-click');
      $(`#scriptContainer #buldCountNumber-${bulbid.join('-')}`).html(`<span>&#10003;</span>`);
    }
    let targetIds = (target.id).split('-');
    if (['feedbackup', 'feedbackdown'].includes(targetIds[0])) {

      let cloneTargtIds = [...targetIds]
      let isDivElement = evt.target instanceof HTMLDivElement;
      if (targetIds.includes('feedbackup')) {
        cloneTargtIds.shift()
        if (isDivElement) {
          $(`#${target.id}`).addClass('active-feedback');
          target.firstElementChild.dataset.feedbacklike = 'true';
          Object.assign(target.dataset, target.firstElementChild.dataset);
          this.feedbackLoop(evt);
        } else {
          $(`#${target.parentElement.id}`).addClass('active-feedback');
          target.dataset.feedbacklike = 'false';
          this.feedbackLoop(evt);
        }

        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .ast-thumbdown`).attr('data-comment', ``)
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .ast-thumbdown`).attr('data-feedbackdetails', '[]');
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .btn-chip-negtive.active-chip`).removeClass('active-chip');
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} #feedBackComment-${cloneTargtIds.join('-')}`).val('');
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .submit-btn`).attr('disabled', 'disabled')
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .submit-btn`).html('Submit');
        $(`#feedbackdown-${cloneTargtIds.join('-')}`).removeClass('active-feedback')
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .thanks-update`).removeClass('hide');
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .help-improve-arrow`).addClass('hide')
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .explore-more-negtive-data`).addClass('hide');
      }
      if (targetIds.includes('feedbackdown')) {
        cloneTargtIds.shift()
        if (isDivElement) {
          $(`#${target.id}`).addClass('active-feedback');
          target.firstElementChild.dataset.feedbacklike = 'true';
          Object.assign(target.dataset, target.firstElementChild.dataset);
          this.feedbackLoop(evt);
        } else {
          $(`#${target.parentElement.id}`).addClass('active-feedback');
          target.dataset.feedbacklike = 'false';
          this.feedbackLoop(evt);
        }
        $(`#feedbackup-${cloneTargtIds.join('-')}`).removeClass('active-feedback')
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .thanks-update`).addClass('hide');
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .help-improve-arrow`).removeClass('hide')
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .explore-more-negtive-data`).removeClass('hide');
        $(`#feedbackHelpfulContainer-${cloneTargtIds.join('-')} .title-improve`).removeClass('hide');

      }
    }
    if (target.id.split('-')[0] == 'dropdownArrowFeedBack' || target.id.split('-')[0] == 'dropdownArrowFeedBackIcon') {
      let targteId = target.id.split('-');
      targteId.shift();
      let dataSets = $(`#feedbackdown-${targteId.join('-')} .ast-thumbdown`).data();
      let activeChipCount = $(`#feedbackHelpfulContainer-${targteId.join('-')} .btn-chip-negtive.active-chip`);
      if ((activeChipCount.length > 0 || dataSets.comment.length > 0) && target.dataset.feedbackDropDownOpened === 'true') {
        $(`#feedbackHelpfulContainer-${targteId.join('-')} .title-improve`).addClass('hide');
      } else {
        if ((activeChipCount.length == 0 && dataSets.comment.length == 0) && target.dataset.feedbackDropDownOpened === 'true') {
          $(`#feedbackHelpfulContainer-${targteId.join('-')} .title-improve`).removeClass('hide');
        } else {
          $(`#feedbackHelpfulContainer-${targteId.join('-')} .title-improve`).addClass('hide');
        }
      }
      if (target.dataset.feedbackDropDownOpened === 'false') {
        $(`#dropdownArrowFeedBackIcon-${targteId.join('-')}`).attr('data-feedback-drop-down-opened', 'true');
        $(`#dropdownArrowFeedBack-${targteId.join('-')}`).attr('data-feedback-drop-down-opened', 'true');
        $(`#feedbackHelpfulContainer-${targteId.join('-')} .explore-more-negtive-data`).addClass('hide');
      } else {
        $(`#dropdownArrowFeedBackIcon-${targteId.join('-')}`).attr('data-feedback-drop-down-opened', 'false');
        $(`#dropdownArrowFeedBack-${targteId.join('-')}`).attr('data-feedback-drop-down-opened', 'false');
        $(`#feedbackHelpfulContainer-${targteId.join('-')} .explore-more-negtive-data`).removeClass('hide');
      }
      let updateFlag = $(`#feedbackHelpfulContainer-${targteId.join('-')} .submit-btn`).attr('data-updateflag');
      if (updateFlag == 'true' && target.dataset.feedbackDropDownOpened === 'false') {
        $(`#feedbackHelpfulContainer-${targteId.join('-')} .submit-btn`).html('Update');
        $(`#feedbackHelpfulContainer-${targteId.join('-')} .submit-btn`).attr('disabled', 'disabled');
        this.AgentAssist_feedBack_Update_Request(dataSets);
        $(`#feedbackHelpfulContainer-${targteId.join('-')} .title-improve`).addClass('hide');
        this.commonService.isUpdateFeedBackDetailsFlag = true;
      }
    }
    if (target.className.includes('btn-chip-negtive')) {
      let id = target.parentElement.id.split('-');
      id.shift();
      let aaa = $(`#${target.parentElement.id} .btn-chip-negtive.active-chip`);
      let arrayOfChips = [];
      aaa.each((i, ele) => {
        arrayOfChips.push($(ele).html())
      });
      let dataSets = $(`#feedbackdown-${id.join('-')} .ast-thumbdown`).data();
      dataSets.feedbackdetails = arrayOfChips;

      if (target.dataset.chipClick == 'false') {
        $(target).addClass('active-chip');
        target.dataset.chipClick = 'true';
        let index;
        if (typeof dataSets.feedbackdetails == 'string') {
          dataSets.feedbackdetails = dataSets.feedbackdetails?.split(',');
          index = dataSets.feedbackdetails.findIndex((ele) => ele == $(target).html());
        }
        index = dataSets.feedbackdetails.findIndex((ele) => ele == $(target).html());
        if (index == -1) {
          dataSets.feedbackdetails.push($(target).html());
        }
      } else {
        $(target).removeClass('active-chip');
        target.dataset.chipClick = 'false';
        dataSets.feedbackdetails?.forEach((ele, i) => {
          if (ele == $(target).html()) {
            delete dataSets.feedbackdetails[i]
          }
        })
      }
      let activeChipCount = $(`#${target.parentElement.id} .btn-chip-negtive.active-chip`);
      if (activeChipCount.length > 0) {
        $(`#feedbackHelpfulContainer-${id.join('-')} .title-improve`).addClass('hide');
        $(`#feedbackHelpfulContainer-${id.join('-')} .submit-btn`).removeAttr('disabled');
      } else {
        if (dataSets.comment.length == 0) {
          $(`#feedbackHelpfulContainer-${id.join('-')} .title-improve`).removeClass('hide');
        }
      }
      $(`#feedbackHelpfulContainer-${id.join('-')} .ast-thumbdown`).attr('data-feedbackdetails', dataSets.feedbackdetails)
    }
    if (target.id == 'feedbackSubmit') {
      let id = target.parentElement.firstElementChild.id.split('-');
      id.shift();
      let feedbackComment = $(`#feedbackHelpfulContainer-${id.join('-')} #feedBackComment-${id.join('-')}`).val();
      let aaa = $(`#feedbackHelpfulContainer-${id.join('-')} .btn-chip-negtive.active-chip`);
      let arrayOfChips = [];
      aaa.each((i, ele) => {
        arrayOfChips.push($(ele).html())
      });

      let dataSets = $(`#feedbackdown-${id.join('-')} .ast-thumbdown`).data();
      dataSets.comment = feedbackComment;
      dataSets.feedbackdetails = arrayOfChips;
      if (typeof dataSets.feedbackdetails == 'string' && dataSets.feedbackdetails.indexOf(',') > -1) {
        dataSets.feedbackdetails = dataSets.feedbackdetails.split(',');
      }
      this.feedbackLoop(dataSets, true);
      $(`#feedbackHelpfulContainer-${id.join('-')} .thanks-update`).css('right', '34px').removeClass('hide');
      setTimeout(() => {
        $(`#feedbackHelpfulContainer-${id.join('-')} .thanks-update`).css('right', '25px').addClass('hide');
      }, 3000)
      $(`#feedbackHelpfulContainer-${id.join('-')} .explore-more-negtive-data`).addClass('hide');
      $(`#feedbackHelpfulContainer-${id.join('-')} #dropdownArrowFeedBackIcon-${id.join('-')}`).attr('data-feedback-drop-down-opened', 'true');
      $(`#feedbackHelpfulContainer-${id.join('-')} #dropdownArrowFeedBack-${id.join('-')}`).attr('data-feedback-drop-down-opened', 'true');
      target.dataset.updateflag = 'true';
      $(`#feedbackHelpfulContainer-${id.join('-')}.submit-btn`).attr('disabled', 'disabled');

      $(`#feedbackHelpfulContainer-${id.join('-')} .ast-thumbdown`).attr('data-comment', ``)
      $(`#feedbackHelpfulContainer-${id.join('-')} .ast-thumbdown`).attr('data-feedbackdetails', '[]')
      dataSets.comment = "";
      dataSets.feedbackdetails = [];
      $(`#feedbackHelpfulContainer-${id.join('-')} .btn-chip-negtive.active-chip`).removeClass('active-chip');
      $(`#feedbackHelpfulContainer-${id.join('-')} #feedBackComment-${id.join('-')}`).val('');
      this.commonService.isUpdateFeedBackDetailsFlag = false;
    }
    if (target.id.split("-")[0] == 'elipseIcon' || target.id.split("-")[0] == 'overflowIcon') {

       if(!this.showSearchSuggestions){

         if ($('.dropdown-content-elipse').length !== 0) {
           $('.dropdown-content-elipse').addClass('hide');
         }
         let elementClicked;
         if (target.id.split("-")[0] == 'elipseIcon') {
           evt.stopPropagation();
           (target.nextElementSibling)?.classList.remove('hide');
           elementClicked = target.parentElement;

         } else if (target.id.split("-")[0] == 'overflowIcon') {
           elementClicked = target.parentElement.parentElement;
           (target.parentElement.nextElementSibling)?.classList.remove('hide');
         }
         if (this.activeTab != this.projConstants.LIBRARY) {
           $('.elipse-dropdown-info').each((i, ele) => {
             $(ele).attr('class').includes('active-elipse') ? $(ele).removeClass('active-elipse') : elementClicked.classList.add('active-elipse');
           });
           $(`#overLaySearch .type-info-run-send`).find(elementClicked).length > 0 ? elementClicked.classList.add('active-elipse') : '';
         }
       }

    }
    if(target.id.split('-').includes('overRideBtn')){
      let overrideObject : any = {
        override : true,
        cancelOverride : false,
        data : target
      }
      this.handleSubjectService.setOverridebtnClickEvent(overrideObject);
    }
    if(target.id.split('-').includes('cancelOverRideBtn')){
      let overrideObject : any = {
        override : false,
        cancelOverride : true,
        data : target
      }
      this.handleSubjectService.setOverridebtnClickEvent(overrideObject);
    }
    if (target.id.split('-')[0] === 'dropDownHeader' || target.id.split('-')[0] === 'dropDownTitle' || target.id.split('-')[0] === 'dialogueArrow') {
      let targetIDs = (target.id).split('-');
      targetIDs.shift();
      let targetsss = targetIDs.join('-');
      let dropdownDataElement = $(`#dropDownData-${targetsss}`);
      if ($(dropdownDataElement).hasClass('hide')) {
        $(dropdownDataElement).removeClass('hide');
        $(`#dropDownHeader-${targetsss}`).find('.ast-carrotup').addClass('rotate-carrot');
        $(`#endTaks-${targetsss}`).removeClass('hide');
      } else {
        $(dropdownDataElement).addClass('hide')
        $(`#dropDownHeader-${targetsss}`).find('.ast-carrotup').removeClass('rotate-carrot');
        $(`#endTaks-${targetsss}`).removeClass('hide');
      }

    }
    if(target.id.split('-')[0] === 'run'){
      if(target.dataset?.dialogRun){
        let data = JSON.parse(target.dataset?.dialogRun);
        let runEventObj: any = {
          agentRunButton: false,
          intentName: data.name,
          childBotId : data.childBotId,
          childBotName : data.childBotName,
          userInput : data.userInput
        }
        this.handleSubjectService.setRunButtonClickEvent(runEventObj);
      }
    }
    if(target.id.split('-')[0] === 'agentSelect'){
      if(target.dataset?.dialogRun){
        let data = JSON.parse(target.dataset?.dialogRun);
        let runDialogueObject: any = {
          agentRunButton: true,
          name: data.name,
          intentName: data.name,
          searchFrom: this.projConstants.ASSIST,
          positionId: this.randomUUIDPipe.transform(IdReferenceConst.positionId),
          childBotId : data?.childBotId,
          childBotName : data?.childBotName,
          botId : this.connectionDetails?.botId,
          userInput : data.userInput
        }
        this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
        this.commonService.agent_run_click(runDialogueObject, false);
        this.handleSubjectService.setRunButtonClickEvent(runDialogueObject);
      }
    }
  }

  // send and copy click operations.
  btnInit() {
    document.addEventListener("keyup", (evt: any) => {
      let target = evt.target;
      let targetids = target.id.split('-');
      if(target.dataset.feedbackComment) {
        targetids.shift();
        let aaa = $(`#feedbackHelpfulContainer-${targetids.join('-')} .btn-chip-negtive.active-chip`);
        let arrayOfChips = [];
        aaa.each((i, ele) => {
          arrayOfChips.push($(ele).html())
        });
        let dataSets = $(`#feedbackdown-${targetids.join('-')} .ast-thumbdown`).data();
        dataSets.feedbackdetails = arrayOfChips;
        dataSets.comment = target.value;
        if (target.value.length > 0) {
          $(`#feedbackHelpfulContainer-${targetids.join('-')} .submit-btn`).removeAttr('disabled');
          $(`#feedbackHelpfulContainer-${targetids.join('-')} .title-improve`).addClass('hide');
        }
        $(`#feedbackHelpfulContainer-${targetids.join('-')} .input-block-optional .input-text`).attr('value', target.value);
        $(`#feedbackdown-${targetids.join('-')} .ast-thumbdown`).attr('data-comment', target.value);
      }
    })
  }

  feedbackLoop(evt, isSubmit = false) {
    if (isSubmit) {
      this.AgentAssist_feedback_click(evt, true);
    } else {
      this.AgentAssist_feedback_click(evt);
    }

  }

  AgentAssist_feedback_click(e, isSubmit = false) {
    let convId, botId, feedback, userInput, dialogId, comment, feedbackdetails, dialogName, taskId, feedDetailsArray;
    if (isSubmit) {
      convId = e.convId;
      botId = e.botId;
      feedback = e.feedback;
      userInput = e.userInput;
      dialogName = e.dialogName;
      dialogId = e.dialogid;
      comment = e.comment;
      feedbackdetails = e.feedbackdetails;
      taskId = e.taskId
    } else {
      convId = e.target.dataset.convId;
      botId = e.target.dataset.botId;
      feedback = e.target.dataset.feedback;
      userInput = e.target.dataset.userInput;
      dialogName = e.target.dataset.dialogName;
      dialogId = e.target.dataset.dialogid;
      comment = e.target.dataset.comment;
      feedbackdetails = e.target.dataset.feedbackdetails;
      taskId = e.target.dataset.taskId
    }

    feedDetailsArray = typeof feedbackdetails == 'string' ? [] : feedbackdetails?.filter(ele => ele !== null);
    this.agent_feedback_usage({
      comment: comment, feedbackDetails: feedDetailsArray, userInput: userInput, dialogName: dialogName, conversationId: convId, botId: botId, feedback: feedback, eventName: 'agent_usage_feedback', dialogId: dialogId,
      taskId: taskId
    });

  }

  agent_feedback_usage(data) {
    var agent_assist_request = {
      "feedback": data.feedback,
      "botId": data.botId,
      "conversationId": data.conversationId,
      userInput: data.userInput,
      taskName: data.dialogName,
      "event": data.eventName,
      positionId: data.dialogId,
      taskId: data.taskId,
      comment: data.comment,
      feedbackDetails: data.feedbackDetails,
      'experience': (this.commonService.configObj.isCall && this.commonService.configObj.isCall == 'true') ? ProjConstants.VOICE : ProjConstants.CHAT,
      "interactionType": this.activeTab == 'Assist' ? 'assist' : 'mybot'
    }
    this.websocketService.emitEvents(EVENTS.agent_usage_feedback, agent_assist_request);
  }

  AgentAssist_feedBack_Update_Request(e) {
    let agent_assist_feedback_request = {
      conversationId: e.convId,
      agentId: '',
      botId: e.botId,
      orgId: '',
      taskId: e.taskId,
      positionId: e.dialogid,
      'experience': (this.commonService.configObj.isCall && this.commonService.configObj.isCall == 'true') ? ProjConstants.VOICE : ProjConstants.CHAT,
      "interactionType": this.activeTab == 'Assist' ? 'assist' : 'mybot'
    }

    this.websocketService.emitEvents(EVENTS.agent_feedback_request, agent_assist_feedback_request);

  }

  scrollToTranscriptElement(top){
    if(top > 0){
      this.psBottom.directiveRef.scrollToTop(top);
    }
  }

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
        this.isChecklistOpened = true;
        if(data.checklists.length > 0 ) {
          this.checkListData = data;
          this.commonService.primaryChecklist = data.checklists.filter(check => check.type === "primary");
          this.commonService.dynamicChecklist = data.checklists.filter(check => check.type === "dynamic");
          (data?.checklists || [])
          .forEach((item)=>{
            (item.stages || [])
            .forEach((stage)=>{
              this.clObjs[stage._id] = stage;
            }) 
          });
        };
        this.sendOpenCheckLIstEvent();
      },
      error:  (err)=> {
          console.error("Unable to fetch the details with the provided data", err);
      }
    });
  }

  sendChecklistEvent() {
    let checklistParams: any = {
      "payload": {
          "event": "checklist_opened",
          "conversationId": this.connectionDetails.conversationId,
          "ccVersion": this.checkListData?.ccVersion,
          "accountId": this.checkListData?.accountId,
          "botId": (this.commonService.configObj?.fromSAT) ?  this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
          "agentInfo": {
              "agentId": "", // mendatory field
              //any other fields
          },
          "checklist": {
            "id": this.commonService.primaryChecklist[0]._id,
              //any other fields
          },
          "timestamp": 0,
          "context": {}
      }
    }
    this.isGuidedChecklistApiSuccess = true;
    this.websocketService.emitEvents(EVENTS.checklist_opened, checklistParams);
    if(this.commonService.primaryChecklist[0]?.stages[0]){
      this.commonService.primaryChecklist[0].stages[0].opened = true;
    };
    (this.commonService.primaryChecklist[0]?.stages)
    .forEach((item)=>{
      item.color = this.clObjs[item._id]?.color
    });
    // if(this.clObjs[this.commonService.primaryChecklist[0]._id]){
    //   this.commonService.primaryChecklist[0].color = this.clObjs[this.commonService.primaryChecklist[0]._id];
    // }
    this.checklists.push(this.commonService.primaryChecklist[0]);
    this.selectedPlayBook = this.commonService.primaryChecklist[0]?.name;
  }

  sendOpenCheckLIstEvent(){
    if(!this.isGuidedChecklistApiSuccess && this.commonService.primaryChecklist.length > 0) {
      let channel = this.commonService.isCallConversation ? 'voice' : 'chat'
      if(this.commonService.primaryChecklist[0]?.channels?.includes(channel)){
        this.sendChecklistEvent();
      }
    }
  }
}
