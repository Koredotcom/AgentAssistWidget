import { Component } from '@angular/core';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent {


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
        this.getmybotData(this.connectionDetails);
      }
    })
  }

  getmybotData(params) {
    let feedback = this.mybotFeedback(params);
    let history = this.mybotHistory(params);
    forkJoin([feedback, history]).subscribe(res => {
      console.log(res, "feedback");
    });
  }

  mybotHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.mybotHistorySA' : 'get.mybotHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { historyAPiCall: 'true', botId : botId }, params.agentassisturl)
  }

  mybotFeedback(params) {
    return this.serviceInvoker.invoke('get.mybotFeedback', { tab: 'mybot', botId: params.botId }, {}, {botId : params.botId }, params.agentassisturl);
  }
}
