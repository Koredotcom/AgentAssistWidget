import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-convs-history-logs',
  templateUrl: './convs-history-logs.component.html',
  styleUrls: ['./convs-history-logs.component.scss']
})
export class ConvsHistoryLogsComponent implements OnInit {

  @Output() onClose = new EventEmitter();
  @Input() conversationId;
  dropDownOptions = [
    {name: 'All suggestions', description:'All suggestions made by AgentAssist will be shown'},
    {name: 'Selected suggestions', description:'AgentAssist suggestions used by the agent will be shown'},
    {name: 'Hide suggestions', description:'AgentAssist suggestions used by the agent will be shown'}
  ]
  selectedElement = this.dropDownOptions[2].name;
  chatHistData = [];
  constructor(private service: ServiceInvokerService) { }

  ngOnInit(): void {
    this.getclickedConversationHistory()
  }

  close() {
    this.onClose.emit();
  }

  getclickedConversationHistory(){
    let params = {
      botId:'dsfdf',
      convId: this.conversationId
    }
    this.service.invoke('conversation.history',params).subscribe(res=>{
      console.log('xxxxxxxxxxxxxx', res);
      this.chatHistData = res;
    })
  }

  selectedDropDown(data){
    this.selectedElement = data.name;
  }
}
