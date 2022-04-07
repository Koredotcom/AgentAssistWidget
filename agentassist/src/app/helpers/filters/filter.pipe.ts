import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchArray: any[]): any[] {
    if (!items) return [];

    return items.filter(it => {
      if (searchArray[2] && searchArray[2].find(f => f[searchArray[1]] === it[searchArray[1]])) {
        return false;
      }
      if (searchArray[1]) {
        searchArray[0] = searchArray[0].toLowerCase();
        return it[searchArray[1]].toLowerCase().includes(searchArray[0]);
      }
      if (searchArray[0]) {
        searchArray[0] = searchArray[0].toLowerCase();
        return it.toLowerCase().includes(searchArray[0]);
      }
      return true;
    });
  }
}