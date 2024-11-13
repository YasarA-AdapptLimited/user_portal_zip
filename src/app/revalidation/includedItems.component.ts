import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RevalidationItem } from '../shared/model/revalidation/RevalidationItem';
import { RevalidationItemType } from '../shared/model/revalidation/RevalidationItemType';
import { Router } from '@angular/router';
import { Tooltip } from '../core/tooltip/Tooltip';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-included-items',
  moduleId: module.id,
  templateUrl: './includedItems.component.html',
  styleUrls: ['./includedItems.scss']
})
export class IncludedItemsComponent implements OnInit {
  @Input() type: RevalidationItemType;
  @Input() id: string;
  @Input() title: string;
  items: RevalidationItem[];
  @Input('items') set setItems(items: RevalidationItem[]) {
    this.items = items;

  }
  @Input() isCurrentSubmission;
  @Input() requiredCount: number;
  @Input() overMaxWarning: string;
  @Input() countInfo: string;
  @Input() readonly = false;
  @Input() index = 0; // index of item type
  @Input() length = 0; // length of item types
  @Output() itemChanged = new EventEmitter<RevalidationItem>();

  createTooltip: Tooltip;
  progressTooltip: Tooltip;
  completedTooltip: Tooltip;
  notStartedTooltip: Tooltip;
  excludeTooltip: Tooltip;
  itemTitleTooltip: Tooltip;
  itemCountTooltip: Tooltip;

  constructor(
    private _router: Router, private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    this.itemCountTooltip = {
      id: 'count-' + this.title,
      contextId: 'currentSubmission',
      content: this.countInfo,
      width: 210,
      placement: 'top',
      order: this.index
    };

    this.createTooltip = {
      id: 'create-' + this.title,
      contextId: 'currentSubmission',
      content: `Click the plus button to create a new ${this.title} entry.`,
      placement: 'right',
      width: 180,
      order: this.index + 1,
      used: !!this.items.length
    };

    this.itemTitleTooltip = {
      id: 'item-title',
      contextId: 'currentSubmission',
      content: `The title of your ${this.title}.<br/>Click the title to open it.`,
      placement: 'bottom',
      width: 280,
      order: this.length + 10
    };

    this.progressTooltip = {
      id: 'item-progress',
      contextId: 'currentSubmission',
      content: 'This entry is in progress.<br/>Click to mark it as completed.',
      width: 260,
      placement: 'bottom',
      order: this.length + 11
    };

    this.completedTooltip = {
      id: 'item-completed',
      contextId: 'currentSubmission',
      content: 'This entry is marked as completed.<br/>Click to mark it as in progress.',
      width: 300,
      placement: 'bottom',
      order: this.length + 12
    };

    this.notStartedTooltip = {
      id: 'item-not-started',
      contextId: 'currentSubmission',
      content: 'This entry hasn\'t been started yet, so you can\'t mark it as completed.',
      width: 300,
      placement: 'bottom',
      order: this.length + 13
    };

    this.excludeTooltip = {
      id: 'item-exclude',
      contextId: 'currentSubmission',
      content: 'Exclude this entry from your next submission.',
      placement: 'right',
      width: 170,
      order: this.length + 14
    };

  }


  getItemTooltip(item: RevalidationItem) {
    if (item.completed) { return this.completedTooltip; }
    if (!item.answers || !item.answers.length) { return this.notStartedTooltip; }
    return this.progressTooltip;
  }

  create() {
    this._router.navigate([`/revalidation/${this.id}/item/${this.type}`],
      { queryParams: { current: this.isCurrentSubmission } });
  }

  open(item) {

    this._router.navigate([`/revalidation/${this.id}/item/${item.type}/${item.id}`],
      { queryParams: { current: this.isCurrentSubmission } });
  }

  toggleCompleted(item: RevalidationItem) {
    if (item.progress) {
      item.completed = !item.completed;
      this.itemChanged.emit(item);
    }
  }

  toggleIsPartOfSubmission(item: RevalidationItem) {
    item.included = !item.included;
    this.itemChanged.emit(item);
  }

  get isCompleted() {
    return this.requiredCount === this.items.filter(i => i.completed).length;
  }


}