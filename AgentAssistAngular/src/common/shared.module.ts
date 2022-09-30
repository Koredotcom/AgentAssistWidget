import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OverlaysearchComponent } from './components/overlaysearch/overlaysearch.component';
import { InterruptPopupComponent } from './components/interrupt-popup/interrupt-popup.component';
import { RestorePopupComponent } from './components/restore-popup/restore-popup.component';
import { SummaryPopupComponent } from './components/summary-popup/summary-popup.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TemplateRenderClassService } from './services/template-render-class.service';
import { TerminateComponent } from './components/terminate/terminate.component';


@NgModule({
  declarations: [OverlaysearchComponent, InterruptPopupComponent, RestorePopupComponent, SummaryPopupComponent, TerminateComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    PerfectScrollbarModule
  ],
  providers:[TemplateRenderClassService],
  exports : [OverlaysearchComponent, InterruptPopupComponent, RestorePopupComponent, SummaryPopupComponent, TerminateComponent]
})
export class SharedModule { }
