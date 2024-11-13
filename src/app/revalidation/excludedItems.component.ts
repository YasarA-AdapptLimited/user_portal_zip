import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RevalidationItem } from '../shared/model/revalidation/RevalidationItem';
import { RevalidationItemType } from '../shared/model/revalidation/RevalidationItemType';
import { Router } from '@angular/router';
import { Tooltip } from '../core/tooltip/Tooltip';

@Component({
  selector: 'app-excluded-items',
  moduleId: module.id,
  templateUrl: './excludedItems.component.html',
  styleUrls: ['./excludedItems.scss']
})
export class ExcludedItemsComponent implements OnInit {
  @Input() type: RevalidationItemType;
  @Input() id: string;
  @Input() title: string;
  @Input() items: RevalidationItem[];
  @Input() readonly = false;
  @Input() isCurrentSubmission;

  @Output() itemDelete = new EventEmitter<RevalidationItem>();
  @Output() itemChanged = new EventEmitter<RevalidationItem>();

  deleteTooltip: Tooltip;
  includeTooltip: Tooltip;
  itemTitleTooltip: Tooltip;
  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
    this.itemTitleTooltip = {
      id: 'item-title',
      contextId: 'excluded',
      content: 'The title of your ' + this.title + '.<br/>Click the title to open it.',
      placement: 'bottom',
      width: 280,
      order: 1
    };
    this.deleteTooltip = {
      id: 'delete',
      contextId: 'excluded',
      content: 'Permanently delete this entry.',
      placement: 'top',
      width: 160,
      order: 2
    };
    this.includeTooltip = {
      id: 'include',
      contextId: 'excluded',
      content: 'Include this entry in your next submission.',
      placement: 'right',
      width: 160,
      order: 3
    };

  }

  open(item: RevalidationItem) {
    this._router.navigate([`/revalidation/${this.id}/item/${item.type}/${item.id}`],
    { queryParams: { current: this.isCurrentSubmission } });
  }


  toggleIsPartOfSubmission(item: RevalidationItem) {
    item.included = !item.included;
    this.itemChanged.emit(item);
  }

  delete(item) {
    this.itemDelete.emit(item);
  }

}
