import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { FormatAmpmPipe } from 'src/app/pipes/format-ampm.pipe';
import { RandomUuidPipe } from 'src/app/pipes/random-uuid.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { ProjConstants, RenderResponseType } from 'src/app/proj.const';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent  implements OnInit, OnDestroy{

  @Input() maxButton;
  @Output() maxMinButtonClick = new EventEmitter();
  @ViewChild('transcriptTabHistoryText', {static: false}) private transcriptTabHistoryText: ElementRef<HTMLDivElement>
  

  subs = new SubSink();
  parsedCustomData : any;
  transcriptArray: any = [];
  connectionDetails : any = {};

  showEmptyScreen: boolean = true;

  projConstants : any = ProjConstants;

  userBotConversationShow: boolean = false;
  transcriptScrollTopText: string = 'Scroll up for Bot Conversation History';
  hideUserBotHistory : boolean = true;


  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService,
    private websocketService : WebSocketService, private formatAMPMPipe : FormatAmpmPipe,
    private randomUUidPipe : RandomUuidPipe,private handleSubjectService: HandleSubjectService,
    private sanitizeHTMLPipe : SanitizeHtmlPipe){
  }

  ngOnInit(): void {
    this.subscribeEvents();
    // this.sampleMessages();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        // this.getTranscriptData(this.connectionDetails);
        this.parsedCustomData = Object.assign({},this.connectionDetails.customData);
        // if (this.connectionDetails.customData) {
        //   let decodedCustomData = decodeURI(this.connectionDetails.customData);
        //   if (decodedCustomData) {
        //     this.parsedCustomData = JSON.parse(decodedCustomData);
        //   }
        // }
      }
    });

    this.subs.sink = this.websocketService.userMessageResponse$.subscribe((response: any) => {
      if (response && Object.keys(response)?.length > 0) {
        this.processUserMessage(response);
      }
    });

    this.subs.sink = this.websocketService.agentMessageResponse$.subscribe((response: any) => {
      if (response && Object.keys(response)?.length > 0) {
        // this.prepareConversation();
        this.processAgentMessages(response);
      }
    });

    this.subs.sink = this.handleSubjectService.processAgentOrTranscriptResponseSubject.subscribe((userInputData: any) => {
      if (userInputData) {
        let agent_assist_request = {
          'author': {
            "firstName": userInputData.author?.firstName,
            "lastName": userInputData.author?.lastName,
            "type": userInputData.author?.type
          },
          'botId': this.connectionDetails.botId,
          'conversationId': userInputData.conversationid,
          'experience': this.connectionDetails?.channel,
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
          if (!this.rootService.OverRideMode) {
            this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request);
          } else {
            userAgentMessage['type'] = 'user';
            userAgentMessage.author['type'] = 'user';
            this.websocketService.emitEvents(EVENTS.user_sent_message, userAgentMessage)
            this.websocketService.emitEvents(EVENTS.user_message, user_messsage);
          }
        } else {
          this.processAgentMessages(userInputData);
          userAgentMessage['type'] = 'agent';
          userAgentMessage.author['type'] = 'agent';
          this.websocketService.emitEvents(EVENTS.user_sent_message, userAgentMessage)
        }
      }
    });

    this.subs.sink = this.handleSubjectService.callConversationSuggestions$.subscribe((response: any) => {
      if (response?.data && Object.keys(response?.data)?.length > 0) {
        this.processAssistResponse(response);
      }
    });

    this.subs.sink = this.rootService.userBotHistory$.subscribe((data : any) => {
      if(data && data.messages?.length > 0){
        this.hideUserBotHistory = false;
      }else{
        this.hideUserBotHistory = true;
      }
    });

  }

  // getTranscriptData(params){
  //   this.getUserBotHistory(params);
  // }

  // getUserBotHistory(params){
  //   let userBotConversationDetails = this.rootService.getUserBotConvosDataDetails();
  //   let botId = userBotConversationDetails?.botId || params?.botId;
  //   let userId = userBotConversationDetails?.userId;
  //   let sessionId = userBotConversationDetails?.sessionId;  
  //   if((userBotConversationDetails?.botId || this.rootService.connectionDetails?.botId) && userBotConversationDetails?.userId && userBotConversationDetails?.sessionId) {
  //     this.serviceInvoker.invoke('get.userBotHistory', { botId: botId, convId: params.conversationId, userId, sessionId }, {}, { transcriptHistory: 'true', botId : botId }, params.agentassisturl).subscribe((res)=> {
        
  //     });
  //   }
  // }

  processUserMessage(response) {
    this.rootService.connectionDetails.isCallConversation === true ? this.processTranscriptData(response) : '';
  }

  processTranscriptData(data) {
    let time = new Date();
    let timeStr = this.formatAMPMPipe.transform(time);
    let uuid = this.randomUUidPipe.transform() + this.randomUUidPipe.transform();
    this.showEmptyScreen = false;

    this.transcriptArray.push({ data: data, timeStr: timeStr, type: ProjConstants.INCOMING, uuid: uuid });
    this.transcriptArray = structuredClone(this.transcriptArray);
  }

  processAgentMessages(data) {
    let time = new Date();
    let timeStr = this.formatAMPMPipe.transform(time);
    let uuid = this.randomUUidPipe.transform() + this.randomUUidPipe.transform();
    this.showEmptyScreen = false;

    this.transcriptArray.push({ data: data, timeStr: timeStr, type: ProjConstants.OUTGOING, uuid: uuid });
    this.transcriptArray = structuredClone(this.transcriptArray);
  }

  processAssistResponse(response){
    let data = response?.data;
    if (this.connectionDetails.isCallConversation === true && data.suggestions) {
      let bulbCount = (data.suggestions.dialogs?.length || 0) + (data.suggestions.faqs?.length || 0) + (data.suggestions.searchassist?.snippets?.length || 0) + (this.rootService.formatSearchResponse(data)?.articles?.length || 0);
      let userBubbleIndex = this.transcriptArray.findLastIndex((data) => data.type == ProjConstants.INCOMING);
      this.transcriptArray[userBubbleIndex].count = bulbCount;
      this.transcriptArray[userBubbleIndex].suggestionUUID = response.uuid;
    }
  }

  buldClick(trans){
    trans.data.bulbClick = true;
    this.rootService.bulbClick = true;
    this.rootService.setActiveTab(this.projConstants.ASSIST);
    if(document.getElementById(RenderResponseType.SUGGESTIONS + '-' + trans.suggestionUUID)){
      document.getElementById(RenderResponseType.SUGGESTIONS + '-' + trans.suggestionUUID).scrollIntoView();
    }
  }

  minMaxButtonClick(){
    this.maxMinButtonClick.emit(true);
  }

  onScroll() {
    if (!this.userBotConversationShow && !this.hideUserBotHistory) {
      if(this.transcriptTabHistoryText){
        let scrollInView = this.isScrolledIntoView();
        if (scrollInView) {
          this.userBotConversationShow = true;
          this.transcriptScrollTopText = 'Agent Joined the Conversation';
        }
      }
    }
  }

  isScrolledIntoView(){
    const rect = this.transcriptTabHistoryText.nativeElement.getBoundingClientRect();
    const topShown = rect.top >= 0;
    const bottomShown = rect.bottom <= window.innerHeight;
    return (topShown && bottomShown);
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
  
}
