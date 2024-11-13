import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Form } from '../../../../dynamic/model/Form';
import { ReturnToRegisterService } from '../../../../core/service/returnToRegister.service';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FtpDeclarationOneComponent } from './ftp-declarations-one.component';

describe('FtpDeclarationOneComponent', () => {
  let component: FtpDeclarationOneComponent;
  let fixture: ComponentFixture<FtpDeclarationOneComponent>;
  let MockFormStepperService, MockFormValidationService, MockRTRService;

  MockRTRService = jasmine.createSpyObj('ReturnToRegisterService', ['getDeclarationFormTemplates']);
  MockFormValidationService = jasmine.createSpyObj('FormValidationService', ['getDeclarationFormTemplates','getPayload'], {
    state$ : new BehaviorSubject([])
  });

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
      declarations: [ FtpDeclarationOneComponent ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService },
        { provide: FormValidationService, useValue: MockFormValidationService },
        { provide: ReturnToRegisterService, useValue: MockRTRService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpDeclarationOneComponent);
    component = fixture.componentInstance;
    component.formIndex = 0;
    component = Object.assign(component, { application });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('on call of load method, ', () => {    
    const ready$Spy: jasmine.Spy= spyOn(component.ready$,'next');
    component.formIndex = 0;
    MockRTRService.getDeclarationFormTemplates.and.returnValue(of([{
      dynamicFormId: '1',
      formTitle: 'title',
      formBody: 'test',
      questionGroups: [],
    }]));
    component.load();
    expect(ready$Spy).toHaveBeenCalledOnceWith(true);
  });

  it('User is shown with error message if not all questions are answered', () => {
    const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');
    MockFormValidationService.state$.next([{
      dynamicFormId: '1',
      formTitle: 'title',
      formBody: 'test',
      questionGroups: [],
      invalid : true
    }]);    
    component.validate();
    component.valid = false;
    expect(validity$Spy).toHaveBeenCalledWith({ valid: undefined, messages: ['You must answer all the questions to continue'], touched: undefined});
    MockFormValidationService.state$.next([]);
  });
});
