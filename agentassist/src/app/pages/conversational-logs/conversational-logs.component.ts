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

  @ViewChild('newConvSlider', { static: true }) newConvSlider: SliderComponentComponent;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  showConversation: boolean;

  constructor() {}

  ngOnInit() {

  }

  openSlider() {
    this.showConversation = true;
    this.newConvSlider.openSlider("#convsLogSilder", "width500");
  }

  closeConvsHistorySlider() {
    this.showConversation = false;
    this.newConvSlider.closeSlider('#convsLogSilder');
  }

  openConvsHistorySlider() {
    this.openSlider()
  }
}
