import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wizard-steps',
  moduleId: module.id,
  templateUrl: './wizardSteps.component.html',
  styleUrls: ['wizardSteps.component.scss']
})
export class WizardStepsComponent {
  @Input() steps;
  @Input() currentStep;
  @Input() sticky = false;

}
