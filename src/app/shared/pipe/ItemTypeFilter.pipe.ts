import { Pipe, PipeTransform } from '@angular/core';
import { RevalidationItem } from '../model/revalidation/RevalidationItem';
import { RevalidationItemType } from '../model/revalidation/RevalidationItemType';

@Pipe({
  name: 'RevalidationItemType',
  pure: false
})
export class RevalidationItemTypePipe implements PipeTransform {

  transform(items: RevalidationItem[], type: RevalidationItemType): any {
    if (!items) {
      return [];
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter(item => item.type === type);
  }
}
