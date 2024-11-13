import { Component, forwardRef } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../../../core/service/layout.service';
import { ApplicationStatus } from '../../../model/ApplicationStatus';
import { AssessmentRegistrationStep } from '../../model/AssessmentRegistrationStep';
import { AssessmentRegistrationService } from '../../../../core/service/assessmentRegistration.service';

@Component({
  selector: 'app-assessment-registration-submit',
  templateUrl: './assessmentRegistrationSubmit.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentRegistrationSubmitComponent)
    }
  ]
}) export class AssessmentRegistrationSubmitComponent extends FormStepComponent {

  title = 'Submit';
  stepId = AssessmentRegistrationStep.Submit;
  serverErrors;
  submitting;

  constructor(service: FormStepperService, private assessmentService: AssessmentRegistrationService, private router: Router, private layout: LayoutService) {
    super(service);
  }

  beforeNext() {
    this.submitting = true;
    this.layout.setOverlay(true);
    this.assessmentService.reSubmitApplication(this.application.activeForm.id).subscribe(() => {
      this.application.activeForm.formStatus = ApplicationStatus.Submitted;
      // invalidate cache
      delete this.assessmentService.application;
      this.layout.setOverlay(false);
      this.router.navigate(['/home']);
    }, error => {
      this.layout.setOverlay(false);
      this.serverErrors = error.validationErrors;
      this.submitting = false;
    });
    return false;
  }

  validate() {

    this.validity$.next({ valid: true, messages: [], touched: this.touched });
  }

  populateForm() { }


}
