import { I } from "@angular/cdk/keycodes";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "sort"
})
export class ArraySortPipe implements PipeTransform {
    transform(array: any, field: string, order?: 'asc' | 'desc'): any[] {
        if (!Array.isArray(array)) {
            return;
        }
        array.sort((a: any, b: any) => {
            if (order === 'asc') {
                if (a[field] < b[field]) {
                    return -1;
                } else if (a[field] > b[field]) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (a[field] > b[field]) {
                    return -1;
                } else if (a[field] < b[field]) {
                    return 1;
                } else {
                    return 0;
                }
            }

        });
        return array;
    }
}