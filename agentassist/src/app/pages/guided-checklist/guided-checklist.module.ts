import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidedChecklistComponent } from './guided-checklist/guided-checklist.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component:  GuidedChecklistComponent}
];

@NgModule({
  declarations: [
    GuidedChecklistComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class GuidedChecklistModule { }
