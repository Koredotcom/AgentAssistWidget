import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'underscore';

@Pipe({
  name: 'findSkill',
  pure: false
})
export class FindSkillPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let gp, skList, inp, added;
    [gp, skList, inp, added] = args;
    if(!gp) {
      return null;
    }
    if(gp && skList) {
      let list = _.pluck(_.where(skList, {skillGroupName: gp}), 'name');
      if(!inp) {
        if(!added) return list;
        return list.filter(item => !added.includes(item));
      }
      list = list.filter((val) => {
        return val.toLowerCase().startsWith(inp.toLowerCase())
      });
      return list;
    }
    return null;
  }

}
