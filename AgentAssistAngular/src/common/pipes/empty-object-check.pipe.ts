import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyObjectCheck'
})
export class EmptyObjectCheckPipe implements PipeTransform {

  transform(value) {
    console.log(value, "value");
    
    if(value == null || value == undefined || typeof(value) == undefined){
      return false;
    }else if(value instanceof Array){
      console.log(value.length, "lenght");
      
      return value.length;
    }else if(typeof(value) == 'object' && !Object.keys(value).length){
      return false;
    }
    return true;
  }

}
