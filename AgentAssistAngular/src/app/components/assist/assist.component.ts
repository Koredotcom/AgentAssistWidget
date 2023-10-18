import { Component, OnInit } from '@angular/core';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss']
})
export class AssistComponent implements OnInit{

  connectionDetails : any = {};
  loader : boolean = false;

  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService){
    
  }

  ngOnInit(): void {
    
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.getAssistData(this.connectionDetails);
      }
    })
  }

  getAssistData(params) {
    this.loader = true;
    let feedback = this.assistFeedback(params);
    let history = this.assistHistory(params);
    forkJoin([feedback, history]).subscribe(res => {
      console.log(res, "feedback");
      this.loader = false;
    });
  }

  assistHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.assistHistorySA' : 'get.assistHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { historyAPiCall: 'true', botId : botId }, params.agentassisturl);
  }

  assistFeedback(params) {
    return this.serviceInvoker.invoke('get.assistFeedback', { tab: 'assist', botId: params.botId }, {}, {botId : params.botId }, params.agentassisturl);
  }


}
