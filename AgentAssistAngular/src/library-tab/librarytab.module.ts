import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './components/library/library.component';



@NgModule({
  declarations: [LibraryComponent],
  imports: [
    CommonModule
  ],
  exports : [LibraryComponent]
})
export class LibrarytabModule { }
