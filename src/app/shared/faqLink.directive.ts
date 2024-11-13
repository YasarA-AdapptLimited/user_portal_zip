import { Directive, HostListener, HostBinding, Input } from '@angular/core';
import { FaqService } from './faq.service';

@Directive({
  selector: '[faqLink]'
})
export class FaqLinkDirective {

  constructor(private service: FaqService) { }

  @Input() faqLink;

  @HostListener('click') onclick() {
    this.service.navigateTo(this.faqLink);
  }

}
