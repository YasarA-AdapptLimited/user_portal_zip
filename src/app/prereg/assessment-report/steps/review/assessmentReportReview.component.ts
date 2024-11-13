import { Input, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../../../account/model/Applicant';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';
import { AssessmentReport } from '../../models/AssessmentReport';
import { AssessmentReportApplicationForm } from '../../models/AssessmentReportApplicationForm';
import { CountersignatureOutcome } from '../../../../prereg/model/CountersignatureOutcome';
import { User } from '../../../../account/model/User';
import { Address } from '../../../../account/model/Address';
import { TrainingPlacement } from '../../../../prereg/model/TrainingPlacement';
import { AssessmentTutorDetails } from '../../models/AssessmentTutors';
import { Training } from '../../../../prereg/model/Training';
import { CountersignerComment } from '../../models/AssessmentCountersigners';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';


@Component({
  selector: 'app-assessment-report-review',
  templateUrl: './assessmentReportReview.component.html',
  styleUrls: ['./assessmentReportReview.scss']
}) export class AssessmentReportReviewComponent implements OnInit {

  @Input() application: AssessmentReport;
  @Input() readonly = true;
  AssessmentReportStep = AssessmentReportStep;
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
  get tempRegValid() {
    return this.application.activeForm.confirmTempRegistration === true;
  }

  ngOnInit() {
    this.trainee = this.application.trainee;
    this.tutorDetails = this.application.tutorDetails;
    this.formatAddress();
    this.mapComments(this.application.activeForm);
    this.countersigner = this.application.activeForm.countersignatures[0];
    this.tempreg = this.application.activeForm.confirmTempRegistration;
    if(this.trainee) {
      this.traineeFullName = [this.trainee.forenames, this.trainee.middleName, this.trainee.surname].filter(Boolean).join(" ");
    }
  }

  mapComments(application: AssessmentReportApplicationForm): void {
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
