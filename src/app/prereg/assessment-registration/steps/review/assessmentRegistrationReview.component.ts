import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { Applicant } from '../../../../account/model/Applicant';
import { AssessmentRegistration } from '../../model/AssessmentRegistration';
import { AssessmentRegistrationStep } from '../../model/AssessmentRegistrationStep';
@Component({
  selector: 'assessment-registration-review',
  templateUrl: './assessmentRegistrationReview.component.html',
  styleUrls: ['../../../../style/sectionHeaders.scss']
}) export class AssessmentRegistrationReviewComponent {
  applicant: Applicant;
  @Input() application: AssessmentRegistration;
  @Input() readonly = false;
  @Input() formId;
  @Input() showEdi = true;
  @Input() showContactDetails = true;
  AssessmentRegistrationStep = AssessmentRegistrationStep;

  @Output() navigate = new EventEmitter<number>();
  ngOnInit() {
    this.applicant = this.application.trainee;
  }
  goToStep(stepId) {
    this.navigate.emit(stepId);
  }
}
