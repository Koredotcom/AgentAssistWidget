import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventConfigurationComponent } from './event-configuration/event-configuration.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewServiceComponent } from './event-configuration/new-service/new-service.component';
import { EditServiceComponent } from './event-configuration/edit-service/edit-service.component';

const routes: Routes = [
  { path: '', component:  EventConfigurationComponent}
];

@NgModule({
  declarations: [
    EventConfigurationComponent,
    NewServiceComponent,
    EditServiceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EventConfigurationModule { }
