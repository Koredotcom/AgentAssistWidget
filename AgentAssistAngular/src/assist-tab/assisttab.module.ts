import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistComponent } from './components/assist/assist.component';



@NgModule({
  declarations: [AssistComponent],
  imports: [
    CommonModule
  ],
  exports : [AssistComponent]
})
export class AssisttabModule { }
