import { Component, OnInit, ViewChild, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { AssessmentRegistrationStep } from '../../model/AssessmentRegistrationStep';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepperComponent } from '../../../../shared/formStepper/formStepper.component';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { AssessmentRegistration } from '../../model/AssessmentRegistration';
//added new scss file to add background color
@Component({
  selector: 'app-assessment-registration-regulation-step',
  templateUrl: './assessmentRegistrationRegulationStep.component.html',
  styleUrls: ['./assessmentRegistrationRegulation.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentRegistrationRegulationStepComponent)
    }
  ]
})
export class AssessmentRegistrationRegulationStepComponent
  extends FormStepComponent
  implements OnInit {
  viewReady: any;
  hasCheckedRgistrationRegulation;
  hasCheckedCorrectInformation;
  hasCheckedPhotoIdentification;
  constructor(service: FormStepperService) {
    super(service);
  }

  @Input() application: AssessmentRegistration;
  @Output() navigate = new EventEmitter<number>();

  saving: boolean = false;
  title = 'Regulations';
  stepId = AssessmentRegistrationStep.Regulation;

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
    const messages = [];
    const valid = true;
    this.validity$.next({ valid, messages, touched: this.touched });
  }


  populateForm() { }
}
