import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule, createTranslateLoader } from 'src/common/shared.module';
import { HomeModule } from 'src/home/home.module';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../common/services/web-socket.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
      },
    }),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    HomeModule
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
