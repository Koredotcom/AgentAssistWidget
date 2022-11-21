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
import { AccountsDataService } from '@kore.services/dataservices/accounts-data.service';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { NotificationMessageComponent } from './components/notification-message/notification-message.component';
import { NgbdDatepickerRange } from './components/custom-range/datepicker-range';
import { SideBarService } from '@kore.services/header.service';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FieldTypePipe } from './helpers/filters/field-type.pipe';
import { ScrollSpyDirective } from './helpers/directives/scroll-spy.directive';
import { AutoFocusDirective } from './helpers/directives/auto-focus.directive';
import { ConfirmationDialogComponent } from './helpers/components/confirmation-dialog/confirmation-dialog.component';
import { ConversationalLogsComponent } from './pages/conversational-logs/conversational-logs.component';
import { HttpLoaderFactory, SharedModule } from './shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { CanDeactivateGuard } from './helpers/guards/can-deactivate-guard.service';
import { ChatHistoryComponent } from './components/chat-history/chat-history.component';
import { MarkdownEditorResizeSensorComponent } from './helpers/lib/resize-sensor/resize-sensor.component';
import { EditorUrlDialogComponent } from './helpers/components/editor-url-dialog/editor-url-dialog.component';
import { MomentModule } from 'ngx-moment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RefreshTokenInterceptor } from '@kore.services/inteceptors/refresh-token-interceptor';
import { MatPaginatorModule } from '@angular/material/paginator';

import { channelsConfigService } from '@kore.services/channelsConfig.service';
import { SafePipe } from './helpers/filters/safe.pipe';
import { UserUtterancesComponent } from './pages/usecases/user-utterances/user-utterances.component';
// import { ConversationConfigComponent } from './pages/usecases/conversation-config/conversation-config.component';
import { FaqConfigComponent } from './pages/usecases/faq-config/faq-config.component';
import { UsecasesHeaderComponent } from './pages/usecases/uc-main/uc-header/uc-header.component';
import { UsecasesTableMainComponent } from './pages/usecases/uc-main/uc-table-main/uc-table-main.component';
import { UsecasesTableViewSelectionComponent } from './pages/usecases/uc-main/uc-table-main/uc-table-view-selection/uc-table-view-selection.component';
import { UsecasesTableViewComponent } from './pages/usecases/uc-main/uc-table-main/uc-table-view/uc-table-view.component';
import { UsecasesCreateFormComponent } from './pages/usecases/uc-main/uc-create-form/uc-create-form.component';
import { UsecasesTableEditNameComponent } from './pages/usecases/uc-main/uc-table-main/uc-table-view/uc-table-edit-name/uc-table-edit-name.component';
import { FilterUsecasesPipe } from './pages/usecases/uc-main/uc-table-main/filter-uc.pipe';
import { UcTableRowsComponent } from './pages/usecases/uc-main/uc-table-main/uc-table-view/uc-table-rows/uc-table-rows.component';
// AoT requires an exported function for factories
import { UcDeleteConfirmComponent } from './helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { UcGroupbyComponent } from './pages/usecases/uc-main/uc-table-main/uc-table-view/uc-groupby/uc-groupby.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { InSetupComponent } from './pages/settings/in-setup/in-setup.component';
import { AdvSettingsComponent } from './pages/settings/adv-settings/adv-settings.component';
import { EmptyScreensComponent } from './pages/usecases/uc-main/uc-table-main/uc-table-view/empty-screens/empty-screens.component';
import { ChatPersonalizationComponent } from './pages/settings/sdk-pref/chat-personalization/chat-personalization.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { InviteDialogComponent } from './helpers/components/invite-dialog/invite-dialog.component';
import { RoundPipe } from './helpers/filters/round.pipe';
import { UpdateBotComponent } from './pages/w-sel-dialog/update-bot/update-bot.component';
import { DeploymentCodeComponent } from './pages/settings/sdk-pref/deployment-code/deployment-code.component';
import { AgentsComponent } from './pages/agents/agents.component';
import { NewAgentComponent } from './pages/agents/new-agent/new-agent.component';
import { NewAgentGroupComponent } from './pages/agents/new-agent-group/new-agent-group.component';
import { HistoryComponent } from './pages/history/history.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { LangSwitchDialogComponent } from './helpers/components/lang-switch-dialog/lang-switch-dialog.component';

import { AutomationChannelsComponent } from './pages/automation-channels/automation-channels.component';
import { NewConversationComponent } from './pages/agent-assist/new-conversation/new-conversation.component';
import { ConversationListComponent } from './pages/agent-assist/conversation-list/conversation-list.component';
import { ConfigConversationComponent } from './pages/agent-assist/config-conversation/config-conversation.component';
import { InstallTemplatesComponent } from './pages/usecases/popUps/install-templates/install-templates.component';
import { ExpTableRowComponent } from './pages/usecases/exp-table-row/exp-table-row.component';
import { NewFlowExpComponent } from './pages/usecases/new-flow-exp/new-flow-exp.component';
import { DockStatusComponent } from './pages/dock-status/dock-status.component';
import { BTContainerComponent } from './pages/bt-container/bt-container.component';
import { BTMainmenuComponent } from '../app/components/bt-mainmenu/bt-mainmenu.component';
import { AutomationComponent } from './pages/automation/automation.component';
import { VoiceSettingsComponent } from './pages/voice-settings/voice-settings.component';
import { AttachFlowComponent } from './pages/voice-settings/attach-flow/attach-flow.component';
import { NewHoursOfOperationComponent } from './pages/agent-settings/new-hours-of-operation/new-hours-of-operation.component';
import { UserManagementComponent } from './pages/agent-settings/user-management/user-management.component';
import { NewRoleComponent } from './pages/agent-settings/user-management/new-role/new-role.component';
import { NewUserComponent } from './pages/agent-settings/user-management/new-user/new-user.component';
import { UmTableComponent } from './pages/agent-settings/user-management/um-table/um-table.component';
import { RmTableComponent } from './pages/agent-settings/user-management/rm-table/rm-table.component';
import { LanguagesSpeechComponent } from './pages/languages-speech/languages-speech.component';
import { LanguageSettingsComponent } from './pages/agent-settings/language-settings/language-settings.component';
import { ExternalWidgetComponent } from './pages/agent-settings/external-widget/external-widget.component';
import { AddWidgetComponent } from './pages/agent-settings/external-widget/add-widget/add-widget.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { OnboardingDialogComponent } from './pages/onboarding/onboarding-dialog/onboarding-dialog.component';
import { SearchAssistComponent } from './pages/search-assist/search-assist.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    MainmenuComponent,
    NotificationMessageComponent,
    NgbdDatepickerRange,
    FieldTypePipe,
    ScrollSpyDirective,
    ConfirmationDialogComponent,
    ConversationalLogsComponent,
    ChatHistoryComponent,
    MarkdownEditorResizeSensorComponent,
    EditorUrlDialogComponent,
    SafePipe,
    UserUtterancesComponent,
    // ConversationConfigComponent,
    FaqConfigComponent,
    UsecasesHeaderComponent,
    UsecasesTableMainComponent,
    UsecasesTableViewSelectionComponent,
    UsecasesTableViewComponent,
    UsecasesCreateFormComponent,
    UsecasesTableEditNameComponent,
    FilterUsecasesPipe,
    AutoFocusDirective,
    UcTableRowsComponent,
    UcDeleteConfirmComponent,
    UcGroupbyComponent,
    WelcomeComponent,
    InSetupComponent,
    AdvSettingsComponent,
    ChatPersonalizationComponent,
    InviteDialogComponent,
    RoundPipe,
    UpdateBotComponent,
    DeploymentCodeComponent,
    AgentsComponent,
    NewAgentComponent,
    NewAgentGroupComponent,
    HistoryComponent,
    ConfigurationsComponent,
    LangSwitchDialogComponent,
    AutomationChannelsComponent,
    NewConversationComponent,
    ConversationListComponent,
    ConfigConversationComponent,
    InstallTemplatesComponent,
    LangSwitchDialogComponent,
    ExpTableRowComponent,
    NewFlowExpComponent,
    DockStatusComponent,
    BTContainerComponent,
    BTMainmenuComponent,
    AutomationComponent,
    VoiceSettingsComponent,
    AttachFlowComponent,
    NewHoursOfOperationComponent,
    UserManagementComponent,
    NewRoleComponent,
    NewUserComponent,
    UmTableComponent,
    RmTableComponent,
    LanguagesSpeechComponent,
    LanguageSettingsComponent,
    ExternalWidgetComponent,
    AddWidgetComponent,
    OnboardingComponent,
    OnboardingDialogComponent,
    SearchAssistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
    SharedModule,
    FileUploadModule,
    MomentModule,
    MatPaginatorModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
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
  entryComponents: [NotificationMessageComponent, ConfirmationDialogComponent, ChatHistoryComponent, EditorUrlDialogComponent],
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
    AuthGuard, AppDataResolver, AccountsDataService, SideBarService, CanDeactivateGuard, channelsConfigService
  ],
  exports: [NgbdDatepickerRange],
  bootstrap: [AppComponent]
})
export class AppModule { }
