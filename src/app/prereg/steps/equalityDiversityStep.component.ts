import { Component, forwardRef, OnInit } from '@angular/core';
import { EdiService } from '../../account/service/edi.service';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { EqualityDiversity } from '../../account/model/EqualityDiversity';
import { RegApplicationStep } from '../model/RegApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../core/tooltip/Tooltip';

@Component({
  selector: 'app-equality-diversity-step',
  templateUrl: './equalityDiversityStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => EqualityDiversityStepComponent)
    }
  ]
}) export class EqualityDiversityStepComponent extends FormStepComponent implements OnInit {

  equalityDiversity: EqualityDiversity;
  constructor(public ediService: EdiService, service: FormStepperService) {
    super(service);
  }
  title = 'Equality and diversity';
  stepId = RegApplicationStep.Edi;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  showDetailsHelp = false;
  prevDisabled = true;

  ngOnInit() {
    this.equalityDiversity = this.application.trainee.equalityDiversity || {
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
    const nationality = this.application.trainee.equalityDiversity.nationality;
    this.application.trainee.equalityDiversity = Object.assign($event, { nationality });
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
