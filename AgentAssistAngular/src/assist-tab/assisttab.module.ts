import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/common/shared.module';
import { AssistComponent } from './components/assist/assist-angular.component';
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
