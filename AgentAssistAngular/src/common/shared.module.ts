import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OverlaysearchComponent } from './components/overlaysearch/overlaysearch.component';
import { InterruptPopupComponent } from './components/interrupt-popup/interrupt-popup.component';
import { RestorePopupComponent } from './components/restore-popup/restore-popup.component';
import { SummaryPopupComponent } from './components/summary-popup/summary-popup.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TemplateRenderClassService } from './services/template-render-class.service';
import { TerminateComponent } from './components/terminate/terminate.component';
import { RandomUUIDPipe } from './pipes/random-uuid.pipe';
import { RemoveSpecialCharPipe } from './pipes/remove-special-char.pipe';
import { ReplaceQuotStringWithDoubleQuotPipe } from './pipes/replace-quot-string-with-double-quot.pipe';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { RawHtmlPipe } from './pipes/raw-html.pipe';
import { KoreGenerateuuidPipe } from './pipes/kore-generateuuid.pipe';
import { HtmlEntityPipe } from './pipes/html-entity.pipe';
import { EmptyObjectCheckPipe } from './pipes/empty-object-check.pipe';
import { FormatAMPMPipe } from './pipes/format-ampm.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { RemoveTagFromStringPipe } from './pipes/remove-tag-from-string.pipe';
import { ReplaceTextWithTagPipe } from './pipes/replace-text-with-tag.pipe';
import { UserBotHistoryComponent } from './components/user-bot-history/user-bot-history.component';
import { ConverTimestampToDatePipe } from './pipes/conver-timestamp-to-date.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SuggestionsComponent } from './render-comp/suggestions/suggestions.component';
import { SmalltalkComponent } from './render-comp/smalltalk/smalltalk.component';
import { AutomationComponent } from './render-comp/automation/automation.component';
import { FeedbackComponent } from './render-comp/feedback/feedback.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const COMPONENTS = [
  OverlaysearchComponent, 
  InterruptPopupComponent, 
  RestorePopupComponent, 
  SummaryPopupComponent, 
  TerminateComponent, 
  RandomUUIDPipe, 
  RemoveSpecialCharPipe, 
  ReplaceQuotStringWithDoubleQuotPipe, 
  SanitizeHtmlPipe, 
  RawHtmlPipe, 
  KoreGenerateuuidPipe, 
  HtmlEntityPipe, 
  EmptyObjectCheckPipe, 
  FormatAMPMPipe, 
  LoaderComponent, 
  TypeaheadComponent, 
  RemoveTagFromStringPipe, 
  ReplaceTextWithTagPipe, 
  UserBotHistoryComponent, 
  ConverTimestampToDatePipe, 
  SafeHtmlPipe,
  SmalltalkComponent,
  SuggestionsComponent, 
  AutomationComponent, 
  FeedbackComponent
]
@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    NgxEchartsModule.forRoot({ echarts }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PerfectScrollbarModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers:[
    TemplateRenderClassService, 
    SanitizeHtmlPipe, 
    RandomUUIDPipe, 
    RemoveSpecialCharPipe,
    ReplaceQuotStringWithDoubleQuotPipe, 
    RawHtmlPipe, 
    KoreGenerateuuidPipe, 
    HtmlEntityPipe,
    EmptyObjectCheckPipe, 
    FormatAMPMPipe, 
    RemoveTagFromStringPipe, 
    ReplaceTextWithTagPipe
  ],
  exports : [
    ...COMPONENTS,
    TranslateModule,
    NgxEchartsModule
  ]
})
export class SharedModule { }
