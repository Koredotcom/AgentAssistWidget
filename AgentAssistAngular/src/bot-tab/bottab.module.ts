import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MybotComponent } from './components/mybot/mybot.component';
import { SharedModule } from 'src/common/shared.module';



@NgModule({
  declarations: [MybotComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports : [MybotComponent]
})
export class BottabModule { }
