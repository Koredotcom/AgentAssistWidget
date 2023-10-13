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
    MybotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
