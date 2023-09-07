import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentAspectComponent } from '../agent-aspect/agent-aspect.component';
import { CustomerAspectComponent } from '../customer-aspect/customer-aspect.component';
import { AutomationOverrideReportComponent } from '../automation-override-report/automation-override-report.component';
import { AutomationPerformanceComponent } from '../automation-performance/automation-performance.component';
import { AgentFeedbackComponent } from '../agent-feedback/agent-feedback.component';
import { ExhaustiveRepresentationComponent } from '../exhaustive-representation/exhaustive-representation.component';
import { DashboardFiltersComponent } from '../dashboard-filters/dashboard-filters.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard.component';

const routes: Routes = [
  { path: '', component:  DashboardComponent}
];


@NgModule({
  declarations: [DashboardComponent, AgentAspectComponent, CustomerAspectComponent, AutomationOverrideReportComponent, AutomationPerformanceComponent, AgentFeedbackComponent,ExhaustiveRepresentationComponent, DashboardFiltersComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AgentassistDashboardModule { }
