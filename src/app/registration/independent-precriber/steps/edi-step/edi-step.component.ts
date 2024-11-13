import { Component, forwardRef, OnInit } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { IndependentPrescriberApplicationStep } from '../../model/IndependentPrescriberApplicationStep';
import { EqualityDiversity } from '../../../../account/model/EqualityDiversity';
import { EdiService } from '../../../../account/service/edi.service';
import { Tooltip } from '../../../../core/tooltip/Tooltip';

@Component({
  selector: 'app-edi-step',
  templateUrl: './edi-step.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => EdiStepComponent)
    }
  ]
})
export class EdiStepComponent extends FormStepComponent implements OnInit {
  
  title = 'ED&I Details';
  stepId = IndependentPrescriberApplicationStep.EDIDetails;
  equalityDiversity: EqualityDiversity;
  constructor(public ediService: EdiService, service: FormStepperService) {
    super(service);
  }

  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  showDetailsHelp = false;
  prevDisabled = false;

  ngOnInit() {
    this.equalityDiversity = this.application.activeForm.equalityDiversity || {
      ethnicity: undefined,
      ethnicityOther: '',
      nationality: undefined,
      religion: undefined,
      religionOther: '',
      disabled: undefined,
      disabilityDetails: '',
      gender: undefined,
      sexualOrientation: undefined
    };
  }

  validate() {
    this.validity$.next(Object.assign(this.ediService.validate(this.equalityDiversity), { touched: this.touched }));
  }

  update($event) {
    const nationality = this.application.activeForm.equalityDiversity.nationality;
    this.application.activeForm.equalityDiversity = Object.assign($event, { nationality });
    this.makeDirty();
    this.validate();
  }

  load() {
    this.ediService.load().subscribe(() => {
      this.ready$.next(true);
    });
  }

  populateForm() { }

}
