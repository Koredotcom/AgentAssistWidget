import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistComponent } from './components/assist/assist.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/common/shared.module';
import { ChecklistsComponent } from './components/checklists/checklists.component';

@NgModule({
  declarations: [AssistComponent, ChecklistsComponent],
  imports: [
    CommonModule,
    SharedModule,
    PerfectScrollbarModule,
  ],
  exports : [AssistComponent]
})
export class AssisttabModule { }
