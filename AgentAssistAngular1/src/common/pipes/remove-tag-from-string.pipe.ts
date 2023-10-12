import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeTagFromString'
})
export class RemoveTagFromStringPipe implements PipeTransform {

  transform(value: string): unknown {
    if(value){
     return value.replace( /(<([^>]+)>)/ig, '').replace(/"/g, "'");
    }
    return '';
  }

}
