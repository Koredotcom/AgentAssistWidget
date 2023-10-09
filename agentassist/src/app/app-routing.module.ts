import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '@kore.services/auth.guard';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { ConversationalLogsComponent } from './pages/conversational-logs/conversational-logs.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { AutomationChannelsComponent } from './pages/automation-channels/automation-channels.component';
import { BTContainerComponent } from './pages/bt-container/bt-container.component';
import { AutomationComponent } from './pages/automation/automation.component';
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
          { path: 'usecases', loadChildren: () => import('./pages/agent-usecases/agent-usecases.module').then(m => m.AgentUsecasesModule) },
          { path: 'welcomeEvents', loadChildren: () => import('./pages/welcomeEvents/welcomeevent.module').then(m => m.WelcomeeventModule) },
          { path: 'channels', component: AutomationChannelsComponent },
          { path: 'conversationalLogs', component: ConversationalLogsComponent },
          { path: 'languages', component: LanguagesSpeechComponent },
          { path: 'searchAssist', component: SearchAssistComponent},
          { path: 'coaching', loadChildren: () => import('./pages/coaching/coaching.module').then(m => m.CoachingModule)},
          { path: 'guided-checklist', loadChildren: () => import('./pages/guided-checklist/guided-checklist.module').then(m => m.GuidedChecklistModule)},
          { path: 'advanced-nlu', loadChildren: () => import('./pages/ai-config/ai-config.module').then(m => m.AiConfigModule)},
          { path: '**', redirectTo: (isSmartassist ? 'coaching' : 'usecases') },
        ]
      },
      {
        path: 'onboarding', component: OnboardingComponent
      },
      { path: 'bt', component: AutomationComponent },
      { path: 'bt/:type', component: BTContainerComponent },
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/agentassist-dashboard/agentassist-dashboard.module').then(m => m.AgentassistDashboardModule)},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
