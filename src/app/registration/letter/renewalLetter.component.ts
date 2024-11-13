import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from '../model/Registrant';
import { AuthService } from '../../core/service/auth.service';
import {  RegistrationService } from '../../core/service/registration.service';
import { PaymentMethod } from '../../payment/model/PaymentMethod';

@Component({
    selector: 'app-renewal-letter',
    moduleId: module.id,
    templateUrl: './renewalLetter.component.html',
    styleUrls: ['letter.scss']
})
export class RenewalLetterComponent implements OnInit {
    registrantStartDate: any;
    registrant: Registrant;
    registrantAddress: any;
    registrantType;

    loading = false;
    failed = false;
    letter;
    isRegistrant;
    PaymentMethod = PaymentMethod;
    paymentMethod: PaymentMethod;

    id;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private service: RegistrationService
    ) {
      this.id = route.snapshot.params['id'];
    }

    ngOnInit() {
      this.loading = true;
        this.registrant = this.auth.user.registrant;
        this.registrantType = this.registrant.type === 1 ? 'pharmacist' : 'pharmacy technician';
        // this.registrantType = 'pharmacist';
        this.isRegistrant = this.auth.user.isRegistrant;
        this.registrantAddress = this.auth.user.address;
        this.service.getLetters().subscribe(
            letters => {
                this.letter = letters.find(l => l.id === this.id);

                this.paymentMethod = this.letter.data.PaymentMethod;

                this.loading = false;
  
            }
        );
    }


    print() {
        (<any>window).print();
    }

    exit() {
        if (this.auth.user.isRegistrant) {
            this.router.navigate(['/registration']);
        } else {
            this.router.navigate(['/home']);
        }

    }

}

