import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidedChecklistComponent } from './guided-checklist/guided-checklist.component';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryChecklistComponent } from './primary-checklist/primary-checklist.component';
import { DynamicChecklistComponent } from './dynamic-checklist/dynamic-checklist.component';
import { StepCreateComponent } from './common/step-create/step-create.component';
import { ChecklistService } from './checklist.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { StagesListComponent } from './common/stages-list/stages-list.component';
import { StageCreateComponent } from './common/create-checklist/create-checklist.component';
import { TriggerByComponent } from './common/trigger-by/trigger-by.component';
import { DeleteComponent } from './common/delete/delete.component';

const routes: Routes = [
  { path: '', component:  GuidedChecklistComponent}
];

@NgModule({
  declarations: [
    GuidedChecklistComponent,
    PrimaryChecklistComponent,
    DynamicChecklistComponent,
    StagesListComponent,
    StageCreateComponent,
    StepCreateComponent,
    TriggerByComponent,
    DeleteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [ChecklistService]
})
export class GuidedChecklistModule { }
