import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { RenewalService } from '../../core/service/renewal.service';
import { ReturnToRegisterService } from '../../core/service/returnToRegister.service';
import { CreditCard, creditCards } from '../../renewal/model/CreditCard';

@Component({
    templateUrl: './restorationFeePayment.component.html',
    styleUrls: ['./restorationFeePayment.scss']
})
export class RestorationFeePaymentOldComponent implements OnInit {
    loading = false;
    fee;
    worldpayConfig;
    messages = [];
    serverErrors = [];
    cartId;
    selectedCard: CreditCard;
    creditCards = creditCards;
    title;

    @ViewChild('worldpayForm') worldpayForm: ElementRef;

    constructor(private service: ReturnToRegisterService,  private auth: AuthService,
        private renewalService: RenewalService) {}

    ngOnInit() {
        this.title = this.payRestorationFee ? 'Restoration fee' :  'Restoration and renewal fee';        

        this.loading = true;
         this.service.getApplication(this.auth.user.registrationStatus).subscribe(application => {  
            this.fee = application?.restorationToRegisterFeeAmount
            this.renewalService.getWordpayConfig().subscribe(config => {
              this.worldpayConfig = config;
              this.loading = false;
            });      
         });
    }

    get payRestorationFee() : boolean {
        return true;   
    }
    
    get payRestorationAndRenewalFee() : boolean {      
      return false;
    }

    next() {

        this.messages = [];
        this.serverErrors = [];
        const valid = !!this.selectedCard;
        if (!valid) {
          this.messages.push('You must select a card type to proceed to payment');
          return;
        }
    
        this.service.saveRestorationPaymentOld().subscribe((result) => {
          this.cartId = JSON.stringify(result.paymentIdentifier);
          setTimeout(() => {            
            this.worldpayForm.nativeElement.submit();
          }, 100);
        }, error => {
          this.serverErrors = error.validationErrors;
        });
    
      }
}