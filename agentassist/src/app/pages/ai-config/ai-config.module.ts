import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiConfigComponent } from './ai-config/ai-config.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  { path: '', component:  AiConfigComponent}
];
@NgModule({
  declarations: [
    AiConfigComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AiConfigModule { }
