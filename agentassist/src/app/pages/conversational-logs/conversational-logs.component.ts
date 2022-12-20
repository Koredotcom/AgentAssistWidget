import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import * as _ from 'underscore';
import * as moment from 'moment';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { Moment } from 'moment';
export interface IAnalyticsFilters {
  startDate: string,
  endDate: string,
  type?: string
}
@Component({
  selector: 'app-conversational-logs',
  templateUrl: './conversational-logs.component.html',
  styleUrls: ['./conversational-logs.component.scss']
})
export class ConversationalLogsComponent implements OnInit {
  @ViewChild('newConvSlider', { static: true }) newConvSlider: SliderComponentComponent;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  showConversation: boolean;
  @ViewChild('searchTerm') searchTerm: ElementRef<HTMLElement>;
  isLoadingData = false;
  showSlider = false;
  filter = {
    startDate: moment().subtract({ days: 7 }),
    endDate: moment(),
    limit: 20,
    sort: { "date": "desc" }
  };
  isLoading: boolean = false;
  rangeList = [
    { id: 'today', display: ("CONVERSATIONAL_LOGS.TODAY") },
    { id: 'yesterday', display: ("CONVERSATIONAL_LOGS.YESTERDAY") },
    { id: 'seven', display: ("CONVERSATIONAL_LOGS.LAST_7_DAYS") },
    { id: 'twoEight', display: ("CONVERSATIONAL_LOGS.LAST_28_DAYS") },
    { id: 'ninety', display: ("CONVERSATIONAL_LOGS.LAST_90_DAYS") }
  ];
  convs = [
    {
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations": ["book ticket", "book flight"]
    },
    {
      "channel": "voice",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c6",
      "duration": 152020,
      "automations": ["book ticket", "book flight"]
    }, {
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c7",
      "duration": 152020,
      "automations": ["book ticket", "book flight",]
    },
    {
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c8",
      "duration": 152020,
      "automations": ["book ticket", "book flight"]
    }, {
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations": ["book ticket", "book flight"]
    }

  ];
  realconvs = [];
  isSearching = false;
  erroMsg;
  isSearched = false;
  readonly USECASES_LIMIT = 20;
  ucOffset = 0;
  isInitialLoadDone = false;
  conversationId;
  ranges: any;
  calendarLocale: any;
  filters: IAnalyticsFilters;
  selected: { startDate: Moment, endDate: Moment };
  public filterUpdated$ = new Subject();
  @ViewChild(DaterangepickerDirective) pickerDirective: DaterangepickerDirective;
  constructor(
    private service: ServiceInvokerService
  ) { }

  ngOnInit() {
    this.ranges = {
      [('Today')]: [moment().startOf('day'), moment()],
      [('Yesterday')]: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
      [('Last 7 Days')]: [moment().subtract(6, 'days').startOf('day'), moment()],
      [('Last 28 Days')]: [moment().subtract(27, 'days').startOf('day'), moment()],
      [('Last 90 Days')]: [moment().subtract(89, 'days').startOf('day'), moment()]
    }
    this.calendarLocale = {
      applyLabel: ('Apply'),
      cancelLabel: ('Cancel'),
      customRangeLabel: ('Custom Range')
    }
    this.selected = { startDate: moment().subtract(6, 'days').startOf('day'), endDate: moment() }
    this.getUsecases();

  }
  ngAfterViewInit() {
    setTimeout(() => {
      fromEvent(this.searchTerm.nativeElement, 'input')
        .pipe(
          map((event: any) => {
            console.log(event.target.value)
            if (event.target.value == '') {
              return event.target.value;
            }
          }),
          debounceTime(1000),
          distinctUntilChanged())
        .subscribe((val) => {
          console.log(val)
          if (val == '' && this.isSearched) {
            this.getUsecases('');
            this.isSearched = false;
          }
        });
    }, 100);

  }

  save(e) {
    console.log("cam here with after enter pressed ", e.target.value);
    this.isSearched = true;
    this.getUsecases(e.target.value);
  }
  onReachEnd() {
    if (this.isInitialLoadDone) {
      this.getUsecases(null, true);
    }
  }
  openSlider(event, data) {
    this.showConversation = true;
    this.newConvSlider.openSlider("#convsLogSilder", "width940");
    this.conversationId = data.conversationId;
  }

  closeConvsHistorySlider() {
    this.showConversation = false;
    this.newConvSlider.closeSlider('#convsLogSilder');
  }

  openConvsHistorySlider(event, data) {
    this.openSlider(event, data)
  }


  getUsecases(val?, pagination?: boolean) {
    this.ucOffset = pagination ? this.USECASES_LIMIT + this.USECASES_LIMIT : this.USECASES_LIMIT;
    let payload = {
      start: this.filter.startDate,
      end: this.filter.endDate,
      limit: this.ucOffset,
      skip: 0,
      sort: this.filter.sort,
      conversationId: val || ''
    }
    if (val?.length > 0) {
      this.realconvs = this.convs.filter((ele) => ele.conversationId == val);
      if (this.realconvs.length == 0) {
        this.erroMsg = `No conversation logs found.
        Modify filter parameters and try again.`;
      }
    } else {
      this.erroMsg = undefined;
      this.realconvs = [...this.convs]
    }
    this.service.invoke('conversation.logs', {}, payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;

        }))
      .subscribe((res) => {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', res)
        if (pagination) {
          this.realconvs = [...this.realconvs, ...res.usecases];
        } else {
          this.realconvs = res.usecases;
        }

        this.isInitialLoadDone = true;
      }, err => {
        this.isInitialLoadDone = false;
      });
  }

  openPicker() {
    this.pickerDirective.open();
  }

  isInvalidDate = (m: moment.Moment) => {
    return m.isBefore(moment().subtract(90, 'days')) || m.isAfter(moment());
  }

  onDatesUpdated($event) {
    this.filters = { ... this.filters, startDate: this.selected.startDate.toISOString(), endDate: this.selected.endDate.toISOString() }
    this.updateFilters(this.filters);
  }
  updateFilters(filters: IAnalyticsFilters) {
    this.filters = filters;
    this.getUsecases(null, true)
    this.filterUpdated$.next(this.filters);
  }

}
