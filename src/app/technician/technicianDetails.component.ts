import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { TechnicianService } from '../core/service/technician.service';
import { User } from '../account/model/User';
import { Applicant } from '../account/model/Applicant';

@Component({
  moduleId: module.id,
  templateUrl: './technicianDetails.component.html'
})
export class TechnicianDetailsComponent implements OnInit  {

  technicianApplicant: Applicant;
  user: User;
  loading;

  constructor(private auth: AuthService, private service: TechnicianService) {
  }

  ngOnInit() {
    this.loading = true;
    this.service.getApplication(this.auth.user.registrationStatus).subscribe(application => {
      this.technicianApplicant = application.trainee;
      this.loading = false;
    });
    this.user = this.auth.user;
  }
}
