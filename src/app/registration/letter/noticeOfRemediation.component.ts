import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from '../../registration/model/Registrant';
import { AuthService } from '../../core/service/auth.service';
import { AccountService } from '../../account/service/account.service';
import { RegistrationService } from '../../core/service/registration.service';
import { LetterType } from '../model/LetterType';



@Component({
  selector: 'app-remediation-letter',
    moduleId: module.id,
    templateUrl: './noticeOfRemediation.component.html',
    styleUrls: ['letter.scss']
})
export class NoticeOfRemediationComponent implements OnInit {

    registrant: Registrant;
    registrantAddress: any;

    loading = false;
    failed = false;
    submissionDeadline;
    letterDate;
    id: string;


    constructor(
        private router: Router,
        private service: RegistrationService,
        private route: ActivatedRoute,
        private auth: AuthService
    ) { this.id = this.route.snapshot.params['id']; }

    ngOnInit() {
        this.registrant = this.auth.user.registrant;
        this.registrantAddress = this.auth.user.address;
        this.service.getLetters().subscribe(letters => {

            const letter = letters.find(l => l.letterType === LetterType.Remediation);
          this.letterDate = letter.letterDate;
          this.submissionDeadline = letter.data.SubmissionDeadline;

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
