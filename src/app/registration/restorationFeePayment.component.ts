import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { RenewalService } from '../core/service/renewal.service';
import { ReturnToRegisterService } from '../core/service/returnToRegister.service';
import { CreditCard, creditCards } from '../renewal/model/CreditCard';
import { Router } from '@angular/router';
import { ApplicationStatus } from '../prereg/model/ApplicationStatus';

@Component({
    templateUrl: './restorationFeePayment.component.html',
    styleUrls: ['./restorationFeePayment.scss']
})
export class RestorationFeePaymentComponent implements OnInit {
    loading = false;
    fee;
    worldpayConfig;
    messages = [];
    serverErrors = [];
    cartId;
    creditCards = creditCards;
    title;
    isApplicationPendingProcessing;
    initiatePayment: any;
    @Output() savingDetails = new EventEmitter<boolean>();
    @ViewChild('worldpayForm') worldpayForm: ElementRef;

    constructor(private service: ReturnToRegisterService,  private auth: AuthService,
        private renewalService: RenewalService, private _router: Router) {}

    ngOnInit() {
        this.title = this.payRestorationFee ? 'Restoration fee' :  'Restoration and renewal fee';        

        this.loading = true;
         this.service.getApplication(this.auth.user.registrationStatus).subscribe(application => {  
          this.isApplicationPendingProcessing = application.form?.formStatus === ApplicationStatus.ApprovedPendingRestorationFee;
          if(!this.isApplicationPendingProcessing) {
            this.navigateToHome();
            this.loading = false;
            this.renewalService.applicationStatus$.next(application.form?.formStatus);
          } else {
            this.fee = application?.restorationToRegisterFeeAmount;
            this.renewalService.getWordpayConfig().subscribe(config => {
              this.worldpayConfig = config;
              this.loading = false;
            }); 
          }     
         });
    }

    navigateToHome() {
      setTimeout(()=> this._router.navigate([`/home`]), 10000);
    }

    get payRestorationFee() : boolean {
        return true;   
    }
    
    get payRestorationAndRenewalFee() : boolean {      
      return false;
    }

    next() {

        this.loading = true;
        this.savingDetails.emit(this.loading);

        this.messages = [];
        this.serverErrors = [];
    
        this.service.saveRestorationPayment().subscribe((result) => {
          this.loading = false;           
          this.initiatePayment = result;
          const worldpayUrl = this.initiatePayment.worldpayUrl;
          window.location.href = worldpayUrl;
        }, error => {
          this.loading = false;
          this.savingDetails.emit(this.loading);
          this.serverErrors = error.validationErrors;
        });
    
      }
}