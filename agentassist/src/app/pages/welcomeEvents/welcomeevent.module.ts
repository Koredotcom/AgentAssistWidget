import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeeventComponent } from './welcomeevent.component';
import { NewWelcomeEventComponent } from './new-welcome-event/new-welcome-event.component';
import { PrioritySettingsComponent } from './priority-settings/priority-settings.component';
import { OnConnectDialogComponent } from './on-connect-dialog/on-connect-dialog.component';
import { GreetingMessagesComponent } from './greeting-messages/greeting-messages.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes: Routes = [
  { path: '', component:  WelcomeeventComponent}
];

@NgModule({
  declarations: [WelcomeeventComponent, NewWelcomeEventComponent, PrioritySettingsComponent, OnConnectDialogComponent, GreetingMessagesComponent],
  imports: [
    DragDropModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class WelcomeeventModule { }
