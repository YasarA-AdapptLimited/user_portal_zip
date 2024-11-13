import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from '../model/Registrant';
import { AuthService } from '../../core/service/auth.service';
import {  RegistrationService } from '../../core/service/registration.service';
import { LetterType } from '../model/LetterType';

@Component({
    selector: 'app-renewal-dd-letter',
    moduleId: module.id,
    templateUrl: './renewalDDLetter.component.html',
    styleUrls: ['letter.scss']
})
export class RenewalDDLetterComponent implements OnInit {
    registrantStartDate: any;
    registrant: Registrant;
    registrantAddress: any;
    registrantType;

    loading = false;
    failed = false;
    isRegistrant;

    @Input() letter;

    appealDate;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public auth: AuthService,
        private service: RegistrationService
    ) { }

    ngOnInit() {
        this.registrant = this.auth.user.registrant;
        this.registrantType = this.registrant.type === 1 ? 'pharmacist' : 'pharmacy technician';
        this.isRegistrant = this.auth.user.isRegistrant;
        this.registrantAddress = this.auth.user.address;
     
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

