import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { RegistrationService } from '../../core/service/registration.service';

@Component({
  selector: 'app-revalidation-partial-submission-letter',
  templateUrl: './revalidationPartialSubmissionLetter.component.html',
  styleUrls: ['letter.scss']
})
export class RevalidationPartialSubmissionLetterComponent implements OnInit {

  loading = false;
  failed = false;
  registrantName: string;
  id: string;
  letter;

  constructor(public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,private registrationService: RegistrationService) { this.id = this.route.snapshot.params['id']; }

  ngOnInit(): void {
    this.registrantName = this.auth.user.title + ' ' + this.auth.user.surname;
    this.registrationService.getLetters().subscribe( letters => {
      this.letter = letters.find(l => l.id === this.id);
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
