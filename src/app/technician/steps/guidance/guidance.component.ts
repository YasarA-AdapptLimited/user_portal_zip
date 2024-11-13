import { Component, forwardRef } from '@angular/core';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { TechnicianApplication } from '../../model/TechnicianApplication';

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
  application : TechnicianApplication;
  stepId = TechnicianApplicationStep.Guidance;
  fee = '106';

  constructor(private formStepperService: FormStepperService) { 
    super(formStepperService);
  }

  populateForm() {}

  validate() {
    this.validity$.next({ valid: true, messages : [] , touched: false });
  }
}
