import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lookup'
})
export class LookupPipe implements PipeTransform {

  transform(items: any[], searchArray: any[]): any[] {
    if (!items) return [];

    return items.filter(item => {
      return !searchArray.find(f => f.name === item.name)
    });
  }

}
