import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptComponent } from './components/transcript/transcript.component';
import { SharedModule } from 'src/common/shared.module';
import { TranscriptHistoryComponent } from './components/transcript-history/transcript-history.component';



@NgModule({
  declarations: [TranscriptComponent, TranscriptHistoryComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports : [TranscriptComponent]
})
export class TranscripttabModule { }
