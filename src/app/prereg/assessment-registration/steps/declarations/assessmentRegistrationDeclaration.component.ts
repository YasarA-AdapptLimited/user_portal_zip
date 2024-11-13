import { Component, OnInit, ViewChild, forwardRef, Input } from '@angular/core';
import { AssessmentRegistrationStep } from '../../model/AssessmentRegistrationStep';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepperComponent } from '../../../../shared/formStepper/formStepper.component';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { AssessmentRegistration } from '../../model/AssessmentRegistration';

@Component({
  selector: 'app-assessment-registration-declaration',
  templateUrl: './assessmentRegistrationDeclaration.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentRegistrationDeclarationComponent)
    }
  ]
})
export class AssessmentRegistrationDeclarationComponent
  extends FormStepComponent
  implements OnInit {
  viewReady: any;
  constructor(service: FormStepperService) {
    super(service);
  }

  @Input() application: AssessmentRegistration;

  saving: boolean = false;
  title = ' Declarations';
  stepId = AssessmentRegistrationStep.Declaration;

  ngOnInit() {
  }

  update() {
    this.makeDirty();
    this.validate();
  }

  load() {
    if (this.viewReady) {
      this.ready$.next(true);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
      this.viewReady = true;
    });
  }

  validate() {
    const {
      isQ1Confirmed,
      isQ2Confirmed,
      isQ3Confirmed,
      isQ4Confirmed
    } = this.application.activeForm.declaration;

    let valid =
      isQ1Confirmed && isQ2Confirmed && isQ3Confirmed && isQ4Confirmed;
    const messages = [];

    if (!isQ1Confirmed) {
      messages.push('You have not confirmed the 1st declaration');
    }
    if (!isQ2Confirmed) {
      messages.push('You have not confirmed the 2nd declaration');
    }
    if (!isQ3Confirmed) {
      messages.push('You have not confirmed the 3rd declaration');
    }
    if (!isQ4Confirmed) {
      messages.push('You have not confirmed the 4th declaration');
    }
    this.validity$.next({ valid, messages, touched: this.touched });
  }

  populateForm() { }
}
