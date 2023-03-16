import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MybotComponent } from './components/mybot/mybot.component';
import { SharedModule } from 'src/common/shared.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';



@NgModule({
  declarations: [MybotComponent],
  imports: [
    CommonModule,
    SharedModule,
    PerfectScrollbarModule
  ],
  exports : [MybotComponent]
})
export class BottabModule { }
