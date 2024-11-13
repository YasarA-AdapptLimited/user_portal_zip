import { Input, Component, forwardRef, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../../../account/model/Applicant';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { AssessmentRegistrationStep } from '../../model/AssessmentRegistrationStep';


@Component({
  selector: 'assessment-registration-review-step',
  templateUrl: './assessmentRegistrationReviewStep.component.html',
  styleUrls: ['./assessmentRegistrationReviewStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentRegistrationReviewStepComponent)
    }
  ]
}) export class AssessmentRegistrationReviewStepComponent extends FormStepComponent implements OnInit {
  title;
  @Input() stepId = AssessmentRegistrationStep.Review;
  applicant: Applicant;
  AssessmentRegistrationStep = AssessmentRegistrationStep;
  @Input() readonly = false;

  constructor(service: FormStepperService) {
    super(service);
  }

  @Output() navigate = new EventEmitter<number>();

  ngOnInit() {
    this.applicant = this.application.trainee;
    this.title = this.readonly ? 'Final review' : 'Review';
  }

  validate() {
    this.validity$.next({ valid: true, messages: [], touched: this.touched });
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }

  populateForm() { }

}
