import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsComponent } from './widgets/widgets.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ApiAdvancedModelComponent } from './api-advanced-model/api-advanced-model.component';

const routes: Routes = [
  { path: '', component:  WidgetsComponent}
];

@NgModule({
  declarations: [
    WidgetsComponent,
    ApiAdvancedModelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class WidgetSettingsModule { }
