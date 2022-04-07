import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldType'
})
export class FieldTypePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let chngVal = '';
    if(value == 'date') {
      chngVal = 'Date';
    }
    else if(value == 'url') {
      chngVal = 'URL';
    }
    else if(value == 'textbox') {
      chngVal = 'Textbox';
    }
    else if(value == 'staticDropDown') {
      chngVal = 'Static Dropdown';
    }
    else if(value == 'textarea') {
      chngVal = 'Textarea';
    }
    else if(value == 'typeahead') {
      chngVal = 'Type Ahead';
    }
    else if(value == 'email') {
      chngVal = 'Email';
    }
    else if(value == 'file') {
      chngVal = 'File Upload';
    }
    else if(value == 'datetime') {
      chngVal = 'Date & Time';
    }
    else if(value == 'timezone') {
      chngVal = 'Time Zone';
    }
    return chngVal;
  }

}
