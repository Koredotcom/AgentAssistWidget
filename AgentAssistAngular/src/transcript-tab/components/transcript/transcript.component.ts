import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import * as $ from 'jquery';
import { CommonService } from 'src/common/services/common.service';
import { FormatAMPMPipe } from 'src/common/pipes/format-ampm.pipe';
import { EVENTS } from 'src/common/helper/events';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { IdReferenceConst, ProjConstants } from 'src/common/constants/proj.cnts';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { DesignAlterService } from 'src/common/services/design-alter.service';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';


@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent implements OnInit {


  @Output() scrollToBottomEvent = new EventEmitter();
  @Output() scrollToTranscriptElement = new EventEmitter();

  constructor(private websocketService: WebSocketService,
    private handleSubjectService: HandleSubjectService,
    public commonService: CommonService,
    private formatAMPMPipe: FormatAMPMPipe,
    private sanitizeHTMLPipe: SanitizeHtmlPipe,
    private randomUUidPipe: RandomUUIDPipe,
    private designAlterService: DesignAlterService,
    private koreGenerateuuidPipe : KoreGenerateuuidPipe) { }

  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;

  transcriptArray: any = [];

  connectionDetails: any;
  parsedCustomData: any;
  historyResponse: any;
  scrollEventDone: boolean = false;
  transcriptScrollTopText: string = 'Scroll up for Bot Conversation History';
  sourceDesktop: any = this.commonService?.configObj?.source;
  showEmptyScreen: boolean = true;
  unreadUUID : any;

  ngOnInit(): void {
    this.subscribeEvents();
    this.scrollToBottom();
  }

  subscribeEvents() {

    let subscription1 = this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
        if (this.connectionDetails.customdata) {
          let decodedCustomData = decodeURI(this.connectionDetails.customdata);
          if (decodedCustomData) {
            this.parsedCustomData = JSON.parse(decodedCustomData);
          }
        }
      }
    });

    let subscription2 = this.websocketService.userMessageResponse$.subscribe((response: any) => {
      if (response && Object.keys(response).length > 0) {
        this.processUserMessage(response);
      }
    });

    let subscription3 = this.websocketService.agentMessageResponse$.subscribe((response: any) => {
      if (response && Object.keys(response).length > 0) {
        // this.prepareConversation();
        this.processAgentMessages(response);
      }
    });


    let subscription4 = this.handleSubjectService.processAgentOrTranscriptResponseSubject.subscribe((userInputData: any) => {
      if (userInputData) {
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
        let userAgentMessage = {
          "author": {
            "id": '',
            "firstName": '',
            "email": '',
            "lastName": '',
            "profImage": '', //url
            "type": ""
          },
          "botId": this.connectionDetails.botId,
          "sessionId": '',
          "conversationId": userInputData.conversationid,
          "timestamp": '',
          "accountId": '',
          "orgId": '',
          "userId": '',
          "message": this.sanitizeHTMLPipe.transform(userInputData.value), // user or agent sent message
          "isTemplate": false,
          "isAttachement": false,
          "attachmentDetails": [{
            "fileName": '',
            "fileUrl": '',
            "fileType": ''
          }],
          "templatePayload": [],
          "sentType": '' // send (or) copy
        }
        // this.prepareConversation();
        if (userInputData.author.type === 'USER') {
          this.processTranscriptData(userInputData);
          if (this.commonService.OverRideMode) {
            userAgentMessage['type'] = 'user';
            userAgentMessage.author['type'] = 'user';
            this.websocketService.emitEvents(EVENTS.user_sent_message, userAgentMessage)
            this.websocketService.emitEvents(EVENTS.user_message, user_messsage);
          } else {
            this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
          }
        } else {
          this.processAgentMessages(userInputData);
          userAgentMessage['type'] = 'agent';
          userAgentMessage.author['type'] = 'agent';
          this.websocketService.emitEvents(EVENTS.user_sent_message, userAgentMessage)
        }
      }
    });

    let subscription5 = this.handleSubjectService.userHistoryDataSubject$.subscribe((res: any) => {
      console.log(res, "response inside history");
      if (res && res.messages.length > 0) {
        this.historyResponse = res.messages || [];
        if (this.historyResponse?.length) {
          this.showEmptyScreen = false;
        }
        // this.prepareConversation();
      }
    });

    let subscription6 = this.handleSubjectService.callConversationSuggestions$.subscribe((response: any) => {
      console.log("------------resposne of agent request")
      if (response?.data && Object.keys(response?.data).length > 0) {
        this.processAssistResponse(response);
      }
    });

    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);
    this.subscriptionsList.push(subscription5);
    this.subscriptionsList.push(subscription6);

  }

  processUserMessage(response) {
    // this.prepareConversation();
    this.commonService.isCallConversation === true ? this.processTranscriptData(response) : '';
  }

  // prepareConversation() {
  //   $(`#scriptContainer .empty-data-no-agents`).addClass('hide');
  // }


  scrollToBottom(flag?) {
    if (flag || (this.commonService.activeTab == this.projConstants.TRANSCRIPT && this.commonService.scrollContent[this.projConstants.TRANSCRIPT].scrollAtEnd))
      this.scrollToBottomEvent.emit(true);
  }

  processAssistResponse(response){

    let data = this.commonService.confirmationNodeRenderDataTransform(response.data);
  
    if (this.commonService.isCallConversation === true && data.suggestions) {

      let bulbCount = (data.suggestions.dialogs?.length || 0) + (data.suggestions.faqs?.length || 0) + (data.suggestions.searchassist?.snippets?.length || 0) + (this.commonService.formatSearchResponse(data)?.articles?.length || 0);

      let userBubbleIndex = this.transcriptArray.findLastIndex((data) => data.type == ProjConstants.INCOMING);

      this.transcriptArray[userBubbleIndex].count = bulbCount;
      this.transcriptArray[userBubbleIndex].suggestionUUID = response.uuid;
    }
  }

  processTranscriptData(data) {
    let time = new Date();
    let timeStr = this.formatAMPMPipe.transform(time);
    let uuid = this.randomUUidPipe.transform() + this.randomUUidPipe.transform();
    this.showEmptyScreen = false;

    this.transcriptArray.push({ data: data, timeStr: timeStr, type: ProjConstants.INCOMING, uuid: uuid });
    this.transcriptArray = structuredClone(this.transcriptArray);

    this.scrollToBottom();
    this.updateNewMessageUUIDList(uuid, IdReferenceConst.OTHER_BUBBLE);
  }

  processAgentMessages(data) {
    let time = new Date();
    let timeStr = this.formatAMPMPipe.transform(time);
    let uuid = this.randomUUidPipe.transform() + this.randomUUidPipe.transform();
    this.showEmptyScreen = false;
    //  ["agent_message",{"botId":"st-760d56df-7303-5968-baae-fc4b3a6d5057","orgId":"o-e8bde714-ea18-5b2a-8d59-648fb1ba49ee","accountId":"62b400e7e8d0a17ed980fc3f","type":"text","conversationId":"c-0ead79b-28a0-422a-ab91-bab8372345e2","value":"One night.","author":{"type":"AGENT","id":"u-0609dd49-12b7-5432-9cc6-afb2f41128fe","firstName":"dev","lastName":"test"},"event":"agent_message","_id":"ms-1b113b73-d52e-5807-a990-5286b79f81a3"}]
    // let dataConetentTabOfTranscript = $('#scriptContainer .data-contnet');
    // let currentBubbleHtml = `
    // <div class="current-user-bubble" id="currentUser-${uuid}">
    // <div class="name-with-time">
    //     <div class="u-time">${timeStr}</div>
    //     <div class="u-name">You</div>
    // </div>
    // <div class="bubble-data">
    //     <div class="b-text">${data.value}</div>
    // </div>
    // </div>`;
    // dataConetentTabOfTranscript.append(currentBubbleHtml);

    this.transcriptArray.push({ data: data, timeStr: timeStr, type: ProjConstants.OUTGOING, uuid: uuid });
    this.transcriptArray = structuredClone(this.transcriptArray);

    this.scrollToBottom();
    this.updateNewMessageUUIDList(uuid, IdReferenceConst.CURRENTUSER_BUBBLE);
  }

  // new messages count and rendering code

  updateNumberOfMessages() {
    if (this.commonService.activeTab == this.projConstants.TRANSCRIPT) {
      this.commonService.scrollContent[ProjConstants.TRANSCRIPT].numberOfNewMessages += 1;
    }
  }

  updateNewMessageUUIDList(responseId, actulaId) {
    this.updateNumberOfMessages();
    if (!this.commonService.scrollContent[ProjConstants.TRANSCRIPT].scrollAtEnd) {
      if (this.commonService.scrollContent[ProjConstants.TRANSCRIPT].numberOfNewMessages) {
        if (this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedMessagesUUIDlist.indexOf(responseId) == -1) {
          this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedMessagesUUIDlist.push(responseId);
          this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedIdList.push(actulaId + '-' + responseId)
        }
        this.addUnreadMessageHtml();
      }
    }else{
      this.unreadUUID = null;
    }
  }

  addUnreadMessageHtml() {
    let newAddedMsgUuid = this.commonService.scrollContent[ProjConstants.TRANSCRIPT]?.newlyAddedMessagesUUIDlist[0];
    this.unreadUUID = newAddedMsgUuid ? newAddedMsgUuid : null;
  }

  onScroll() {
    if (!this.scrollEventDone) {
      console.log("scroll event ******");
      let trascriptTextEle = document.getElementById('transcriptTabHistoryText');
      let scrollInView = !this.designAlterService.isScrolledIntoView(trascriptTextEle)
      console.log(scrollInView);
      if (scrollInView) {
        this.scrollEventDone = true;
        this.transcriptScrollTopText = 'Agent Joined the Conversation';
        setTimeout(() => {
          let scrollHeight = this.designAlterService.getScrollElementHeight('transcriptTabHistoryText');
          this.scrollToTranscriptElement.emit(scrollHeight);
        }, 100);
      }
    }

  }

  buldClick(trans){
    trans.data.bulbClick = true;
    this.handleSubjectService.setActiveTab(this.projConstants.ASSIST);
    this.designAlterService.scrollToEle(`automationSuggestions-${trans.data.suggestionUUID}`)
  }

}
