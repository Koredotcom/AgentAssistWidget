import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import * as _ from 'underscore';
import * as moment from 'moment';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { Moment } from 'moment';
import { LocalStoreService } from '@kore.services/localstore.service';
import { mock_logs } from 'src/app/data/conversational-logs.model';
export interface IAnalyticsFilters {
  startDate: string | any,
  endDate: string | any,
  type?: string | any
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
  // isLoadingData = false;
  showSlider = false;
  isApiPending = false;
  filter: any = {
    startDate: moment().subtract({ days: 7 }),
    endDate: moment(),
    limit: 20,
    sort: { "startTime": "desc" }
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
  isSearching = false;
  erroMsg;
  isSearched = false;
  readonly USECASES_LIMIT = 20;
  // ucOffset = 20;
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
  sortConvsIds: string = 'desc';
  sortConvsLogsByTime: string = 'desc';
  accountId: string;
  hasMore = false;
  page = 0;
  onScroll = false;
  constructor(
    private service: ServiceInvokerService,
    private localstorage: LocalStoreService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.accountId = this.localstorage.getSelectedAccount()?.accountId
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
    this.selected = { startDate: moment().startOf('day'), endDate: moment() }
    this.filters = { startDate: this.selected.startDate.toISOString(), endDate: this.selected.endDate.toISOString() }
    console.log("called from ngoninit 111111111111111111111111111111111");

    this.getConversationLogs();

  }
  ngAfterViewInit() {
    // setTimeout(() => {
    //   fromEvent(this.searchTerm.nativeElement, 'input')
    //     .pipe(
    //       map((event: any) => {
    //         if (event.target.value == '') {
    //           return event.target.value;
    //         }
    //       }),
    //       debounceTime(1000),
    //       distinctUntilChanged())
    //     .subscribe((val) => {
    //       if (val == '' && this.isSearched) {
    //         console.log("called once search is cleared 222222222222222222222222222222222");
    //         this.getConversationLogs('');
    //         this.isDatePicked = false;
    //         this.isSearched = false;
    //       }
    //     });
    // }, 100);

  }

  // save(e) {
  //   this.isDatePicked = false
  //   this.isSearched = true;
  //   this.seachedConvsId = e.target.value;
  //   this.getConversationLogs();
  //   console.log("called clciked enter on search box 333333333333333333333333333333333333333");
  // }
  onReachEnd(event) {
    // console.log(this.showConversation, this.isSearched, this.isDatePicked, "flags", this.isInitialLoadDone, this.isMoreAvailable);

    // if ((this.isInitialLoadDone || this.isMoreAvailable) && !this.showConversation && !this.isSearched && !this.isDatePicked) {
    //   console.log("called once scroll reached end 444444444444444444444444444444");
    //   this.getConversationLogs(null, true);
    // } else {
    //   return;
    // }
    if(this.hasMore && event.target.scrollTop > 0 && !this.isLoading){
      this.getConversationLogs(undefined, true)
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


  getConversationLogs(page=undefined, onScroll=false) {
    if(onScroll){
      this.onScroll = true;
    }
    if(page != undefined){
      this.page = page;
    }
    // this.ucOffset = pagination ? this.ucOffset + this.USECASES_LIMIT : this.USECASES_LIMIT;
    // console.log(this.filter)
    this.isLoading = true;
    const params = {
      'accountId': this.accountId
    };

    let payload = {
      start: this.filters.startDate,
      end: this.filters.endDate,
      limit: this.USECASES_LIMIT,
      page: this.page,
      sort: this.filter.sort,
      conversationId: ''
    }
    // if (val?.length > 0) {
    //   this.realconvs = this.convs.filter((ele) => ele.CONVERSATION_ID == val);
    //   if (this.realconvs.length == 0) {
    //     this.erroMsg = `No conversation logs found.
    //     Modify filter parameters and try again.`;
    //   }
    // } else {
    //   this.erroMsg = undefined;
    //   this.realconvs = [...this.convs]
    // }
    this.cdRef.detectChanges();
    this.service.invoke('conversation.logs', params, payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.onScroll = false;
          this.cdRef.detectChanges();
        }))
      .subscribe((res) => {
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', res)
        if (res.data.length > 0) {
            this.page = this.page+1;
            this.hasMore = res.hasMore;
           this.TransformConvsLogsData(res.data)
          //  this.page = this.page+1;
        }else{
          this.transformedConvsLogs = [];
        } /* else {
          this.TransformConvsLogsData(res.data);
        } */
        // this.isInitialLoadDone = true;
        // if(this.TransformConvsLogsData.length == 0){
        //   this.isDatePicked = false;
        // }
      }, err => {
        this.isInitialLoadDone = false;
        this.transformedConvsLogs = [];
        this.isDatePicked = false;
      });
    // let res = mock_logs;
    // this.TransformConvsLogsData(res.data);
    // this.isMoreAvailable = res.hasMore;
    // this.isInitialLoadDone = true;
    // if(datepicked && this.TransformConvsLogsData.length == 0){
    //   this.isDatePicked = false;
    // }
  }

  TransformConvsLogsData(resData) {
    // this.transformedConvsLogs = [];
      if(resData){
        this.transformedConvsLogs.push(...resData);
      }else{
        this.transformedConvsLogs = [];
      }
      this.cdRef.detectChanges();
    // if(resData){
    //   for( let convsLogData of resData) {
    //     convsLogData.start = moment(convsLogData.time).format('MMMM Do YYYY, h:mm:ss a');
    //     // convsLogData.end = moment(convsLogData.endedOn).format('MMMM Do YYYY, h:mm:ss a');
    //     // convsLogData.duration = moment(convsLogData.duration).format("HH:mm:ss");
    //     this.transformedConvsLogs.push({...convsLogData})
    //   }
    // }else{
    //   this.transformedConvsLogs = [];
    // }
    // this.transformedConvsLogs = JSON.parse(JSON.stringify(this.transformedConvsLogs));
    // return JSON.parse(JSON.stringify(this.transformedConvsLogs));
  }
  getStartTime(date){
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  }
  convsIdSorting(sortType) {
    this.filter["sort"] = {
      "convId": sortType
    };
    this.isLoading = true;
    const params = {
      'accountId': this.accountId
    };
    this.page = 0;
    this.transformedConvsLogs=[]
    this.sortConvsIds = sortType
    let payload = {
      start: this.filters.startDate,
      end: this.filters.endDate,
      limit: this.USECASES_LIMIT,
      page: 0,
      sort: {"convId": sortType},
      conversationId: ''
    };
    this.cdRef.detectChanges();
    this.service.invoke('conversation.logs', params, payload)
    .pipe(
      finalize(()=>{
        this.isLoading = false;
      })
    )
    .subscribe((res) => {
      console.log(res);
      this.page = this.page+1;
      this.hasMore = res.hasMore;
      this.TransformConvsLogsData(res.data);
    })
  }

  sortingConvLogsByTime(sortType) {
    this.filter["sort"] = {
      "startTime": sortType
    };
    this.isLoading = true;
    const params = {
      'accountId': this.accountId
    };
    this.page = 0;
    this.transformedConvsLogs=[];
    this.sortConvsLogsByTime = sortType
    let payload = {
      start: this.filters.startDate,
      end: this.filters.endDate,
      limit: this.USECASES_LIMIT,
      page: 0,
      sort: {"startTime":sortType},
      conversationId: ''
    };
    this.cdRef.detectChanges();
    this.service.invoke('conversation.logs', params, payload)
    .pipe(
      finalize(()=>{
        this.isLoading = false;
      })
    )
    .subscribe((res) => {
      console.log(res);
      this.page = this.page+1;
      this.hasMore = res.hasMore;
      this.TransformConvsLogsData(res.data);
    })
  }

  openPicker() {
    this.isDatePicked = true;
    this.pickerDirective.open();
  }

  isInvalidDate = (m: moment.Moment) => {
    return m.isBefore(moment().subtract(360, 'days')) || m.isAfter(moment());
  }

  onDatesUpdated($event) {
    this.transformedConvsLogs = [];
    this.cdRef.detectChanges();
    this.filters = { ... this.filters, startDate: this.selected.startDate, endDate: this.selected.endDate }
    if (this.isDatePicked) {
      this.getConversationLogs(0);
      // console.log("called once date selectedd 5555555555555555555555555555555555555555555", this.selected.startDate.toISOString());
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
