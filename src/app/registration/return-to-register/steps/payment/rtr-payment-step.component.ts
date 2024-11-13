import { Component, forwardRef, ElementRef, ViewChild, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { creditCards, CreditCard } from '../../../../renewal/model/CreditCard';
import { RenewalService } from '../../../../core/service/renewal.service';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';
import { ReturnToRegisterApplication } from '../../model/ReturnToRegister';
import { ReturnToRegisterService } from '../../../../../app/core/service/returnToRegister.service';
import { CollectionMethod } from '../../../../../app/payment/model/CollectionMethod';


@Component({
  selector: 'app-rtr-payment-step',
  templateUrl: './rtr-payment-step.component.html',
  styleUrls: ['./rtr-payment-step.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => RtrPaymentStepComponent)
    }
  ]
}) export class RtrPaymentStepComponent extends FormStepComponent implements OnInit{

  title = 'Payment';
  stepId = ReturnToRegisterStep.Payment;
  fee;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  loading = false;
  initiatePayment: any;
  @Output() savingDetails = new EventEmitter<boolean>();
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  application: ReturnToRegisterApplication;
  outStandingPaymentDetails = [];
  collectionMethod = CollectionMethod;


  constructor(private renewalService: RenewalService,
    stepper: FormStepperService, private rtrService: ReturnToRegisterService) {
    super(stepper);
  }

  ngOnInit() {

   this.fee=this.application.returnToRegisterApplicationFeeAmount;
  }

  load() {
    //this.fee = this.application.pendingFee;
    this.renewalService.getWordpayConfig().subscribe(config => {
      this.worldpayConfig = config;
      this.ready$.next(true);
    });
  }

  validate() {
    const messages = [];
    let isDateValid = true;

    if(!isDateValid) {
      messages.push("The date of removal from the register must be greater than today's date, please select a valid date.");
    }
    const valid = isDateValid;

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  beforeNext() {
    this.loading = true; 
    this.rtrService.saveApplicationPayment().subscribe((result) => {
      this.loading = false;           
      this.initiatePayment = result;
      const worldpayUrl = this.initiatePayment.worldpayUrl;
      window.location.href = worldpayUrl;
    },(error)=>{
      console.log(error.messages)
      this.loading = false;
      this.savingDetails.emit(this.loading);
    });
    return false;
  }

  populateForm() { }

}
