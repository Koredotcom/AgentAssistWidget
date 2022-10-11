import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistComponent } from './components/assist/assist.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';



@NgModule({
  declarations: [AssistComponent],
  imports: [
    CommonModule,
    PerfectScrollbarModule
  ],
  exports : [AssistComponent]
})
export class AssisttabModule { }
