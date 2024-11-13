import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dobDate'
})

export class DobDatePipe implements PipeTransform {

  transform(value: any): any {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    value = value ? value.split('T')[0].replace(pattern, '$3/$2/$1') : value;
    return value;
  }
}