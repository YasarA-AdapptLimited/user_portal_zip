import { OnInit, Component, forwardRef, ViewChild, AfterViewInit } from '@angular/core';
import { Applicant } from '../../account/model/Applicant';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { ContactEditComponent } from '../../account/contactEdit.component';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../core/tooltip/Tooltip';
import { PreregApplication } from '../../shared/model/student/PreregApplication';
import { AddressEditComponent } from '../../account/addressEdit.component';
import { inputValidator, UK } from '../../shared/user-address/userAddress';

@Component({
  selector: 'app-personal-details-step',
  templateUrl: './personalDetailsStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PersonalDetailsStepComponent)
    }
  ]
}) export class PersonalDetailsStepComponent extends FormStepComponent implements OnInit, AfterViewInit {

  showDetailsHelp = false;
  showContactHelp = false;
  applicant: Applicant;
  contactValid;
  hasAddress;
  hasTitle;
  hasNationality;
  selection;
  title = 'Personal details';
  stepId = PreregApplicationStep.PersonalDetails;
  viewReady = false;
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

  @ViewChild('contact') contact: ContactEditComponent;
  ngOnInit() {
    this.applicant = this.application.trainee;
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
    this.makeDirty();
    this.validate();
  }

  validate() {
    this.hasTitle = !!this.applicant.title && !!this.applicant.title.name && !!this.applicant.title.name.trim().length;
    this.hasAddress = !!this.applicant.address &&
      !!this.applicant.address.line1 && !!this.applicant.address.line1.trim().length && inputValidator(this.applicant.address.line1) &&
      !!this.applicant.address.town && !!this.applicant.address.town.trim().length && inputValidator(this.applicant.address.town) &&
      !!this.applicant.address.country && !!this.applicant.address.country.trim().length;

      if(this.applicant?.address?.line2) {
        this.hasAddress = this.hasAddress && inputValidator(this.applicant.address.line2);
      }
  
      if(this.applicant?.address?.line3) {
        this.hasAddress = this.hasAddress && inputValidator(this.applicant.address.line3);
      }
  
      if(this.applicant?.address?.postcode) {
        this.hasAddress = this.hasAddress && inputValidator(this.applicant.address.postcode);
      }
  
      if(this.applicant?.address?.county) {
        this.hasAddress = this.hasAddress && inputValidator(this.applicant.address.county);
      }
      
      if(this.applicant.address && this.applicant.address.country && 
        this.applicant.address.country === UK &&
        !this.applicant.address.homeNation) {
        this.hasAddress = this.hasAddress && !!this.applicant.address.homeNation;
      }
  
    const messages = [];
    if (!this.hasTitle) {
      messages.push('You haven\'t entered a title');
    }

    if (this.contact) {
      this.contactValid = this.contact.valid;
      if (!this.contactValid) {
        messages.push('Please enter a UK mobile phone number');
        messages.push('Please check that the UK mobile phone number you have entered is correct');
      }
    }
    this.applicant.equalityDiversity.nationality = parseInt(<any>(this.applicant.equalityDiversity.nationality), 10);
    this.hasNationality = !!this.applicant.equalityDiversity.nationality;
    if (!this.hasNationality) {
      messages.push('You haven\'t selected your nationality');
    }

    if (!this.hasAddress) {
      if (!this.applicant.address) {
        messages.push('You haven\'t provided your address');
      } else if(this.applicant.address.country === UK) {
        messages.push('Your address must have a line 1, town, country and residence details');
      } else {
        messages.push('Your address must have a line 1, town and country');
      }
    }
    const valid = this.hasTitle &&
      this.hasAddress &&
      this.contactValid &&
      this.hasNationality;

    this.validity$.next({
      valid,
      messages, touched: this.touched
    });
  }

  populateForm() { }

}
