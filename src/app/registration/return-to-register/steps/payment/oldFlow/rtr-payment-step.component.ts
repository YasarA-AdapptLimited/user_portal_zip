import { Component, forwardRef, ElementRef, ViewChild, Renderer2, OnInit, Input } from '@angular/core';
import { FormStepComponent } from '../../../../../shared/formStepper/formStep.component';
import { creditCards, CreditCard } from '../../../../../renewal/model/CreditCard';
import { RenewalService } from '../../../../../core/service/renewal.service';
import { FormStepperService } from '../../../../../shared/formStepper/formStepper.service';
import { ReturnToRegisterStep } from '../../../model/ReturnToRegisterStep';
import { ReturnToRegisterApplication } from '../../../model/ReturnToRegister';
import { ReturnToRegisterService } from '../../../../../../app/core/service/returnToRegister.service';
import { CollectionMethod } from '../../../../../../app/payment/model/CollectionMethod';


@Component({
  selector: 'app-rtr-payment-step-old',
  templateUrl: './rtr-payment-step.component.html',
  styleUrls: ['./rtr-payment-step.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => RtrPaymentStepOldComponent)
    }
  ]
}) export class RtrPaymentStepOldComponent extends FormStepComponent implements OnInit{

  title = 'Payment';
  stepId = ReturnToRegisterStep.Payment;
  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
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
    const valid = !!this.selectedCard && isDateValid;
    if (!valid) {
      messages.push('You must select a card type to proceed to payment');
    }

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  beforeNext() {
    this.rtrService.saveApplicationPaymentOld().subscribe((result) => {
      this.cartId = JSON.stringify(result.paymentIdentifier);
      setTimeout(() => {
        this.worldpayForm.nativeElement.submit();
      }, 100);
    },(error)=>{
      console.log(error.messages)
    });
    return false;
  }

  populateForm() { }

}
