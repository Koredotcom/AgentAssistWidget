import { Pipe, PipeTransform } from '@angular/core';
import { UsecaseOb } from './uc-table-main.model';

import * as _ from 'underscore';

@Pipe({
  name: 'ucFilter'
})
export class FilterUsecasesPipe implements PipeTransform {
  transform(usecases: UsecaseOb[], prop: string, search: string, prop2: string, search2: string): UsecaseOb[]  {
    if(!search && !search2) {  
      return usecases; 
    } else if(usecases) {
      if(search && search2) {
        return _.where(usecases, {[prop]: search, [prop2]: search2});
      } else if(search) {
        return _.where(usecases, {[prop]: search});
      } else if(search2){
        return _.where(usecases, {[prop2]: search2});
      }
    }
  }
}
