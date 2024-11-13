import { Component, forwardRef, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ReturnToRegisterStep } from '../../../../registration/return-to-register/model/ReturnToRegisterStep';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { UploadType } from '../../../../shared/model/UploadType';
import { AttachmentType } from '../../../../shared/model/AttachmentType';
import utils from '../../../../shared/service/utils';
import { ReturnToRegisterApplication } from '../../model/ReturnToRegister';
import { EnglishQualificationType, RegistrationDetails, RegistrationRoute, ReturnToRegisterDetails } from '../../model/ReturnToRegisterDetails';
import { RegistrantStatus } from '../../../model/RegistrantStatus';
import { AnnotationType } from '../../../../registration/model/AnnotationType';
import { FileUploadComponent } from '../../../../shared/fileUpload.component';


@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => RegistrationDetailsComponent)
    }    
  ]
})
export class RegistrationDetailsComponent extends FormStepComponent implements OnInit {
  title = 'Details of previous registration';
  @Input() application : ReturnToRegisterApplication;
  @Input() touched = false;
  stepId = ReturnToRegisterStep.RegistrationDetails;
  @ViewChild('ielts') ieltsFileUpload : FileUploadComponent;
  @ViewChild('employerRef') employerRefFileUpload : FileUploadComponent;
  @ViewChild(FileUploadComponent) fileUploadComponent;
  details: RegistrationDetails;
  returnToRegisterDetails: ReturnToRegisterDetails;
  attachments = [];
  IELTSAttachment = [];
  employerRefAttachment = [];  
  registrationStatus;
  isEnglishCertificateRequired = true;
  englishQualificationType;
  qualificationTypes = [
    {name: 'IELTS certificate', val: EnglishQualificationType.IELTS},
    {name: 'OET candidate number', val:EnglishQualificationType.OET},
    {name: 'Employer reference', val:EnglishQualificationType.EmployerReference}
  ];
  previousAnnotation;
  registrationRoute;
  deleteUrl = 'v1.0/pharmacistform/attachment';
  attachmentType = AttachmentType;
  type: AttachmentType;
  uploadType = UploadType.ReturnToRegisterSupportingDocuments;
  sessionId = utils.guid();
  valid = true;
  deleteUrl1;
  deleteUrl2;

  constructor(private formStepperService: FormStepperService,
    private cd: ChangeDetectorRef) { 
    super(formStepperService);
  }

  ngOnInit(): void {
    this.details = this.application.personalDetails.registration;
    this.returnToRegisterDetails = this.application.form.returnToRegisterDetail;
    if(this.details) {
      this.registrationStatus = this.details.registrationStatus ? RegistrantStatus[this.details.registrationStatus] : '-';    
      this.registrationRoute = this.details.registrationRoute ? RegistrationRoute[this.details.registrationRoute] : '-' ;
      this.setAnnotation();      
      this.isEnglishCertificateRequired = !!this.details.isRequiredEnglishCertificate;
    }
    if(this.returnToRegisterDetails) {
      this.englishQualificationType = this.returnToRegisterDetails.englishCertificateOption;
    }
    this.attachments = this.application.form.attachments ? this.application.form.attachments : [];
    this.getAttachment();    
  }

  setAnnotation() {
    if(this.details.independentPrescriberStatus) {
        if(this.details.independentPrescriberStatus === AnnotationType.IndependentAndSupplementary || 
          this.details.independentPrescriberStatus === AnnotationType.Independent) {
          this.previousAnnotation = 'Independent prescriber'
        }
        if(this.details.independentPrescriberStatus === AnnotationType.Supplementary) {
          this.previousAnnotation = 'Supplementary prescriber'
        }
      }
    else {
      this.previousAnnotation = '-';
    }
  }

  getAttachment() {            
    if(this.application.form && this.application.form.attachments) {
      if(this.returnToRegisterDetails.englishCertificateOption && 
        !this.isEnglishCertificationTypeOET) {
        this.attachments.forEach((item, index) => {
          if(item.type === AttachmentType.IELTSCertificate) {
            this.deleteUrl1 = item.deleteUrl;
            this.IELTSAttachment.push(item);            
          }
          if(item.type === AttachmentType.EmployerReferenceForEnglishCertificate) {
            this.deleteUrl2 = item.deleteUrl;
            this.employerRefAttachment.push(item);            
          }          
        });
      }
    }
  }

  onLangQualTypeChange(val) {
    this.application.form.returnToRegisterDetail.englishCertificateOption = val;    
    this.propagate();    
  }

  get isEnglishCertificationTypeOET() {
    return this.englishQualificationType === EnglishQualificationType.OET;
  }

  get isEnglishCertificationTypeIELTS() {
    return this.englishQualificationType === EnglishQualificationType.IELTS;
  }

  get isEnglishCertificationTypeReference() {
    return this.englishQualificationType === EnglishQualificationType.EmployerReference;
  }

  get getIELTSCertificate() {
    return this.IELTSAttachment[0] ? this.IELTSAttachment[0] : null;
  }

  get getEmployerRefDoc() {
    return this.employerRefAttachment[0] ? this.employerRefAttachment[0] : null;
  }

  populateForm() {
    this.updateAttachments();    
  }

  updateAttachments() {
    let index, type, doc;
    if(this.isEnglishCertificationTypeOET) {
      return;
    }
    if(this.isEnglishCertificationTypeIELTS) {     
      type = AttachmentType.IELTSCertificate;
      doc = this.getIELTSCertificate;
    }
    if(this.isEnglishCertificationTypeReference) {     
      type = AttachmentType.EmployerReferenceForEnglishCertificate;    
      doc = this.getEmployerRefDoc;  
    }
    index = this.attachments.findIndex(item => item.type === AttachmentType.IELTSCertificate);
    if( index >= 0) {
      this.attachments.splice(index, 1);
    }
    index = this.attachments.findIndex(item => item.type === AttachmentType.EmployerReferenceForEnglishCertificate);
    if( index >= 0) {
      this.attachments.splice(index, 1);
    }
    if(doc) {
      this.attachments.push(doc);
    }    
  }

  validate() {
    let messages = [];

    if(this.isEnglishCertificateRequired) {
      if(this.englishQualificationType) {
        if(this.englishQualificationType === EnglishQualificationType.OET) {
          if(!this.returnToRegisterDetails.oetCandidateNo) {
            messages.push('Please enter OET candidate number');
          }
          if(!this.returnToRegisterDetails.confirmAccessOETPortal) {
                messages.push('Please select the checkbox');
          }
        }

        if(this.englishQualificationType !== EnglishQualificationType.OET) {
          if((this.englishQualificationType === EnglishQualificationType.IELTS && (!this.IELTSAttachment || this.IELTSAttachment.length === 0)) ||
          (this.englishQualificationType === EnglishQualificationType.EmployerReference && (!this.employerRefAttachment || this.employerRefAttachment.length === 0)) ){
            messages.push('Please upload a document as evidence of your English language competency');
          }
        }
      } else {
          messages.push('Please select from either: IELTS certification, OET candidate number or Employer reference');      
      }
    }      
    this.valid = messages.length === 0;
    this.validity$.next({ valid: this.valid, messages , touched: this.touched });
  }

  getDocIndex(arr, type): number {
    let index = arr.findIndex(item => item.type);
    return index;
  }

  onDocUpload(val) {
    this.IELTSAttachment.splice(0, this.IELTSAttachment.length);
    this.employerRefAttachment.splice(0, this.employerRefAttachment.length);
    if(!val || val.length === 0) {
      return;
    }
    if(this.isEnglishCertificationTypeIELTS) {      
      this.IELTSAttachment.push(val[0]);
      this.IELTSAttachment[0].type = AttachmentType.IELTSCertificate;
      this.deleteUrl1 = this.IELTSAttachment[0].deleteUrl; 
    }
    if(this.isEnglishCertificationTypeReference) {            
      this.employerRefAttachment.push(val[0]);
      this.employerRefAttachment[0].type = AttachmentType.EmployerReferenceForEnglishCertificate;      
      this.deleteUrl2 = this.employerRefAttachment[0].deleteUrl;
    }
    this.application.form.returnToRegisterDetail.oetCandidateNo = null;
    this.application.form.returnToRegisterDetail.confirmAccessOETPortal = null;    
    this.cd.detectChanges();
    this.validate();
  }

  onDocDelete(val) {
    if(this.isEnglishCertificationTypeIELTS) {
      this.IELTSAttachment.splice(0, this.IELTSAttachment.length);
    }
    if(this.isEnglishCertificationTypeReference) {
      this.employerRefAttachment.splice(0, this.employerRefAttachment.length);
    } 
  }

  onOETNumberChange(event) {
    if(event.target.value && event.target.value.trim().length > 0) {
      this.IELTSAttachment.splice(0, this.IELTSAttachment.length);
      this.employerRefAttachment.splice(0, this.employerRefAttachment.length);
    }
  }

  propagate() {   
    this.validate();
  }

}
