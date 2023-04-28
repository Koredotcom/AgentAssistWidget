import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptComponent } from './components/transcript/transcript.component';
import { SharedModule } from 'src/common/shared.module';



@NgModule({
  declarations: [TranscriptComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports : [TranscriptComponent]
})
export class TranscripttabModule { }
