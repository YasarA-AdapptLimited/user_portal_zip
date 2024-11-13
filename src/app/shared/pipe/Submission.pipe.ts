import { Pipe, PipeTransform } from '@angular/core';
import { RevalidationItem } from '../model/revalidation/RevalidationItem';

@Pipe({
  name: 'Submission',
  pure: false
})
export class SubmissionPipe implements PipeTransform {

  transform(items: RevalidationItem[], submission: boolean): any {
    if (!items) {
      return [];
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter(item => !item.deleted && item.included === submission
      );
  }
}
