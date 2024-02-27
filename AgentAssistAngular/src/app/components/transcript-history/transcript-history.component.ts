import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-transcript-history',
  templateUrl: './transcript-history.component.html',
  styleUrls: ['./transcript-history.component.scss']
})
export class TranscriptHistoryComponent implements OnInit, OnDestroy{

// @ViewChild('transcriptScrollContainer', {static: false}) private transcriptScrollContainer: ElementRef<HTMLDivElement>

  subs = new SubSink();
  connectionDetails : any;
  historyResponse : any = [];
  parsedCustomData : any;
  projConstants : any = ProjConstants;

  constructor(private serviceInvoker: ServiceInvokerService,
    private rootService : RootService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails = this.rootService.getConnectionDetails();
        this.getTranscriptHistory(this.connectionDetails);
        this.parsedCustomData = Object.assign({},this.connectionDetails.customData);
      }
    });
  }


  getTranscriptHistory(params){
    this.serviceInvoker.invoke('get.transcriptHistory', { convId: params.conversationId }, {}, { botId : params.botId }, params.agentassisturl).subscribe((data)=> {
      if(data && data?.result?.length > 0) {
        this.historyResponse = data.result;
      }
    });
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
