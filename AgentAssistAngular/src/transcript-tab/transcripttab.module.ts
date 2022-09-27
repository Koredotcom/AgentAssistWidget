import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptComponent } from './components/transcript/transcript.component';



@NgModule({
  declarations: [TranscriptComponent],
  imports: [
    CommonModule
  ],
  exports : [TranscriptComponent]
})
export class TranscripttabModule { }
