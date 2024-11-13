import { Component, forwardRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { creditCards, CreditCard } from '../../../renewal/model/CreditCard';
import { RenewalService } from '../../../core/service/renewal.service';
import { RegApplicationStep } from '../../model/RegApplicationStep';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { PreregService } from '../../../core/service/prereg.service';

@Component({
  selector: 'app-payment-step-old',
  templateUrl: './paymentStep.component.html',
  styleUrls: ['./paymentStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PaymentStepOldComponent)
    }
  ]
}) export class PaymentStepOldComponent extends FormStepComponent {

  title = 'Payment';
  stepId = RegApplicationStep.Payment;
  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  constructor(private renewalService: RenewalService,
    private renderer: Renderer2, stepper: FormStepperService, private preg: PreregService) {
    super(stepper);
  }
  load() {
    this.fee = this.application.registrationFees.applicationFee;
    this.renewalService.getWordpayConfig().subscribe(config => {
      this.worldpayConfig = config;
      this.ready$.next(true);
    });
  }

  validate() {
    const messages = [];
    const valid = !!this.selectedCard;
    if (!valid) {
      messages.push('You must select a card type to proceed to payment');
    }

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  beforeNext() {
    this.preg.saveApplicationPaymentOld().subscribe((result) => {
      this.cartId = JSON.stringify(result.paymentIdentifier);
      setTimeout(() => {
        //this.renderer.setProperty(this.worldpayForm.nativeElement, 'value', 'submit');
        this.worldpayForm.nativeElement.submit();
      }, 100);
    });
    return false;
  }

  populateForm() { }

}
