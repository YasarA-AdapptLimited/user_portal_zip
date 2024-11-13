import { Component, OnInit, Input, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { CountersignatureOutcome } from '../../prereg/model/CountersignatureOutcome';
import { AssessmentReport } from '../../prereg/assessment-report/models/AssessmentReport';
import { AssessmentReportService } from '../../core/service/assessmentReport.service';
import { Address } from '../../account/model/Address';
import { TrainingPlacement } from '../../prereg/model/TrainingPlacement';
import { User } from '../../account/model/User';
import { NgForm } from '@angular/forms';
import { Tooltip } from './../../core/tooltip/Tooltip';
import { AssessmentTutorDetails } from '../../prereg/assessment-report/models/AssessmentTutors';
import { ValidationError } from '../../core/model/ValidationError';

@Component({
  moduleId: module.id,
  selector: 'app-assessment-countersign-response',
  templateUrl: './assessmentCountersignResponse.component.html',
  styleUrls: ['../countersign.scss']
})
export class AssessmentCountersignResponseComponent implements OnInit {

  @ViewChild('form') countersignForm: NgForm;
  @ViewChildren('formInput') allInputs: QueryList<any>;
  @Input() application: AssessmentReport;
  id: string;
  date: string;
  name: string;
  loading = false;
  CountersignatureOutcome = CountersignatureOutcome;
  response;
  responseReason;
  certified;
  certifiedIdentity;
  role: number;
  submitting = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  }
  showDetailsHelp = false;
  comments = '';
  otherComment = '';
  otherLeaveComment = '';
  validationErrors: any;
  certifiedPhotoValidationFailed: boolean = false;
  certifiedPhotoIdentityValidationFailed: boolean = false;

  trainingSiteAdress: Array<string>;
  user: User;
  weeksSinceTrainingStart: number;
  validInputs: boolean;
  @Input() trainingSites: TrainingPlacement[];
  @Input() tutors: AssessmentTutorDetails[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private assessmentReportService: AssessmentReportService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.date = this.route.snapshot.params['date'];
    this.role = +this.route.snapshot.params['role'];
  }

  ngOnInit(): void {

    this.user = this.auth.user;
    this.formatAddress();

  }

  public formatName(trainee): string {
    return `${trainee.title.name} ${trainee.forenames} ${trainee.middleName ? trainee.middleName : ''} ${trainee.surname}`
  }

  formatAddress(): void {
    this.trainingSiteAdress = this.application.training.trainedAt.map((training: TrainingPlacement) => {
      return new Address(training.address).toString('<br/>');
    });
  }

  print(): void {
    (<any>window).print();
  }

  exit(): void {
    this.router.navigate(['/registration']);
  }

  focusOnInvalidInputs(): void {
    this
      .allInputs
      .filter(input => input.nativeElement.className.includes('ng-invalid'))
      .forEach(input => input.nativeElement.focus());
  }

  submitOutcome(formValue): void {
    this.submitting = true;
    const outcome = {
      id: this.id,
      decision: this.response,
      feedback: this.responseReason,
      countersignerComment: formValue
    };
    const submitOutcome = (anoutcome = outcome): void => {
      this.submitting = false;
      this.validInputs = true;
      this.assessmentReportService.submitCountersignatureOutcome(anoutcome).subscribe(() => {
        this.submitting = true;
        this.exit();
      }, () => {
        this.submitting = false;
        this.validInputs = false;
      });
    };

    if (this.response === CountersignatureOutcome.Refused) {
      this.validInputs = true;
      outcome['countersignerComment'] = '';
      submitOutcome(outcome);
    }

    if (this.response === CountersignatureOutcome.Approved ||
      this.response === CountersignatureOutcome.Rejected
    ) {
      (this.countersignForm.invalid) ? this.focusOnInvalidInputs() : submitOutcome();
    }
  }

}