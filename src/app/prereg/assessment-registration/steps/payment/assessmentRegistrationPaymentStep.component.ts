import { Component, forwardRef, ElementRef, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { creditCards, CreditCard } from '../../../../renewal/model/CreditCard';
import { RenewalService } from '../../../../core/service/renewal.service';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { AssessmentRegistrationStep } from '../../model/AssessmentRegistrationStep';
import { AssessmentRegistrationService } from '../../../../core/service/assessmentRegistration.service';

@Component({
  selector: 'app-assessment-payment-step',
  templateUrl: './assessmentRegistrationPaymentStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentRegistrationPaymentStepComponent)
    }
  ]
})
export class AssessmentRegistrationPaymentStepComponent extends FormStepComponent {
  title = 'Payment';
  stepId = AssessmentRegistrationStep.Payment;
  fee;
  cartId;  
  creditCards = creditCards;
  worldpayConfig;
  loading;
  initiatePayment;
  @Output() savingDetails = new EventEmitter<boolean>();
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
    const messages = []
    this.validity$.next({ valid:  !this.loading, messages, touched: this.touched });
  }

  beforeNext() {
    this.loading = true;
    this.savingDetails.emit(this.loading);
    this.assessmentRegistrationService
      .saveApplicationPayment()
      .subscribe(result => {
        this.initiatePayment = result;
        this.loading = false;        
        const worldpayUrl = this.initiatePayment.worldpayUrl;
        window.location.href = worldpayUrl;
      }, error => {
        this.loading = false;
        this.savingDetails.emit(this.loading);
      });
    return false;
  }

  populateForm() { }
}
