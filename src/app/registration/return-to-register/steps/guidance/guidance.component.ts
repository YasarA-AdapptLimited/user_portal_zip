import { Component, forwardRef } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { ReturnToRegisterApplication } from '../../model/ReturnToRegister';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';

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
  title = 'Guidance for this application';
  application : ReturnToRegisterApplication;
  stepId = ReturnToRegisterStep.Guidance;
  fee = '114';

  constructor(private formStepperService: FormStepperService) { 
    super(formStepperService);
  }

  populateForm() {}

  validate() {
    this.validity$.next({ valid: true, messages : [] , touched: false });
  }
}
