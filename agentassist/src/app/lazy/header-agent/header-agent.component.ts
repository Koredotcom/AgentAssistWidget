import { Component, OnInit } from '@angular/core';
import { AgentHeader } from '../../data/agent-chat-history.model';
import { AgentChatService } from '../../services/dataservices/agent-chat.service';

@Component({
  selector: 'app-header-agent',
  templateUrl: './header-agent.component.html',
  styleUrls: ['./header-agent.component.scss']
})
export class HeaderAgentComponent implements OnInit {
  headerDetails: AgentHeader;

  constructor(private agentService: AgentChatService) { }

  ngOnInit() {
    this.agentService.getAgentChatData().subscribe(res=>{
      this.headerDetails = new AgentHeader(res.conversationInfo);
    }, err=>{ 
      this.headerDetails = null;
    });
  }

}
