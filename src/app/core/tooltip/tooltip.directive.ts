import { Directive, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, HostListener, HostBinding, Renderer2 } from '@angular/core';
import { TooltipService } from './tooltip.service';
import { Tooltip } from './Tooltip';
import { AuthService } from '../service/auth.service';

@Directive({ selector: '[appTooltip]' })
export class TooltipDirective implements OnInit, OnDestroy {

  appTooltip: Tooltip;
  @Input('appTooltip') set setAppTooltip(tooltip: Tooltip) {
    if (!tooltip) { return; }
    if (this.appTooltip) {
      this.destroy();
    }
    this.appTooltip = tooltip;
    this.init();
  }
  hovering = false;
  showDelay = 500;
  @HostBinding('attr.aria-label') ariaLabel;

  constructor(private tooltipService: TooltipService,
    private element: ElementRef, private service: TooltipService,
    private auth: AuthService,
    private renderer: Renderer2) { }

  ngOnInit() {
    if (!this.appTooltip) { return; }
    this.init();
  }

  init() {
    this.appTooltip = Object.assign({}, this.appTooltip,
      {
        source: this.element,
        visible: false,
        width: this.appTooltip.width || 150
      }
    );
    if (!this.appTooltip.used) {
      this.service.add(this.appTooltip);
    }

    this.ariaLabel = this.removeTags(this.appTooltip.content);

  }

  removeTags(content): string {
      let withoutTags = content.replace(/<[^>]*>/g, ' ');
      withoutTags = withoutTags.replace(/\s+/g, ' ');
      return withoutTags.trim();
  }


  @HostListener('mouseenter', ['$event']) onMouseEnter($event) {
    this.show();
  }
  @HostListener('focus', ['$event']) onFocus($event) {
    this.show();
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave($event) {
    this.hide();
  }
  @HostListener('blur', ['$event']) onBlur($event) {
    this.hide();
  }

  show() {
    if (this.auth.user && this.auth.user.preference &&
      this.auth.user.preference.ui && !this.auth.user.preference.ui.showTooltips) { return; }
    if (!this.appTooltip || this.appTooltip.notSolo) { return; }
    if (this.service.soloTip === this.appTooltip) { return; }
    if (this.service.activeContext) { return; }
    this.hovering = true;
    setTimeout(() => {
      if (this.service.activeContext) { return; }
      if (this.hovering && !(this.appTooltip.isHidden && this.appTooltip.isHidden())) {
        this.service.showTooltip(this.appTooltip);
      }
    }, this.showDelay);
  }

  hide() {
    if (!this.appTooltip) { return; }
    this.hovering = false;
    this.service.hideTooltip(this.appTooltip);
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (!this.appTooltip) { return; }
    this.service.remove(this.appTooltip);
    this.hovering = false;
    this.appTooltip = undefined;
    this.service.soloTip = undefined;
  }
}
