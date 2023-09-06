import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { IDashboardFilter } from './dateFilter.model';
import { Subject } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { CHANNELS } from '../dashboard.cnst';
import { AuthService } from '@kore.services/auth.service';

@Component({
  selector: 'app-dashboard-filters',
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss']
})
export class DashboardFiltersComponent implements OnInit {

  @Output() exportPdf = new EventEmitter();

  private filters: IDashboardFilter;

  //Calender
  selected: { startTime: Moment, endTime: Moment };
  ranges: any = {
    [this.translate.instant('CALENDAR.TODAY')]: [moment().startOf('day'), moment()],
    [this.translate.instant('CALENDAR.YESTERDAY')]: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
    [this.translate.instant('CALENDAR.LAST_X_DAYS', { x: 7 })]: [moment().subtract(6, 'days').startOf('day'), moment()],
    [this.translate.instant('CALENDAR.LAST_X_DAYS', { x: 15 })]: [moment().subtract(16, 'days').startOf('day'), moment()],
    [this.translate.instant('CALENDAR.LAST_X_DAYS', { x: 30 })]: [moment().subtract(29, 'days').startOf('day'), moment()]
  }
    ;
  calendarLocale: any;
  channelList : any = CHANNELS;
  selectedChannel : string = 'all';
  botList: any = {};
  selectedBot: any;


  @ViewChild(DaterangepickerDirective) pickerDirective: DaterangepickerDirective;
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private dashboardService : DashboardService,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.botList = this.authService.smartAssistBots || [];
    this.selectedBot = this.authService.smartAssistBots[0].name;
    this.calendarLocale = {
      applyLabel: this.translate.instant('BUTTONS.APPLY'),
      cancelLabel: this.translate.instant('BUTTONS.CANCEL'),
      customRangeLabel: this.translate.instant('CALENDAR.CUSTOM_RANGE')
    }

    this.selected = { startTime: moment().subtract(6, 'days').startOf('day'), endTime: moment() }
    this.filters = { startTime: this.selected.startTime.toISOString(), endTime: this.selected.endTime.toISOString(), experience : this.selectedChannel }
    this.updateFilters(this.filters);
  }

  onDatesUpdated($event) {
    this.filters = { ... this.filters, startTime: this.selected.startTime.toISOString(), endTime: this.selected.endTime.toISOString() }
    this.updateFilters(this.filters);
  }

  isInvalidDate = (m: Moment) => {
    return m.isBefore(moment().subtract(90, 'days')) || m.isAfter(moment());
  }

  openPicker() {
    this.pickerDirective.open();
  }

  updateFilters(filters: IDashboardFilter) {
    this.filters = filters;
    this.dashboardService.setDashboardFilterUpdated(this.filters);
  }

  getFilters(): IDashboardFilter {
    return this.filters;
  }

  export() {
    this.exportPdf.emit("export pdf")
  }

  changeChannel(channel){
    this.filters = { ... this.filters, experience : channel }
    this.selectedChannel = channel;
  }

  changeBot(bot) {
    this.filters = { ... this.filters, botId: bot._id}
    this.selectedBot = bot.name;
    this.updateFilters(this.filters);
  }

}
