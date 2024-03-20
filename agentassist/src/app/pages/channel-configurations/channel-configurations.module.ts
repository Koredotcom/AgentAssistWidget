import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AutomationChannelsComponent } from './automation-channels/automation-channels.component';
import { VoiceSettingsComponent } from '../voice-settings/voice-settings.component';

const routes: Routes = [
  { path: '', component:  AutomationChannelsComponent}
];


@NgModule({
  declarations: [
    AutomationChannelsComponent,
    VoiceSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class ChannelConfigurationsModule { }
