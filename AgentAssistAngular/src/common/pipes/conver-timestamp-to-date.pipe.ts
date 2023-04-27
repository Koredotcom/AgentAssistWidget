import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'converTimestampToDate'
})
export class ConverTimestampToDatePipe implements PipeTransform {

  transform(timestamp: any) {
    if(timestamp){
      const date = new Date(timestamp);
      let dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
      return dateFormat;
    }
    return null
  }

}
