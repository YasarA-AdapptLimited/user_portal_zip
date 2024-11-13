import { Component, Input, Output, OnInit, EventEmitter, HostBinding } from '@angular/core';
import { Tooltip } from '../core/tooltip/Tooltip';

@Component({
  selector: 'app-gphc-icon',
  moduleId: module.id,
  templateUrl: './gphc-icon.component.html',
  styleUrls: ['./gphc-icon.scss']
})

export class GphcIconComponent implements OnInit {

  @HostBinding('tabindex') tabindex = -1;
  @Input() iconType: string;
  @Input() label: string;
  position = 'absolute';
  @Input() set static(value) {
    if (value) {
      this.position = 'static';
    }
  }
  fontSize;
  @Input() set size(value) {
    this.fontSize = value + 'px';
  }
  @Input() description = '';
  @Input() small = false;
  @Input() active = false;
  @Input() primary = false;
  offsetPixelsTop;
  offsetPixelsRight = '-10px';
  offsetPixelsLeft;
  @Input() set top(value) {
    this.offsetPixelsTop = value + 'px';
  }
  @Input() set right(value) {
    this.offsetPixelsRight = value + 'px';
  }
  @Input() disabled = false;
  @Input() showLabel = true;
  @Input() showLabelAlways = false;
  @Input() tooltip: Tooltip;

  @Input('offset') set offsetRight(value: any) {
    if (value === 'none') {
      this.offsetPixelsRight = undefined;
    } else {
      this.offsetPixelsRight = value + 'px';
    }
  }
  @Input('offsetLeft') set offsetLeft(value: any) {
    if (value === 'none') {
      this.offsetPixelsLeft = undefined;
    } else {
      this.offsetPixelsLeft = value + 'px';
    }
  }
  @Input('offsetTop') set offsetTop(value: any) {
    if (value === 'none') {
      this.offsetPixelsTop = undefined;
    } else {
      this.offsetPixelsTop = value + 'px';
    }
  }

  @Output() click = new EventEmitter<any>();


  iconTypes = {
    back: {
      fa: 'fa-chevron-left'
    },
    info: {
      fa: 'fa-info'
    },
    edit: {
      fa: 'fa-pencil'
    },
    annotate: {
      fa: 'fa-pencil'
    },
    save: {
      fa: 'fa-save'
    },
    cancel: {
      fa: 'fa-remove'
    },
    close: {
      fa: 'fa-close'
    },
    create: {
      fa: 'fa-plus'
    },
    next: {
      fa: 'fa-chevron-right'
    },
    prev: {
      fa: 'fa-chevron-left'
    },
    list: {
      fa: 'fa-list'
    },
    submit: {
      fa: 'fa-upload'
    },
    discussion: {
      fa: 'fa-comments'
    },
    delete: {
      fa: 'fa-trash'
    },
    approve: {
      fa: 'fa-thumbs-up'
    },
    unapprove: {
      fa: 'fa-thumbs-down'
    },
    return: {
      fa: 'fa-arrow-left'
    }
  }

  constructor() { }

  ngOnInit() {
    if (this.iconType === 'info' || this.iconType === 'create') {
      this.showLabel = false;
    }
  }

  onClick($event) {
    $event.stopPropagation();
    this.click.emit($event);
  }
  onKeyupEnter($event) {
    $event.stopPropagation();
  }
  onKeydownEnter($event) {
    $event.stopPropagation();
  }

}
