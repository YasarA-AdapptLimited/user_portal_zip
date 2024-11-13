import { Pipe, PipeTransform } from '@angular/core';
import utils from '../service/utils';
import { DateFormat } from '../model/DateFormat';

@Pipe({ name: 'utcDate' })
export class UtcDatePipe implements PipeTransform {
  transform(value: any): any {
    return utils.formatDate(value, DateFormat.Display);
  }
}


