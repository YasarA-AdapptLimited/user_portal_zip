import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from './model/Registrant';
import { AuthService } from '../core/service/auth.service';
import { DatePipe } from '@angular/common';
import { PreregService } from '../core/service/prereg.service';

import { RegApplication } from '../prereg/model/RegApplication';

import { CountersignatureOutcome } from '../prereg/model/CountersignatureOutcome';
import { FormScope } from './model/FormScope';
import { TechnicianService } from '../core/service/technician.service';
import { ValidationError } from '../core/model/ValidationError';
import { TechnicianApplication } from '../technician/model/TechnicianApplication';
import { AssessmentReportService } from '../core/service/assessmentReport.service';
import { AssessmentReport } from '../prereg/assessment-report/models/AssessmentReport';
import { FinalDeclaration } from '../prereg/final-declaration/model/FinalDeclaration';
import { FinalDeclarationService } from '../core/service/finalDeclaration.service';
import { IndependentPrescriberService } from '../core/service/independentPrescriber.service';
import { IndependentPrescriberApplication } from './independent-precriber/model/IndependentPrescriberApplication';
import { IndependentPrescriberData } from './model/IndependentPrescriberData';

@Component({
  moduleId: module.id,
  templateUrl: './countersign.component.html',
  styleUrls: ['countersign.scss']
})
export class CountersignComponent implements OnInit {

  id: string;
  date: string;
  name: string;
  loading = false;
  application: RegApplication | TechnicianApplication | AssessmentReport | FinalDeclaration |IndependentPrescriberData;
  isTechnician = false;
  submitClicked;
  CountersignatureOutcome = CountersignatureOutcome;
  submitting;
  response;
  responseReason;
  @ViewChild('responseReasonInput') responseReasonInput: ElementRef;
  certified: boolean = false;
  validationErrors: any;
  technicianApplicationValidationFailed: boolean = false;
  role: number;
  isAssessmentReport = false;
  isFinalDeclaration = false;
  FormScope = FormScope;
  technicianAndROSApplicationValidationFailed = false;
  isPrescriber = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private preregService: PreregService,
    private arosService: AssessmentReportService,
    private finalDeclarationService: FinalDeclarationService,
    private independentPrescriberService: IndependentPrescriberService,

    private technicianService: TechnicianService,
    private ref: ChangeDetectorRef
  ) {
    this.id = this.route.snapshot.params['id'];
    this.date = this.route.snapshot.params['date'];
    this.role = +this.route.snapshot.params['role'];
  }

  setFocus(response) {
    if (response === CountersignatureOutcome.Rejected) {
      setTimeout(() => { this.responseReasonInput.nativeElement.focus(); }, 1000);
    }
  }

  ngOnInit() {

    this.loading = true;
    switch (this.role) {
      case FormScope.TechnicianApplicant:
        this.isTechnician = true;
        this.preregService.getTechnicianCountersignerForm(this.id).subscribe((application: TechnicianApplication) => {
          this.application = application;
          this.name = application.trainee.forenames + ' ' + application.trainee.surname;
          this.loading = false;
        })
        break;
      case FormScope.Trainee:
        this.preregService.getCountersignerForm(this.id).subscribe((application: RegApplication) => {
          this.application = application;
          this.name = application.trainee.forenames + ' ' + application.trainee.surname;
          this.loading = false;
        });
        break;
      case FormScope.ProgressReport:
        this.isAssessmentReport = true;
        this.arosService.getCountersignerForm(this.id).subscribe((application: AssessmentReport) => {
          this.application = application;
          this.isAssessmentReport = this.application.isOpen;
          this.name = application.trainee.forenames + ' ' + application.trainee.surname;
          if (!this.isAssessmentReport) {
            this.router.navigate(['/registration']);
            this.loading = false;
          }
          this.loading = false;
        }, error => {
          this.loading = false;
        });
        break;
      case FormScope.FinalDeclaration:
        this.isFinalDeclaration = true;
        this.finalDeclarationService.getCountersignerForm(this.id).subscribe((application: FinalDeclaration) => {
          this.application = application;
          this.isFinalDeclaration = this.application.isOpen;
          this.name = application.trainee.forenames + ' ' + application.trainee.surname;
          if (!this.isFinalDeclaration) {
            this.router.navigate(['/registration']);
            this.loading = false;
          }
          this.loading = false;
        }, error => {
          this.loading = false;
        });
        break;
       /*Independent prescriber */
        case FormScope.IndependentPrescriber:
        this.isPrescriber = true;
        this.independentPrescriberService.getCountersignerForm(this.id).subscribe((application: IndependentPrescriberData) => {
          this.application = application;
         // this.name = application.registrant.forenames + ' ' + application.registrant.surname;
          if (!this.isPrescriber) {
            this.router.navigate(['/registration']);
            this.loading = false;
          }
          this.loading = false;
        }, error => {
          this.loading = false;
        });
        break;

      default:
        break;
    }



  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  print() {
    (<any>window).print();
  }

  exit() {
    this.router.navigate(['/registration']);
  }

  submitOutcome() {
    this.submitClicked = true;
    let payload = null;
    if (!this.response || (this.response === CountersignatureOutcome.Rejected && !this.responseReason)) {
      this.setFocus(this.response);
      return;
    }

    if (this.isTechnician) {
      if (this.certified === false && (this.response === this.CountersignatureOutcome.Approved
        || this.response === this.CountersignatureOutcome.Rejected)) {
        this.validationErrors = new Array<ValidationError>();
        const valError = {
          errors: ["Please open the photo attachment above and if it is true likeness of the applicant confirm this by checking the tick box"],
          property: "Certify Photo"
        };
        this.validationErrors.push(valError);
        this.technicianAndROSApplicationValidationFailed = true;
        return false;
      }

      const outcome = {
        id: this.id,
        decision: this.response,
        isCertifiedPhoto: this.certified,
        feedback: this.responseReason
      };
      this.submitting = true;
      this.technicianService.submitCountersignatureOutcome(outcome)
        .subscribe(() => {
          this.submitting = false;
          this.exit();
        }, error => {
          this.submitting = false;
        });
    } else {

      if (this.certified === false && this.response === this.CountersignatureOutcome.Approved) {
        this.validationErrors = new Array<ValidationError>();
        const valError = {
          errors: ["Please open the photo attachment above and if it is true likeness of the applicant confirm this by checking the tick box"],
          property: "Certify Photo"
        };
        this.validationErrors.push(valError);
        this.technicianAndROSApplicationValidationFailed = true;
        return false;
      }

      payload = {
        id: this.id,
        decision: this.response,
        isCertifiedPhoto: this.certified,
        feedback: this.responseReason
      };
      this.submitting = true;
      this.preregService.submitCountersignatureOutcome(payload)
        .subscribe(() => {
          this.exit();
        }, error => {
          this.submitting = false;
        });
    }


  }

}
