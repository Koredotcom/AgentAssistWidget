import { Component, OnInit } from '@angular/core';
import { AgentChatService } from '../../services/dataservices/agent-chat.service';
import * as _ from 'underscore';
import { TaskList } from '../../data/agent-chat-history.model';

@Component({
  selector: 'app-agent-conver-flow',
  templateUrl: './agent-conver-flow.component.html',
  styleUrls: ['./agent-conver-flow.component.scss']
})
export class AgentConverFlowComponent implements OnInit {
  chatList: TaskList[] = []
  voiceList: TaskList[] = [];
  allList: TaskList[] = [];
  listToShow: TaskList[] = [];

  constructor(private agentService: AgentChatService) { }

  ngOnInit() {
    this.agentService.getAgentChatData().subscribe(res=>{
      this.addToList(res.conversationInfo.conversationDetails);
    }, err=>{
      // this.addToList(err.conversationInfo.conversationDetails);
    });
  }

  onPageChange($event) { this.listToShow =  this.allList.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize); }

  addToList(info) {
    let tempChatList = _.findWhere(info, {channel: 'rtm'})?.conversationInfo.conversationFlow.filter(o=>{return o.status == 'completedTask' || o.status == 'failedTask'}) || [];
    let tempVoiceInfo = _.reject(info, {channel: 'rtm'});
    let tempVoiceList = [];
    if(tempVoiceInfo.length) { tempVoiceList = tempVoiceInfo[0].conversationInfo.conversationFlow.filter(o=>{return o.status == 'completedTask' || o.status == 'failedTask'}); }
    this.allList = tempVoiceList.concat({status: 'divide'});
    this.allList = this.allList.concat(tempChatList);
    this.allList = this.allList.map(o => new TaskList(o));
    this.listToShow = this.allList.slice(0, 5);
  }

  scrollChat(msg: string) {
    this.agentService.scrollToElement(msg);
  }

}
