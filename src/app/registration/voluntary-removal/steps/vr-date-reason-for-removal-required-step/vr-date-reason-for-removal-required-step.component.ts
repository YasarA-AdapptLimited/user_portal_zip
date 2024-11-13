import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApplicationStatus } from '../../../../technician/model/ApplicationStatus';
import { AuthService } from '../../../../core/service/auth.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { VoluntaryRemovalApplication } from '../../model/VoluntaryRemovalApplication';
import { VoluntaryRemovalApplicationStep } from '../../model/VoluntaryRemovalApplicationStep';
import { VoluntaryRemovalDetails } from '../../model/VoluntaryRemovalDetails';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';

@Component({
  selector: 'app-vr-date-reason-for-removal-required-step',
  templateUrl: './vr-date-reason-for-removal-required-step.component.html',
  styleUrls: ['./vr-date-reason-for-removal-required-step.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => VrDateReasonForRemovalRequiredStepComponent)
    }
  ]
})
export class VrDateReasonForRemovalRequiredStepComponent extends FormStepComponent implements OnInit {

  @Input() application: VoluntaryRemovalApplication;
  @ViewChild('form') form: NgForm;
  title;
  @Input() SIdetails: {
    endDate: string;
    ownerName: string;
    ownerNumber: string;
    startDate: string;
  }
  @Input() set stepTitle(value: string) {
    this.title = value;
  };
  stepId = VoluntaryRemovalApplicationStep.DateReasonForRemovalRequired;
  valid;  
  minDate = new Date(new Date().setDate(new Date().getDate() + 1));
  expiryDate: string;
  voluntaryRemovalDetails: VoluntaryRemovalDetails;
  @Output() isPendingFeeZero = new EventEmitter();  

  reasons: string[] = [
    'Retirement',
    'Moving abroad',
    'Career break',
    'Health',
    'Maternity/Paternity/Parental leave',
    'Personal',
    'Profession change',
    'Revalidation',
    'Other',
    'Prefer not to say'
  ];

  constructor(formStpperService: FormStepperService, private auth: AuthService,
    private vrService: VoluntaryRemovalService) { 
    super(formStpperService);
  }

  ngOnInit(): void {
    this.expiryDate = this.auth.user.registrant.expiryDate;
    this.voluntaryRemovalDetails = this.application.activeForm.voluntaryRemovalDetails;
    if(this.voluntaryRemovalDetails) {
      this.voluntaryRemovalDetails.dateOfRegistryRemoval = this.voluntaryRemovalDetails.dateOfRegistryRemoval ?
                                          this.voluntaryRemovalDetails.dateOfRegistryRemoval : this.expiryDate;
    }

    if(this.application.activeForm.formStatus === ApplicationStatus.NotStarted) {
      this.application.activeForm.formStatus = ApplicationStatus.InProgress;
    }
  }

  validate() {
    let messages = [];
    let isDateValid = true;
    if(this.voluntaryRemovalDetails.dateOfRegistryRemoval && (new Date(this.voluntaryRemovalDetails.dateOfRegistryRemoval).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0))) {
      isDateValid = false;
    }

    this.valid = !!this.voluntaryRemovalDetails.dateOfRegistryRemoval && isDateValid &&
                 !!this.voluntaryRemovalDetails.reasonForRemoval;

    if(this.voluntaryRemovalDetails.reasonForRemovalDetails && this.voluntaryRemovalDetails.reasonForRemovalDetails.length > 2000) {
      this.valid = false
    }

    if(!isDateValid) {
      messages.push('Please enter a valid date');
    }
    if(!this.voluntaryRemovalDetails.dateOfRegistryRemoval) {
      messages.push('Please provide the date you would like to be removed from the register ');
    }
    if(!this.voluntaryRemovalDetails.reasonForRemoval) {
      messages.push('Please provide the reason you would like to be removed from the register ');
    }
    this.validity$.next({ valid: this.valid, messages , touched: this.touched });
  }

  dateChange() {
    this.isPendingFeeZero.emit(this.vrService.isOutstandingPaymentZero(this.expiryDate, this.voluntaryRemovalDetails.dateOfRegistryRemoval, this.application.pendingFee));    
    this.validate();
  }

  onReasonChange() {
    this.voluntaryRemovalDetails.reasonForRemovalDetails = '';
    this.validate();
  }

  populateForm() {}

}
