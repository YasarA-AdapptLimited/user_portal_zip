import { Component, forwardRef, ElementRef, ViewChild, Renderer2, OnInit, Input } from '@angular/core';
import { FormStepComponent } from '../../../../../shared/formStepper/formStep.component';
import { creditCards, CreditCard } from '../../../../../renewal/model/CreditCard';
import { RenewalService } from '../../../../../core/service/renewal.service';
import { FormStepperService } from '../../../../../shared/formStepper/formStepper.service';
import { VoluntaryRemovalApplicationStep } from '../../../model/VoluntaryRemovalApplicationStep';
import { VoluntaryRemovalService } from '../../../../../core/service/voluntaryRemoval.service';
import { VoluntaryRemovalApplication } from '../../../model/VoluntaryRemovalApplication';
import { CollectionMethod } from '../../../../../payment/model/CollectionMethod';
import { VoluntaryRemovalDetails } from '../../../model/VoluntaryRemovalDetails';

@Component({
  selector: 'app-vr-payment-step-old',
  templateUrl: './vr-payment-step.component.html',
  styleUrls: ['./vr-payment-step.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => VrPaymentStepOldComponent)
    }
  ]
}) export class VrPaymentStepOldComponent extends FormStepComponent implements OnInit{

  title = 'Payment';
  stepId = VoluntaryRemovalApplicationStep.Payment;
  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild('worldpayForm', { static: false }) worldpayForm: ElementRef;
  application: VoluntaryRemovalApplication;
  outStandingPaymentDetails = [];
  collectionMethod = CollectionMethod;
  voluntaryRemovalDetails: VoluntaryRemovalDetails;

  constructor(private renewalService: RenewalService,
    private renderer: Renderer2, stepper: FormStepperService, private vrService: VoluntaryRemovalService) {
    super(stepper);
  }

  ngOnInit() {
    this.outStandingPaymentDetails = this.application.outstandingPayments;
    this.voluntaryRemovalDetails = this.application.activeForm.voluntaryRemovalDetails;
  }

  load() {
    this.fee = this.application.pendingFee;
    this.renewalService.getWordpayConfig().subscribe(config => {
      this.worldpayConfig = config;
      this.ready$.next(true);
    });
  }

  validate() {
    const messages = [];
    let isDateValid = true;

    if(this.voluntaryRemovalDetails && this.voluntaryRemovalDetails.dateOfRegistryRemoval) {
      if(new Date(this.voluntaryRemovalDetails.dateOfRegistryRemoval).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)) {
        isDateValid = false;
      }
    }

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
    this.vrService.saveApplicationPaymentOld().subscribe((result) => {
      this.cartId = JSON.stringify(result.paymentIdentifier);
      setTimeout(() => {
        this.worldpayForm.nativeElement.submit();
      }, 100);
    });
    return false;
  }

  populateForm() { }

}
