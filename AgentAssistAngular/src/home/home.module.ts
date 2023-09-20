import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from 'src/common/shared.module';
import { AssisttabModule } from 'src/assist-tab/assisttab.module';
import { TranscripttabModule } from 'src/transcript-tab/transcripttab.module';
import { LibrarytabModule } from 'src/library-tab/librarytab.module';
import { BottabModule } from 'src/bot-tab/bottab.module';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChecklistsComponent } from 'src/assist-tab/components/checklists/checklists.component';



@NgModule({
  declarations: [HomeComponent,ChecklistsComponent],
  imports: [
    CommonModule,
    FormsModule,
    PerfectScrollbarModule,
    SharedModule,
    AssisttabModule,
    TranscripttabModule,
    LibrarytabModule,
    BottabModule
  ],
  exports : [HomeComponent]
})
export class HomeModule { }
