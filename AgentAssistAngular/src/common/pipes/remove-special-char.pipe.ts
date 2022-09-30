import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpecialChar'
})
export class RemoveSpecialCharPipe implements PipeTransform {

  transform(string: String): String {
    return string.replace(/^\s+|\s+$/g, "");
  }

}
