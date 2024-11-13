import { Component, OnInit, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';
import { User } from '../account/model/User';
import { StudentService } from '../core/service/student.service';
import { PreregApplication } from '../shared/model/student/PreregApplication';
import { ApplicationStatus } from '../prereg/model/ApplicationStatus';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  moduleId: module.id,
  templateUrl: './studentDashboard.component.html',
  styleUrls: ['../style/dashboard.scss']
})
export class StudentDashboardComponent implements OnInit {

  user: User;
  loadingApplication = false;
  application: PreregApplication;
  ApplicationStatus = ApplicationStatus;
  isApplicationOpen;
  applicationClosedMessage;
  error = false;
  constructor(private _router: Router, private auth: AuthService,
    private log: LogService, private service: StudentService, private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.user = this.auth.user;
    this.loadApplication();
  }

  loadApplication() {

    this.loadingApplication = true;
    this.service.getApplication(this.auth.user.registrationStatus)
    .subscribe(application => {
      this.application = application;
      this.isApplicationOpen = this.application.preRegistrationApplicationScheme.isOpened;
      const from = this.datePipe.transform(this.application.preRegistrationApplicationScheme.startDateForCurrentYear, 'd MMMM yyyy');
      const to = this.datePipe.transform(this.application.preRegistrationApplicationScheme.endDateForCurrentYear, 'd MMMM yyyy');
      this.applicationClosedMessage = `Applications open between ${from} and ${to}.`;
      this.loadingApplication = false;

    }, error => {
      this.error = error;
      this.loadingApplication = false;
    });
  }

}
