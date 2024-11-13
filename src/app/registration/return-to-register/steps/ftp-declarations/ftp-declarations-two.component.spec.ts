import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ftpDeclarationObj } from '../../model/FtPDeclaration';

import { FtpDeclarationTwoComponent } from './ftp-declarations-two.component';

describe('FtpDeclarationTwoComponent', () => {
  let component: FtpDeclarationTwoComponent;
  let fixture: ComponentFixture<FtpDeclarationTwoComponent>;
  let MockFormStepperService;

  let application = {
    activeForm: {
      declarations: [
        { dynamicFormId: '1', answers: [
          {
          questionId: 'question-one',
          answer: 'answer'
          }
        ]
        }
      ],
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FtpDeclarationTwoComponent ],
      providers: [{ provide: FormStepperService, useValue: MockFormStepperService }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpDeclarationTwoComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
    fixture.detectChanges();
    component.question10 = new ftpDeclarationObj('Q10');
    component.question11 = new ftpDeclarationObj('Q11');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateDetails method updates restorationDeclarations', () => {
    component.updateDetails();
    expect(component.application.activeForm.restorationDeclarations.length).toEqual(2);
  });

  it('if question 10 not answered, throw a error message', () => {
    const validity$ : jasmine.Spy = spyOn(component.validity$, 'next');  
    component.question11.isRegistered = false;         
    component.validate();
    expect(validity$).toHaveBeenCalledWith({valid: false, messages: ['Please let us know if you have worked as pharmacist or pharmacy technician'], touched: undefined });
  });

  it('if pharmacist/ pharmacy technician is investigated, case reference number has to be provided', () => {
    const validity$ : jasmine.Spy = spyOn(component.validity$, 'next');
    component.question11.isRegistered = false;  
    component.question10.isRegistered = true;  
    component.question10.isInvestigated = true;  
    component.validate();
    expect(validity$).toHaveBeenCalledWith({valid: false, messages: ['Please enter case reference number'], touched: undefined });
  });

  it('if pharmacist/ pharmacy technician is not investigated, title and employer details has to be provided', () => {
    const validity$ : jasmine.Spy = spyOn(component.validity$, 'next');
    component.question11.isRegistered = false;  
    component.question10.isRegistered = true;  
    component.question10.isInvestigated = false;  
    component.validate();
    expect(validity$).toHaveBeenCalledWith({valid: false, messages: ['Please enter your job title, dates of your unregistered practise, employer name, employer address'], touched: undefined });
  });

  it('if question 11 not answered, throw a error message', () => {
    const validity$ : jasmine.Spy = spyOn(component.validity$, 'next'); 
    component.question10.isRegistered = false;        
    component.validate();
    expect(validity$).toHaveBeenCalledWith({valid: false, messages: ['Please let us know if you have used the title ‘pharmacist’ or ‘pharmacy technician’ while not registered with the GPhC'], touched: undefined });
  });

  it('if title used pharmacist/ pharmacy technician is investigated while not registered, case reference number has to be provided', () => {
    const validity$ : jasmine.Spy = spyOn(component.validity$, 'next');
    component.question10.isRegistered = false; 
    component.question11.isRegistered = true;  
    component.question11.isInvestigated = true;  
    component.validate();
    expect(validity$).toHaveBeenCalledWith({valid: false, messages: ['Please enter case reference number'], touched: undefined });
  });

  it('if pharmacist/ pharmacy technician is not investigated while not registered, title details has to be provided', () => {
    const validity$ : jasmine.Spy = spyOn(component.validity$, 'next');
    component.question10.isRegistered = false; 
    component.question11.isRegistered = true;  
    component.question11.isInvestigated = false;  
    component.validate();
    expect(validity$).toHaveBeenCalledWith({valid: false, messages: ['Please enter the title you used, dates of your title use, how or where you used the title'], touched: undefined });
  });

//   it('setStartEndDate, updates start and end date of title used', () => {
//     component.setStartEndDate(component.question10,{from : '1/1/2022', to: '1/6/2022'});
//     expect(component.question10.titleUsedFrom).toBe('1/1/2022');
//   });

  it('onDateRangeChange updates start and end date titleUsed in question10', () => {
    component.onDateRangeChange({from : '1/1/2022', to: '1/6/2022'});
    expect(component.question10.titleUsedFrom).toBe('1/1/2022');
  });

  it('onDatesChange updates start and end date titleUsed in question11', () => {
    component.onDatesChange({from : '1/1/2022', to: '1/6/2022'});
    expect(component.question11.titleUsedFrom).toBe('1/1/2022');
  });
});
