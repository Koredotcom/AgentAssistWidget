import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service'
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { PerfectScrollbarComponent  } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@kore.services/notification.service';


declare const $: any;
import * as _ from 'underscore';
@Component({
  selector: 'app-conversational-logs',
  templateUrl: './conversational-logs.component.html',
  styleUrls: ['./conversational-logs.component.scss']
})
export class ConversationalLogsComponent implements OnInit {
  showSlider = true;
  @ViewChild('slider', { static: true }) slider: SliderComponentComponent;
  constructor() {}

  ngOnInit() {}

  closeSlider(event) {
    this.showSlider = false;
    this.slider.closeSlider("#slider2");
  }
}
