import { Component, forwardRef } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';

@Component({
  selector: 'app-assessment-report-overall-declaration-step',
  templateUrl: './assessmentReportOverallDeclarationStep.component.html',
  styleUrls: ['./overallDeclarationStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentReportOverallDeclarationStepComponent)
    }
  ]
}) export class AssessmentReportOverallDeclarationStepComponent extends FormStepComponent {

  title = 'Declaration (3)';
  stepId = AssessmentReportStep.OverallDeclaration;

  constructor(service: FormStepperService) {
    super(service);
  }

  update() {
    this.makeDirty();
    this.validate();
  }

  validate() {
    const messages = [];
    const valid = this.application.activeForm.isOverallDeclarationConfirmed;
    if (!valid) {
      messages.push('You must tick the box to continue');
    }
    this.validity$.next({ valid, messages, touched: this.touched });
  }
  populateForm() { }

}
