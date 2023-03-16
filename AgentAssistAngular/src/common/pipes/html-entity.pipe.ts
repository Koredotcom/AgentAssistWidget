import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlEntity'
})
export class HtmlEntityPipe implements PipeTransform {

  transform(str): unknown {
    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos/g,"'");
  }

}
