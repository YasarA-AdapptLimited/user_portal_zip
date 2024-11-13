import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'friendlyBoolean' })
export class FriendlyBooleanPipe implements PipeTransform {
  transform(value: Boolean): any {
    return value ? 'Yes' : 'No';
  }
}
