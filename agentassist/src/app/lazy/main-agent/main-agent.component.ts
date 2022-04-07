import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SMILEYLIST } from 'src/app/data/agent-chat-history.model';
import { AgentChatService } from '../../services/dataservices/agent-chat.service';
import * as _ from 'underscore';
@Component({
  selector: 'app-main-agent',
  templateUrl: './main-agent.component.html',
  styleUrls: ['./main-agent.component.scss']
})
export class MainAgentComponent implements OnInit {
  smileyList: {imgSrc: string, title: string}[] = [];
  hashDetails: any = {};
  agentDetails: any = null;
  activeSmiley: any = [];
  isLoading: boolean = true;
  constructor(private route: ActivatedRoute,
              private agentService: AgentChatService) { }

  ngOnInit() {
    this.smileyList = SMILEYLIST;
    this.route.fragment.subscribe((fragment: string) => {
      this.hashDetails = JSON.parse(atob(fragment));
      let params = {
        userId: this.hashDetails.uI,
        botId: this.hashDetails.botInfo._id
      }
      this.agentService.getAgentChatData(params, this.hashDetails.aT).subscribe(res=>{
        this.agentDetails = res;
        this.activeSmiley = _.pluck(res.conversationInfo.sentimentAnalysis.messageTone, 'tone_name');
        this.isLoading = false;
      }, err=>{
        this.isLoading = false;
       });
    });
    }

}
