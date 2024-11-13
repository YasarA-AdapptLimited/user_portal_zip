import { Component, forwardRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { PreviousRegistrationType } from '../../model/PreviousRegistrationType';
import { ApplicationProcessType } from '../../model/ApplicationProcessType';
import { PreviousRegs } from '../../model/PreviousRegs';
import {  RegistrantApplicationType } from '../../model/RegApplicationType';
import {  PreRegistrationApplicationType } from '../../model/PreRegApplicationType';
import { UtcDatePickerComponent } from '../../../shared/utcDatePicker.component';

@Component({
  selector: 'app-previous-applications-and-registrations-step',
  templateUrl: './previousApplicationsAndRegistrations.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PreviousApplicationsAndRegistrationsComponent)
    }
  ],
  styleUrls: ['./previousApplicationsAndRegistrations.component.scss']
})
export class PreviousApplicationsAndRegistrationsComponent extends FormStepComponent implements AfterViewInit, OnInit {
  stepId = TechnicianApplicationStep.PreviousApplicationsAndRegistrations;
  title = 'Previous registrations';
  viewReady = false;
  PreviousRegistrationType = PreviousRegistrationType;
  @ViewChild('firstDatePicker') firstDatePicker: UtcDatePickerComponent;
  @ViewChild('secondDatePicker') secondDatePicker: UtcDatePickerComponent;

  hasReducedWorkExperience: boolean;

  constructor(service: FormStepperService) {
    super(service);
  }

  ngOnInit() {
    this.populateForm();
  }

  beforePrev() {
    this.dirty = false;
    return true;
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


  update() {
    const { undertaken: hasUndertaken } = this.application.activeForm.previousApplicationsAndRegistrations.
      applications.preRegistrationTraining;
    const { applied: hasApplied } = this.application.activeForm.previousApplicationsAndRegistrations.
      applications.registration;
    if (!hasUndertaken) {
      this.secondDatePicker.setDateToUndefined();
    }
    if (!hasApplied) {
      this.firstDatePicker.setDateToUndefined();
    }

    this.makeDirty();
    this.validate();
  }

  nullifyDetail(prevAppAndRegDetail: PreviousRegs |
    RegistrantApplicationType | PreRegistrationApplicationType, confirmed: string) {
    for (const prop in prevAppAndRegDetail) {
      if (prop !== confirmed && prop !== 'type') {
        prevAppAndRegDetail[prop] = null;
      }
    }
  }

  isAnswerValid(answer) {
    return (answer || !answer) && (answer !== null) && (answer !== undefined);
  }

  get isFirstQDetailValid() {
    const registration = this.application.activeForm.previousApplicationsAndRegistrations.applications.registration;
    const { type: hasType} = registration;
    return !!hasType;
  }

  get isSecondQDetailValid() {
    return true;
  }

  get isThirdQDetailValid() {
    const firstRegistration = this.application.activeForm.previousApplicationsAndRegistrations.ukRegistration;
    const { registrationNumber: hasRegNumber, nameOfBody: hasNameOfBody, wasCertificateRequested: wasCertReq } = firstRegistration;
    return !!hasNameOfBody;
  }

  get isThirdConfirmed() {
    const firstRegistration = this.application.activeForm.previousApplicationsAndRegistrations.ukRegistration;
    const { wasCertificateRequested: wasCertReq } = firstRegistration;
    return !!wasCertReq;
  }


  get isFourthQNameOfBodyEntered() {
    const secondRegistration = this.application.activeForm.previousApplicationsAndRegistrations.outsideUKRegistration;
    const { registrationNumber: hasRegNumber, nameOfBody: hasNameOfBody, wasCertificateRequested: wasCertReq } = secondRegistration;
    return !!hasNameOfBody ;
  }

  get isFourthQConfirmed() {
    const secondRegistration = this.application.activeForm.previousApplicationsAndRegistrations.outsideUKRegistration;
    const { registrationNumber: hasRegNumber, nameOfBody: hasNameOfBody, wasCertificateRequested: wasCertReq } = secondRegistration;
    return !!wasCertReq;
  }



  validate() {
    const messages = [];
    // this is just validating that there is an answer, not what the answer is
    // console.log(this.application);

    const { applied: hasApplied } = this.application.activeForm.previousApplicationsAndRegistrations.applications.registration;
    const { undertaken: hasUndertaken } = this.application.activeForm.previousApplicationsAndRegistrations.applications.
      preRegistrationTraining;
    const { registered: hasRegisteredInUk } = this.application.activeForm.previousApplicationsAndRegistrations.ukRegistration;
    const { registered: hasRegisteredOutsideUK } = this.application.activeForm.previousApplicationsAndRegistrations.outsideUKRegistration;

    const firstQValid = this.isAnswerValid(hasApplied);
    const secondQValid = this.isAnswerValid(hasUndertaken);
    const thirdQValid = this.isAnswerValid(hasRegisteredInUk);
    const fourthQValid = this.isAnswerValid(hasRegisteredOutsideUK);

    const invalid = !firstQValid || !secondQValid || !thirdQValid || !fourthQValid;


    if (invalid) {
      messages.push(`These fields are mandatory`);
    }


    if (firstQValid) {

      if (hasApplied && !this.isFirstQDetailValid) {
        messages.push(`Please indicate what type of application you have previously applied for.`);
      }

      if (!hasApplied) {
        this.nullifyDetail(this.application.activeForm.
          previousApplicationsAndRegistrations.
          applications.registration, 'applied');
      }
    }


    if (secondQValid) {
      if (hasUndertaken && !this.isSecondQDetailValid) {
        messages.push(`Please put in the required detail for the second question`);
      }

      if (hasUndertaken && this.application.activeForm.
        previousApplicationsAndRegistrations.
        applications.preRegistrationTraining.startDate === '') {
          this.application.activeForm.
          previousApplicationsAndRegistrations.
          applications.preRegistrationTraining.startDate = null;
      }

      if (!hasUndertaken) {
        this.nullifyDetail(this.application.activeForm.
          previousApplicationsAndRegistrations.
          applications.preRegistrationTraining, 'undertaken');
      }
    }




    if (thirdQValid) {
      if (hasRegisteredInUk && !this.isThirdQDetailValid) {
        messages.push(`Please provide the required details for the overseas health regulatory body`);
      }

      if (hasRegisteredInUk && !this.isThirdConfirmed) {
        messages.push(`Please confirm that you have, or will request a certificate of current professional status from your regulatory body`);
      }

      if (!hasRegisteredInUk) {
        this.nullifyDetail(this.application.activeForm.
          previousApplicationsAndRegistrations.ukRegistration, 'registered');
      }

    }



    if (fourthQValid) {
      if (hasRegisteredOutsideUK && !this.isFourthQNameOfBodyEntered) {
        messages.push(`Please provide the required details for the overseas health regulatory body`);
      }

      if (hasRegisteredOutsideUK && !this.isFourthQConfirmed) {
        messages.push(`Please confirm that you have, or will request a certificate of current professional status from your regulatory body`);
      }


      if (!hasRegisteredOutsideUK) {
        this.nullifyDetail(this.application.activeForm.previousApplicationsAndRegistrations.outsideUKRegistration, 'registered');
      }
    }
    this.validity$.next({ valid: !messages.length, messages, touched: this.touched });
  }

  populateForm() {
    this.hasReducedWorkExperience = this.application.activeForm.applicationType === ApplicationProcessType.LessThanTwoYears;
  }


}

