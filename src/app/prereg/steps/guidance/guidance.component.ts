import { Component, forwardRef } from '@angular/core';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { RegApplicationStep } from '../../model/RegApplicationStep';
import { RegApplication } from '../../model/RegApplication';

@Component({
  selector: 'app-guidance',
  templateUrl: './guidance.component.html',
  styleUrls: ['./guidance.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => GuidanceComponent)
    }    
  ]
})
export class GuidanceComponent extends FormStepComponent {
  title = 'Guidance on completing this application';
  application : RegApplication;
  stepId = RegApplicationStep.Guidance;
  fee = '106';

  constructor(private formStepperService: FormStepperService) { 
    super(formStepperService);
  }

  populateForm() {}

  validate() {
    this.validity$.next({ valid: true, messages : [] , touched: false });
  }
}
