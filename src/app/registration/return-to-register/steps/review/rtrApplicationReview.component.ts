import { Input, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RegistrantStatus } from '../../../../registration/model/RegistrantStatus';
import { ReturnToRegisterService } from '../../../../core/service/returnToRegister.service';
import { ReturnToRegisterApplication } from '../../model/ReturnToRegister';
import { EnglishQualificationType, RegistrationRoute } from '../../model/ReturnToRegisterDetails';
import { ReturnToRegisterStep, ReturnToRegisterStepWithoutRevalidationOutstanding } from '../../model/ReturnToRegisterStep';

@Component({
  selector: 'app-rtr-application-review',
  templateUrl: './rtrApplicationReview.component.html',
  styleUrls: ['./rtrApplicationReview.scss']
}) export class RtrApplicationReviewComponent  implements OnInit {

  applicant;
  @Input() application: ReturnToRegisterApplication;
  @Input() readonly = false;
  @Input() showEdi = true;
  @Input() formId;
  @Input() pastApplication = false;
  rtrApplicationStep ;
  registrantFullName: string;
  
  registration;
  contactType;
  independentPrescriberStatus;
  isRequiredEnglishCertificate=false
  isRequiredRevalidationSubmission=false
  registrationNumber;
  registrationRoute;
  registrationStatus;
  voluntaryRemovalReason;
  
  letterOfGoodStanding
  registrationNumberwithTheOrganisation
  hasRegistered=false
  isRequested=false
  regulatoryBody=""

  q8Title="Question 8";
  q9Title="Question 9";
  
  englishCertificateOption;
  
  constructor(private rtrService: ReturnToRegisterService) {
    
  }

  @Output() navigate = new EventEmitter<number>();
  ngOnInit() {
     this.applicant = this.application.personalDetails;
     this.registration=this.application.personalDetails.registration;
     this.letterOfGoodStanding=this.application.activeForm.letterOfGoodStanding

     if(this.registration){
      this.registrationNumber = this.registration.registrationNumber;      
      this.registrationRoute = RegistrationRoute[this.registration.registrationRoute] || "-";
      this.registrationStatus =RegistrantStatus[this.registration.registrationStatus] || "-";
      this.voluntaryRemovalReason =this.registration.voluntaryRemovalReason || "-";
     }

     if(this.letterOfGoodStanding){
      this.hasRegistered=this.letterOfGoodStanding.hasRegistered
      this.isRequested=this.letterOfGoodStanding.isRequested
      this.regulatoryBody=this.letterOfGoodStanding.regulatoryBody
      this.registrationNumberwithTheOrganisation= this.letterOfGoodStanding.registrationNumber
     }

     this.rtrApplicationStep=this.application.personalDetails.registration.isRequiredRevalidationSubmission ? ReturnToRegisterStep : ReturnToRegisterStepWithoutRevalidationOutstanding;

     if (this.applicant) {
      this.registrantFullName = [this.applicant?.title?.name,this.applicant.forenames, this.applicant.middleName, this.applicant.surname].filter(Boolean).join(' ');
    }
    
     this.englishCertificateOption=EnglishQualificationType[this.application.activeForm?.returnToRegisterDetail?.englishCertificateOption] ||"-";
   
    
  }

  get isRouteEEA(): boolean {
    return this.registration.registrationRoute === RegistrationRoute.EEA;
  }


  goToStep(stepId) {    
        this.navigate.emit(stepId);
  }
}
