import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EVENTS } from 'src/common/helper/events';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { classNamesConst, IdReferenceConst, ImageFileNames, ImageFilePath, ProjConstants } from '../../../common/constants/proj.cnts'
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import * as $ from 'jquery';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { CommonService } from 'src/common/services/common.service';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';
import { DesignAlterService } from 'src/common/services/design-alter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('psBottom') psBottom: PerfectScrollbarComponent;

  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  projConstants: any = ProjConstants;
  searchText: string = '';
  showSearchSuggestions: boolean = false;
  subscriptionsList: Subscription[] = [];
  searchConentObject: any;
  activeTab: string; // call conversation make transcript as active tab.
  showTerminatePopup: boolean = false;
  showInterruptPopup: boolean = false;
  connectionDetails: any = {};

  constructor(public handleSubjectService: HandleSubjectService, public websocketService: WebSocketService,
    public sanitizeHTMLPipe: SanitizeHtmlPipe, private commonService: CommonService, private koregenerateUUIDPipe: KoreGenerateuuidPipe,
    private designAlterService : DesignAlterService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents() {

    let subscription1 = this.handleSubjectService.activeTabSubject.subscribe(tab => {
      this.activeTab = tab;
    });

    let subscription2 = this.handleSubjectService.connectDetailsSubject.subscribe((urlParams: any) => {
      console.log(urlParams, "inside home component");
      if (urlParams && urlParams?.token) {
        this.connectionDetails = urlParams;
        this.emitEvents();
        this.eventListenerFromParent();
      }
    });

    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
  }

  eventListenerFromParent() {

    window.addEventListener("message", (e) => {
      console.log(e.data, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx message came to widget when any message came from others inside angular");//your data is captured in e.data
      if (e.data.name === 'response_resolution_comments' && e.data.conversationId) {
        $(`#summary`).removeClass('hide');
        $(`#summaryText`).val(e.data?.summary ? e.data?.summary[0]?.summary_text : '');
        $(`#summarySubmit`).attr('data-summary', e.data ? JSON.stringify(e.data) : '')
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
          this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
        })
      }
      if (e.data.name === 'agentAssist.endOfConversation' && e.data.conversationId) {
        let currentEndedConversationId = e.data.conversationId;
        let appStateStr = localStorage.getItem('agentAssistState') || '{}';
        let appState = JSON.parse(appStateStr);
        if (appState[currentEndedConversationId]) {
          let request_resolution_comments = {
            conversationId: e.data?.conversationId,
            userId: '',
            botId: this.connectionDetails.botId,
            sessionId: this.koregenerateUUIDPipe.transform(),
            chatHistory: e.data?.payload?.chatHistory
          }
          this.websocketService.emitEvents(EVENTS.request_resolution_comments, request_resolution_comments);
          console.log("request_resolution_comments event published", request_resolution_comments)
          // localStorage.clear(appState[currentEndedConversationId]);
          delete appState[currentEndedConversationId];
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
        if (this.commonService.isCallConversation === true) {
          // prepareConversation();
          if (userInputData.author.type === 'USER') {
            // processTranscriptData(userInputData, userInputData.conversationid, this.connectionDetails.botId,);
            this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
          } else {
            // processAgentMessages(userInputData)
          }
        } else {
          if (userInputData?.author?.type === 'USER') {
            this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
          }
        }
      }
    });

  }


  emitEvents() {
    console.log(this.connectionDetails, "connection details");
    
    let menu_request_params : any = {
      botId : this.connectionDetails.botId,
      conversationId : this.connectionDetails.conversationId,
      experience : this.connectionDetails.isCall == "false" ? 'chat' : 'voice'
    }
    let parsedCustomData: any = {};
    let welcomeMessageParams: any = {
      'waitTime': 2000,
      'userName': parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'user',
      'id': this.connectionDetails.conversationId,
      "isSendWelcomeMessage": true
    }
    console.log(menu_request_params, "menu_prams");
    
    this.websocketService.emitEvents(EVENTS.welcome_message_request, welcomeMessageParams);
    this.websocketService.emitEvents(EVENTS.agent_menu_request, menu_request_params);
  }

  isChecked() {

  }

  changeActiveTab(tab) {
    this.handleSubjectService.setActiveTab(tab);
  }

  getSearchResults() {
    this.showSearchSuggestions = true;
    this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.ASSIST, value: this.searchText });
  }

  emptySearchTextCheck() {
    if (this.searchText == '') {
      this.closeSearchSuggestions(true);
    }
  }

  handleSearchClickEvent(eventObj) {
    if (eventObj.eventFrom == this.projConstants.AGENT_SEARCH) {
      this.closeSearchSuggestions(true);
      this.changeActiveTab(this.projConstants.LIBRARY);
      this.handleSubjectService.setLibrarySearchTextFromAgentSearch(eventObj);
    } else if (eventObj.eventFrom == this.projConstants.LIBRARY_SEARCH) {
      this.changeActiveTab(this.projConstants.ASSIST);
      this.searchText = eventObj.searchText;
      this.getSearchResults()
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

  handleTerminatePopup(popupObject) {
    console.log("handle terminate popup");

    if (popupObject.type == this.projConstants.TERMINATE) {
      this.showTerminatePopup = popupObject.status;
      if (popupObject.terminate) {
        console.log("terminate inside home component");
        this.handleSubjectService.setTerminateClickEvent({ activeTab: this.activeTab })
      }
    } else if (popupObject.type == this.projConstants.INTERRUPT) {
      this.showInterruptPopup = popupObject.status;
      if (popupObject.interrupt) {
        console.log("interrupt inside home component");
        this.handleSubjectService.setInterruptClickEvent({ activeTab: this.activeTab })
      }
    }

  }

  scrollToBottom($event) {
    console.log("inside scroll to bottom home component");
    setTimeout(() => {
      this.psBottom.directiveRef.update(); 
    }, 100);
  }

  onScrollEvent(event){
    if(event && event?.type){
      if(event.type == this.projConstants.PS_Y_REACH_START){
        console.log("ps reach start");
        
      }else if(event.type == this.projConstants.PS_Y_REACH_END){
        console.log("ps reach end");
        
      }else if(event.type == this.projConstants.PS_SCROLL_UP){
        console.log("ps scroll top");
        setTimeout(() => {
          this.updateScrollButton()
        }, 10);
        
      }
    }
    
  }

  updateScrollButton(){
    let dynamicBlockId = (this.activeTab == this.projConstants.ASSIST) ?  IdReferenceConst.DYNAMICBLOCK : IdReferenceConst.MYBOTAUTOMATIONBLOCK;
    let lastelement = this.designAlterService.getLastElement(dynamicBlockId);
    console.log(lastelement, "lastelement inside update scroll");
    let scrollAtEnd = !this.designAlterService.isScrolledIntoView(lastelement) ? true : false;
    console.log(scrollAtEnd, "scrollatend");
    
    if (!scrollAtEnd) {
        $(".scroll-bottom-show-btn").removeClass('hide');
    }else{
        $(".scroll-bottom-show-btn").addClass('hide');
    }
  }



}
