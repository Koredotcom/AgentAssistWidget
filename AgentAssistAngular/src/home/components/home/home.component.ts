import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('tabBody', { read: ElementRef }) public homescroll: ElementRef<any>;
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
  scrollContainer : any;
  scrollbottomwaitingTime : number = 500;

  constructor(public handleSubjectService: HandleSubjectService, public websocketService: WebSocketService,
    public sanitizeHTMLPipe: SanitizeHtmlPipe, private commonService: CommonService, private koregenerateUUIDPipe: KoreGenerateuuidPipe,
    private designAlterService: DesignAlterService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  ngAfterViewInit(){
    this.scrollContainer = document.getElementById(IdReferenceConst.HOMESCROLLBAR);
  }

  subscribeEvents() {

    let subscription1 = this.handleSubjectService.activeTabSubject.subscribe(tab => {
      this.activeTab = tab;
      setTimeout(() => { 
        if(this.activeTab != this.projConstants.LIBRARY){
          this.scrollToBottom(true);
        } 
      }, this.scrollbottomwaitingTime);
    });

    let subscription2 = this.handleSubjectService.connectDetailsSubject.subscribe((urlParams: any) => {
      if (urlParams && urlParams?.token) {
        this.connectionDetails = urlParams;
        this.eventListenerFromParent();
      }
    });

    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
  }

  eventListenerFromParent() {

    window.addEventListener("message", (e) => {
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

  isChecked() {

  }

  changeActiveTab(tab) {
    $(".scroll-bottom-show-btn").addClass('hiddenEle');
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
    }

  }

  scrollToBottom($event) {
    if(this.psBottom){
      $(window).trigger('resize');
      this.psBottom.directiveRef.scrollToTop(this.homescroll.nativeElement.scrollHeight);
      setTimeout(() => {        
        this.psBottom.directiveRef.update();    
      }, this.scrollbottomwaitingTime);
    }
  }

  onScrollEvent(event) {
    if(this.activeTab == this.projConstants.ASSIST || this.activeTab == this.projConstants.MYBOT){      
      if (event && event?.type) {
        if(event.type == this.projConstants.PS_Y_REACH_END){          
          this.commonService.scrollContent[this.activeTab].scrollAtEnd = true;
          this.commonService.checkDropdownCollapaseState(this.commonService.scrollContent[this.activeTab].lastElementBeforeNewMessage, this.activeTab);
          if(this.commonService.scrollContent[this.activeTab].scrollAtEnd){
              this.commonService.updateScrollAtEndVariables(this.activeTab);
          }else{
              $(".scroll-bottom-show-btn").removeClass('hiddenEle');
          }
          let dynamicBlockId = (this.activeTab == this.projConstants.ASSIST) ? IdReferenceConst.DYNAMICBLOCK : IdReferenceConst.MYBOTAUTOMATIONBLOCK;
          this.commonService.scrollContent[this.activeTab].lastElementBeforeNewMessage = this.designAlterService.getLastElement(dynamicBlockId);
          this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[this.activeTab].scrollAtEnd, dynamicBlockId);
        } else if (event.type == this.projConstants.PS_SCROLL_DOWN) {
          let dynamicBlockId = (this.activeTab == this.projConstants.ASSIST) ? IdReferenceConst.DYNAMICBLOCK : IdReferenceConst.MYBOTAUTOMATIONBLOCK;
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

  scrollClickEvents(){
    let scrollbuttonId = this.activeTab == this.projConstants.ASSIST ? IdReferenceConst.SCROLLBUTTON_ASSIST : IdReferenceConst.SCROLLBUTTON_MYBOT;
    document.getElementById(scrollbuttonId).removeEventListener('click', ()=>{
      console.log("click event removed");
    });    
    document.getElementById(scrollbuttonId).addEventListener('click', (event) => {
      this.scrollToBottom(true);
    }, { once: true });
  }

  updateScrollButton() {
    let dynamicBlockId = (this.activeTab == this.projConstants.ASSIST) ? IdReferenceConst.DYNAMICBLOCK : IdReferenceConst.MYBOTAUTOMATIONBLOCK;
    let lastelement = this.designAlterService.getLastElement(dynamicBlockId);
    let scrollAtEnd = !this.designAlterService.isScrolledIntoView(lastelement) ? true : false;
    this.commonService.scrollContent[this.activeTab].scrollAtEnd = scrollAtEnd;
    if (!scrollAtEnd) {
      $(".scroll-bottom-show-btn").removeClass('hiddenEle');
      this.scrollClickEvents();
    } else {
      $(".scroll-bottom-show-btn").addClass('hiddenEle');
    }
  }



}
