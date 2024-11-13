import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'caseSplit' })
export class CaseSplitPipe implements PipeTransform {
  public transform(input: string, isCCPSApplication: boolean = false): string {
    if (!input) {
      return '';
    } else {
      if (isCCPSApplication && input === "NotStarted") {
        return "Start new application";
      } else {
        const val = input.split(/(?=[A-Z,0-9])/).join(' ');
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();  
      }
    }
  }
}
