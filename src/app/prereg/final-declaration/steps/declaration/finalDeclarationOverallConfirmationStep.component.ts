import { Component, forwardRef } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FinalDeclarationStep } from '../../model/FinalDeclarationStep';

@Component({
  selector: 'app-final-declaration-overall-confirmation-step',
  templateUrl: './finalDeclarationOverallConfirmationStep.component.html',
  styleUrls: ['./overallConfirmationStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => FinalDeclarationOverallConfirmationStepComponent)
    }
  ]
}) export class FinalDeclarationOverallConfirmationStepComponent extends FormStepComponent {

  title = 'Declaration (3)';
  stepId = FinalDeclarationStep.OverallDeclaration;

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
