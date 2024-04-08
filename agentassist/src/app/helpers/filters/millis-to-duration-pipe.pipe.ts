import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisToDurationPipe'
})
export class MillisToDurationPipePipe implements PipeTransform {

  transform(milliseconds: number): string {
    // Convert milliseconds to seconds
    let seconds = Math.floor((milliseconds / 1000) % 60);

    // Convert seconds to minutes
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);

    // Convert minutes to hours
    let hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    // Format the duration string
    let durationString = '';
    if (hours > 0) {
      durationString += hours + 'h ';
    }
    if (minutes > 0 || hours > 0) {
      durationString += minutes + 'm ';
    }
    durationString += seconds + 's';

    return durationString;
  }

}
