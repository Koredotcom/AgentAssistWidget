import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoachingGroupCreateComponent } from './coaching-group-create/coaching-group-create.component';
import { CoachingRuleCreateComponent } from './coaching-rule-create/coaching-rule-create.component';
import { CoachingComponent } from './coaching.component';

const routes: Routes = [
  { path: '', component:  CoachingComponent}
];

@NgModule({
  declarations: [CoachingGroupCreateComponent, CoachingRuleCreateComponent, CoachingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CoachingModule { }
