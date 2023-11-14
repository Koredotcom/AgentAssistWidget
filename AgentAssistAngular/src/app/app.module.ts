import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from 'src/common/shared.module';
import { HomeModule } from 'src/home/home.module';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../common/services/web-socket.service';
import { TitleCasePipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    HomeModule
  ],
  providers: [WebSocketService, TitleCasePipe],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
