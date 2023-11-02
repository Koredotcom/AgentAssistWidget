import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeTagFromString'
})
export class RemoveTagFromStringPipe implements PipeTransform {

  transform(value: string): string {
    console.log("valuevaluevalue", value);
    if(value && typeof value === 'string'){
     return value.replace( /(<([^>]+)>)/ig, '').replace(/"/g, "'");
    }
    return '';
  }
}
