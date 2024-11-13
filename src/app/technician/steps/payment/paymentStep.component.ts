import { Component, forwardRef, ElementRef, ViewChild, Renderer2, Output, EventEmitter } from "@angular/core";
import { FormStepComponent } from "../../../shared/formStepper/formStep.component";
import { creditCards, CreditCard } from "../../../renewal/model/CreditCard";
import { RenewalService } from "../../../core/service/renewal.service";
import { FormStepperService } from "../../../shared/formStepper/formStepper.service";
import { TechnicianApplicationStep } from "../../model/TechnicianApplicationStep";
import { TechnicianService } from "../../../core/service/technician.service";

@Component({
  selector: "app-payment-step",
  templateUrl: "./paymentStep.component.html",
  styleUrls: ["./paymentStep.scss"],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PaymentStepComponent)
    }
  ]
})
export class PaymentStepComponent extends FormStepComponent {
  title = "Payment";
  stepId = TechnicianApplicationStep.Payment;
  fee;
  creditCards = creditCards;
  worldpayConfig;
  @ViewChild("worldpayForm") worldpayForm: ElementRef;
  initiatePayment: any;
  loading;
  @Output() savingDetails = new EventEmitter<boolean>();
  constructor(
    private renewalService: RenewalService,
    private renderer: Renderer2,
    stepper: FormStepperService,
    private technicianService: TechnicianService
  ) {
    super(stepper);
  }
  load() {
    this.fee = this.application.registrationFees.applicationFee;
    // console.log(this.application);
    this.renewalService.getWordpayConfig().subscribe(config => {
      this.worldpayConfig = config;
      this.ready$.next(true);
    });
  }

  validate() {
    const messages = [];
    const valid = !this.loading;
    this.validity$.next({ valid, messages, touched: this.touched });
  }

  beforeNext() {
    this.loading = true;
    this.savingDetails.emit(this.loading);
    this.technicianService.saveApplicationPayment().subscribe((result) => {
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
