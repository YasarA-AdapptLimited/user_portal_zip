import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';

import { RegistrationDetailsComponent } from './registration-details.component';
import { ChangeDetectorRef } from '@angular/core';
import { EnglishQualificationType } from '../../model/ReturnToRegisterDetails';

describe('RegistrationDetailsComponent', () => {
  let component: RegistrationDetailsComponent;
  let fixture: ComponentFixture<RegistrationDetailsComponent>;
  let MockChangeDetection, MockformStepperService;

  let application = {
    form: {
      isOverallDeclarationAcknowledged: true,
      returnToRegisterDetail: {
          confirmUserNameChange: false,
          title: {
              name: 'Mr',
              id: 123456
          },
          forenames: 'XXX',
          surname: 'YYY',
          middleName: null,
          englishCertificateOption: null,
          oetCandidateNo: null,
          confirmAccessOETPortal: null,
          hasConfirmedRevalidationSubmission: null
      },
      letterOfGoodStanding: {
          regulatoryBody: 'Org Name',
          registrationNumber: '123456',
          isRequested: true,
          hasRegistered: true
      },
      appDeclaration: {
          isQ1Confirmed: true,
          isQ2Confirmed: true,
          isQ3Confirmed: true
      },
      equalityDiversity: {
          ethnicity: 717750011,
          ethnicityOther: '',
          nationality: null,
          religion: 717750003,
          religionOther: '',
          disabled: 717750001,
          disabilityDetails: '',
          gender: 1,
          sexualOrientation: 981360000
      },            
      restorationDeclarations: [
          {
              questionName: 'Q10',
              isRegistered: false,
              isInvestigated: null,
              caseReferenceNo: null,
              investigationDate: null,
              titleUsed: null,
              employerName: null,
              howWhereUsedIt: null,
              employerAddress: null,
              titleUsedFrom: null,
              titleUsedUntil: null
          },
          {
              questionName: 'Q11',
              isRegistered: false,
              isInvestigated: null,
              caseReferenceNo: null,
              investigationDate: null,
              titleUsed: null,
              employerName: null,
              howWhereUsedIt: null,
              employerAddress: null,
              titleUsedFrom: null,
              titleUsedUntil: null
          }
      ],
      isRestorationFeePaymentAvailable: false,
      id: 'af5e08a0',
      formStatus: 2,
      step: 11,
      scope: 8,
      attachments: [
          {
              fileId: '8f7c5d32',
              expiryDate: null,
              type: 14,
              filename: 'New PDF - Copy.pdf',
              filesize: 0,
              deleteUrl: 'v1/form/attachment/8f7c5d32',
              downloadUrl: 'v1/EvidenceOfNameChangeDocumment/files/8f7c5d32',
              title: null,
              certifier: {
                  name: null,
                  companyName: null,
                  type: null,
                  number: null,
                  date: null
              },
              isDuplicateCopy: false
          }
      ],
      countersignatures: [],
      createdAt: '2022-11-30T06:16:11.453',
      dateApplicationSubmitted: null
  },
  personalDetails: {
      title: {
          name: 'Mr',
          id: 717750001
      },
      forenames: '8WJMM40ZWU14XO',
      surname: '8WJMM4',
      middleName: null,
      dateOfBirth: '1943-09-06T00:00:00',
      address: {
          line1: '8WJMM40ZWU14XO6CKUG6',
          line2: '8WJMM40ZWU14X',
          line3: null,
          town: '8WJMM40',
          county: '8WJMM40ZWU1',
          postcode: '8WJMM40',
          country: '8W',
          homeNation: 717750002,
          latitude: null,
          longitude: null,
          countryCode: null
      },
      contact: {
          email: 'test@test.com',
          telephone1: 'telephone1',
          mobilePhone: null
      },
      registration: {
          registrationNumber: '123321',
          registrationStatus: 717750011,
          independentPrescriberStatus: 0,
          voluntaryRemovalReason: null,
          registrationRoute: null,
          contactType: 717750000,
          isRequiredEnglishCertificate: false,
          isRequiredRevalidationSubmission: true
      }
  },
  returnToRegisterApplicationFeeCode: 'VRRA',
  returnToRegisterApplicationFeeAmount: 144.00,
  restorationToRegisterFeeCode: '121',
  restorationToRegisterFeeAmount: 106.00
  }

  let attachment  = {
    fileId: '8f7c5d32a',
    expiryDate: null,
    type: 14,
    filename: 'New PDF - Copy.pdf',
    filesize: 0,
    deleteUrl: 'v1/form/attachment/f607404b7d60',
    downloadUrl: 'v1/doc/files/f607404b7d60',
    title: null,
    certifier: {
        name: null,
        companyName: null,
        type: null,
        number: null,
        date: null
    },
    isDuplicateCopy: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationDetailsComponent ],
      providers: [ { provide: ChangeDetectorRef, useValue: MockChangeDetection},
                   { provide: FormStepperService , useValue: MockformStepperService}]      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationDetailsComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('annotation is set as none if independentPrescriberStatus resceived is 0', () => {
    component.application.personalDetails.registration.independentPrescriberStatus = 0;
    component.setAnnotation();
    expect(component.previousAnnotation).toBe('-');
  });

  it('annotation is set as none if independentPrescriberStatus resceived is 1', () => {
    component.application.personalDetails.registration.independentPrescriberStatus = 3;
    let status = 'IndependentAndSupplementary';
    component.setAnnotation();
    expect(component.previousAnnotation).toBe(status);
  });

  it('on "language certification" type change, update englisgCertificationOption', () => {
    let propogateSpy: jasmine.Spy = spyOn(component,'propagate');
    component.onLangQualTypeChange(1);
    expect(component.application.form.returnToRegisterDetail.englishCertificateOption).toBe(1);
  });

  it('isEnglishCertificationTypeOET returns true if englishQualificationType is OET', () =>{
    component.englishQualificationType = EnglishQualificationType.OET;
    expect(component.isEnglishCertificationTypeOET).toBeTrue();
  });

  it('isEnglishCertificationTypeIELTS returns true if englishQualificationType is IELTS', () =>{
    component.englishQualificationType = EnglishQualificationType.IELTS;
    expect(component.isEnglishCertificationTypeIELTS).toBeTrue();
  });

  it('isEnglishCertificationTypeReference returns true if englishQualificationType is EmployerReference', () =>{
    component.englishQualificationType = EnglishQualificationType.EmployerReference;
    expect(component.isEnglishCertificationTypeReference).toBeTrue();
  });

  it('update attachments just before load of next step - IELTS document uploaded', () => {
    component.IELTSAttachment[0] = attachment;
    component.englishQualificationType  = EnglishQualificationType.IELTS;
    component.populateForm();
    expect(component.attachments.length).toBeDefined();
  });

  it('on document upload, validate -  - IELTS document uploaded', () => {    
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    component.isEnglishCertificateRequired = true;
    component.englishQualificationType  = EnglishQualificationType.IELTS;
    component.onDocUpload([attachment]);
    expect(validity$spy).toHaveBeenCalledWith({ valid: true, messages:[], touched: false });
  });

  it('update on document delete  - IELTS document uploaded', ()=> {
    component.englishQualificationType  = EnglishQualificationType.IELTS;
    component.onDocDelete(attachment);
    expect(component.IELTSAttachment.length).toBe(0);
  });

  it('update attachments just before load of next step - Employer reference uploaded', () => {
    component.employerRefAttachment[0] = attachment;
    component.englishQualificationType  = EnglishQualificationType.EmployerReference;
    component.populateForm();
    expect(component.attachments.length).toBe(2);
  });

  it('on document upload, validate -  - Employer reference uploaded', () => {    
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    component.isEnglishCertificateRequired = true;
    component.englishQualificationType  = EnglishQualificationType.EmployerReference;
    component.onDocUpload([attachment]);
    expect(validity$spy).toHaveBeenCalledWith({ valid: true, messages:[], touched: false });
  });

  it('update on document delete  - Employer reference uploaded', ()=> {
    component.englishQualificationType  = EnglishQualificationType.EmployerReference;
    component.onDocDelete(attachment);
    expect(component.employerRefAttachment.length).toBe(0);
  });

  it('if OET number is not entered and consent confirmation not made, error messages are shown to user', () => {
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    component.isEnglishCertificateRequired = true;
    component.englishQualificationType = EnglishQualificationType.OET;
    component.validate();
    expect(validity$spy).toHaveBeenCalledWith({ valid: false, messages:['Please enter OET candidate number','Please select the checkbox'], touched: false });
  });

});
