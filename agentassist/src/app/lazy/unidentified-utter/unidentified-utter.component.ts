import { Component, OnInit } from '@angular/core';
import { AgentChatService } from '../../services/dataservices/agent-chat.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-unidentified-utter',
  templateUrl: './unidentified-utter.component.html',
  styleUrls: ['./unidentified-utter.component.scss']
})
export class UnidentifiedUtterComponent implements OnInit {

  utterancesList: string[] = [];
  utterancesToShow = [];
  voiceUtter = [];
  chatUtter = [];
  

  constructor(private agentService: AgentChatService) { }

  ngOnInit() {
    this.agentService.getAgentChatData().subscribe(res=>{
      this.addUtterancesList(res.conversationInfo.conversationDetails);
    }, err=>{
      this.addUtterancesList(err.conversationInfo.conversationDetails);
    });
    this.utterancesToShow = this.utterancesList.slice(0, 5);
  }

  addUtterancesList(info) { 
    let tempChatList = _.findWhere(info, {channel: 'rtm'})?.conversationInfo.conversationFlow.filter(o=>{return o.status == 'unidentifiedIntent'}) || [];
    let tempVoiceInfo = _.reject(info, {channel: 'rtm'});
    let tempVoiceList = [];
    if(tempVoiceInfo.length) { tempVoiceList = _.reject(info, {channel: 'rtm'})[0].conversationInfo.conversationFlow.filter(o=>{return o.status == 'unidentifiedIntent'}); }
    this.utterancesList = tempVoiceList.concat({status: 'divide'});
    this.utterancesList = this.utterancesList.concat(tempChatList);
    this.utterancesToShow = this.utterancesList.slice(0, 5);
  }

  onPageChange($event) { 
    this.utterancesToShow =  this.utterancesList.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize); 
  }

  scrollChat(msg: string) {
    this.agentService.scrollToElement(msg);
  }

}
