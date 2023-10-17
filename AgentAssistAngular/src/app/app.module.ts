import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { RestartDialogComponent } from './components/common/components/restart-dialog/restart-dialog.component';
import { InterruptionComponent } from './components/common/components/interruption/interruption.component';
import { SentimentScoreComponent } from './components/common/components/sentiment-score/sentiment-score.component';
import { NudgesComponent } from './components/common/components/nudges/nudges.component';
import { HintsComponent } from './components/common/components/hints/hints.component';
import { EmptyObjectCheckPipe } from './pipes/empty-object-check.pipe';
import { FormsModule } from '@angular/forms';

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
    RestartDialogComponent,
    InterruptionComponent,
    SentimentScoreComponent,
    NudgesComponent,
    HintsComponent,
    EmptyObjectCheckPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [EmptyObjectCheckPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
