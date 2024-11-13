import { Component, forwardRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormStepComponent } from '../../../../../shared/formStepper/formStep.component';
import { creditCards, CreditCard } from '../../../../../renewal/model/CreditCard';
import { RenewalService } from '../../../../../core/service/renewal.service';
import { FormStepperService } from '../../../../../shared/formStepper/formStepper.service';
import { AssessmentRegistrationStep } from '../../../model/AssessmentRegistrationStep';
import { AssessmentRegistrationService } from '../../../../../core/service/assessmentRegistration.service';

@Component({
  selector: 'app-assessment-payment-step-old',
  templateUrl: './assessmentRegistrationPaymentStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentRegistrationPaymentStepOldComponent)
    }
  ]
})
export class AssessmentRegistrationPaymentStepOldComponent extends FormStepComponent {
  title = 'Payment';
  stepId = AssessmentRegistrationStep.Payment;
  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm') worldpayForm: ElementRef;
  constructor(
    private renewalService: RenewalService,
    private renderer: Renderer2,
    stepper: FormStepperService,
    private assessmentRegistrationService: AssessmentRegistrationService
  ) {
    super(stepper);
  }
  load() {
    this.fee = this.application.assessmentRegistrationFee;
    this.renewalService.getWordpayConfig().subscribe(config => {
      this.worldpayConfig = config;
      this.ready$.next(true);
    });
  }

  validate() {
    2
    const messages = [];
    const valid = !!this.selectedCard;
    if (!valid) {
      messages.push('You must select a card type to proceed to payment');
    }
    this.validity$.next({ valid, messages, touched: this.touched });
  }

  beforeNext() {
    this.assessmentRegistrationService
      .saveApplicationPaymentOld()
      .subscribe(result => {
        this.cartId = JSON.stringify(result.paymentIdentifier);
        setTimeout(() => {
         // this.renderer.setProperty(this.worldpayForm.nativeElement, 'value','submit');
            this.worldpayForm.nativeElement.submit();
        }, 100);
      });
    return false;
  }

  populateForm() { }
}
