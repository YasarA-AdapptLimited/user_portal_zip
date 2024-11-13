import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, HostBinding } from '@angular/core';
import { IProgress } from './IProgress';
import { Tooltip } from '../core/tooltip/Tooltip';

@Component({
  selector: 'app-progress-indicator',
  moduleId: module.id,
  templateUrl: 'progressIndicator.component.html',
  styleUrls: ['./progressIndicator.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressIndicatorComponent  {

  radius = 12;
  stroke = 2;
  sizeName = 'small';
  responsive =  false;
  background = '#e5f1eb';
  successColor = '#58b896';
  warningColor = '#c52e2e'; // '#ef7b0f';
  currentValue = '';
  
  progress: IProgress;
  @HostBinding('tabindex') tabindex = -1;
  @Input() extraSmall = false;
  @Input() progressLabel;
  @Input() noLabel;
  @Input() description = '';
  @Input() percent = false;
  @Input() set item(item: IProgress) {
    this.progress = item;
    if (this.percent) {
      const percent = Math.round(item.progress * 100 / item.total);
      this.currentValue = `${percent}%`;
    } else {
      this.currentValue = `${item.progress}/${item.total}`;
    }
  }
  @Input() set invert(value: boolean) {
    if (value) {
      this.background = '#8acab3';
    }
  }
  @Input() set light(value: boolean) {
    if (value) {
      this.background = '#fff';
    }
  }
  @Input() tooltip: Tooltip;
  @Output() click = new EventEmitter<any>();

  getColor() {
    if (this.progress.error) {
      return this.warningColor;
    } else {
      return this.successColor;
    }
  }

  @Input() set size(value: number) {
    switch (+value) {
      case 2:
        this.radius = 55;
        this.stroke = 10;
        this.sizeName = 'medium';
        break;
      case 3:
        this.radius = 75;
        this.stroke = 10;
        this.sizeName = 'large';
        break;
    }
  }

  onClick($event) {
    $event.stopPropagation();
    this.click.emit($event);
  }

  get hasClick() {
    return this.click.observers.length > 0;
  }
}
