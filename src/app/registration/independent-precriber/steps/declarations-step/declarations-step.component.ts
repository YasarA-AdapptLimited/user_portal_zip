import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { IndependentPrescriberApplicationStep } from '../../model/IndependentPrescriberApplicationStep';
import { IndependentPrescriberApplication } from '../../model/IndependentPrescriberApplication';

@Component({
  selector: 'app-declarations-step',
  templateUrl: './declarations-step.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => DeclarationsStepComponent)
    }
  ]
})
export class DeclarationsStepComponent extends FormStepComponent implements OnInit {


  viewReady: any;

  constructor(formStpperService: FormStepperService) {
    super(formStpperService);
  }
  @Input() application: IndependentPrescriberApplication;
  saving = false;
  title = 'Declarations';
  stepId = IndependentPrescriberApplicationStep.Declarations;
  ngOnInit(): void {
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
      isQ4Confirmed,
      isQ5Confirmed
    } = this.application.activeForm.declaration;

    const valid =
      isQ1Confirmed && isQ2Confirmed && isQ3Confirmed && isQ4Confirmed && isQ5Confirmed;
    const messages = [];

    if (!isQ1Confirmed) {
      messages.push('You must answer “Yes” to declaration 1');
    }
    if (!isQ2Confirmed) {
      messages.push('You must answer “Yes” to declaration 2');
    }
    if (!isQ3Confirmed) {
      messages.push('You must answer “Yes” to declaration 3');
    }
    if (!isQ4Confirmed) {
      messages.push('You must answer “Yes” to declaration 4');
    }
    if (!isQ5Confirmed) {
      messages.push('You must answer “Yes” to declaration 5');
    }
    this.validity$.next({ valid , messages, touched: this.touched });
  }

  populateForm() { }

}
