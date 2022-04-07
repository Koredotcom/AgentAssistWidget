import { Pipe, PipeTransform } from '@angular/core';
import { Skill } from '../../data/skills.model';

import * as _ from 'underscore';

@Pipe({
  name: 'skillsMap'
})
export class SkillsMapPipe implements PipeTransform {

  transform(value: string, skills: Skill[], type: 'gp' | 'skill'): unknown {
    if(type == 'gp') {
      return _.findWhere(skills, {skillGroupId: value})?.skillGroupName;
    } else if(type == 'skill') {
      return _.findWhere(skills, {_id: value})?.name?_.findWhere(skills, {_id: value})?.name:value;
    }
  }

}
