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
  config: any = {
    suppressScrollX: true
  };
  rangeList = [
    { id: 'today', display: ("CONVERSATIONAL_LOGS.TODAY") },
    { id: 'yesterday', display: ("CONVERSATIONAL_LOGS.YESTERDAY") },
    { id: 'seven', display: ("CONVERSATIONAL_LOGS.LAST_7_DAYS") },
    { id: 'twoEight', display: ("CONVERSATIONAL_LOGS.LAST_28_DAYS") },
    { id: 'ninety', display: ("CONVERSATIONAL_LOGS.LAST_90_DAYS") }
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
  isDatePicked = false;
  selected: { startDate: Moment, endDate: Moment };
  isMoreAvailable = false;
  seachedConvsId;
  @ViewChild(DaterangepickerDirective) pickerDirective: DaterangepickerDirective;
  transformedConvsLogs: any = [];
  sortConvsIds= 'desc';
  sortConvsLogsByTime= 'desc';
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
    this.filters = { startDate: this.selected.startDate.toISOString(), endDate: this.selected.endDate.toISOString() }
    console.log("called from ngoninit 111111111111111111111111111111111");

    this.getUsecases();

  }
  ngAfterViewInit() {
    setTimeout(() => {
      fromEvent(this.searchTerm.nativeElement, 'input')
        .pipe(
          map((event: any) => {
            if (event.target.value == '') {
              return event.target.value;
            }
          }),
          debounceTime(1000),
          distinctUntilChanged())
        .subscribe((val) => {
          if (val == '' && this.isSearched) {
            console.log("called once search is cleared 222222222222222222222222222222222");
            this.getUsecases('');
            this.isSearched = false;
          }
        });
    }, 100);

  }

  save(e) {
    this.isSearched = true;
    this.seachedConvsId = e.target.value;
    this.getUsecases(e.target.value);
    console.log("called clciked enter on search box 333333333333333333333333333333333333333");
  }
  onReachEnd() {
    if ((this.isInitialLoadDone || this.isMoreAvailable) && !this.showConversation && !this.isSearched && !this.isDatePicked) {
      console.log("called once scroll reached end 444444444444444444444444444444");
      this.getUsecases(null, true);
    } else {
      return;
    }
  }
  openSlider(event, data) {
    this.showConversation = true;
    this.newConvSlider.openSlider("#convsLogSilder", "width500");
    this.conversationId = data.conversationId;
  }


  closeConvsHistorySlider() {
    this.showConversation = false;
    this.newConvSlider.closeSlider('#convsLogSilder');
  }

  openConvsHistorySlider(event, data) {
    this.openSlider(event, data);
  }


  getUsecases(val?, pagination?: boolean) {
    this.ucOffset = pagination ? this.ucOffset + this.USECASES_LIMIT : this.USECASES_LIMIT;
    console.log(this.filter)
    let payload = {
      start: this.filters.startDate,
      end: this.filters.endDate,
      limit: this.ucOffset,
      skip: 0,
      sort: this.filter.sort,
      conversationId: val || ''
    }
    this.service.invoke('conversation.logs', {}, payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;

        }))
      .subscribe((res) => {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', res)
        this.TransformConvsLogsData(res.data);
        if (pagination && res.length > 0) {
          this.realconvs = [...this.transformedConvsLogs, ...this.TransformConvsLogsData(res.data)];
        } else {
          this.TransformConvsLogsData(res.data);

        }
        this.isMoreAvailable = res.hasMore;
        this.isInitialLoadDone = true;
        this.realconvs.length>0?this.isDatePicked = false:this.isDatePicked = true;
      }, err => {
        this.isInitialLoadDone = false;
        this.realconvs = [];
        this.isDatePicked = false;
      });
  }

  TransformConvsLogsData(resData) {
    for( let convsLogData of resData) {
      convsLogData.start = moment(convsLogData.startedOn).format('MMMM Do YYYY, h:mm:ss a');
      convsLogData.end = moment(convsLogData.endedOn).format('MMMM Do YYYY, h:mm:ss a');
      convsLogData.duration = moment(parseInt(convsLogData.duration)).format("HH:mm:ss");
      this.transformedConvsLogs.push(convsLogData)
    }
    return this.transformedConvsLogs;
  }

  convsIdSorting(sortType) {
    this.transformedConvsLogs=[]
    this.sortConvsIds = sortType
    let payload = {
      start: this.filter.startDate,
      end: this.filter.endDate,
      limit: this.ucOffset,
      skip: 0,
      sort: {conversationId: sortType},
      conversationId: ''
    }
    this.service.invoke('conversation.logs', {}, payload).subscribe((res) => {
      console.log(res);
      this.TransformConvsLogsData(res.data);
    })
  }

  sortingConvLogsByTime(sortType) {
    this.transformedConvsLogs=[];
    this.sortConvsLogsByTime = sortType
    let payload = {
      start: this.filter.startDate,
      end: this.filter.endDate,
      limit: this.ucOffset,
      skip: 0,
      sort: {"date":sortType},
      conversationId: ''
    }
    this.service.invoke('conversation.logs', {}, payload).subscribe((res) => {
      console.log(res);
      this.TransformConvsLogsData(res.data);
    })
  }

  openPicker() {
    this.isDatePicked = true;
    this.pickerDirective.open();
  }

  isInvalidDate = (m: moment.Moment) => {
    return m.isBefore(moment().subtract(90, 'days')) || m.isAfter(moment());
  }

  onDatesUpdated($event) {
    this.filters = { ... this.filters, startDate: this.selected.startDate.toISOString(), endDate: this.selected.endDate.toISOString() }
    if (this.isDatePicked) {
      this.getUsecases(null, false)
      console.log("called once date selectedd 5555555555555555555555555555555555555555555");
    }

  }

  durationCalc(dur: number) {
    var duration = moment.duration(dur);
    var hours = Math.trunc(duration.asHours());
    var minutes = Math.trunc(duration.asMinutes()) % 60;
    var seconds = Math.trunc(duration.asSeconds()) % 60;
    let diff;
    if (!hours) {
      if (!minutes) {
        if (!seconds) {
          diff = "0s"
        } else {
          diff = seconds + 's';
        }
      } else {
        diff = minutes + "m " + seconds + "s";
      }
    } else {
      diff = hours + "h " + minutes + "m " + seconds + "s";
    }
    return diff;
  }

}
