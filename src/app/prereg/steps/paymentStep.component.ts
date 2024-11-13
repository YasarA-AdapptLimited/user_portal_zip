import { Component, forwardRef, ElementRef, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { creditCards, CreditCard } from '../../renewal/model/CreditCard';
import { RenewalService } from '../../core/service/renewal.service';
import { RegApplicationStep } from '../model/RegApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { PreregService } from '../../core/service/prereg.service';

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
  stepId = RegApplicationStep.Payment;
  fee;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  initiatePayment: any;
  loading = false;
  @Output() savingDetails = new EventEmitter<boolean>();
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
    this.validity$.next({ valid: !this.loading, messages, touched: this.touched });
  }

  beforeNext() {
    this.loading = true;
    this.savingDetails.emit(this.loading);
    this.preg.saveApplicationPayment().subscribe((result) => {
      this.loading = false;           
      this.initiatePayment = result;
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
