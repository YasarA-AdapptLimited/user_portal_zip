import { Component, ElementRef, forwardRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormStepperService } from '../../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../../shared/formStepper/formStep.component';
import { IndependentPrescriberApplicationStep } from '../../../model/IndependentPrescriberApplicationStep';
import { CreditCard, creditCards } from '../../../../../renewal/model/CreditCard';
import { RenewalService } from '../../../../../core/service/renewal.service';
import { IndependentPrescriberService } from '../../../../../core/service/independentPrescriber.service';

@Component({
  selector: 'app-payment-step-old',
  templateUrl: './payment-step.component.html',
  styleUrls: ['./payment-step.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PaymentStepOldComponent)
    }
  ]
})
export class PaymentStepOldComponent extends FormStepComponent  {

  title = 'Payment';
  stepId = IndependentPrescriberApplicationStep.Payment;
  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  constructor(private renewalService: RenewalService,
    private renderer: Renderer2, stepper: FormStepperService, private independentPrescriberService: IndependentPrescriberService) {
    super(stepper);
  }
  load() {
    this.fee = this.application.indyPrescriberApplicationFee;
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
    this.independentPrescriberService.saveApplicationPaymentOld().subscribe((result) => {
      this.cartId = JSON.stringify(result.paymentIdentifier);
      setTimeout(() => {
        this.worldpayForm.nativeElement.submit();
      }, 100);
    });
    return false;
  }

  populateForm() { }
}