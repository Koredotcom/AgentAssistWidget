import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'strictFilter'
})
export class StrictFilterPipe implements PipeTransform {
    transform(items: any[], args: any[]): any[] {
        if (!items) return [];

        return items.filter(it => {
            if (args[1]) {
                return it[args[1]] == args[0];
            } else {
                return it == args[0];
            }
        });
    }
}