import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoachingGroupCreateComponent } from './coaching-group-create/coaching-group-create.component';
import { CoachingRuleCreateComponent } from './coaching-rule-create/coaching-rule-create.component';
import { CoachingComponent } from './coaching.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { UtteranceComponent } from './trigger/utterance/utterance.component';
import { SpeechAnalysisComponent } from './trigger/speech-analysis/speech-analysis.component';
import { VariableComponent } from './trigger/variable/variable.component';
import { DialogComponent } from './trigger/dialog/dialog.component';
import { NudgeAgentComponent } from './then-action/nudge-agent/nudge-agent.component';
import { HintAgentComponent } from './then-action/hint-agent/hint-agent.component';
import { AlertManagerComponent } from './then-action/alert-manager/alert-manager.component';
import { EmailManagerComponent } from './then-action/email-manager/email-manager.component';
import { FaqComponent } from './then-action/faq/faq.component';
import { UtteranceAdherenceComponent } from './then-action/utterance-adherence/utterance-adherence.component';

const routes: Routes = [
  { path: '', component:  CoachingComponent}
];

@NgModule({
  declarations: [CoachingGroupCreateComponent, CoachingRuleCreateComponent, CoachingComponent, UtteranceComponent, SpeechAnalysisComponent, VariableComponent, DialogComponent, NudgeAgentComponent, HintAgentComponent, AlertManagerComponent, EmailManagerComponent, FaqComponent, UtteranceAdherenceComponent],
  imports: [
    DragDropModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CoachingModule { }
