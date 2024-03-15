import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-convs-history-logs',
  templateUrl: './convs-history-logs.component.html',
  styleUrls: ['./convs-history-logs.component.scss']
})
export class ConvsHistoryLogsComponent implements OnInit {

  @Output() onClose = new EventEmitter();
  @Input() conversationId;
  @Input() sessionId;
  @Input() botId;
  @Input() userId;
  USECASES_LIMIT = 100;
  page = 0;
  dropDownOptions = [
    {name: 'All suggestions', description:'All suggestions made by AgentAssist will be shown'},
    {name: 'Selected suggestions', description:'AgentAssist suggestions used by the agent will be shown'},
    {name: 'Hide suggestions', description:'AgentAssist suggestions used by the agent will be shown'}
  ]
  selectedElement = this.dropDownOptions[2].name;
  chatHistData = [];
  isPendingOnScroll = false;
  constructor(
    private service: ServiceInvokerService,
    private cdRef: ChangeDetectorRef,
  ) { }
  hasMore = false;
  isLoading = true;
  ngOnInit(): void {
    // this.getclickedConversationHistory();
    this.getConvUserBot();
  }

  close() {
    this.onClose.emit();
  }
  isAgentJoined = false;

  getclickedConversationHistory(scroll = false){
    if(scroll){
      this.isPendingOnScroll = true;
    }
    this.isLoading = true;
    let params = {
      convId: this.conversationId,
      limit: this.USECASES_LIMIT,
      page: this.page,
    }
    this.service.invoke('conversation.history',params)
    .pipe(
      finalize(()=>{
        this.isPendingOnScroll = false;
        this.isLoading = false;
      })
    )
    .subscribe(res=>{
      res.result = res.userAgentMessages;
      if(res?.result?.length){
        this.page = this.page+1;
        this.hasMore = res.hasMore;
        if(!this.isAgentJoined){
          this.chatHistData.push({
            'interruption': true
          });
          this.isAgentJoined = true;
        }
        let userAgenthistoryData = this.historResponseType(res)
        this.chatHistData.push(...userAgenthistoryData);
        this.cdRef.detectChanges();
      }
    },
    (err)=>{
      console.log(err);
    })
  }

  historResponseType(response) {
    let Data = (response?.result || []).map(data=>{
      if (data.msgType === 'AGENT') {
        try {
          data.components[0].data.text = JSON.parse(data.components[0]?.data?.text).payload.text;
          return data;
        } catch(err) {
          return data;
        }
      } else {
        return data;
      }
    });
    return Data;
  }

  selectedDropDown(data){
    this.selectedElement = data.name;
  }

  onReachEnd(event){
    if(this.hasMore && event.target.scrollTop > 0 && !this.isLoading){
      this.getclickedConversationHistory(true)
    }
  }
  historyData = [];
  getConvUserBot(){
    let params = {
      botId: this.botId,
      userId: this.userId,
      sessionId: this.sessionId,
    };
    this.service.invoke('conversation.userbot', params)
    .pipe(finalize(()=>{
      this.getclickedConversationHistory();
    }))
    .subscribe((data)=>{
      this.chatHistData.push(...data.messages);
      // this.historyData = data ? data : [];
    });
  }
}
