import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { RenewalService } from '../../core/service/renewal.service';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { StudentService } from '../../core/service/student.service';
import { Router } from '@angular/router';
import { CreditCard , creditCards} from '../../renewal/model/CreditCard';
import { LayoutService } from '../../core/service/layout.service';

@Component({
  selector: 'app-payment-step',
  templateUrl: './paymentStep.component.html',
  styleUrls: ['./paymentStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PaymentStepComponent)
    }
  ]
}) export class PaymentStepComponent extends FormStepComponent {

  title = 'Payment';
  stepId = PreregApplicationStep.Payment;
  fee;
  initiatePayment;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  loading = false;
  @Output() savingDetails = new EventEmitter<boolean>();
  constructor( stepper: FormStepperService, private studentService: StudentService,
    private router: Router, private renewalService: RenewalService,   public layout: LayoutService) {
    super(stepper);
  }
  load() {
    this.loading = false;
    this.fee = this.application.preRegistrationApplicationFee;
    this.renewalService.getWordpayConfig().subscribe(config => {
      this.worldpayConfig = config;
      this.ready$.next(true);
    });
  }

  validate() {
    const messages = [];
    this.validity$.next({ valid: !this.loading, messages, touched: this.touched });
  }

  beforeNext() {
    this.loading = true;
    this.savingDetails.emit(this.loading);
    this.studentService.saveApplicationPayment().subscribe((result) => {
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
