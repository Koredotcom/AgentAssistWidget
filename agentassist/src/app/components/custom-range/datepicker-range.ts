import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { Component, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ngbd-datepicker-range',
  templateUrl: './date-picker-range.html',
  styles: [`
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.outRange {
      opacity:0.5;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `]
})
export class NgbdDatepickerRange{

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  maxDate: NgbDate;
  minDate: NgbDate;
  arrows: NgbDate;
  @Output() messageEvent = new EventEmitter<any>();

  constructor(calendar: NgbCalendar) {
    this.maxDate = calendar.getToday();
    this.minDate = calendar.getPrev(calendar.getToday(), 'd', 89)
    this.toDate = calendar.getToday();
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 6);
  }

  ngAfterViewInit() {
    var leftNav = document.getElementsByClassName('ngb-dp-arrow-btn') as HTMLCollectionOf<HTMLElement>;
    setTimeout(() => {
      leftNav[0].click();
    }, 10);    
  }

  onDateSelection(date: NgbDate) {
    if (this.toDate && this.fromDate) {
      this.fromDate = date;
      this.toDate = null;
    }
    else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    }
    else if (this.fromDate && !this.toDate && date.before(this.fromDate)) {
      this.toDate = this.fromDate;
      this.fromDate = date;
    }
  }

  applyDates() {
      if(!this.toDate){
        this.toDate = this.fromDate;
      }
      var a = {d1: this.fromDate, d2: this.toDate};
      this.messageEvent.emit(a);
  }
  closeDates() {
    this.messageEvent.emit("close");
}

  isHovered(date: NgbDate) {
    //return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    //return this.toDate && !this.fromDate && this.hoveredDate && date.after(this.hoveredDate) && date.before(this.toDate);
    //return this.toDate && this.hoveredDate && date.after(this.hoveredDate) && date.before(this.toDate);
    return this.toDate && date.after(this.hoveredDate) && date.before(this.maxDate) && date.after(this.minDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  isOutRange(date: NgbDate) {
    return date.before(this.minDate) || date.after(this.maxDate);
  }
}
