import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROIAnalyserComponent } from './roianalyser/roianalyser.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigureDataComponent } from './configure-data/configure-data.component';

const routes: Routes = [
  { path: '', component:  ROIAnalyserComponent}
];


@NgModule({
  declarations: [
    ROIAnalyserComponent,
    ConfigureDataComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ROIAnalyserModule { }
