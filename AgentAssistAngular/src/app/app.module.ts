import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from 'src/common/shared.module';
import { AssisttabModule } from 'src/assisttab/assisttab.module';
import { LibrarytabModule } from 'src/librarytab/librarytab.module';
import { TranscripttabModule } from 'src/transcripttab/transcripttab.module';
import { BottabModule } from 'src/bottab/bottab.module';
import { OnboardingModule } from 'src/onboarding/onboarding.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    OnboardingModule,
    AssisttabModule,
    LibrarytabModule,
    TranscripttabModule,
    BottabModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
