import { Component, ViewChild, Input, HostListener, AfterViewInit, OnDestroy,
  ElementRef, NgZone, Renderer2 } from '@angular/core';
import { Tooltip } from './Tooltip';
import { TooltipService } from './tooltip.service';
import Popper from 'popper.js';

@Component({
  selector: 'app-tooltip',
  moduleId: module.id,
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements AfterViewInit, OnDestroy {

  public tooltip: Tooltip;
  @Input('tooltip') set setTooltip(tooltip) {
    this.tooltip = tooltip;
    if (this.tooltip) {
      this.create();
    }
  }
  @Input() index;
  @ViewChild('tooltipRef', { static: true }) tooltipElement: ElementRef;
  @ViewChild('focus') focusElement: ElementRef;

  private popper: Popper;

  constructor(private zone: NgZone, public service: TooltipService,
    private renderer: Renderer2) {

  }

  ngAfterViewInit() {
    this.create();
  }

  get allowNext() {
    if (!this.service.activeContext) { return false; }
    return this.index < this.service.activeContext.tooltips.length - 1;
  }

  nextTip() {
    this.service.nextTip();
  }

  exit() {
    this.service.close();
  }

  create() {
    if (!this.tooltip || !this.tooltip.source) { return; }
    this.zone.runOutsideAngular(() => {
      this.popper = new Popper(
        this.tooltip.source.nativeElement,
        this.tooltipElement.nativeElement,
        {
          placement: this.tooltip.placement || 'right',
        });
    });
    setTimeout(() => {
      if (!this.service.activeContext) {
        this.tooltip.source.nativeElement.focus();
      } else {
        this.focusElement.nativeElement.focus();
      }
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.popper) {
      this.zone.runOutsideAngular(() => {
        this.popper.destroy();
      });

      this.popper = null;
      this.service.soloTip = undefined;
    }
  }


removeTags(content): string {
    let withoutTags = content.replace(/<[^>]*>/g, ' ');
    withoutTags = withoutTags.replace(/\s+/g, ' ');
    return withoutTags.trim();
}

  getAriaLabel() {
    const label = this.removeTags(this.tooltip.content);

    if (!this.service.activeContext) { return label; }
    if (this.allowNext) {
      return label + ' Hit \'Enter\' to see the next tip, or \'escape\' to exit.';
    } else {
      return label + ' Hit \'Enter\' to finish.';
    }
  }

}
