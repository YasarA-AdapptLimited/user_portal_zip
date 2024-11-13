import { Injectable } from '@angular/core';
import { FaqDirective } from './faq.directive';

@Injectable() export class FaqService {

  faqs: {[key: string]: { directive: FaqDirective, element: any } } = {};

  add(id, faq, element) {
    this.faqs[id] = { directive: faq, element };
  }

  navigateTo(faqId) {
    const faq = this.faqs[faqId];
    if (!faq) {
      console.error(`There's no FAQ with an faqId of ${faqId}. Mark the faq you want to link by setting the attribute faqId on it`);
      return;
    }
    faq.directive.isOpen = true;
    setTimeout(() => {
      faq.element.scrollIntoView();
    }, 10);
  }
}
