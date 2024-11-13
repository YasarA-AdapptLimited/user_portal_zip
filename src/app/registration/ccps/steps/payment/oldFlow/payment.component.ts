import { Component, OnInit, forwardRef, Input, ViewChild, ElementRef } from '@angular/core';
import { FormStepperService } from '../../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../../shared/formStepper/formStep.component';
import { CCPSApplicationStep } from '../../../model/ccpsApplicationStep';
import { CreditCard, creditCards } from '../../../../../../app/renewal/model/CreditCard';
import { CCPSApplication } from '../../../model/ccpsApplication';
import { CollectionMethod } from '../../../../../../app/payment/model/CollectionMethod';
import { RenewalService } from '../../../../../../app/core/service/renewal.service';
import { CCPSService } from '../../../../../../app/core/service/ccps.service';

@Component({
  selector: 'app-payment-old',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PaymentOldComponent)
    }
  ]
})
export class PaymentOldComponent extends FormStepComponent implements OnInit {

  title = 'Payment';
  stepId = CCPSApplicationStep.Payment;
  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  application: CCPSApplication;
  outStandingPaymentDetails = [];
  collectionMethod = CollectionMethod;


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
    let isDateValid = true;

    if(!isDateValid) {
      messages.push("The date of removal from the register must be greater than today's date, please select a valid date.");
    }
    const valid = !!this.selectedCard && isDateValid;
    if (!valid) {
      messages.push('You must select a card type to proceed to payment');
    }

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  beforeNext() {
    this.ccpsService.saveApplicationPaymentOld().subscribe((result) => {
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
