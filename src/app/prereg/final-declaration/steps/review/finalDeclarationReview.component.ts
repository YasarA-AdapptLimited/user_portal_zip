import { Input, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../../../account/model/Applicant';
import { CountersignatureOutcome } from '../../../../prereg/model/CountersignatureOutcome';
import { User } from '../../../../account/model/User';
import { Address } from '../../../../account/model/Address';
import { TrainingPlacement } from '../../../../prereg/model/TrainingPlacement';
import { Training } from '../../../../prereg/model/Training';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';
import { FinalDeclaration } from '../../model/FinalDeclaration';
import { FinalDeclarationStep } from '../../model/FinalDeclarationStep';
import { AssessmentTutorDetails } from '../../../../prereg/assessment-report/models/AssessmentTutors';
import { FinalDeclarationApplicationForm } from '../../model/FinalDeclarationApplicationForm';
import { CountersignerComment } from '../../model/FinalDeclarationCountersigner';


@Component({
  selector: 'app-final-declaration-review',
  templateUrl: './finalDeclarationReview.component.html',
  styleUrls: ['./finalDeclarationReview.scss']
}) export class FinalDeclarationReviewComponent implements OnInit {

  @Input() application: FinalDeclaration;
  @Input() readonly = true;
  FinalDeclarationStep = FinalDeclarationStep;
  CountersignatureOutcome = CountersignatureOutcome;
  trainee: Applicant;
  training: Training;
  tutorDetails: AssessmentTutorDetails[];
  comments: CountersignerComment;
  countersigner;
  traineePerformance;
  trainingSiteAdress: Array<string>;
  user: User;
  weeksSinceTrainingStart: number;
  tempreg;
  traineeFullName;

  constructor() { }

  @Output() navigate = new EventEmitter<number>();

  get traineeComments() {
    return this.application.activeForm.formStatus === ApplicationStatus.Submitted;
  }
  // get tempRegValid() {
  //   return this.application.activeForm.confirmTempRegistration === true;
  // }

  ngOnInit() {
    this.trainee = this.application.trainee;
    this.tutorDetails = this.application.tutorDetails;
    this.formatAddress();
    this.mapComments(this.application.activeForm);
    this.countersigner = this.application.activeForm.countersignatures[0];
   // this.tempreg = this.application.activeForm.confirmTempRegistration
    if(this.trainee) {
      this.traineeFullName = [this.trainee.forenames, this.trainee.middleName, this.trainee.surname].filter(Boolean).join(" ");
    }
  }

  mapComments(application: FinalDeclarationApplicationForm): void {
    const { countersignatures } = application;
    const response = countersignatures.filter(cs =>
      cs.decision === CountersignatureOutcome.Approved ||
      cs.decision === CountersignatureOutcome.Rejected);
    this.comments = response[0].countersignerComment;
  }

  formatAddress(): void {
    this.trainingSiteAdress = this.application.training.trainedAt.map((training: TrainingPlacement) => {
      return new Address(training.address).toString('<br/>');
    });
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }
}
