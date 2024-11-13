import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { EdiService } from '../../../../account/service/edi.service';
import { EqualityDiversity } from '../../../../account/model/EqualityDiversity';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../../../core/tooltip/Tooltip';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { VoluntaryRemovalApplicationStep } from '../../model/VoluntaryRemovalApplicationStep';
import { VoluntaryRemovalApplication } from '../../model/VoluntaryRemovalApplication';

@Component({
  selector: 'app-vr-edi-step',
  templateUrl: './vr-edi-step.component.html',
  styleUrls: ['./vr-edi-step.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => VrEdiStepComponent)
    }
  ]
})
export class VrEdiStepComponent extends FormStepComponent implements OnInit {
  title = 'ED&I Details';
  stepId = VoluntaryRemovalApplicationStep.EDIDetails;
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
    const nationality = this.application.activeForm.equalityDiversity?.nationality;
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
