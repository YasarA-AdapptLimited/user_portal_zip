import { Component, Input } from '@angular/core';
import { creditCards, CreditCard } from '../model/CreditCard';
import { RenewalPaymentMethod } from '../model/RenewalPaymentMethod';

@Component({
  selector: 'app-payment-old',
  moduleId: module.id,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.scss']
})
export class PaymentOldComponent {
  creditCards: Array<CreditCard> = creditCards;
  selectedCard: CreditCard;
  RenewalPaymentMethod = RenewalPaymentMethod;

  @Input() renewal;
  @Input() config;

}
