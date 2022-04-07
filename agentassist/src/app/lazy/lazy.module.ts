import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyRoutingModule } from './lazy-routing.module';
import { HeaderAgentComponent } from './header-agent/header-agent.component';
import { CallDetailsComponent } from './call-details/call-details.component';
import { ConversationFlowComponent } from './conversation-flow/conversation-flow.component';
import { MainAgentComponent } from './main-agent/main-agent.component';
import { AgentChatHistoryComponent } from './agent-chat-history/agent-chat-history.component';
import { SharedModule } from '../shared/shared.module';
import { MetaTagssComponent } from './meta-tagss/meta-tagss.component';
import { UnidentifiedUtterComponent } from './unidentified-utter/unidentified-utter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AgentConverFlowComponent } from './agent-conver-flow/agent-conver-flow.component';


@NgModule({
  declarations: [HeaderAgentComponent, CallDetailsComponent, ConversationFlowComponent, MainAgentComponent, AgentChatHistoryComponent, MetaTagssComponent, UnidentifiedUtterComponent, AgentConverFlowComponent],
  imports: [
    CommonModule,
    LazyRoutingModule,
    SharedModule,
    MatPaginatorModule
  ]
})
export class LazyModule { }
