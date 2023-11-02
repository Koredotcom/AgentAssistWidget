import { Component, EventEmitter, Output } from '@angular/core';
import { FormatAmpmPipe } from 'src/app/pipes/format-ampm.pipe';
import { RandomUuidPipe } from 'src/app/pipes/random-uuid.pipe';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent {

  @Output() maxMinButtonClick = new EventEmitter();

  subs = new SubSink();
  parsedCustomData : any;
  transcriptArray: any = [];
  connectionDetails : any = {};

  showEmptyScreen: boolean = true;

  projConstants : any = ProjConstants;

  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService,
    private websocketService : WebSocketService, private formatAMPMPipe : FormatAmpmPipe,
    private randomUUidPipe : RandomUuidPipe){
  }

  ngOnInit(): void {
    this.subscribeEvents();
    this.sampleMessages();
  }

  sampleMessages(){
    setTimeout(() => {
      this.processTranscriptData(this.rootService.getUserMessage());
      this.processAgentMessages(this.rootService.getAgentMessage());
    }, 1000);
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.getTranscriptData(this.connectionDetails);
        if (this.connectionDetails.customdata) {
          let decodedCustomData = decodeURI(this.connectionDetails.customdata);
          if (decodedCustomData) {
            this.parsedCustomData = JSON.parse(decodedCustomData);
          }
        }
      }
    });

    this.subs.sink = this.websocketService.userMessageResponse$.subscribe((response: any) => {
      if (response && Object.keys(response).length > 0) {
        this.processUserMessage(response);
      }
    });

    this.subs.sink = this.websocketService.agentMessageResponse$.subscribe((response: any) => {
      if (response && Object.keys(response).length > 0) {
        // this.prepareConversation();
        this.processAgentMessages(response);
      }
    });

  }

  getTranscriptData(params){
    this.getUserBotHistory(params);
  }

  getUserBotHistory(params){
    let userBotConversationDetails = this.rootService.getUserBotConvosDataDetails();
    let botId = userBotConversationDetails?.botId || params?.botId;
    let userId = userBotConversationDetails?.userId;
    let sessionId = userBotConversationDetails?.sessionId;  
    if((userBotConversationDetails?.botId || this.rootService.connectionDetails?.botId) && userBotConversationDetails?.userId && userBotConversationDetails?.sessionId) {
      this.serviceInvoker.invoke('get.userBotHistory', { botId: botId, convId: params.conversationId, userId, sessionId }, {}, { transcriptHistory: 'true', botId : botId }, params.agentassisturl).subscribe((res)=> {
        
      });
    }
  }

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

    console.log(this.transcriptArray, 'transcript array');
    

    // this.scrollToBottom();
    // this.updateNewMessageUUIDList(uuid, IdReferenceConst.OTHER_BUBBLE);
  }

  processAgentMessages(data) {
    let time = new Date();
    let timeStr = this.formatAMPMPipe.transform(time);
    let uuid = this.randomUUidPipe.transform() + this.randomUUidPipe.transform();
    this.showEmptyScreen = false;

    this.transcriptArray.push({ data: data, timeStr: timeStr, type: ProjConstants.OUTGOING, uuid: uuid });
    this.transcriptArray = structuredClone(this.transcriptArray);

    console.log(this.transcriptArray, 'transcript array');
    
    // this.scrollToBottom();
    // this.updateNewMessageUUIDList(uuid, IdReferenceConst.CURRENTUSER_BUBBLE);
  }

  minMaxButtonClick(){
    console.log("min max button click");
    
    this.maxMinButtonClick.emit(true);
  }

  
}
