import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistComponent } from './components/assist/assist.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/common/shared.module';

@NgModule({
  declarations: [AssistComponent],
  imports: [
    CommonModule,
    SharedModule,
    PerfectScrollbarModule,
  ],
  exports : [AssistComponent]
})
export class AssisttabModule { }
