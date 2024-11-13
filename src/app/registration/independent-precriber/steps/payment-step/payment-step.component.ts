import { Component, ElementRef, forwardRef, OnInit, Renderer2, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { IndependentPrescriberApplicationStep } from '../../model/IndependentPrescriberApplicationStep';
import { CreditCard, creditCards } from '../../../../renewal/model/CreditCard';
import { RenewalService } from '../../../../core/service/renewal.service';
import { IndependentPrescriberService } from '../../../../core/service/independentPrescriber.service';

@Component({
  selector: 'app-payment-step',
  templateUrl: './payment-step.component.html',
  styleUrls: ['./payment-step.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PaymentStepComponent)
    }
  ]
})
export class PaymentStepComponent extends FormStepComponent  {

  title = 'Payment';
  stepId = IndependentPrescriberApplicationStep.Payment;
  fee;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  initiatePayment: any;
  loading;
  @Output() savingDetails = new EventEmitter<boolean>();
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
    this.validity$.next({ valid: !this.loading, messages, touched: this.touched });
  }

  beforeNext() {
    this.loading = true;
    this.savingDetails.emit(this.loading);
    this.independentPrescriberService.saveApplicationPayment().subscribe((result) => {
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