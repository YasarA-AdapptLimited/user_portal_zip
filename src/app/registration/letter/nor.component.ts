import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from '../../registration/model/Registrant';
import { AuthService } from '../../core/service/auth.service';
import {  RegistrationService } from '../../core/service/registration.service';
import { LetterType } from '../model/LetterType';

@Component({
    selector: 'app-nor-letter',
    moduleId: module.id,
    templateUrl: './nor.component.html',
    styleUrls: ['letter.scss']
})
export class NorComponent implements OnInit {
    registrantStartDate: any;
    registrant: Registrant;
    registrantAddress: any;
    registrantType;

    loading = false;
    failed = false;
    letter;
    isRegistrant;
    letterDate;

    appealDate;
    id: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private service: RegistrationService
    ) { this.id = this.route.snapshot.params['id']; }

    ngOnInit() {
        this.registrant = this.auth.user.registrant;
        this.registrantType = this.registrant.type === 1 ? 'pharmacist' : 'pharmacy technician';
        this.isRegistrant = this.auth.user.isRegistrant;
        this.registrantAddress = this.auth.user.address;
        this.service.getLetters().subscribe(
            letters => {
                this.letter = letters.find(l => l.letterType === LetterType.NoticeOfRemoval);
                this.letterDate = this.letter.letterDate;
                const removalTicks = new Date(this.letter.data.RemovalDate).getTime() - (24 * 60 * 60 * 1000);
                this.appealDate = new Date(removalTicks);
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

