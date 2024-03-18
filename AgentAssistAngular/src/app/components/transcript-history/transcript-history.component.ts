import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
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
  userBotHostory = [];
  userAgentHistory = [];
  subs = new SubSink();
  connectionDetails : any;
  historyResponse : any = [];
  parsedCustomData : any;
  projConstants : any = ProjConstants;
  summary:any = {};
  @Input() wheeled = false;
  @Output() checkOldData = new EventEmitter();
  widgetLoader = true;
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
    this.widgetLoader = true;
    this.serviceInvoker.invoke('get.transcriptHistory', { convId: params.conversationId, botId : params.botId, isSummaryRequired: true, sessionId: this.rootService.userBotConversationDetails?.sessionId, experience:  this.rootService.connectionDetails?.channel}, {}, { botId : params.botId }, params.agentassisturl)
    .pipe(
      finalize(()=>{
        this.widgetLoader = false;
      })
    )
    .subscribe((data)=> {
      if(data) {
        this.historyResponse = data.result;
        this.userBotHostory = data.userBotMessages?.result /* [] */;
        this.userAgentHistory = data.userAgentMessages?.result /* [] */;

        (this.userBotHostory || [])
        .forEach((item)=>{
            if(typeof(item?.components[0]?.data?.text) === 'string'){
                try{
                    let a = JSON.parse(item?.components[0]?.data?.text);
                    if(typeof a === 'object' && a?.payload?.text){
                        item.components[0].data.text = a?.payload?.text;
                    }
                }catch(e){
                    
                }
            }
        });

        (this.userAgentHistory || [])
        .forEach((item)=>{
            if(typeof(item?.components[0]?.data?.text) === 'string'){
                try{
                    let a = JSON.parse(item?.components[0]?.data?.text);
                    if(typeof a === 'object' && a?.payload?.text){
                        item.components[0].data.text = a?.payload?.text;
                    }
                }catch(e){
                }
            }
        });
        
        this.summary.message = this.extractConversationSummary(data.summary.message || '');
        
        if((this.userBotHostory || [])?.length || (this.userAgentHistory || [])?.length){
            this.checkOldData.emit(true);
        }
      }
    });
  }

  extractConversationSummary(inputString=''){
    const conversationSummaryRegex = /Conversation Summary: (.+?)(?=\n\n|\n?$)/s;
    const match = inputString.match(conversationSummaryRegex);
    return match ? match[1].trim() : inputString;
  };
  
  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
