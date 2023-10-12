import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceQuotStringWithDoubleQuot'
})
export class ReplaceQuotStringWithDoubleQuotPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
