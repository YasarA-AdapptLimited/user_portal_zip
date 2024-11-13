import { Component, OnInit, Input, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { CountersignatureOutcome } from '../../prereg/model/CountersignatureOutcome';
import { Address } from '../../account/model/Address';
import { TrainingPlacement } from '../../prereg/model/TrainingPlacement';
import { User } from '../../account/model/User';
import { NgForm } from '@angular/forms';
import { Tooltip } from './../../core/tooltip/Tooltip';
import { AssessmentTutorDetails } from '../../prereg/assessment-report/models/AssessmentTutors';
import { FinalDeclarationService } from '../../core/service/finalDeclaration.service';
import { FinalDeclaration } from '../../prereg/final-declaration/model/FinalDeclaration';

@Component({
  moduleId: module.id,
  selector: 'app-final-declaration-countersign-response',
  templateUrl: './finalDeclarationCountersignResponse.component.html',
  styleUrls: ['../countersign.scss']
})
export class FinalDeclarationCountersignResponseComponent implements OnInit {

  @ViewChild('form') countersignForm: NgForm;
  @ViewChildren('formInput') allInputs: QueryList<any>;
  @Input() application: FinalDeclaration;
  id: string;
  date: string;
  name: string;
  loading = false;
  CountersignatureOutcome = CountersignatureOutcome;
  response;
  responseReason;
  traineePerfomance;
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
  anyProblemsEffected;
  annualLeaves;
  sickLeaves;
  otherLeaves;
  otherLeaveDetails;

  @Input() trainingSites: TrainingPlacement[];
  @Input() tutors: AssessmentTutorDetails[];
  professionalHealthcareName: any;
  professionalHealthJobRole: any;
  professionalHealthRegNumber: any;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private finalDeclarationService: FinalDeclarationService
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
    if(trainee !== undefined && trainee !== null) {
      return `${trainee.title.name} ${trainee.forenames} ${trainee.middleName ? trainee.middleName : ''} ${trainee.surname}`
    }
  }

  formatAddress(): void {
    if(this.application !== undefined) {
      this.trainingSiteAdress = this.application.training.trainedAt.map((training: TrainingPlacement) => {
        return new Address(training.address).toString('<br/>');
      });
    }
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
    const approved = `I confirm that I have discussed the satisfactory outcome of this report with ${this.professionalHealthcareName} and having job role as ${this.professionalHealthJobRole} of healthcare professional with registration number ${this.professionalHealthRegNumber}.`
    const outcome = {
      id: this.id,
      decision: this.response,
      feedback: this.responseReason || approved,
      countersignerComment: formValue
    };
    const submitOutcome = (anoutcome = outcome): void => {
      this.submitting = false;
      this.validInputs = true;
      this.finalDeclarationService.submitCountersignatureOutcome(anoutcome).subscribe(() => {
        const tutorFeedback = anoutcome.feedback;
        if (tutorFeedback === CountersignatureOutcome.Approved) {
          this.responseReason = approved;
        } else if (tutorFeedback === CountersignatureOutcome.Rejected) {
          this.responseReason = this.responseReason;
        }
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
