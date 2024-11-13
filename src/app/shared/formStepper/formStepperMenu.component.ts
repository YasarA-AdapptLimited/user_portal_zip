import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormStepSummary } from './FormStepSummary';
import { FormStepperService } from './formStepper.service';

@Component({
  selector: 'app-form-stepper-menu',
  templateUrl: './formStepperMenu.component.html',
  styleUrls: ['./formStepperMenu.scss']
})
export class FormStepperMenuComponent {

  @Input() summary: Array<FormStepSummary> = [];
  @Output() navigate = new EventEmitter<FormStepSummary>();

  constructor(private service: FormStepperService) { }

  goToStep(item: FormStepSummary) {
    this.navigate.emit(item);
  }

  getTooltip(item: FormStepSummary) {
    if (!item.validity.messages.length) { return undefined; }
    return {
      id: 'step-' + item.stepId,
      content: item.validity.messages.join(', '),
      width: 320,
      placement: 'bottom',
      order: 1
    };
  }

  getIconCss(step: FormStepSummary) {

    const stepComponent = this.service.getStep(step.stepId);
    if(stepComponent) {
      if (stepComponent.waiting) {
        return 'fa fa-clock-o';
      }
      if (step.validity && step.validity.touched && step.validity.valid === false) {
        return 'fa fa-warning danger';
      }
  
      if (step.validity && step.validity.valid === true) {
        return 'fa fa-check success';
      }
      return '';
    }    

  }
}
