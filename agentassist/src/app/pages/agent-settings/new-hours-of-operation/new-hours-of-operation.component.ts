import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { AgentSettingsService } from '../agent-settings.service';
import * as _ from 'underscore';
import * as moment from 'moment-timezone';
import { finalize } from 'rxjs/operators';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';

@Component({
  selector: 'app-new-hours-of-operation',
  templateUrl: './new-hours-of-operation.component.html',
  styleUrls: ['./new-hours-of-operation.component.scss'],
  animations: [fadeInOutAnimation]
})
export class NewHoursOfOperationComponent implements OnInit {
  hoursOperation: any = {};
  specialDays: any[] = [];
  editMode: boolean = false;
  submitted: boolean = false;
  timeZones: any[] = [];

  standardDays: any[] = [];

  loading: boolean = false;

  @Input() selectedHourOperation: any = {};
  @Output() closed = new EventEmitter();
  constructor(private agentSettingsService: AgentSettingsService, private translate: TranslateService,
    private service: ServiceInvokerService, private notificationService: NotificationService
  ) { }

  ngOnInit(): void {


    this.standardDays = [
      { "day": this.translate.instant("SUNDAY"), "value": "SU", "isOpen": false, "startTime": "09:00 AM", "endTime": "06:00 PM" },
      { "day": this.translate.instant("MONDAY"), "value": "MO", "isOpen": true, "startTime": "09:00 AM", "endTime": "06:00 PM" },
      { "day": this.translate.instant("TUESDAY"), "value": "TU", "isOpen": true, "startTime": "09:00 AM", "endTime": "06:00 PM" },
      { "day": this.translate.instant("WEDNESDAY"), "value": "WE", "isOpen": true, "startTime": "09:00 AM", "endTime": "06:00 PM" },
      { "day": this.translate.instant("THURSDAY"), "value": "TH", "isOpen": true, "startTime": "09:00 AM", "endTime": "06:00 PM" },
      { "day": this.translate.instant("FRIDAY"), "value": "FR", "isOpen": true, "startTime": "09:00 AM", "endTime": "06:00 PM" },
      { "day": this.translate.instant("SATURDAY"), "value": "SA", "isOpen": false, "startTime": "09:00 AM", "endTime": "06:00 PM" },
    ]
    if (this.selectedHourOperation && this.selectedHourOperation.id) {
      this.editMode = true;
      this.prepareFormData();
    } else {
      this.editMode = false;
    }

    this.timeZones = moment.tz.names();
    this.hoursOperation.timezone = moment.tz.guess();
    if (this.hoursOperation.timezone === 'Asia/Calcutta') { this.hoursOperation.timezone = 'Asia/Kolkata' }

  }

  prepareFormData() {
    this.loading = true;
    const params = { "id": this.selectedHourOperation.id };
    this.service.invoke("get.hoursOperations", params)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.hoursOperation.name = res.name;
        this.hoursOperation.timezone = res.timezone;
        this.specialDays = res.specialDays.days.map(day => {
          return {
            "name": day.name,
            "startTime": day.start,
            "endTime": day.end,
            "date": day.date ? { startDate: moment(day.date), endDate: moment(day.date) } : '',
            "period": day.period === 'FULL' ? true : false
          }
        });

        const days = res.standardDays.days;

        this.standardDays = this.standardDays.map(standardDay => {
          const day = days.find(f => f.day === standardDay.value)
          if (day) {
            standardDay.startTime = day.start;
            standardDay.endTime = day.end;
          }
          standardDay.isOpen = !!day;

          return standardDay;
        })

      }, err => {
        this.notificationService.showError(err, this.translate.instant("AGENTSETTINGS.FAILED_FETCH"));
      })
  }


  saveHoursOperation(isFormInvalid) {
    this.submitted = true;
    if (isFormInvalid) {
      this.notificationService.showError(undefined, this.translate.instant("AGENTS.FORM_INVALID"));
      return;
    } else {
      for (let item of this.specialDays) {
        if (item.date.startDate == null || item.date.startDate == undefined) {
          this.notificationService.showError(undefined, this.translate.instant("AGENTS.FORM_INVALID"));
          return;
        }
      }
      let payload: any = this.preparePayload();
      if (this.editMode) {
        const params = { "id": this.selectedHourOperation.id };
        this.service.invoke("put.agentSettings.putHoursOperation", params, payload).subscribe(res => {
          console.log(res, "save hours of operaion resp");
          this.agentSettingsService.appendHoursOfOperation(res);
          this.close();
        }, err => {
          this.notificationService.showError(err, this.translate.instant("AGENTSETTINGS.FAILED_CREATE_HOURS_OPER"));
        })
      } else {
        const params = {};
        this.service.invoke("post.agentSettings.createHoursOperation", params, payload).subscribe(res => {
          console.log(res, "save hours of operaion resp");
          this.agentSettingsService.appendHoursOfOperation(res);
          this.close();
        }, err => {
          this.notificationService.showError(err, this.translate.instant("AGENTSETTINGS.FAILED_CREATE_HOURS_OPER"));
        })
      }
    }
  }

  preparePayload() {
    let payload: any = {};
    payload["name"] = this.hoursOperation.name;
    payload["timezone"] = this.hoursOperation.timezone;
    payload["standardDays"] = {
      "frequency": "WEEKLY",
      "days": this.formatStandardDays()
    };
    payload["specialDays"] = {
      "frequency": "YEARLY",
      "days": this.formatSpecialDay()
    };
    return payload;
  }

  formatStandardDays() {
    return this.standardDays.filter(f => f.isOpen).map(e => ({ day: e.value, start: e.startTime, end: e.endTime }))
  }

  formatSpecialDay() {
    return this.specialDays.map(day => {
      return {
        "name": day.name,
        "start": day.startTime,
        "end": day.endTime,
        "date": day.date?.startDate.format('MM/DD/YYYY') || day.date,
        "period": day.period ? 'FULL' : 'PARTIAL'
      }
    })
  }

  addSpecialDay() {
    this.specialDays.push({ "date": "", "name": "", "period": false, "startTime": "09:00 AM", "endTime": "06:00 PM" })
  }

  deleteSpecialDay(index) {
    this.specialDays.splice(index, 1);
  }

  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  close() {
    this.closed.emit();
  }

}
