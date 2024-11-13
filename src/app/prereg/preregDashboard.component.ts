import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { ApplicationStatus } from './model/ApplicationStatus';
import { User } from '../account/model/User';
import { PreregService } from '../core/service/prereg.service';
import { RegApplication } from './model/RegApplication';
import { Registrant } from '../registration/model/Registrant';
import { RegistrantStatus } from '../registration/model/RegistrantStatus';
import { Address } from '../account/model/Address';
import { DatePipe } from '@angular/common';
import { AssessmentReport } from './assessment-report/models/AssessmentReport';
import { AssessmentReportService } from '../core/service/assessmentReport.service';
import { FormScope } from '../registration/model/FormScope';
import { AssessmentRegistrationService } from '../core/service/assessmentRegistration.service';

import { CurrentApplicationService } from '../core/service/prereg/currentApplication.service';
import { AssessmentRegistration } from './assessment-registration/model/AssessmentRegistration';
import { AssessmentApplicationStatus } from './assessment-report/models/AssessmentApplicationStatus';

import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CountersignatureOutcome } from './model/CountersignatureOutcome';
import { FinalDeclarationService } from '../core/service/finalDeclaration.service';
import { FinalDeclaration } from './final-declaration/model/FinalDeclaration';


@Component({
  selector: 'app-prereg-dashboard',
  moduleId: module.id,
  templateUrl: './preregDashboard.component.html',
  styleUrls: ['../style/dashboard.scss']
})
export class PreregDashboardComponent implements OnInit {
  user: User;
  loadingApplication = false;
  error = false;
  regApplication: RegApplication;
  assessmentReport: AssessmentReport;
  assessmentRegistration: AssessmentRegistration;
  ApplicationStatus = ApplicationStatus;
  AssessmentApplicationStatus = AssessmentApplicationStatus;
  emptyData = true;
  noTile;
  applicationClosedMessage;
  showNoticeOfEntry = false;
  isApplicationOpen;
  isAssessmentRegistrationOpen = true;
  isCurrentApplicationRecieved = false;

  countersignerOutcome = CountersignatureOutcome;
  response;


  isFinalDeclarationOpen;
  registrantStatus: RegistrantStatus;
  finalDeclaration: FinalDeclaration;

  constructor(
    private auth: AuthService,
    private service: PreregService,
    private assessmentReportService: AssessmentReportService,
    private assessmentRegistrationService: AssessmentRegistrationService,
    private finalDeclarationService: FinalDeclarationService,
    private datePipe: DatePipe,
    private currentApplicationService: CurrentApplicationService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.auth.user;
    if (this.isInEligibleToRegister) {
      return;
    } else {
      this.getAvailableForm();
    }
  }

  get threeColumns(): boolean {
    return this.showFirstYearPayment || this.showNoticeOfEntry;
  }

  get twoColumns(): boolean {
    return !this.threeColumns;
  }

  get showAssessmentReport(): boolean {
    return !!this.assessmentReport;
  }

  get showAssessmentRegistration(): boolean {
    return !!this.assessmentRegistration;
  }

  get showFinalDeclaration(): boolean {
    return !!this.finalDeclaration;
  }

  get showPreregApp(): boolean {
    return !!this.regApplication;
  }

  get showFirstYearPayment(): boolean {
    return this.regApplication && this.regApplication.isFirstYearPaymentAvailable;
  }

  get isAssessmentCountersigned() {
    return this.assessmentReport.activeForm.formStatus === ApplicationStatus.CounterSigned;
  }

  get hasBeenApproved() {
    return this.assessmentReport.activeForm.countersignatures[0].decision === CountersignatureOutcome.Approved;
  }


  get isInEligibleToRegister() {
    return this.user.registrationStatus === RegistrantStatus.IneligibleToRegister;
  }
  get isFinalDeclarationCountersigned() {
    return this.finalDeclaration.activeForm.formStatus === ApplicationStatus.CounterSigned;
  }

  get hasFinalDeclarationApproved() {
    return this.finalDeclaration.activeForm.countersignatures[0].decision === CountersignatureOutcome.Approved;
  }

  getAvailableForm(): void {
    this.service.getAvailableForm().subscribe((availableForm: number) => {

      switch (availableForm) {
        case FormScope.ProgressReport:
          this.getAssessmentReport();
          break;
        case FormScope.Trainee:
          this.getRegApplication();
          break;
        case FormScope.AssessmentRegistration:
          this.getAssessmentRegistrationApplication();
          break;
        case FormScope.FinalDeclaration:
          this.getFinalDeclarationApplication();
          break;
        default:
          break;
      }

    });


  }

  getAssessmentRegistrationApplication() {
    this.assessmentRegistrationService
      .getAssessmentRegistrationApplication(this.auth.user.registrationStatus)
      .subscribe(assessmentRegistrationApplication => {
        this.assessmentRegistration = assessmentRegistrationApplication;
        this.currentApplicationService.setTrainee(assessmentRegistrationApplication);
        this.loadingApplication = false;
      });
  }

  getFinalDeclarationApplication() {
    this.finalDeclarationService
      .getFinalDeclarationApplication(this.auth.user.registrationStatus).subscribe(finalDeclarationApplication => {
        this.finalDeclaration = finalDeclarationApplication;
        this.currentApplicationService.setTrainee(finalDeclarationApplication);
        this.isFinalDeclarationOpen = this.finalDeclaration.isOpen;
        if (this.isFinalDeclarationCountersigned && this.hasFinalDeclarationApproved) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            data: {
              allowCancel: false,
              allowNext: false,
              title: `Hello ${this.user.toString()}`,
              message: `<p>
              You can now see your satisfactory final declaration and the comments made by your supervisor. You have the opportunity to add any comments you might have.
              </p>
              `,
              confirmFinalDeclaration: true
            }
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/account/notifications']);
          });

        }
        this.loadingApplication = false;
      });
  }

  getRegApplication() {
    this.loadingApplication = true;
    this.service.getRegApplication(this.auth.user.registrationStatus).subscribe(
      application => {
        this.regApplication = application;
        this.currentApplicationService.setTrainee(application);
        this.isApplicationOpen = this.regApplication.registrationApplicationScheme.isOpened;
        this.showNoticeOfEntry = this.auth.user.showNoticeOfEntry;
        const startDate = this.datePipe.transform(
          this.regApplication.registrationApplicationScheme.openingDate,
          'd MMMM yyyy'
        );
        this.applicationClosedMessage = `Your application for registration will be available
       towards the end of your pre-registration year on ${startDate}`;
        if (this.showNoticeOfEntry) {
          const registrant = new Registrant(this.regApplication.registrant);
          registrant.title = this.auth.user.title;
          registrant.forenames = this.auth.user.forenames;
          registrant.surname = this.auth.user.surname;
          registrant.status = RegistrantStatus.ReadyForRegistration;
          registrant.postalTown = this.regApplication.trainee.address.town;
          this.auth.user.address = new Address(
            this.regApplication.trainee.address
          );
          this.auth.user.registrant = registrant;
        }
        this.loadingApplication = false;
      },
      error => {
        this.error = error;
        this.loadingApplication = false;
      }
    );
  }

  getAssessmentReport() {
    this.loadingApplication = true;
    this.assessmentReportService
      .getAssessmentReportApplication(this.auth.user.registrationStatus)
      .subscribe(report => {
        this.assessmentReport = report;
        this.currentApplicationService.setTrainee(report);
        this.isApplicationOpen = this.assessmentReport.isOpen;

        if (this.assessmentReport.thirtyNineWeekReportResult === null) {
          console.log(this.assessmentReport.thirtyNineWeekReportResult)
          this.applicationClosedMessage = `Your 39 week progress report will soon be available here for sign-off. Please come back once you have completed the 36th week of your training.`;
        } else {
          this.applicationClosedMessage = `Not Applicable`;
        }
        if (this.isAssessmentCountersigned && this.hasBeenApproved) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            data: {
              allowCancel: false,
              allowNext: false,
              title: `Hello ${this.user.toString()}`,
              message: `<p>
              You can now review your satisfactory 39 week progress report and the comments made by your designated supervisor.
               You have the opportunity to add any comments you may have.
              </p>
              `,
              confirmProgressReport: true
            }
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/account/notifications']);
          });

        }
        this.loadingApplication = false;
      });
  }

  get applicationLink() {
    if (
      this.regApplication &&
      this.regApplication.isFirstYearPaymentAvailable
    ) {
      return '/prereg/application/first-year-payment';
    }
    return '/prereg/application';
  }
}
