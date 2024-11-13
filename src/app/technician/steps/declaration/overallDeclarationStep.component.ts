import { Component, forwardRef } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';

@Component({
  selector: 'app-overall-declaration-step',
  templateUrl: './overallDeclarationStep.component.html',
  styleUrls: ['./overallDeclarationStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => OverallDeclarationStepComponent)
    }
  ]
}) export class OverallDeclarationStepComponent extends FormStepComponent {

  title = 'Declaration (3)';
  stepId = TechnicianApplicationStep.OverallDeclaration;

  constructor(service: FormStepperService) {
    super(service);
  }

  update() {
    this.makeDirty();
    this.validate();
  }

  validate()  {
    const messages = [];
    const valid = this.application.activeForm.isOverallDeclarationConfirmed;
    if (!valid) {
      messages.push('You must tick the box to continue');
    }
    this.validity$.next({ valid, messages, touched: this.touched});
  }
  populateForm() {}

}
