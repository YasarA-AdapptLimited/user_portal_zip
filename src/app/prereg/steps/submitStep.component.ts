import { Component, forwardRef } from '@angular/core';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { RegApplicationStep } from '../model/RegApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { PreregService } from '../../core/service/prereg.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../core/service/layout.service';
import { ApplicationStatus } from '../model/ApplicationStatus';

@Component({
  selector: 'app-submit-step',
  templateUrl: './submitStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => SubmitStepComponent)
    }
  ]
}) export class SubmitStepComponent extends FormStepComponent {

  title = 'Submit';
  stepId = RegApplicationStep.Submit;
  serverErrors;
  submitting;

  constructor(service: FormStepperService, private preregService: PreregService, private router: Router, private layout: LayoutService) {
    super(service);
  }

  beforeNext() {
    this.submitting = true;
    this.layout.setOverlay(true);
    this.preregService.reSubmitApplication(this.application.activeForm.id).subscribe(() => {
      this.application.activeForm.formStatus = ApplicationStatus.Submitted;
      // invalidate cache
      delete this.preregService.application;
      this.layout.setOverlay(false);
      this.router.navigate(['/home']);
    }, error => {
      this.layout.setOverlay(false);
      this.serverErrors = error.validationErrors;
      this.submitting = false;
    });
    return false;
  }

  validate()  {

    this.validity$.next({ valid: true, messages: [], touched: this.touched});
  }

  populateForm() {}


}
