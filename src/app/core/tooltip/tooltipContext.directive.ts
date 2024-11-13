import { Directive, OnInit, OnDestroy, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { TooltipService } from './tooltip.service';
import { TooltipContext } from './TooltipContext';

@Directive({ selector: '[appTooltipContext]' })
export class TooltipContextDirective implements OnInit, OnDestroy {

  @Input() appTooltipContext = '';
  context: TooltipContext;
  private id: number;
  sub1: any;
  sub2: any;

  constructor(private renderer: Renderer2, private tooltipService: TooltipService,
    private element: ElementRef, private service: TooltipService) { }

  ngOnInit() {

    this.context = {
      id: this.appTooltipContext,
      source: this.element,
      tooltips: [],
      active: false
    };
    this.service.addContext(this.context);

    this.sub1 = this.service.activeTipChanged.subscribe((activeTooltip)  => {
      this.service.contexts.forEach(context => {
        context.tooltips.forEach(tooltip => {
          this.renderer.removeClass(tooltip.source.nativeElement, 'foreground');
        });
      });
      if (activeTooltip) {
        this.renderer.addClass(activeTooltip.source.nativeElement, 'foreground');
      }
    });

    this.sub2 = this.service.activeContextChanged.subscribe((activeContext) => {

      if (activeContext && activeContext.id === this.context.id) {
        this.renderer.addClass(this.element.nativeElement, 'tooltips-active');
      } else {
        this.renderer.removeClass(this.element.nativeElement, 'tooltips-active');
      }
    });
  }


  ngOnDestroy(): void {
    this.service.removeContext(this.context);
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
