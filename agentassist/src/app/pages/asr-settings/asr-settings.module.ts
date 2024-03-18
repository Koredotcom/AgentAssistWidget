import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { LanguagesSpeechComponent } from './languages-speech/languages-speech.component';
import { AdvSettingsComponent } from '../settings/adv-settings/adv-settings.component';

const routes: Routes = [
  { path: '', component:  LanguagesSpeechComponent}
];

@NgModule({
  declarations: [
    LanguagesSpeechComponent,
    AdvSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class AsrSettingsModule { }
