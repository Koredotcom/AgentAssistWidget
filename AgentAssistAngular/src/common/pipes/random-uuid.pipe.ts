import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomUUID'
})
export class RandomUUIDPipe implements PipeTransform {

  transform(positionId?:string): any {
    console.log(positionId, "positionid");
    if(positionId){
      return  ('dg-' + (Math.random() + 1).toString(36).substring(2));
    }
    return Math.floor(Math.random() * 100);
  }

}
