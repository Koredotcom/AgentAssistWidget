import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeeventComponent } from './welcomeevent.component';

const routes: Routes = [
  { path: '', component:  WelcomeeventComponent}
];

@NgModule({
  declarations: [WelcomeeventComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class WelcomeeventModule { }
