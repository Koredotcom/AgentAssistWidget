import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ConversationalLogsComponent } from './conversational-logs.component';
import { ConvsHistoryLogsComponent } from './convs-history-logs/convs-history-logs.component';

const routes: Routes = [
  { path: '', component:  ConversationalLogsComponent}
];

@NgModule({
  declarations: [
    ConversationalLogsComponent,
    ConvsHistoryLogsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class ConversationalLogsModule { }
