import { Component, forwardRef, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../../../core/tooltip/Tooltip';
import { FinalDeclarationStep } from '../../model/FinalDeclarationStep';

@Component({
  selector: 'app-final-declaration-confirm-training-step',
  templateUrl: './finalDeclarationConfirmTrainingStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => FinalDeclarationConfirmTrainingStepComponent)
    }
  ]
}) export class FinalDeclarationConfirmTrainingStepComponent extends FormStepComponent implements OnInit {

  trainingConfirmed;
  title = 'Training';
  stepId = FinalDeclarationStep.TrainingConfirmation;
  showDetailsHelp = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };


  constructor(service: FormStepperService) {
    super(service);
  }

  ngOnInit() {
    this.trainingConfirmed = this.application.activeForm.isTrainingConfirmed;
  }


  validate() {
    const messages = [];

    const valid = !!this.trainingConfirmed;

    if (!valid) {
      messages.push(`You must complete this step to continue`);
    }

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  populateForm() {

    this.application.activeForm.isTrainingConfirmed = this.trainingConfirmed;
  }

}
