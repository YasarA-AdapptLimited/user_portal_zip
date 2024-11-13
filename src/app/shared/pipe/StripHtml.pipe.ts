import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stripHtml' })
export class StripHtmlPipe implements PipeTransform {
  public transform(input: string): string {
    if (!input) {
      return '';
    } else {
      return input.replace('<br/>', '');

    }
  }
}
