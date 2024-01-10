import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BodyComponent } from './components/body/body.component';
import { ModalComponent } from './components/modal/modal.component';
import { AssistComponent } from './components/assist/assist.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TranscriptComponent } from './components/transcript/transcript.component';
import { SearchComponent } from './components/search/search.component';
import { MybotComponent } from './components/mybot/mybot.component';
import { DialogComponent } from './components/common/components/dialog/dialog.component';
import { FeedbackComponent } from './components/common/components/feedback/feedback.component';
import { SmalltalkComponent } from './components/common/components/smalltalk/smalltalk.component';
import { SuggestionsComponent } from './components/common/components/suggestions/suggestions.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { DialogSuggestionComponent } from './components/common/components/dialog-suggestion/dialog-suggestion.component';
import { SentimentScoreComponent } from './components/common/components/sentiment-score/sentiment-score.component';
import { NudgesComponent } from './components/common/components/nudges/nudges.component';
import { HintsComponent } from './components/common/components/hints/hints.component';
import { EmptyObjectCheckPipe } from './pipes/empty-object-check.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { I1 } from './services/Interceptor';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FaqSuggestionsComponent } from './components/common/components/faq-suggestions/faq-suggestions.component';
import { FormatAmpmPipe } from './pipes/format-ampm.pipe';
import { RandomUuidPipe } from './pipes/random-uuid.pipe';
import { ArticleSuggestionsComponent } from './components/common/components/article-suggestions/article-suggestions.component';
import { SnippetSuggestionsComponent } from './components/common/components/snippet-suggestions/snippet-suggestions.component';
import { RemoveTagFromStringPipe } from './pipes/remove-tag-from-string.pipe';
import { ReplaceTextWithTagPipe } from './pipes/replace-text-with-tag.pipe';
import { TranscriptHistoryComponent } from './components/transcript-history/transcript-history.component';
import { ConverTimestampToDatePipe } from './pipes/conver-timestamp-to-date.pipe';
import { UserBotHistoryComponent } from './components/user-bot-history/user-bot-history.component';
import { InterruptComponent } from './components/interrupt/interrupt.component';
import { RestartComponent } from './components/restart/restart.component';
import { TerminateComponent } from './components/terminate/terminate.component';
import { ListviewComponent } from './components/listview/listview.component';
import { TaskProgressComponent } from './components/task-progress/task-progress.component';
import { AskCustomerComponent } from './ask-customer/ask-customer.component';
import { TellCustomerComponent } from './tell-customer/tell-customer.component';
import { KoreGenerateuuidPipe } from './pipes/kore-generateuuid.pipe';
import { SummaryPopupComponent } from './components/summary-popup/summary-popup.component';
import { LoaderComponent } from './components/common/components/loader/loader.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { WidgetDragDirective } from './helpers/widget-drag.directive';
import { FileSuggestionsComponent } from './components/common/components/file-suggestions/file-suggestions.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    ModalComponent,
    AssistComponent,
    SettingsComponent,
    TranscriptComponent,
    SearchComponent,
    MybotComponent,
    DialogComponent,
    FeedbackComponent,
    SmalltalkComponent,
    SuggestionsComponent,
    ChecklistComponent,
    DialogSuggestionComponent,
    SentimentScoreComponent,
    NudgesComponent,
    HintsComponent,
    EmptyObjectCheckPipe,
    FaqSuggestionsComponent,
    FormatAmpmPipe,
    RandomUuidPipe,
    ArticleSuggestionsComponent,
    SnippetSuggestionsComponent,
    RemoveTagFromStringPipe,
    ReplaceTextWithTagPipe,
    TranscriptHistoryComponent,
    ConverTimestampToDatePipe,
    UserBotHistoryComponent,
    InterruptComponent,
    RestartComponent,
    TerminateComponent,
    ListviewComponent,
    TaskProgressComponent,
    AskCustomerComponent,
    TellCustomerComponent,
    KoreGenerateuuidPipe,
    SummaryPopupComponent,
    LoaderComponent,
    SafeHtmlPipe,
    SanitizeHtmlPipe,
    WidgetDragDirective,
    FileSuggestionsComponent
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      },
    }),
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({ echarts })
  ],
  providers: [EmptyObjectCheckPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: I1,
      multi: true
  },FormatAmpmPipe,RandomUuidPipe,RemoveTagFromStringPipe, ReplaceTextWithTagPipe, ConverTimestampToDatePipe,
   KoreGenerateuuidPipe, NgbActiveModal, SafeHtmlPipe, SanitizeHtmlPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
