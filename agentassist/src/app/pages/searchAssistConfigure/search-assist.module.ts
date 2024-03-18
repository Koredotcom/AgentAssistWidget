import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SearchAssistComponent } from './search-assist/search-assist.component';


const routes: Routes = [
  { path: '', component:  SearchAssistComponent}
];

@NgModule({
  declarations: [
    SearchAssistComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class SearchAssistModule { }
