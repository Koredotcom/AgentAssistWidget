import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainAgentComponent } from './main-agent/main-agent.component';

const routes: Routes = [
  {path: '', component: MainAgentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyRoutingModule { }
