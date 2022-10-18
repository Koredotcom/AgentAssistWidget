import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EVENTS } from 'src/common/helper/events';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { classNamesConst, IdReferenceConst, ImageFileNames, ImageFilePath, ProjConstants, storageConst } from '../../../common/constants/proj.cnts'
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import * as $ from 'jquery';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { CommonService } from 'src/common/services/common.service';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';
import { DesignAlterService } from 'src/common/services/design-alter.service';
import { LocalStorageService } from 'src/common/services/local-storage.service';

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


  constructor(public handleSubjectService: HandleSubjectService, public websocketService: WebSocketService,
    public sanitizeHTMLPipe: SanitizeHtmlPipe, public commonService: CommonService, private koregenerateUUIDPipe: KoreGenerateuuidPipe,
    private designAlterService: DesignAlterService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  ngAfterViewInit() {
    this.scrollContainer = document.getElementById(IdReferenceConst.HOMESCROLLBAR);
  }

  subscribeEvents() {
    let subscription1 = this.handleSubjectService.activeTabSubject.subscribe(tab => {
      this.activeTab = tab;
      this.tabActiveActivities();
      console.log(this.activeTab, "active tab**********", this.commonService.isCallConversation);
      setTimeout(() => {
        if (this.activeTab != this.projConstants.LIBRARY) {
          this.scrollToBottom(true);
        }
      }, this.scrollbottomwaitingTime);
    });

    let subscription2 = this.handleSubjectService.connectDetailsSubject.subscribe((urlParams: any) => {
      if (urlParams && urlParams?.token) {
        this.commonService.isCallConversation = (urlParams.isCall == "false") ? false : true;
        this.localStorageService.initializeLocalStorageState();
        this.connectionDetails = urlParams;
        this.eventListenerFromParent();
        this.updateUIState(this.connectionDetails.conversationId, urlParams.isCall);
        this.btnInit();
      }
    });

    let subscription3 = this.websocketService.responseResolutionCommentsResponse$.subscribe((data: any) => {
      console.log((data));
      if (data) {
        this.handleResponseResoultionComments(data);
      }

    });

    let subscription4 = this.handleSubjectService.summarySubmitClickEventSubject.subscribe((data: any) => {
      if (data) {
        this.handleSummarySubmitClickEvent(data);
      }
    });

    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);
  }

  //summary popup related code
  handleResponseResoultionComments(data) {
    this.handlePopupEvent({ status: true, type: this.projConstants.SUMMARY, summaryText: data });
  }

  handleSummarySubmitClickEvent(response) {
    let data = response.summaryText;
    let editedSummaryText = response.editedSummary;
    if (data?.summary != '') {
      data['summary'][0]['summary_text'] = editedSummaryText;
    } else {
      data['summary'] = [];
      data['summary'].push({ 'summary_text': editedSummaryText });
    }
    var message = {
      name: "agentAssist.conversation_summary",
      conversationId: this.connectionDetails.conversationId,
      payload: data
    };
    window.parent.postMessage(message, '*');
  }

  // update state based on local storage.
  updateUIState(_convId, _isCallConv) {
    console.log(_isCallConv, "is call conversation");

    $('.empty-data-no-agents').addClass('hide');
    let appState = this.localStorageService.getLocalStorageState();
    let activeTab: any;
    if (_isCallConv == 'true') {
      $(`#scriptContainer .empty-data-no-agents`).removeClass('hide');
    }
    if (appState[_convId] && !appState[_convId][storageConst.CURRENT_TAB]) {
      let storageObject: any = {};
      if (_isCallConv == 'true') {
        storageObject[storageConst.CURRENT_TAB] = this.projConstants.TRANSCRIPT;
        activeTab = this.projConstants.TRANSCRIPT;
      } else {
        storageObject[storageConst.CURRENT_TAB] = this.projConstants.ASSIST;
        activeTab = this.projConstants.ASSIST;
      }
      this.localStorageService.setLocalStorageItem(storageObject, activeTab);
    } else if (appState[_convId] && appState[_convId][storageConst.CURRENT_TAB]) {
      activeTab = appState[_convId][storageConst.CURRENT_TAB];
    }
    console.log(activeTab, "active tab inside update ui state");

    this.handleSubjectService.setActiveTab(activeTab);
    // document.getElementById("loader").style.display = "none";
    this.hightLightFaqFromStoredList(_convId, this.projConstants.ASSIST);
  }

  //event listeners from parent
  eventListenerFromParent() {

    if (!(window)._agentAssisteventListenerAdded) {
      window.addEventListener("message", (e: any) => {
        if (e.data.name === EVENTS.response_resolution_comments && e.data.conversationId) {
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
            this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
          })
        }
        if (e.data.name === 'agentAssist.endOfConversation' && e.data.conversationId) {
          let currentEndedConversationId = e.data.conversationId;
          if (this.localStorageService.checkConversationIdStateInStorage([currentEndedConversationId])) {
            let request_resolution_comments = {
              conversationId: e.data?.conversationId,
              userId: '',
              botId: this.connectionDetails.botId,
              sessionId: this.koregenerateUUIDPipe.transform(),
              chatHistory: e.data?.payload?.chatHistory
            }
            this.websocketService.emitEvents(EVENTS.request_resolution_comments, request_resolution_comments);
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
          if (this.commonService.isCallConversation === true) {
            this.handleSubjectService.setAgentOrTranscriptResponse(userInputData);
          } else {
            if (userInputData?.author?.type === 'USER') {
              this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
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

  tabActiveActivities() {
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
      this.summaryText = popupObject.summaryText ? popupObject.summaryText : '';
      this.showSummaryPopup = popupObject.status;
      if (popupObject.summary) {
        this.handleSubjectService.setSummarySubmitClickEvent({ activeTab: this.activeTab, summaryText: popupObject.summaryText, editedSummary: popupObject.editedSummaryText });
      }
    }

  }

  //proactive tab toggle click
  proactiveToggle(proactiveModeEnabled) {
    this.proactiveModeEnabled = proactiveModeEnabled;
    let toggleObj: any = {
      "agentId": "",
      "botId": this.connectionDetails.botId,
      "conversationId": this.connectionDetails.conversationId,
      "query": "",
      'experience': this.commonService.isCallConversation === true ? ProjConstants.VOICE : ProjConstants.CHAT,
      "enable_override_userinput": this.proactiveModeEnabled
    }
    this.commonService.OverRideMode ? this.websocketService.emitEvents(EVENTS.enable_override_userinput, toggleObj) : '';
    this.commonService.OverRideMode = this.proactiveModeEnabled;
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


  // scroll realted code.
  scrollToBottom($event) {
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

  onScrollEvent(event) {
    if (this.activeTab == this.projConstants.ASSIST || this.activeTab == this.projConstants.MYBOT) {
      if (event && event?.type) {
        if (event.type == this.projConstants.PS_Y_REACH_END) {
          this.commonService.scrollContent[this.activeTab].scrollAtEnd = true;
          this.commonService.checkDropdownCollapaseState(this.commonService.scrollContent[this.activeTab].lastElementBeforeNewMessage, this.activeTab);
          if (this.commonService.scrollContent[this.activeTab].scrollAtEnd) {
            this.commonService.updateScrollAtEndVariables(this.activeTab);
          } else {
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

  scrollClickEvents() {
    let scrollbuttonId = this.activeTab == this.projConstants.ASSIST ? IdReferenceConst.SCROLLBUTTON_ASSIST : IdReferenceConst.SCROLLBUTTON_MYBOT;
    document.getElementById(scrollbuttonId).removeEventListener('click', () => {
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

  // send and copy click operations.
  btnInit() {
    document.addEventListener("click", (evt: any) => {
      let target: any = evt.target;
      if (target.id === 'sendMsg') {
        let ele = document.getElementById(`displayData-${target.dataset.msgId}`) ? document.getElementById(`displayData-${target.dataset.msgId}`) : document.getElementById(target.dataset.msgId);
        let data = target.dataset.msgData && target.dataset.msgData !== '' ? target.dataset.msgData : (target.parentNode.dataset.msgData && target.parentNode.dataset.msgData !== '' ? target.parentNode.dataset.msgData : ele.innerText);
        this.commonService.preparePostMessageForSendAndCopy(evt, data, IdReferenceConst.SENDMSG, this.connectionDetails);
      }
      if ((target.className == 'copy-btn' || target.className == 'ast-copy')) {
        let ele = document.getElementById(`displayData-${target.dataset.msgId}`) ? document.getElementById(`displayData-${target.dataset.msgId}`) : document.getElementById(target.dataset.msgId);
        let data = target.dataset.msgData && target.dataset.msgData !== '' ? target.dataset.msgData : (target.parentNode.dataset.msgData && target.parentNode.dataset.msgData !== '' ? target.parentNode.dataset.msgData : ele.innerText);
        this.commonService.preparePostMessageForSendAndCopy(evt, data, IdReferenceConst.COPYMSG, this.connectionDetails);
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
    });
  }


}
