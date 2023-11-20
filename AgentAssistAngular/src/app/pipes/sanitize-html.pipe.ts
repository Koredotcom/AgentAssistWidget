import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {

  transform(text:string) {
    if(typeof text == 'object'){
      return JSON.stringify(text);
    }
    var lt = /</g, 
    gt = />/g, 
    ap = /'/g, 
    ic = /"/g;
    let value = text.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
    return value;
}

}
