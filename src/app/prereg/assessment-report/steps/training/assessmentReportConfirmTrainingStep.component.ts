import { Component, forwardRef, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../../../core/tooltip/Tooltip';

@Component({
  selector: 'app-assessment-report-confirm-training-step',
  templateUrl: './assessmentReportConfirmTrainingStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentReportConfirmTrainingStepComponent)
    }
  ]
}) export class AssessmentReportConfirmTrainingStepComponent extends FormStepComponent implements OnInit {

  trainingConfirmed;
  title = 'Training';
  stepId = AssessmentReportStep.TrainingConfirmation;
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
