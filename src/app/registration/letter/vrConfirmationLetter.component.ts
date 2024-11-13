import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { RegistrationService } from '../../core/service/registration.service';
import { ApplicationDetails } from '../model/ApplicationDetails';

@Component({
  selector: 'app-vr-confirmation-letter',
  templateUrl: './vrConfirmationLetter.component.html',
  styleUrls: ['letter.scss']
})
export class VrConfirmationLetterComponent implements OnInit {

  loading = false;
  failed = false;
  registrantName: string;
  isVRApplicationAvailable;

  constructor(public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private registrationService: RegistrationService) { }

  ngOnInit(): void {
    this.registrantName = this.auth.user.title + ' ' + this.auth.user.surname;
    this.registrationService.getAvailableForms().subscribe((details : ApplicationDetails) => { 
      this.isVRApplicationAvailable = details.isVRAppAvailable;
    });
  }

  print() {
    (<any>window).print();
  }

  exit() {
    if ( this.isVRApplicationAvailable ) {
      this.router.navigate(['/account/notifications']);
    } else {
      this.router.navigate(['/home']);
    }

  }
}
