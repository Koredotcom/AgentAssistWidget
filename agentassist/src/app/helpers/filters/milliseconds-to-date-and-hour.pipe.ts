import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisecondsToDateAndHour'
})
export class MillisecondsToDateAndHourPipe implements PipeTransform {

  transform(milliseconds: number): string {
    const date = new Date(milliseconds);

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sept", "Oct",
      "Nov", "Dec"
    ];
    const monthName = monthNames[monthIndex];
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Function to add ordinal suffix to day
    const addOrdinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return day + 'th';
      switch (day % 10) {
        case 1: return day + "st";
        case 2: return day + "nd";
        case 3: return day + "rd";
        default: return day + "th";
      }
    };

    // Format hours and minutes
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const period = hours < 12 ? 'am' : 'pm';

    return `${addOrdinalSuffix(day)} ${monthName} ${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

}
