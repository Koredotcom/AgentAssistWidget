import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomUUID'
})
export class RandomUUIDPipe implements PipeTransform {

  transform(positionId?:string): any {
    if(positionId){
      return  ('dg-' + (Math.random() + 1).toString(36).substring(2));
    }
    let max = Math.floor(Math.random() * 9);
    let min = Math.floor(Math.random() * 5);
    return Math.floor(Math.random() * 95) + max - min;
  }

}
