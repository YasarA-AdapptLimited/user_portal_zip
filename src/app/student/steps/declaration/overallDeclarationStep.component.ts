import { Component, forwardRef } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { PreregApplicationStep } from '../../../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';

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

  showDetailsHelp = false;
  title = 'Overall declaration';
  stepId = PreregApplicationStep.OverallDeclaration;

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
