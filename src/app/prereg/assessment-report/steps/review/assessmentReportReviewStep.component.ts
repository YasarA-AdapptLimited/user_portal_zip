import { Input, Component, forwardRef, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../../../account/model/Applicant';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { AssessmentReport } from '../../models/AssessmentReport';


@Component({
  selector: 'app-assessment-report-review-step',
  templateUrl: './assessmentReportReviewStep.component.html',

  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentReportReviewStepComponent)
    }
  ]
}) export class AssessmentReportReviewStepComponent extends FormStepComponent implements OnInit {
  title;
  @Input() stepId = AssessmentReportStep.FinalReview;
 // applicant: Applicant;
  AssessmentReportStep = AssessmentReportStep;
  @Input() readonly = false;
  @Input() application: AssessmentReport;

  constructor(service: FormStepperService) {
    super(service);
  }

  @Output() navigate = new EventEmitter<number>();

  ngOnInit() {
   // this.applicant = this.application;
    this.title = this.readonly ? 'Final review' : 'Review';
  }

  validate()  {
    this.validity$.next({ valid: true, messages: [], touched: this.touched});
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }

  populateForm() {}

}
