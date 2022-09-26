import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from 'src/common/shared.module';
import { AssisttabModule } from 'src/assist-tab/assisttab.module';
import { BottabModule } from 'src/bot-tab/bottab.module';
import { LibrarytabModule } from 'src/library-tab/librarytab.module';
import { TranscripttabModule } from 'src/transcript-tab/transcripttab.module';
import { HomeModule } from 'src/home/home.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    AssisttabModule,
    LibrarytabModule,
    TranscripttabModule,
    BottabModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
