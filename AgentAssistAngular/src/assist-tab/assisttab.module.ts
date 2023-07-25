import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'src/common/shared.module';
import { AssistComponent } from './components/assist/assist-angular.component';

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
