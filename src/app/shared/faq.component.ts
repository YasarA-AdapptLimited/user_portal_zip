import { Component, Input, ViewChild, AfterViewInit, HostBinding, ElementRef } from '@angular/core';
import { FaqService } from './faq.service';
import { FaqDirective } from './faq.directive';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.scss'],
  animations: [
    trigger('openState', [
      state('open', style({
        height: '*'
      })),
      state('closed', style({
        height: '0'
      })),
      transition('open => closed', animate('250ms cubic-bezier(0, 0, 0.2, 1)')),
      transition('closed => open', animate('250ms cubic-bezier(0, 0, 0.2, 1)'))
    ])
  ]
})
export class FaqComponent implements AfterViewInit {

  constructor(private service: FaqService) { }
  @ViewChild('faq') faq: FaqDirective;
  @ViewChild('ref') ref: ElementRef;
  @Input() faqId;

  ngAfterViewInit() {
    if (this.faqId) {
      this.service.add(this.faqId, this.faq, this.ref.nativeElement);
    }
  }

}
