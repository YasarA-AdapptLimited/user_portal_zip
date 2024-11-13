import { Component, forwardRef, OnInit } from '@angular/core';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { RegApplicationStep } from '../model/RegApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { FormControl, Validators } from '@angular/forms';
import { Applicant } from '../../account/model/Applicant';
import { Tooltip } from '../../core/tooltip/Tooltip';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-letter-step',
  templateUrl: './letterStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => LetterStepComponent)
    }
  ],
  styleUrls: ['./letterStep.scss']
})
export class LetterStepComponent extends FormStepComponent implements OnInit {
  showDetailsHelp = false;
  applicant: Applicant;
  stepId = RegApplicationStep.LetterOfGoodStanding;
  title = 'Letter of good standing';
  model = {
    hasRegistered: new FormControl<boolean | null>(undefined, {
      validators: Validators.required
    }),
    regulatoryBody: new FormControl<string | null>(undefined),
    registrationNumber: new FormControl<string | null>(undefined),
    requested: new FormControl<boolean | null>(undefined)
  };
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };

  constructor(service: FormStepperService) {
    super(service);
  }

  ngOnInit() {
    this.model.hasRegistered.valueChanges
      .pipe(debounceTime(50))
      .subscribe(value => {
        this.makeDirty();
        if (value === false) {
          this.model.regulatoryBody.clearValidators();
          this.model.registrationNumber.clearValidators();
          this.model.requested.clearValidators();
          this.model.regulatoryBody.setValue(null);
          this.model.registrationNumber.setValue(null);
          this.model.requested.setValue(null);
        } else if (value === true) {
          this.model.regulatoryBody.setValidators(Validators.required);
          this.model.registrationNumber.setValidators(Validators.required);
          this.model.requested.setValidators(Validators.required);
          this.model.regulatoryBody.setValue(
            this.checkFormForNullVals(this.application.activeForm.letterOfGoodStanding.regulatoryBody)
          );
          this.model.registrationNumber.setValue(
            this.checkFormForNullVals(this.application.activeForm.letterOfGoodStanding.registrationNumber)
          );
          this.model.requested.setValue(
            this.checkFormForNullVals(this.application.activeForm.letterOfGoodStanding.isRequested)
          );
        }
        this.model.regulatoryBody.updateValueAndValidity();
        this.model.registrationNumber.updateValueAndValidity();
        this.model.requested.updateValueAndValidity();
        this.validate();
      });
    this.model.regulatoryBody.valueChanges
      .pipe(debounceTime(50))
      .subscribe(value => {
        this.makeDirty();
        this.validate();
      });
    this.model.registrationNumber.valueChanges
      .pipe(debounceTime(50))
      .subscribe(value => {
        this.makeDirty();
        this.validate();
      });
    this.model.requested.valueChanges
      .pipe(debounceTime(50))
      .subscribe(value => {
        this.makeDirty();
        this.validate();
      });
    this.applicant = this.application.trainee;

    if (this.applicant.isOspap) {
      this.model.hasRegistered.setValue(true);
      this.model.hasRegistered.disable();
    } else {
      if (this.application.activeForm.letterOfGoodStanding.hasRegistered !== undefined) {
        this.model.hasRegistered.setValue(this.application.activeForm.letterOfGoodStanding.hasRegistered);
      }
    }
  }

  private checkFormForNullVals(val) {
    return val !== null ? val : '';
  }

  validate() {
    const messages = [];
    if (!this.model.hasRegistered.disabled && !this.model.hasRegistered.valid) {
      messages.push('You must answer the question to continue');
    }
    if (!this.model.regulatoryBody.valid) {
      messages.push('Please enter the name of the regulatory body');
    }
    if (!this.model.registrationNumber.valid) {
      messages.push('Please enter the registration number');
    }
    if (!this.model.requested.valid) {
      messages.push('Please state whether or not letter of good standing has been requested');
    }
    this.validity$.next({ valid: !messages.length, messages, touched: this.touched });

  
  }
/*
  isDirty() {

    const letter = this.application.activeForm.letterOfGoodStanding;

    if ((!letter.hasRegistered && this.model.hasRegistered.value) ||
    (letter.hasRegistered && !this.model.hasRegistered.value) ) {
      return true;
    }
 
    if (letter.isRequested === undefined && this.model.requested.value) { return true; }
    if (letter.isRequested !== undefined && !this.model.requested.value) { return true; }

    if (
      (letter.registrationNumber || this.model.registrationNumber.value) &&
      letter.registrationNumber !== this.model.registrationNumber.value) {
      return true;
    }
    if (
      (letter.regulatoryBody || this.model.regulatoryBody.value) &&
      letter.regulatoryBody !== this.model.regulatoryBody.value) {
      return true;
    }
    return false;
  }*/

  populateForm() {
    this.application.activeForm.letterOfGoodStanding = {
      hasRegistered: this.model.hasRegistered.value,
      isRequested: this.model.requested.value,
      registrationNumber: this.model.registrationNumber.value,
      regulatoryBody: this.model.regulatoryBody.value
    };
  }
}
