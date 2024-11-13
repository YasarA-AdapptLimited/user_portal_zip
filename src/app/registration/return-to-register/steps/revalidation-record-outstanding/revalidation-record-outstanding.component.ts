import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ReturnToRegisterApplication } from '../../model/ReturnToRegister';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';


@Component({
  selector: 'app-revalidation-record-outstanding',
  templateUrl: './revalidation-record-outstanding.component.html',
  styleUrls: ['./revalidation-record-outstanding.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => RevalidationRecordOutstandingComponent)
    }    
  ]
})
export class RevalidationRecordOutstandingComponent extends FormStepComponent implements OnInit {

  stepId = ReturnToRegisterStep.RevalidationRecordOutstanding;
  title = 'Revalidation record outstanding';
  @Input() application : ReturnToRegisterApplication;
  hasAcknowledged;
  returnToRegisterDetail;

  constructor(private formStepperService: FormStepperService) {
    super(formStepperService);
   }

  ngOnInit(): void {
    if(this.application.activeForm) {
      this.returnToRegisterDetail = this.application.activeForm.returnToRegisterDetail;
    }    
  }

  populateForm() {
    
  }

  validate() {
    let valid, messages = [];
  
    if(!this.returnToRegisterDetail.hasConfirmedRevalidationSubmission) {
      messages.push('Please select the checkbox');
    }
    valid = messages.length === 0;

    this.validity$.next({ valid: valid, messages , touched: this.touched });
  }

}
