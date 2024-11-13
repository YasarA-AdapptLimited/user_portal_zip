import { Injectable, EventEmitter } from '@angular/core';
import { Tooltip } from './Tooltip';
import { TooltipContext } from './TooltipContext';
import { LayoutService } from '../service/layout.service';

@Injectable()
export class TooltipService {

  constructor(private layout: LayoutService) {

  }
  public contexts: Array<TooltipContext> = [];
  public activeContext: TooltipContext;
  allVisible = false;
  public activeContextChanged = new EventEmitter<TooltipContext>();
  public activeTipChanged = new EventEmitter<Tooltip>();
  public activeTipIndex = 0;
  active: Array<Tooltip> = [];
  public soloTip: Tooltip;

  public add(tooltip: Tooltip) {
    if (!tooltip.contextId) { return; }
    setTimeout(() => {
      const contexts = this.contexts.filter(c => c.id === tooltip.contextId);
      if (!contexts.length) { return; }
      const context = contexts[0];
      const alreadyAdded = !!context.tooltips.filter(t => t.id === tooltip.id).length;
      if (!alreadyAdded) {
        context.tooltips.push(tooltip);
      }
    });

  }

  public addContext(context: TooltipContext) {
    this.contexts.push(context);
  }

  public removeContext(context: TooltipContext) {
    const idx = this.contexts.indexOf(context);
    if (this.activeContext && context.id === this.activeContext.id) {
      this.activeContext = undefined;
    }
    this.contexts.splice(idx, 1);
  }



  public remove(tooltip: Tooltip) {
    if (!tooltip.contextId) { return; }
    const contextFilter = this.contexts.filter(c => c.id === tooltip.contextId);
    if (contextFilter.length > 0) {
      const context = contextFilter[0];
      const idx = context.tooltips.indexOf(tooltip);
      context.tooltips.splice(idx, 1);
    }

  }

  public close() {
    this.setActiveContext(undefined);
    this.soloTip = undefined;
    setTimeout(() => {
      this.setActiveContext(undefined);
      this.soloTip = undefined;
    }, 350);
  }

  public setActiveContext(contextId: string) {
    this.soloTip = undefined;
    if (contextId) {
      const context = this.contexts.filter(c => c.id === contextId)[0];
      this.activeContext = context;
      this.active = this.activeContext.tooltips.sort((a, b) => {
        if (a.order > b.order) { return 1; }
        return -1;
      });
      this.layout.setOverlay(true);
    } else {
      this.activeContext = undefined;
      this.layout.setOverlay(false);
      this.active = [];
    }

    this.activeTipIndex = 0;
    this.activeContextChanged.emit(this.activeContext);
    this.activeTipChanged.emit(this.activeTooltip);
  }

  get activeTooltip() {
    if (!this.activeContext || !this.activeContext.tooltips.length) { return undefined; }
    return this.activeContext.tooltips[this.activeTipIndex];
  }

  showTooltip(tooltip: Tooltip) {
    this.soloTip = tooltip;
  }
  hideTooltip(tooltip: Tooltip) {
    if (this.soloTip === tooltip) {
      this.soloTip = undefined;
    }
  }

  public nextTip() {
    if (this.activeTipIndex < this.activeContext.tooltips.length - 1) {
      this.activeTipIndex++;
    } else {
      this.setActiveContext(undefined);
      this.activeTipIndex = 0;
    }
    this.activeTipChanged.emit(this.activeTooltip);
  }

  public prevTip() {
    if (this.activeTipIndex > 0) {
      this.activeTipIndex--;
    } else {
      this.activeTipIndex = this.activeContext.tooltips.length - 1;
    }
    this.activeTipChanged.emit(this.activeTooltip);
  }


  public toggleActiveContext(contextId: string) {
    if (this.activeContext && this.activeContext.id === contextId) {
      this.setActiveContext(undefined);
    } else {
      this.setActiveContext(contextId);
    }
  }

}
