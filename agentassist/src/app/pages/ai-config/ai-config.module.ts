import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiConfigComponent } from './ai-config/ai-config.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AzureConfigComponent } from './azure-config/azure-config.component';
import { OpenaiConfigComponent } from './openai-config/openai-config.component';


const routes: Routes = [
  { path: '', component:  AiConfigComponent}
];
@NgModule({
  declarations: [
    AiConfigComponent,
    AzureConfigComponent,
    OpenaiConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AiConfigModule { }
