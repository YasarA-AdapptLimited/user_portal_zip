import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, forwardRef, OnInit } from '@angular/core';
import { EdiService } from '../../../account/service/edi.service';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { EqualityDiversity } from '../../../account/model/EqualityDiversity';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../../core/tooltip/Tooltip';
import { Applicant } from '../../../account/model/Applicant';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';

@Component({
  selector: 'app-equality-diversity-step',
  templateUrl: './equalityDiversityStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => EqualityDiversityStepComponent)
    }
  ]
}) export class EqualityDiversityStepComponent extends FormStepComponent implements OnInit, AfterViewInit, AfterContentChecked {

  equalityDiversity: EqualityDiversity;
  constructor(public ediService: EdiService, service: FormStepperService, private ref: ChangeDetectorRef) {
    super(service);
  }
  title = 'Equality and diversity';
  stepId = TechnicianApplicationStep.Edi;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  showDetailsHelp = false;
  prevDisabled = true;
  applicant: Applicant;

  ngOnInit() {
    this.applicant = this.application.trainee;
    this.applicant.equalityDiversity = this.applicant.equalityDiversity || {
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
   this.equalityDiversity = this.applicant.equalityDiversity;
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  } 
  ngAfterViewInit() {
    setTimeout(() => {
      this.equalityDiversity = this.applicant.equalityDiversity;
    });
  }

  validate() {
    this.validity$.next(Object.assign(this.ediService.validate(this.equalityDiversity), { touched: this.touched }));
  }

  update($event) {
    const nationality = this.applicant.equalityDiversity.nationality;
    this.applicant.equalityDiversity = Object.assign($event, { nationality });
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
