import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyObjectCheck'
})
export class EmptyObjectCheckPipe implements PipeTransform {

  transform(value : any) {
    if(value == null || value == undefined || typeof(value) == undefined){
      return false;
    }else if(value instanceof Array){
      return value.length;
    }else if(typeof(value) == 'object' && !Object.keys(value)?.length){
      return false;
    }
    return true;
  }


}
