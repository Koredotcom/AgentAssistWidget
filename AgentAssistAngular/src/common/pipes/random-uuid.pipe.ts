import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomUUID'
})
export class RandomUUIDPipe implements PipeTransform {

  transform(): number {
    return Math.floor(Math.random() * 100);
  }

}
