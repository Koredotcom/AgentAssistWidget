import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'automationIntentvsEntityString'
})
export class AutomationIntentvsEntityStringPipe implements PipeTransform {

  transform(entityList): unknown {
    if(entityList){
      if(entityList.length > 1){
        return entityList[0].entityName + ', ' + entityList[1].entityName; 
      }else {
        return entityList[0].entityName;
      }
    }
    return '';
  }

}
