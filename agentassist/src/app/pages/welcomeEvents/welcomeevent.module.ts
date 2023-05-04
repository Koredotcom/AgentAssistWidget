import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { WelcomeeventComponent } from './welcomeevent.component';
import { NewWelcomeEventComponent } from './new-welcome-event/new-welcome-event.component';

const routes: Routes = [
  { path: '', component:  WelcomeeventComponent}
];

@NgModule({
  declarations: [WelcomeeventComponent, NewWelcomeEventComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class WelcomeeventModule { }
