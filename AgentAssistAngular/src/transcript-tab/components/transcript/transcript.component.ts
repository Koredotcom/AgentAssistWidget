import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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


@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent implements OnInit {

  @Output() scrollToBottomEvent = new EventEmitter();

  constructor(private websocketService: WebSocketService,
    private handleSubjectService: HandleSubjectService,
    public commonService: CommonService,
    private formatAMPMPipe: FormatAMPMPipe,
    private sanitizeHTMLPipe: SanitizeHtmlPipe,
    private randomUUidPipe : RandomUUIDPipe) { }

  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;

  connectionDetails: any;
  parsedCustomData: any;

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
          this.parsedCustomData = JSON.parse(decodedCustomData);
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
        this.prepareConversation();
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
        this.prepareConversation();
        if (userInputData.author.type === 'USER') {
          this.processTranscriptData(userInputData);
          this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
        } else {
          this.processAgentMessages(userInputData)
        }
      }
    })

    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);

  }

  processUserMessage(response) {
    this.prepareConversation();
    this.commonService.isCallConversation === true ? this.processTranscriptData(response) : '';
  }

  prepareConversation() {
    $(`#scriptContainer .empty-data-no-agents`).addClass('hide');
  }


  scrollToBottom() {
    if (this.commonService.activeTab == this.projConstants.TRANSCRIPT && this.commonService.scrollContent[this.projConstants.TRANSCRIPT].scrollAtEnd)
      this.scrollToBottomEvent.emit(true);
  }

  processTranscriptData(data) {
    this.updateNumberOfMessages();
    let time = new Date();
    let timeStr = this.formatAMPMPipe.transform(time);
    let uuid = this.randomUUidPipe.transform();
    //  ["user_message", { "botId": "st-760d56df-7303-5968-baae-fc4b3a6d5057", "orgId": "o-e8bde714-ea18-5b2a-8d59-648fb1ba49ee", "accountId": "62b400e7e8d0a17ed980fc3f", "type": "text", "conversationId": "c-423773d-0e9b-4510-93c3-5a492e75ae08", "value": "Operator.", "author": { "type": "USER", "id": "u-cb358b24-cc42-5843-9040-d0a61d1f7cc7", "firstName": "Kore", "lastName": "User" }, "event": "user_message", "_id": "ms-3ceba4be-0870-567a-a36d-236c749d4edb" }]
    let transcriptTab = $(`#scriptContainer .data-contnet`);
    let transcriptHtml = `
        <div class="other-user-bubble" id="otherBubble-${uuid}">
            <div class="name-with-time">
                <div class="u-name">${this.parsedCustomData?.userName || this.parsedCustomData?.fName + this.parsedCustomData?.lName || 'Customer'}</div>
                <div class="u-time">${timeStr}</div>
            </div>
            <div class="bubble-data" id="userInputMsg">
                <div class="b-text">${data.value}</div>
            </div>
        </div>`;
    transcriptTab.append(transcriptHtml);
    this.scrollToBottom();
    this.updateNewMessageUUIDList(uuid, IdReferenceConst.OTHER_BUBBLE);
  }

  processAgentMessages(data) {
    this.updateNumberOfMessages();
    let time = new Date();
    let timeStr = this.formatAMPMPipe.transform(time);
    let uuid = this.randomUUidPipe.transform();
    //  ["agent_message",{"botId":"st-760d56df-7303-5968-baae-fc4b3a6d5057","orgId":"o-e8bde714-ea18-5b2a-8d59-648fb1ba49ee","accountId":"62b400e7e8d0a17ed980fc3f","type":"text","conversationId":"c-0ead79b-28a0-422a-ab91-bab8372345e2","value":"One night.","author":{"type":"AGENT","id":"u-0609dd49-12b7-5432-9cc6-afb2f41128fe","firstName":"dev","lastName":"test"},"event":"agent_message","_id":"ms-1b113b73-d52e-5807-a990-5286b79f81a3"}]
    let dataConetentTabOfTranscript = $('#scriptContainer .data-contnet');
    let currentBubbleHtml = `
    <div class="current-user-bubble" id="currentUser-${uuid}">
    <div class="name-with-time">
        <div class="u-time">${timeStr}</div>
        <div class="u-name">You</div>
    </div>
    <div class="bubble-data">
        <div class="b-text">${data.value}</div>
    </div>
    </div>`;
    dataConetentTabOfTranscript.append(currentBubbleHtml);
    this.scrollToBottom();
    this.updateNewMessageUUIDList(uuid,IdReferenceConst.CURRENTUSER_BUBBLE);
  }

  // new messages count and rendering code

  updateNumberOfMessages() {
    if(this.commonService.activeTab == this.projConstants.TRANSCRIPT){
      this.commonService.scrollContent[ProjConstants.TRANSCRIPT].numberOfNewMessages += 1;
      $(".scroll-bottom-btn").addClass("new-messages");
      $(".scroll-bottom-btn span").text(this.commonService.scrollContent[ProjConstants.TRANSCRIPT].numberOfNewMessages + ' new');
    }
  }

  updateNewMessageUUIDList(responseId, actulaId) {
    if (!this.commonService.scrollContent[ProjConstants.TRANSCRIPT].scrollAtEnd) {
      if (this.commonService.scrollContent[ProjConstants.TRANSCRIPT].numberOfNewMessages) {
        if (this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedMessagesUUIDlist.indexOf(responseId) == -1) {
          this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedMessagesUUIDlist.push(responseId);
          this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedIdList.push(actulaId + '-' + responseId)
        }
      }
      this.addUnreadMessageHtml();
    }
  }

  addUnreadMessageHtml() {
    if (!this.commonService.scrollContent[ProjConstants.TRANSCRIPT].scrollAtEnd && this.commonService.scrollContent[ProjConstants.TRANSCRIPT].numberOfNewMessages) {
      $('.unread-msg').remove();
      let unreadHtml = ` <div class="unread-msg last-msg-white-bg">
        <div class="text-dialog-task-end">Unread Messages</div>     
                   </div>`;
      for (let i = 0; i < this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedIdList.length; i++) {
        if (document.getElementById(this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedIdList[i])) {
          let elements: any = document.getElementById(this.commonService.scrollContent[ProjConstants.TRANSCRIPT].newlyAddedIdList[i]);
          elements?.insertAdjacentHTML('beforeBegin', unreadHtml);
          break;
        }
      }
    }
  }

}
