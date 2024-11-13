import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { of, throwError } from 'rxjs';
import { FormStepperMenuComponent } from '../../shared/formStepper/formStepperMenu.component';
import { AuthService } from '../../core/service/auth.service';
import { LayoutService } from '../../core/service/layout.service';

import { FormStepperService } from '../../shared/formStepper/formStepper.service';


import { BannerComponent } from '../../shared/banner.component';

import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { RenewalService } from '../../core/service/renewal.service';
import { FormStepperComponent } from "../../shared/formStepper/formStepper.component";

import { EdiService } from '../../account/service/edi.service';
import { GphcIconComponent } from '../../shared/gphc-icon.component';
import { TooltipModule } from '../../core/tooltip/tooltip.module';
import { TooltipService } from '../../core/tooltip/tooltip.service';
import { ReturnToRegisterComponent } from './return-to-register-application.component';
import { ReturnToRegisterService } from '../../../app/core/service/returnToRegister.service';
import { LogService } from '../../../app/core/service/log.service';
import { ReturnToRegisterApplication } from './model/ReturnToRegister';
import { RegistrantStatus } from '../model/RegistrantStatus';

describe('ReturnToRegisterComponent', () => {
  let component: ReturnToRegisterComponent;
  let fixture: ComponentFixture<ReturnToRegisterComponent>;
  let MockAuthService, MockFormStepperService, MockLayoutService, MockReturnToRegisterService, 
  MockMatDialog, MockRenewalService, MockEDIService, MockTooltipService,MockLogService;

  // MockRenewalService = jasmine.createSpyObj('RenewalService',[]);
  MockAuthService = {
    user: {
      registrationStatus: 717750006,
      registrant: {
        expiryDate: '08-15-2023'
      }
    },    
  }

  MockLayoutService = {
    setBannerState: () => {
        return true;
    },
    state: {
        fullscreen: ''
    },
    setOverlay: () => {}
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
  returnToRegisterApplicationFeeCode: 'VRRA',
  returnToRegisterApplicationFeeAmount: 144.00,
  restorationToRegisterFeeCode: '121',
  restorationToRegisterFeeAmount: 106.00
  }


  let formStepperComponents = jasmine.createSpyObj('FormStepperComponents', ['changes']);
  let formStepper = jasmine.createSpyObj('FormStepper', ['goToStep', 'ngAfterContentInit'], 
                                            {
                                                currentStep: { dirty: false, 
                                                                populateForm: () => {},
                                                                stepId: 1,
                                                                load: () => {},
                                                                ready$: of(true),
                                                                validate: () => {}
                                                             },
                                                serverErrors: [],
                                                steps: [
                                                    {
                                                        stepId: 1,
                                                        title: 'Personal details'
                                                    },                                                    
                                                    {
                                                        stepId: 2,
                                                        title: 'Details of previous registration'
                                                    },
                                                    {
                                                      stepId: 3,
                                                      title: 'Letter of good standing'
                                                    },
                                                    {
                                                        stepId: 4,
                                                        title: 'ED&I Details'
                                                    },{
                                                        stepId: 5,
                                                        title: 'FtP declarations (1)'
                                                    },
                                                    {
                                                      stepId: 6,
                                                      title: 'Application declarations'
                                                    },                                                    
                                                    {
                                                        stepId: 7,
                                                        title: 'Review'
                                                    },
                                                    {
                                                      stepId: 8,
                                                      title: 'Payment'
                                                  },
                                                ]
                                        });

  MockReturnToRegisterService = jasmine.createSpyObj('ReturnToRegisterService', ['getApplication', 'setStep', 'saveApplication']);  
  const data = [
    {
        current: true,
        stepId: 1,
        title: 'Personal details',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
        current: false,
        stepId: 2,
        title: 'Details of previous registration',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
        current: false,
        stepId: 3,
        title: 'Letter of good standing',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
        current: false,
        stepId: 4,
        title: 'ED&I Details',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
        current: false,
        stepId: 5,
        title: 'FtP declarations (1)',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
      current: false,
      stepId: 6,
      title: 'Application declarations',
      validity: { valid: true, messages: [], touched: false },
      disabled: false,
      waiting: true
  },
  {
      current: false,
      stepId: 7,
      title: 'Review',
      validity: { valid: true, messages: [], touched: false },
      disabled: false,
      waiting: true
  },
  {
    current: false,
    stepId: 8,
    title: 'Payment',
    validity: { valid: true, messages: [], touched: false },
    disabled: false,
    waiting: true
}
  ]
  MockFormStepperService = jasmine.createSpyObj('FormStepperService', ['update','getFurthestStep', 'updateStepsId', 'setCurrentStep', 'init'], {
    summary: data,
    steps: data
});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnToRegisterComponent, 
                      FormStepperMenuComponent,
                      BannerComponent,
                      FormStepperComponent,
                      GphcIconComponent ],
      providers: [{ provide: AuthService, useValue: MockAuthService},
      { provide: FormStepperService, useValue: MockFormStepperService},
      { provide: LayoutService, useValue: MockLayoutService },
      { provide: ReturnToRegisterService, useValue: MockReturnToRegisterService },
      { provide: MatDialog, useValue: MockMatDialog },
      { provide: RenewalService, useValue: MockRenewalService},
      { provide: EdiService, useValue: MockEDIService},
      { provide: LogService, useValue: MockLogService},
      

      { provide: TooltipService, useValue: MockTooltipService!}],
      imports: [MatMenuModule, RouterTestingModule, TooltipModule]
    })
    .compileComponents();
    TestBed.overrideComponent(ReturnToRegisterComponent, {
      set: {
          providers: [
              { provide: FormStepperService, useValue: MockFormStepperService}
          ]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToRegisterComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
    component.formStepperComponents = formStepperComponents;
    component.formStepper = formStepper;        
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init load application', () => {
    MockReturnToRegisterService.getApplication.and.returnValue(of(application));
    component.ngOnInit();
    expect(component.application).toBeDefined();
  });

  it('goToStep help navigate to mentioned step', () => {
    const step= {
      stepId: 2,
      title: 'Details of previous registration',
      current: false,
      validity: {
        touched: false,
        valid: null,
        messages: []
      },
      disabled: false,
      waiting: null
    }
    component.goToStep(step);
    expect(component.formStepper.goToStep).toHaveBeenCalled();
  });

  it('goToStepId help navigate to step with mentioned id', () => {
    component.goToStepId(1);
    expect(component.formStepper.goToStep).toHaveBeenCalled();
  });

  it('stepChanged updates stepId', fakeAsync(() => {
    component.formStepperService.summary = data;
    MockFormStepperService.getFurthestStep.and.returnValue(1);
    MockReturnToRegisterService.setStep.and.returnValue(of());
    component.stepChanged(1);
    tick(1000);
    expect(component.application.activeForm.step).toBe(1);
  }));

  it('stepChange checks if current step has no errors', () => {
    const saveSpy: jasmine.Spy = spyOn(component,'save');
    saveSpy.and.returnValue(new Promise<void>((resolve, reject) => {resolve();}));
    expect(component.stepChange()()).toBeDefined();
  });

  it('stepChange sets serverErrors if validation errors exist', () => {
    const saveSpy: jasmine.Spy = spyOn(component,'save');
    saveSpy.and.returnValue(new Promise<void>((resolve, reject) => {throw ({validationErrors: []})}));
    expect(component.stepChange()()).toBeDefined();
  });

  it('save method lets to save the application data', () => {
    component.formStepperService.summary = data;
    //MockFormStepperService.getFurthestStep.and.returnValue(1);
    MockReturnToRegisterService.saveApplication.and.returnValue(of({}));
    expect(component.save()).toBeDefined();
  });

  it('submitted prop check', () => {
    expect(component.submitted).toBe(false);
  });
  it('pendingProcessing prop check', () => {
    expect(component.pendingProcessing).toBe(false);
  });
  it('approvedPendingRestorationFee prop check', () => {
    expect(component.approvedPendingRestorationFee).toBe(false);
  });

  
  it('cloneSteps, copies all steps of the application', () => {
    component.cloneSteps();
    expect(component.allSteps).toBeDefined();
  });


  it('cloneSummary, copies summary of the application', () => {
    component.formStepperService.summary = [{
      stepId: 1, 
      title: 'ABC', 
      current: true, 
      validity: {
          touched: false,
          valid: true,
          messages: []
        },
      disabled: false,
      waiting: false
    }]; 
    component.cloneSummary();
    expect(component.allStepSummary ).toBeDefined();
  });
  it('on load application is defined', fakeAsync(() => {
    MockReturnToRegisterService.getApplication.and.returnValue(of(new ReturnToRegisterApplication(application, RegistrantStatus.Applicant)));
    component.load();
    tick();
    expect(component.application).toEqual(new ReturnToRegisterApplication(application, RegistrantStatus.Applicant));
}));

it('on load application is defined', fakeAsync(() => {
  MockReturnToRegisterService.getApplication.and.returnValue(throwError(new Error('error')));
    component.load();
    tick();
    expect(component.loadingError).toBeTrue();
}));
it('canDeactivate check', () => {
  expect(component.canDeactivate()).toBeTrue();
});

});
