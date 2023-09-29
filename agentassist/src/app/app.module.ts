import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
//import { ScrollTrackerDirective } from './components/dashboard-home/dashboard-home.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from "@kore.services/auth.guard";
import { AuthInterceptor } from '@kore.services/inteceptors/auth-interceptor';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { NotificationMessageComponent } from './components/notification-message/notification-message.component';
import { SideBarService } from '@kore.services/header.service';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AutoFocusDirective } from './helpers/directives/auto-focus.directive';
import { ConfirmationDialogComponent } from './helpers/components/confirmation-dialog/confirmation-dialog.component';
import { ConversationalLogsComponent } from './pages/conversational-logs/conversational-logs.component';
import { HttpLoaderFactory, SharedModule } from './shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MarkdownEditorResizeSensorComponent } from './helpers/lib/resize-sensor/resize-sensor.component';
import { EditorUrlDialogComponent } from './helpers/components/editor-url-dialog/editor-url-dialog.component';
import { MomentModule } from 'ngx-moment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RefreshTokenInterceptor } from '@kore.services/inteceptors/refresh-token-interceptor';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SafePipe } from './helpers/filters/safe.pipe';
// import { ConversationConfigComponent } from './pages/usecases/conversation-config/conversation-config.component';
// import { UsecasesHeaderComponent } from './pages/usecases/uc-main/uc-header/uc-header.component';
// import { UsecasesCreateFormComponent } from './pages/usecases/uc-main/uc-create-form/uc-create-form.component';
// AoT requires an exported function for factories
import { UcDeleteConfirmComponent } from './helpers/components/uc-delete-confirm/uc-delete-confirm.component';
// import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AdvSettingsComponent } from './pages/settings/adv-settings/adv-settings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { InviteDialogComponent } from './helpers/components/invite-dialog/invite-dialog.component';
import { UpdateBotComponent } from './pages/w-sel-dialog/update-bot/update-bot.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { LangSwitchDialogComponent } from './helpers/components/lang-switch-dialog/lang-switch-dialog.component';

import { AutomationChannelsComponent } from './pages/automation-channels/automation-channels.component';
import { BTContainerComponent } from './pages/bt-container/bt-container.component';
import { BTMainmenuComponent } from '../app/components/bt-mainmenu/bt-mainmenu.component';
import { AutomationComponent } from './pages/automation/automation.component';
import { VoiceSettingsComponent } from './pages/voice-settings/voice-settings.component';
import { LanguagesSpeechComponent } from './pages/languages-speech/languages-speech.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { OnboardingDialogComponent } from './pages/onboarding/onboarding-dialog/onboarding-dialog.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchAssistComponent } from './pages/search-assist/search-assist.component';
import { SaDeleteConfirmComponent } from './helpers/components/sa-delete-confirm/sa-delete-confirm.component';
import { AutomationIntentvsEntityStringPipe } from './helpers/filters/automation-intentvs-entity-string.pipe';
import { ConvsHistoryLogsComponent } from './pages/conversational-logs/convs-history-logs/convs-history-logs.component';
import { AccWarningDialogComponent } from './helpers/components/acc-warning-dialog/acc-warning-dialog.component';
import { SkillsDdComponent } from './pages/usecases/skills-dd/skills-dd.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    MainmenuComponent,
    NotificationMessageComponent,
    ConfirmationDialogComponent,
    ConversationalLogsComponent,
    MarkdownEditorResizeSensorComponent,
    EditorUrlDialogComponent,
    SafePipe,
    AutoFocusDirective,
    UcDeleteConfirmComponent,
    AdvSettingsComponent,
    InviteDialogComponent,
    UpdateBotComponent,
    ConfigurationsComponent,
    LangSwitchDialogComponent,
    AutomationChannelsComponent,
    LangSwitchDialogComponent,
    BTContainerComponent,
    BTMainmenuComponent,
    AutomationComponent,
    VoiceSettingsComponent,
    LanguagesSpeechComponent,
    OnboardingComponent,
    OnboardingDialogComponent,
    SearchAssistComponent,
    SaDeleteConfirmComponent,
    ConvsHistoryLogsComponent,
    AccWarningDialogComponent,
    SkillsDdComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    DragDropModule,
    SharedModule,
    FileUploadModule,
    MomentModule,
    MatPaginatorModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      autoDismiss: false,
      closeButton: true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    })
  ],
  entryComponents: [NotificationMessageComponent, ConfirmationDialogComponent, EditorUrlDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
    },
    AuthGuard, AppDataResolver, SideBarService,DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
