import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentUsecasesComponent } from './agent-usecases.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConversationsComponent } from './conversations/conversations.component';


const routes: Routes = [
  { path: '', component: AgentUsecasesComponent }
];

@NgModule({
  declarations: [AgentUsecasesComponent, ConversationsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AgentUsecasesModule { }
