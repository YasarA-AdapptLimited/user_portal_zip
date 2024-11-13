import { Component, forwardRef, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { RegApplicationStep } from '../../model/RegApplicationStep';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../../core/tooltip/Tooltip';

@Component({
  selector: 'app-sitting-confirmation-step',
  templateUrl: './sittingConfirmationStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => SittingConfirmationComponent)
    }
  ]
}) export class SittingConfirmationComponent extends FormStepComponent implements OnInit {

  constructor(service: FormStepperService) {
    super(service);
  }

  assessmentConfirmed;
  trainingConfirmed;
  title = 'Training';
  stepId = RegApplicationStep.TrainingConfirmation;
  showDetailsHelp = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };

  ngOnInit() {
    this.assessmentConfirmed = this.application.activeForm.isAssessmentConfirmed;
    this.trainingConfirmed = this.application.activeForm.isTrainingConfirmed;
  }

  validate() {
    const messages = [];
    const valid = this.assessmentConfirmed === true && this.trainingConfirmed === true;

    if (!valid) {
      messages.push(`Your training and assessment details must be confirmed as correct before you can continue with your application.`);
    }

    if (this.assessmentConfirmed !== this.application.activeForm.isAssessmentConfirmed ||
      this.trainingConfirmed !== this.application.activeForm.isTrainingConfirmed
    ) {
      this.makeDirty();
    }


    this.validity$.next({ valid, messages, touched: this.touched });
  }

  populateForm() {
    this.application.activeForm.isAssessmentConfirmed = this.assessmentConfirmed;
    this.application.activeForm.isTrainingConfirmed = this.trainingConfirmed;
  }


}
