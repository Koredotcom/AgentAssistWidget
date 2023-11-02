import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-user-bot-history',
  templateUrl: './user-bot-history.component.html',
  styleUrls: ['./user-bot-history.component.scss']
})
export class UserBotHistoryComponent implements OnInit, OnDestroy{

  subs = new SubSink();
  connectionDetails : any;
  historyResponse : any = [];
  projConstants : any = ProjConstants;


  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.getUserBotHistory(this.connectionDetails);
      }
    });
  }

  getUserBotHistory(params){
    let userBotConversationDetails = this.rootService.getUserBotConvosDataDetails();
    let botId = userBotConversationDetails?.botId || params?.botId;
    let userId = userBotConversationDetails?.userId;
    let sessionId = userBotConversationDetails?.sessionId;  
    if((userBotConversationDetails?.botId || this.rootService.connectionDetails?.botId) && userBotConversationDetails?.userId && userBotConversationDetails?.sessionId) {
      this.serviceInvoker.invoke('get.userBotHistory', { botId: botId, convId: params.conversationId, userId, sessionId }, {}, { transcriptHistory: 'true', botId : botId }, params.agentassisturl).subscribe((data)=> {
        if(data && data.messages){
          this.historyResponse = data.messages;
          // this.formatHistoryResponse();
        }
      });
    }
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  // formatHistoryResponse(){
  //   for(let hisRes of this.historyResponse){
  //     hisRes = this.commonService.confirmationNodeRenderForHistoryDataTransform(hisRes);
  //     let result : any = this.templateRenderClassService.getResponseUsingTemplateForHistory(hisRes);
  //     hisRes.isTemplateRender = this.templateRenderCheck(hisRes,result);
  //     hisRes.template = this.getTemplateHtml(hisRes.isTemplateRender, result);
  //   }
  // }


}
