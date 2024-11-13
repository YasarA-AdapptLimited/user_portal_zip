import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const enumMember in value) {
      if (!isNaN(parseInt(enumMember, 10))) {
        if (value[enumMember] !== 'Unknown') {
          keys.push({key: enumMember,
            value: value[enumMember],
            displayName: value[enumMember].split(/(?=[A-Z])/).join(' ')});
        }
      }
    }
    return keys;
  }
}
