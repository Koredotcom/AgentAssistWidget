import { Component } from '@angular/core';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent {

  connectionDetails : any = {};

  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService){
  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.getTranscriptData(this.connectionDetails);
      }
    })
  }

  getTranscriptData(params){
    this.getUserBotHistory(params);
    this.getTranscriptHistory(params);
  }

  getUserBotHistory(params){
    let userBotConversationDetails = this.rootService.getUserBotConvosDataDetails();
    let botId = userBotConversationDetails?.botId || params?.botId;
    let userId = userBotConversationDetails?.userId;
    let sessionId = userBotConversationDetails?.sessionId;    
    this.serviceInvoker.invoke('get.userBotHistory', { botId: botId, convId: params.conversationId, userId, sessionId }, {}, { transcriptHistory: 'true', botId : botId }, params.agentassisturl).subscribe((res)=> {
      
    })
  }

  getTranscriptHistory(params){
    this.serviceInvoker.invoke('get.transcriptHistory', { convId: params.conversationId }, {}, { transcriptHistory: 'true', botId : params.botId }, params.agentassisturl).subscribe((res)=> {
      
    })
  }
  
}
