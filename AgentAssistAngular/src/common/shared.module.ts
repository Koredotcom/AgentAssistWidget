import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { RemoveTagFromStringPipe } from './pipes/remove-tag-from-string.pipe';
import { ReplaceTextWithTagPipe } from './pipes/replace-text-with-tag.pipe';
import { UserBotHistoryComponent } from './components/user-bot-history/user-bot-history.component';
import { ConverTimestampToDatePipe } from './pipes/conver-timestamp-to-date.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';


@NgModule({
  declarations: [OverlaysearchComponent, InterruptPopupComponent, RestorePopupComponent, SummaryPopupComponent, TerminateComponent, RandomUUIDPipe, RemoveSpecialCharPipe, ReplaceQuotStringWithDoubleQuotPipe, SanitizeHtmlPipe, RawHtmlPipe, KoreGenerateuuidPipe, HtmlEntityPipe, EmptyObjectCheckPipe, FormatAMPMPipe, LoaderComponent, TypeaheadComponent, RemoveTagFromStringPipe, ReplaceTextWithTagPipe, UserBotHistoryComponent, ConverTimestampToDatePipe, SafeHtmlPipe],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PerfectScrollbarModule
  ],
  providers:[TemplateRenderClassService, SanitizeHtmlPipe, RandomUUIDPipe, RemoveSpecialCharPipe,ReplaceQuotStringWithDoubleQuotPipe, RawHtmlPipe, KoreGenerateuuidPipe, HtmlEntityPipe,
  EmptyObjectCheckPipe, FormatAMPMPipe, RemoveTagFromStringPipe, ReplaceTextWithTagPipe],
  exports : [OverlaysearchComponent, InterruptPopupComponent, RestorePopupComponent, SummaryPopupComponent, TerminateComponent, RandomUUIDPipe,
    RemoveSpecialCharPipe,ReplaceQuotStringWithDoubleQuotPipe, SanitizeHtmlPipe, RawHtmlPipe, KoreGenerateuuidPipe, HtmlEntityPipe, EmptyObjectCheckPipe,
    FormatAMPMPipe, LoaderComponent, TypeaheadComponent,RemoveTagFromStringPipe, ReplaceTextWithTagPipe, UserBotHistoryComponent, ConverTimestampToDatePipe,
    SafeHtmlPipe]
})
export class SharedModule { }
