import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './components/library/library.component';
import { SharedModule } from 'src/common/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [LibraryComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports : [LibraryComponent]
})
export class LibrarytabModule { }
