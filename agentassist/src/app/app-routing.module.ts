import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '@kore.services/auth.guard';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { ConversationalLogsComponent } from './pages/conversational-logs/conversational-logs.component';
import { SeedDataResolver } from '@kore.services/resolvers/seed.data.resolver';
import { AgentsComponent } from './pages/agents/agents.component';
import { HistoryComponent } from './pages/history/history.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { AutomationChannelsComponent } from './pages/automation-channels/automation-channels.component';
import { BTContainerComponent } from './pages/bt-container/bt-container.component';
import { AutomationComponent } from './pages/automation/automation.component';
import { UserManagementComponent } from './pages/agent-settings/user-management/user-management.component';
import { LanguagesSpeechComponent } from './pages/languages-speech/languages-speech.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { SearchAssistComponent } from './pages/search-assist/search-assist.component';

let isSmartassist = false;
if(window.location.href.includes('smartassist')){
  isSmartassist = true;
}

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      appData: AppDataResolver
    },
    children: [
      { path: '', redirectTo: 'config', pathMatch: 'full' },
      {
        path: 'config', component: ConfigurationsComponent, children: [
          { path: '', redirectTo: (isSmartassist ? 'coaching' : 'usecases'), pathMatch: 'full' },
          { path: 'agents', component: AgentsComponent },
          { path: 'roleManagement', component: UserManagementComponent },
          { path: 'usecases', loadChildren: () => import('./pages/agent-usecases/agent-usecases.module').then(m => m.AgentUsecasesModule) },
          { path: 'welcomeEvents', loadChildren: () => import('./pages/welcomeEvents/welcomeevent.module').then(m => m.WelcomeeventModule) },
          { path: 'channels', component: AutomationChannelsComponent },
          { path: 'conversationalLogs', component: ConversationalLogsComponent },
          { path: 'languages', component: LanguagesSpeechComponent },
          { path: 'searchAssist', component: SearchAssistComponent},
          { path: 'coaching', loadChildren: () => import('./pages/coaching/coaching.module').then(m => m.CoachingModule)},
          { path: 'guided-checklist', loadChildren: () => import('./pages/guided-checklist/guided-checklist.module').then(m => m.GuidedChecklistModule)},
          // { path: 'widget-settings', loadChildren: () => import('./pages/widget-settings/widget-settings.module').then(m => m.WidgetSettingsModule)},
          { path: 'advanced-nlu', loadChildren: () => import('./pages/ai-config/ai-config.module').then(m => m.AiConfigModule)},
          { path: '**', redirectTo: (isSmartassist ? 'coaching' : 'usecases') },
        ]
      },
      {
        path: 'onboarding', component: OnboardingComponent
      },
      { path: 'bt', component: AutomationComponent },
      { path: 'bt/:type', component: BTContainerComponent },
      {
        path: 'history', component: HistoryComponent, children: [
          { path: '', redirectTo: 'conversationalLogs', pathMatch: 'full' },
          { path: '**', redirectTo: 'sessiontrends' },
        ]
      },
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/agentassist-dashboard/agentassist-dashboard.module').then(m => m.AgentassistDashboardModule)},
    ]
  },

  { path: 'chathistory', loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
