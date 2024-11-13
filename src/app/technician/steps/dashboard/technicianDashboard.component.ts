import { Component, OnInit, ErrorHandler } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { User } from '../../../account/model/User';
import { TechnicianService } from '../../../core/service/technician.service';
import { TechnicianApplication } from '../../model/TechnicianApplication';
import { ApplicationStatus } from '../../../prereg/model/ApplicationStatus';

@Component({
  selector: 'app-technician-dashboard',
  moduleId: module.id,
  templateUrl: './technicianDashboard.component.html',
  styleUrls: ['../../../style/dashboard.scss']
})
export class TechnicianDashboardComponent implements OnInit {

  user: User;
  loadingApplication = false;
  application: TechnicianApplication;
  ApplicationStatus = ApplicationStatus;
  isApplicationOpen;
  applicationClosedMessage;
  showNoticeOfEntry = false;
  error = false;
  preEntryNumber : string;
  constructor(private auth: AuthService,
   private service: TechnicianService
  ) {}

  ngOnInit() {
    this.user = this.auth.user;
    this.loadApplication();
  }

  get threeColumns() {
    return this.showFirstYearPayment || this.showNoticeOfEntry;
  }

  get twoColumns() {
    return !this.threeColumns;
  }

  get showFirstYearPayment() {
    return this.application && this.application.isFirstYearPaymentAvailable;
  }

  loadApplication() {
    this.loadingApplication = true;
    this.service.getApplication(this.auth.user.registrationStatus)
    .subscribe(application => {
      this.application = application;
      this.showNoticeOfEntry = this.auth.user.showNoticeOfEntry;
      this.isApplicationOpen =  true;
      this.loadingApplication = false;
      this.preEntryNumber = this.application.trainee.preEntryNumber;
    }, error => {
      this.error = error;
      this.loadingApplication = false;
    });
  }

}
