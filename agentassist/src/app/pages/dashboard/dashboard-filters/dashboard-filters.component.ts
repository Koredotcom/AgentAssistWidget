import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { IAnalyticsFilters } from './dateFilter.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-filters',
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss']
})
export class DashboardFiltersComponent implements OnInit {

  @Output() exportPdf = new EventEmitter();

  private filters: IAnalyticsFilters;
  public filterUpdated$ = new Subject();

  //Calender
  selected: { startDate: Moment, endDate: Moment };
  ranges: any;
  calendarLocale: any;


  @ViewChild(DaterangepickerDirective) pickerDirective: DaterangepickerDirective;
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.ranges = {
      [this.translate.instant('CALENDAR.TODAY')]: [moment().startOf('day'), moment()],
      [this.translate.instant('CALENDAR.YESTERDAY')]: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
      [this.translate.instant('CALENDAR.LAST_X_DAYS', { x: 7 })]: [moment().subtract(6, 'days').startOf('day'), moment()],
      [this.translate.instant('CALENDAR.LAST_X_DAYS', { x: 15 })]: [moment().subtract(16, 'days').startOf('day'), moment()],
      [this.translate.instant('CALENDAR.LAST_X_DAYS', { x: 30 })]: [moment().subtract(29, 'days').startOf('day'), moment()]
    }

    this.calendarLocale = {
      applyLabel: this.translate.instant('BUTTONS.APPLY'),
      cancelLabel: this.translate.instant('BUTTONS.CANCEL'),
      customRangeLabel: this.translate.instant('CALENDAR.CUSTOM_RANGE')
    }

    this.selected = { startDate: moment().subtract(6, 'days').startOf('day'), endDate: moment() }
    this.filters = { startDate: this.selected.startDate.toISOString(), endDate: this.selected.endDate.toISOString() }
    this.updateFilters(this.filters);
  }

  onDatesUpdated($event) {
    this.filters = { ... this.filters, startDate: this.selected.startDate.toISOString(), endDate: this.selected.endDate.toISOString() }
    this.updateFilters(this.filters);
  }

  isInvalidDate = (m: Moment) => {
    return m.isBefore(moment().subtract(90, 'days')) || m.isAfter(moment());
  }

  openPicker() {
    this.pickerDirective.open();

  }

  updateFilters(filters: IAnalyticsFilters) {
    this.filters = filters;
    this.filterUpdated$.next(this.filters);
  }

  getFilters(): IAnalyticsFilters {
    return this.filters;
  }

  export(){
    this.exportPdf.emit("export pdf")
  }

}
