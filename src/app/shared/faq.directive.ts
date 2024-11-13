import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[faq]',
  exportAs: 'faq'
})
export class FaqDirective {

  public isOpen = false;
  @HostListener('click') onclick() {
    this.isOpen = !this.isOpen;
  }
  public get openState() {
    if (this.isOpen) {
      return 'open';
    } else {
      return 'closed';
    }
  }
}
