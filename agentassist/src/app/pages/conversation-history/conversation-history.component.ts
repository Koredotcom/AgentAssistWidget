import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-conversation-history',
  templateUrl: './conversation-history.component.html',
  styleUrls: ['./conversation-history.component.scss']
})
export class ConversationHistoryComponent implements OnInit {
  @Output() closed = new EventEmitter();
  @Input() conversationId;
  constructor(private service: ServiceInvokerService) { }

  ngOnInit(): void {
    this.getclickedConversationHistory()
  }

  close() {
    this.closed.emit();
  }

  getclickedConversationHistory(){
    let params = {
      botId:'dsfdf',
      convId: this.conversationId
    }
    this.service.invoke('conversation.history',params).subscribe(res=>{
      console.log('xxxxxxxxxxxxxx', res)
    })
  }
}
