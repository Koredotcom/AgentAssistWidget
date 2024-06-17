import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROIAnalyserComponent } from './roianalyser/roianalyser.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component:  ROIAnalyserComponent}
];


@NgModule({
  declarations: [
    ROIAnalyserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ROIAnalyserModule { }
