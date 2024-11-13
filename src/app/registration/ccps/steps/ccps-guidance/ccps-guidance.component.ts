import { Component, forwardRef } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { CCPSApplication } from '../../model/ccpsApplication';
import { CCPSApplicationStep } from '../../model/ccpsApplicationStep';

@Component({
  selector: 'app-ccps-guidance',
  templateUrl: './ccps-guidance.component.html',
  styleUrls: ['./ccps-guidance.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => CcpsGuidanceComponent)
    }    
  ]
})
export class CcpsGuidanceComponent extends FormStepComponent {
  title = 'Guidance for this application';
  application: CCPSApplication;
  stepId: CCPSApplicationStep = CCPSApplicationStep.Guidance;

  constructor(private formStepperService: FormStepperService) { 
    super(formStepperService);
  }

  populateForm() {}

  validate(){
    this.validity$.next({valid: true, messages: [], touched: this.touched});
  }
}
