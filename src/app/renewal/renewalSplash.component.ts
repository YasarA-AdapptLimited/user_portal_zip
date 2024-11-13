import { Component, EventEmitter, Input, Output } from '@angular/core';
import { creditCards, CreditCard } from './model/CreditCard';
import { Renewal } from './model/Renewal';
import { RenewalPaymentMethod } from './model/RenewalPaymentMethod';

@Component({
  selector: 'app-renewal-splash',
  moduleId: module.id,
  templateUrl: './renewalSplash.component.html',
  styleUrls: ['renewalSplash.scss']
})
export class RenewalSplashComponent {
  creditCards: Array<CreditCard> = creditCards;
  @Input() renewal: Renewal;
  @Output() onStart = new EventEmitter();

  RenewalPaymentMethod = RenewalPaymentMethod;

  start() {
    this.onStart.emit();
  }
}

