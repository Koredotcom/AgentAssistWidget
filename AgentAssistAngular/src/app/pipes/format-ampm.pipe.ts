import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAmpm'
})
export class FormatAmpmPipe implements PipeTransform {

  transform(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

}
