import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { creditCards, CreditCard } from '../../../renewal/model/CreditCard';
import { RenewalService } from '../../../core/service/renewal.service';
import { PreregService } from '../../../core/service/prereg.service';
import { AuthService } from '../../../core/service/auth.service';
import { TechnicianService } from '../../../core/service/technician.service';
import { LayoutService } from '../../../core/service/layout.service';

@Component({
  templateUrl: './firstYearPayment.component.html',
  styleUrls: ['./firstYearPayment.scss']
})
export class FirstYearPaymentComponent implements OnInit {

  fee;
  cartId;
  selectedCard: CreditCard;
  creditCards = creditCards;
  worldpayConfig;
  loading = false;
  messages = [];
  serverErrors = [];
  saving;
  initiatePayment;

  @ViewChild('worldpayForm') worldpayForm: ElementRef;

  constructor(private renderer: Renderer2,
    private service: TechnicianService,
    private renewalService: RenewalService,
    private auth: AuthService,
    private layout: LayoutService
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
    this.loading = true;
    this.serverErrors = [];    
    this.saving = true;
    this.layout.setOverlay(true);
    this.service.saveFirstYearPayment().subscribe((result) => {
      this.saving = false;
      this.loading = false;
      this.initiatePayment = result;      
      const worldpayUrl = this.initiatePayment.worldpayUrl;
      window.location.href = worldpayUrl;
    }, error => {
      this.saving = false;
      this.loading = false;
      this.layout.setOverlay(false);
      this.serverErrors = error.validationErrors;
    });

  }


}
