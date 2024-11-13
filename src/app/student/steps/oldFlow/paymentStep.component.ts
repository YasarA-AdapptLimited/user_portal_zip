import { Component, forwardRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { creditCards, CreditCard } from '../../../renewal/model/CreditCard';
import { RenewalService } from '../../../core/service/renewal.service';
import { PreregApplicationStep } from '../../../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { StudentService } from '../../../core/service/student.service';

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
  stepId = PreregApplicationStep.Payment;
  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  constructor(private renewalService: RenewalService,
    private renderer: Renderer2, stepper: FormStepperService, private studentService: StudentService) {
    super(stepper);
  }
  load() {
    this.fee = this.application.preRegistrationApplicationFee;
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
    this.studentService.saveApplicationPaymentOld().subscribe((result) => {
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
