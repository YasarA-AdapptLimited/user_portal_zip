import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from '../../registration/model/Registrant';
import { AuthService } from '../../core/service/auth.service';
import { RegistrationService } from '../../core/service/registration.service';
import { LetterType } from '../model/LetterType';



@Component({
    selector: 'app-noir-letter',
    moduleId: module.id,
    templateUrl: './noticeOfIntendedRemoval.component.html',
    styleUrls: ['letter.scss']
})
export class NoticeOfIntendedRemovalComponent implements OnInit {
    registrantStartDate: any;
    registrant: Registrant;
    registrantAddress: any;

    loading = false;
    failed = false;

    initialCallDate;
    firstReminderEmail;
    finalReminderEmail;
    letterDate;
    id: string;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private service: RegistrationService
    ) { this.id = this.route.snapshot.params['id']; }

    ngOnInit() {
        this.registrant = this.auth.user.registrant;
        this.registrantAddress = this.auth.user.address;

        this.service.getLetters().subscribe(letters => {
            const letter = letters.find(l => l.letterType === LetterType.NoticeOfIntentToRemove);
            this.letterDate = letter.letterDate;
            this.initialCallDate = letter.data.InitialCallDate;
            this.firstReminderEmail = letter.data.FirstReminderEmail;
            this.finalReminderEmail = letter.data.FinalReminderEmail;

        });
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
