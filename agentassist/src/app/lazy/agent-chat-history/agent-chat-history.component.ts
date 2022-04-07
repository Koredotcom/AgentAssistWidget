import { Component, OnInit, ViewChild } from '@angular/core';
import { AgentChatService } from '../../services/dataservices/agent-chat.service';

import * as _ from 'underscore';
import { TemplatesChatHistoryComponent } from '../../pages/templates-chat-history/templates-chat-history.component';
declare const $: any;

@Component({
  selector: 'app-agent-chat-history',
  templateUrl: './agent-chat-history.component.html',
  styleUrls: ['./agent-chat-history.component.scss']
})
export class AgentChatHistoryComponent implements OnInit {

  chatHistData:any = {messages: []};
  searchIds: string[] = [];
  chatHistLite: {_id: string, msg: string} [] = [];

  @ViewChild(TemplatesChatHistoryComponent) histComp: TemplatesChatHistoryComponent;

  constructor(private agentService: AgentChatService) { }

  ngOnInit() {
    this.agentService.getAgentChatData().subscribe(res=>{
      this.chatHistData.messages = res.chatHistory;
      this.chatHistData.messages.forEach(res => {
        this.chatHistLite.push({
          _id: res._id,
          msg: res.components[0].data.text.toLowerCase()
        });
      });
    }, err=>{
      // this.chatHistData.messages = err.chatHistory;
    });
    this.agentService.scrollToMsg$.subscribe((res:any) =>{
      this.histComp.msgId = res;
      setTimeout(()=>{this.scrollToActiveElement();});
    }, err => {

    })
  }

  scrollToActiveElement() {
    var activeEle = <HTMLElement> document.querySelector('.response.active');
    if(activeEle) {
      var topPos = activeEle.offsetTop;
      document.getElementById('messageScrollDiv').scrollTop = topPos - $('.response.active').parent().height() - 30;
    }
  }

  searchChat(ev) {
    if(ev.target.value.length > 2) {
      this.searchIds = [];
      for(var i=0; i<this.chatHistLite.length; i++) {
        if(this.chatHistLite[i].msg.indexOf(ev.target.value.toLowerCase()) > -1) {
          this.searchIds.push(this.chatHistLite[i]._id);
        }
      }
      this.histComp.msgId = null
      this.histComp.msgIds = this.searchIds;
    }
    if(ev.target.value == '') {
      this.histComp.msgId = null
      this.histComp.msgIds = [];
      this.searchIds = [];
    }
  }

  findFirstRtm() {
    this.histComp.msgIds = [];
    this.histComp.msgId = _.findWhere(this.chatHistData.messages, {chnl: 'rtm'})._id;
    setTimeout(() => {
      this.scrollToActiveElement();
    });
  }

  findConToAgent() {
    this.histComp.msgIds = [];
    this.histComp.msgId = _.findWhere(this.chatHistData.messages, {tN: "ConnectToAgent"})._id;
    setTimeout(() =>{
      this.scrollToActiveElement();
    });
  }


}
