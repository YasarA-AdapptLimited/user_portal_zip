import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../../../core/service/layout.service';
import { ApplicationStatus } from '../../../model/ApplicationStatus';
import { AssessmentReportService } from '../../../../core/service/assessmentReport.service';
import { AssessmentReport } from '../../models/AssessmentReport';


@Component({
  selector: 'app-assessment-report-submit-step',
  templateUrl: './assessmentReportSubmitStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentReportSubmitStepComponent)
    }
  ]
}) export class AssessmentReportSubmitStepComponent extends FormStepComponent implements OnInit {
  showDetailsHelp = false;
  @Input() formId;
  @Input() application: AssessmentReport;
  title = 'Comments';
  stepId = AssessmentReportStep.Submit;
  serverErrors = [];
  submitting;
  traineeFeedbackOnTutorAssessment = '';
  countersigner;
  comments: any;
  maxChars = 2001;
  characterleft = this.maxChars;
  validationErrors: any;

  constructor(service: FormStepperService,
    private assessmentService: AssessmentReportService, private router: Router, private layout: LayoutService) {
    super(service);
  }

  ngOnInit() {
    this.countersigner = this.application.activeForm.countersignatures[0];
  }

  beforeNext() {
    const payload = {
      formId: this.application.activeForm.id,
      countersignatureId: this.countersigner.id,
      countersignerCommentId: this.countersigner.countersignerCommentId,
      traineeFeedbackOnTutorAssessment: this.traineeFeedbackOnTutorAssessment
    };
    this.submitting = true;
    this.serverErrors = [];
    this.assessmentService.submitProgressReportForm(payload).subscribe(() => {
      this.application.activeForm.formStatus = ApplicationStatus.Submitted;
      delete this.assessmentService.application;
      this.router.navigate(['/home']);
      this.submitting = false;
    }, error => {
      this.layout.setOverlay(false);
      this.serverErrors = error.validationErrors;
      this.submitting = false;
    });
    return false;
  }

  validate() {
    const messages = [];
    const hasComment = this.traineeFeedbackOnTutorAssessment.length < this.maxChars;
    const valid = hasComment;

    if (!valid) {

      this.validity$.next({ valid: false, messages, touched: true });
    }

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  populateForm() { }


}
