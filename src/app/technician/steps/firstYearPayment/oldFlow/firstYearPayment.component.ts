import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { creditCards, CreditCard } from '../../../../renewal/model/CreditCard';
import { RenewalService } from '../../../../core/service/renewal.service';
import { PreregService } from '../../../../core/service/prereg.service';
import { AuthService } from '../../../../core/service/auth.service';
import { TechnicianService } from '../../../../core/service/technician.service';

@Component({
  templateUrl: './firstYearPayment.component.html',
  styleUrls: ['./firstYearPayment.scss']
})
export class FirstYearPaymentOldComponent implements OnInit {

  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  loading = false;
  messages = [];
  serverErrors = [];

  @ViewChild('worldpayForm') worldpayForm: ElementRef;

  constructor(private renderer: Renderer2,
    private service: TechnicianService,
    private renewalService: RenewalService,
    private auth: AuthService

  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.service.getApplication(this.auth.user.registrationStatus).subscribe(application => {
      this.fee = application.registrationFees.registrationFee;

      this.renewalService.getWordpayConfig().subscribe(config => {
        this.worldpayConfig = config;
        this.loading = false;
      });

    });

  }

  next() {

    this.messages = [];
    this.serverErrors = [];
    const valid = !!this.selectedCard;
    if (!valid) {
      this.messages.push('You must select a card type to proceed to payment');
      return;
    }
    this.service.saveFirstYearPaymentOld().subscribe((result) => {
      this.cartId = JSON.stringify(result.paymentIdentifier);
      setTimeout(() => {
        //this.renderer.setProperty(this.worldpayForm.nativeElement, 'value', 'submit');
        this.worldpayForm.nativeElement.submit();
      }, 100);
    }, error => {
      this.serverErrors = error.validationErrors;
    });

  }


}
