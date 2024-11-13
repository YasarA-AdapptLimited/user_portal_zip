import { Component, forwardRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Applicant } from '../../../../account/model/Applicant';
import { Tooltip } from '../../../../core/tooltip/Tooltip';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';

@Component({
  selector: 'app-letter-of-good-standing',
  templateUrl: './letter-of-good-standing.component.html',
  styleUrls: ['./letter-of-good-standing.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => LetterOfGoodStandingComponent)
    }
  ]
})
export class LetterOfGoodStandingComponent extends FormStepComponent implements OnInit {
  showDetailsHelp = false;
  applicant: Applicant;
  stepId = ReturnToRegisterStep.LetterOfGoodStanding;
  title = 'Letter of good standing';
  hasRegistered:boolean
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };

  model = {
    hasRegistered: new FormControl<boolean | null>(undefined, {
      validators: Validators.required
    }),
    regulatoryBody: new FormControl<string | null>(undefined),
    registrationNumber: new FormControl<string | null>(undefined),
    requested: new FormControl<boolean | null>(undefined)
  };

  constructor(service: FormStepperService) {
    super(service);
  }

  ngOnInit() {
    this.hasRegistered=this.application.activeForm.letterOfGoodStanding.hasRegistered;
    if(this.hasRegistered)
    {
      this.model.regulatoryBody.setValue(
        this.checkFormForNullVals(this.application.activeForm.letterOfGoodStanding?.regulatoryBody)
      );
      this.model.registrationNumber.setValue(
        this.checkFormForNullVals(this.application.activeForm.letterOfGoodStanding?.registrationNumber)
      );
      this.model.requested.setValue(
        this.checkFormForNullVals(this.application.activeForm.letterOfGoodStanding?.isRequested)
      );
    }
    this.model.hasRegistered.valueChanges
      .pipe(debounceTime(50))
      .subscribe(value => {
        this.makeDirty();
        if (value === false) {
          this.hasRegistered=false;
          this.model.regulatoryBody.clearValidators();
          this.model.registrationNumber.clearValidators();
          this.model.requested.clearValidators();
          this.model.regulatoryBody.setValue(null);
          this.model.registrationNumber.setValue(null);
          this.model.requested.setValue(null);
        } else if (value === true) {
          this.hasRegistered=true;
          this.model.regulatoryBody.setValidators(Validators.required);
          this.model.registrationNumber.setValidators(Validators.required);
          this.model.requested.setValidators(Validators.required);
          this.model.regulatoryBody.setValue(
            this.checkFormForNullVals(this.application.form.letterOfGoodStanding?.regulatoryBody)
          );
          this.model.registrationNumber.setValue(
            this.checkFormForNullVals(this.application.form.letterOfGoodStanding?.registrationNumber)
          );
          this.model.requested.setValue(
            this.checkFormForNullVals(this.application.form.letterOfGoodStanding?.isRequested)
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


  populateForm() {
    this.application.activeForm.letterOfGoodStanding = {
      hasRegistered: this.model.hasRegistered.value,
      isRequested: this.model.requested.value,
      registrationNumber: this.model.registrationNumber.value,
      regulatoryBody: this.model.regulatoryBody.value
    };
  }

}
