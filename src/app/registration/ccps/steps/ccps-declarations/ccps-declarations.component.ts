import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { CCPSApplicationStep } from '../../model/ccpsApplicationStep';
import { RegistrantStatus } from '../../../../../app/registration/model/RegistrantStatus';

@Component({
  selector: 'app-ccps-declarations',
  templateUrl: './ccps-declarations.component.html',
  styleUrls: ['./ccps-declarations.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => CcpsDeclarationsComponent)
    }
  ]
})
export class CcpsDeclarationsComponent extends FormStepComponent implements OnInit {

  title = 'CCPS Declarations';
  stepId = CCPSApplicationStep.CCPSDeclarations;
  @Input() application;
  touched;
  viewReady = false;
  isRegisteredOrSuspended:boolean;
  registrationStatus:any;
  constructor(formStpperService: FormStepperService) {
    super(formStpperService);
   }

  ngOnInit(): void {
    this.registrationStatus=this.application.personalDetails.registration.registrationStatus;
    this.ready$.next(true);
  }
  update() {
    this.application.activeForm.appDeclaration.isQ1Confirmed=this.application.activeForm.appDeclaration.isQ1Confirmed===true ? true : false;
      this.application.activeForm.appDeclaration.isQ2Confirmed=this.application.activeForm.appDeclaration.isQ2Confirmed===true ? true : false;
      this.application.activeForm.appDeclaration.isQ3Confirmed=this.application.activeForm.appDeclaration.isQ3Confirmed===true ? true : false;
      this.application.activeForm.appDeclaration.isQ4Confirmed=this.application.activeForm.appDeclaration.isQ4Confirmed===true ? true : false;
      this.application.activeForm.appDeclaration.isQ5Confirmed=this.application.activeForm.appDeclaration.isQ5Confirmed===true ? true : false;
    this.makeDirty();
    this.validate();
  }

  populateForm() { }  
  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
      this.viewReady = true;
    });
  }

  get isRegistered() {
    return this.registrationStatus===RegistrantStatus.Registered;
  }

  validate() {
    const {
      isQ1Confirmed, isQ2Confirmed, isQ3Confirmed, isQ4Confirmed, isQ5Confirmed
    } = this.application.activeForm.appDeclaration;
    const isOverallDeclarationAcknowledged = this.application.activeForm.isOverallDeclarationAcknowledged;

    let messages = [];
    if(this.isRegistered){
      if (!isQ1Confirmed) {
        messages.push('You have not confirmed the 1st declaration');
      }
      if (!isQ2Confirmed) {
        messages.push('You have not confirmed the 2nd declaration');
      }
      if (!isQ3Confirmed) {
        messages.push('You have not confirmed the 3rd declaration');
      }
      if (!isQ4Confirmed) {
        messages.push('You have not confirmed the 4th declaration');
      }
      if (!isQ5Confirmed) {
        messages.push('You have not confirmed the 5th declaration');
      }
      if (!isOverallDeclarationAcknowledged) {
        messages.push('You have to complete over all declaration');
      }
    }else{
      if (!isQ1Confirmed) {
        messages.push('You have not confirmed the 1st declaration');
      }
      if (!isQ5Confirmed) {
        messages.push('You have not confirmed the 2nd declaration');
      }
      if (!isOverallDeclarationAcknowledged) {
        messages.push('You have to complete over all declaration');
      }
    }    
    this.validity$.next({ valid: messages.length === 0, messages, touched: this.touched });
  }
}
