import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidedChecklistComponent } from './guided-checklist/guided-checklist.component';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryChecklistComponent } from './primary-checklist/primary-checklist.component';
import { DynamicChecklistComponent } from './dynamic-checklist/dynamic-checklist.component';
import { ChecklistCreateComponent } from './common/checklist-create/checklist-create.component';
import { StageCreateComponent } from './common/stage-create/stage-create.component';
import { StepCreateComponent } from './common/step-create/step-create.component';
import { ChecklistService } from './checklist.service';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component:  GuidedChecklistComponent}
];

@NgModule({
  declarations: [
    GuidedChecklistComponent,
    PrimaryChecklistComponent,
    DynamicChecklistComponent,
    ChecklistCreateComponent,
    StageCreateComponent,
    StepCreateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [ChecklistService]
})
export class GuidedChecklistModule { }
