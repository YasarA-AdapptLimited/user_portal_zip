import { Component, OnInit, forwardRef, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { CCPSApplicationStep } from '../../model/ccpsApplicationStep';
import { CreditCard, creditCards } from '../../../../../app/renewal/model/CreditCard';
import { CCPSApplication } from '../../model/ccpsApplication';
import { CollectionMethod } from '../../../../../app/payment/model/CollectionMethod';
import { RenewalService } from '../../../../../app/core/service/renewal.service';
import { CCPSService } from '../../../../../app/core/service/ccps.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PaymentComponent)
    }
  ]
})
export class PaymentComponent extends FormStepComponent implements OnInit {

  title = 'Payment';
  stepId = CCPSApplicationStep.Payment;
  fee;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  application: CCPSApplication;
  outStandingPaymentDetails = [];
  collectionMethod = CollectionMethod;
  initiatePayment: any;
  loading;
  @Output() savingDetails = new EventEmitter<boolean>();

  constructor(private renewalService: RenewalService,
    stepper: FormStepperService, private ccpsService: CCPSService) {
    super(stepper);
  }

  ngOnInit() {
    this.fee=this.application.certProfessionalStandingApplicationFee;
  }

  load() {
    this.renewalService.getWordpayConfig().subscribe(config => {
      this.worldpayConfig = config;
      this.ready$.next(true);
    });
  }

  validate() {
    const messages = [];

    const valid = true;

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  beforeNext() {
    this.loading = true;
    this.savingDetails.emit(this.loading);
    this.ccpsService.saveApplicationPayment().subscribe((result) => {
      this.loading = false; 
      this.initiatePayment = result;
      const worldpayUrl = this.initiatePayment.worldpayUrl;
      window.location.href = worldpayUrl;
    }, error=> {
      this.loading = false;
      this.savingDetails.emit(this.loading);
  });
    return false;
  }

  populateForm() { }

}
