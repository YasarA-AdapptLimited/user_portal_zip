import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
  transform(value: Date, args: string[]): any {
    const hour = ('0' + value.getHours()).slice(-2);
    const minute = ('0' + value.getMinutes()).slice(-2);
    const second = ('0' + value.getSeconds()).slice(-2);
    const milli = ('00' + value.getMilliseconds()).slice(-3);
    return `${hour}:${minute}:${second}:${milli}`;
  }
}
