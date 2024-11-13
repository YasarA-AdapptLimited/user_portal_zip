import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EdiService } from '../../../../account/service/edi.service';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';

import { EqualityDiversityComponent } from './equality-diversity.component';

describe('EqualityDiversityComponent', () => {
  let component: EqualityDiversityComponent;
  let fixture: ComponentFixture<EqualityDiversityComponent>;

  let MockFormStepperService, MockEDIService;

  MockEDIService = jasmine.createSpyObj(['validate', 'load']);

  let application = {
    activeForm: {
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
    fileId: '8f7c5d32-29fe-49c3-9920-f607404b7d60',
    expiryDate: null,
    type: 14,
    filename: 'New PDF - Copy.pdf',
    filesize: 0,
    deleteUrl: 'v1.0/pharmacistform/attachment/8f7c5d32-29fe-49c3-9920-f607404b7d60',
    downloadUrl: 'v1.0/EvidenceOfNameChangeDocumment/files/8f7c5d32-29fe-49c3-9920-f607404b7d60',
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
      declarations: [ EqualityDiversityComponent ],
      providers: [
        {provide: FormStepperService, useValue: MockFormStepperService},
        {provide: EdiService, useValue: MockEDIService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqualityDiversityComponent);
    component = fixture.componentInstance;
    Object.assign(component, {application});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validate equality & diversity information', () => {    
    const valid = { valid: true, messages: [], touched: undefined };
    MockEDIService.validate.and.returnValue(valid);
    const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');    
    component.validate();    
    expect(validity$Spy).toHaveBeenCalledWith(Object.assign({}, valid));
  });

  it('update should call make dirty and validate methods', () => {    
    const validateSpy: jasmine.Spy = spyOn(component, 'validate');
    const makeDirtySpy: jasmine.Spy = spyOn(component, 'makeDirty');    
    component.ngOnInit();
    component.update({});    
    expect(makeDirtySpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
  });

  it(` load all edi's and set ready$ to true`, () => {
    const mockFunction = () => {
      const subscribe = () => {
        return of(true);
      };
      return subscribe;
    };
    MockEDIService.load.and.returnValue(of(mockFunction));
    const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');    
    component.load();    
    expect(ready$Spy).toHaveBeenCalled();
  });

  it('populateForm method should be defined', () => {
    component.populateForm();
    expect(component.populateForm).toBeDefined();
  });

});
