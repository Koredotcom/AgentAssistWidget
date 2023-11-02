import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceTextWithTag'
})
export class ReplaceTextWithTagPipe implements PipeTransform {

  transform(value: string, input:string): string {
    if(value && typeof value === 'string'){
      return input ? value.replace(new RegExp('('+input+')', 'gi'), '<b>$1</b>') : value;
    }
    return '';
  }

}
