import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AccountService } from '../../../../account/service/account.service';
import { AuthService } from '../../../../core/service/auth.service';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { SupportingDocumentsService } from '../../../../shared/supportingDocuments/supportingDocuments.service';
import { AttachmentType } from '../../../../shared/model/AttachmentType';
import { PersonalDetailsComponent } from './personal-details.component';

describe('PersonalDetailsComponent', () => {
  let component: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;

  let MockFormStepperService, MockAuthService, MockSupportingDocumentsService, MockMatDialog, MockAccountService;

  MockAccountService = {
    getSalutations : function (){
      return of({
        Mr : 1,
        Mrs: 2
      });
    }
  }

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
  returnToRegisterApplicationFeeCode: '',
  returnToRegisterApplicationFeeAmount: 144.00,
  restorationToRegisterFeeCode: '121',
  restorationToRegisterFeeAmount: 106.00
  }

  MockAuthService = {
    user: {
      registrationStatus: '09809808',
      forenames: 'XXX',
      showNoticeOfEntry: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDetailsComponent ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService},
        { provide: AuthService, useValue: MockAuthService},
        { provide: SupportingDocumentsService, useValue: MockSupportingDocumentsService },
        { provide: MatDialog, useValue: MockMatDialog},
        { provide: AccountService, useValue: MockAccountService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, {application});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filter method filters the salutations', () => {
    component.filter('Mr');
    expect(component.salutations).toBeDefined();
  });

  it('updateApplication updates the attachments and validates the step', () => {
    const validity$Spy : jasmine.Spy = spyOn(component.validity$,'next');
    component.updateApplication();
    expect(validity$Spy).toHaveBeenCalledWith({ valid: true, messages: [], touched: false});
  });

  it('onTitleChange updates the title', () => {
    component.onTitleChange({target: {value: 'Mr'}});
    expect(component.registrantDetails.title).toEqual({ name: 'Mr', id: 1});
  });

  it('upon salutation change, update title', () => {
    component.loadSalutations();    
  });

  it('update method, validates the step', () => {
    const validity$Spy : jasmine.Spy = spyOn(component.validity$,'next');
    component.update();    
    expect(validity$Spy).toHaveBeenCalledWith({ valid: true, messages: [], touched: false});
  });

  it('onRegistered updates the doc types', () => {
    component.onRegistered(AttachmentType.OfficialDocummentConfirmingNameChange);
    expect(component.registeredDocTypes).toBeDefined();
  });

  it('on upload of file, attachments is updated', () => {    
    let event = {
      type : 14,
      uploads: [{
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
          }]
    };
    component.onUploaded(event);
    expect(component.attachments).toBeDefined();
  });
});
