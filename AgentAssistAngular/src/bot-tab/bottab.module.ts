import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MybotComponent } from './components/mybot/mybot.component';



@NgModule({
  declarations: [MybotComponent],
  imports: [
    CommonModule
  ],
  exports : [MybotComponent]
})
export class BottabModule { }
