import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { of } from 'rxjs';
import { FormStepperMenuComponent } from '../../shared/formStepper/formStepperMenu.component';
import { AuthService } from '../../core/service/auth.service';
import { LayoutService } from '../../core/service/layout.service';
import { VoluntaryRemovalService } from '../../core/service/voluntaryRemoval.service';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';

import { VoluntaryRemovalComponent } from './voluntary-removal.component';
import { BannerComponent } from '../../shared/banner.component';
import { VrDateReasonForRemovalRequiredStepComponent } from './steps/vr-date-reason-for-removal-required-step/vr-date-reason-for-removal-required-step.component';
import { VrFtpDeclarationStepComponent } from './steps/vr-ftp-declaration-step/vr-ftp-declaration-step.component';
import { VrApplicationDeclarationsStepComponent } from './steps/vr-application-declarations-step/vr-application-declarations-step.component';
import { VrApplicationReviewComponent } from './steps/vr-application-review-step/vr-application-review.component';
import { VrApplicationReviewStepComponent } from './steps/vr-application-review-step/vr-application-review-step.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { VrPaymentStepComponent } from './steps/vr-payment-step/vr-payment-step.component';
import { RenewalService } from '../../core/service/renewal.service';
import { FormStepperComponent } from "../../shared/formStepper/formStepper.component";
import { VrEdiStepComponent } from './steps/vr-edi-step/vr-edi-step.component';
import { EdiService } from '../../account/service/edi.service';
import { GphcIconComponent } from '../../shared/gphc-icon.component';
import { TooltipModule } from '../../core/tooltip/tooltip.module';
import { TooltipService } from '../../core/tooltip/tooltip.service';

describe('VoluntaryRemovalComponent', () => {
  let component: VoluntaryRemovalComponent;
  let fixture: ComponentFixture<VoluntaryRemovalComponent>;
  let MockAuthService, MockFormStepperService, MockLayoutService, MockVoluntaryRemovalService, 
  MockMatDialog, MockRenewalService, MockEDIService, MockTooltipService;

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

  const application = {
    activeForm: {
      voluntaryRemovalDetails: {
          dateOfRegistryRemoval: '2022-12-31T00:00:00',
          reasonForRemoval: 'Other',
          reasonForRemovalDetails: 'reason',
          superintendentName: null,
          superintendentNumber: null
      },
      appDeclaration: {
          isQ1Confirmed: null,
          isQ2Confirmed: null
      },
      equalityDiversity: {
          ethnicity: 717750017,
          ethnicityOther: null,
          nationality: null,
          religion: null,
          religionOther: null,
          disabled: null,
          disabilityDetails: null,
          gender: null,
          sexualOrientation: null
      },
      isOverallDeclarationAcknowledged: false,
      ftpDeclarations: [],
      id: 123,
      formStatus: 2,
      step: 1,
      scope: 7,
      attachments: [],
      countersignatures: [],
      createdAt: '2022-04-01T11:54:00.38',
      dateApplicationSubmitted: null,
      minStep: 1
    }
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
                                                        title: 'Date removal required & Reason for removal'
                                                    },                                                    
                                                    {
                                                        stepId: 2,
                                                        title: 'Ftp declarations'
                                                    },
                                                    {
                                                      stepId: 3,
                                                      title: 'ED&I Details'
                                                    },
                                                    {
                                                        stepId: 4,
                                                        title: 'Review'
                                                    },{
                                                        stepId: 5,
                                                        title: 'Payment'
                                                    },
                                                    
                                                ]
                                        });

  MockVoluntaryRemovalService = jasmine.createSpyObj('VoluntaryRemovalService', ['getApplication', 'setStep', 'saveVRApplication', 'isOutstandingPaymentZero']);  
  const data = [
    {
        current: true,
        stepId: 1,
        title: 'Date removal required & Reason for removal',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
        current: false,
        stepId: 2,
        title: 'ED&I Details',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
        current: false,
        stepId: 3,
        title: 'Ftp declarations',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
        current: false,
        stepId: 4,
        title: 'Review',
        validity: { valid: true, messages: [], touched: false },
        disabled: false,
        waiting: true
    },
    {
        current: false,
        stepId: 5,
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
      declarations: [ VoluntaryRemovalComponent, 
                      FormStepperMenuComponent,
                      BannerComponent,
                      VrDateReasonForRemovalRequiredStepComponent,
                      VrFtpDeclarationStepComponent,
                      VrApplicationDeclarationsStepComponent,
                      VrApplicationReviewComponent,
                      VrApplicationReviewStepComponent,
                      VrPaymentStepComponent,
                      FormStepperComponent,
                      VrEdiStepComponent,
                      GphcIconComponent ],
      providers: [{ provide: AuthService, useValue: MockAuthService},
      { provide: FormStepperService, useValue: MockFormStepperService},
      { provide: LayoutService, useValue: MockLayoutService },
      { provide: VoluntaryRemovalService, useValue: MockVoluntaryRemovalService },
      { provide: MatDialog, useValue: MockMatDialog },
      { provide: RenewalService, useValue: MockRenewalService},
      { provide: EdiService, useValue: MockEDIService},
      { provide: TooltipService, useValue: MockTooltipService!}],
      imports: [MatMenuModule, RouterTestingModule, TooltipModule]
    })
    .compileComponents();
    TestBed.overrideComponent(VoluntaryRemovalComponent, {
      set: {
          providers: [
              { provide: FormStepperService, useValue: MockFormStepperService}
          ]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoluntaryRemovalComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
    component.formStepperComponents = formStepperComponents;
    component.formStepper = formStepper;        
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init load application', () => {
    MockVoluntaryRemovalService.getApplication.and.returnValue(of(application));
    component.ngOnInit();
    expect(component.application).toBeDefined();
  });

  it('goToStep help navigate to mentioned step', () => {
    const step= {
      stepId: 2,
      title: 'ED&I Details',
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
    MockVoluntaryRemovalService.setStep.and.returnValue(of());
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
    MockFormStepperService.getFurthestStep.and.returnValue(1);
    MockVoluntaryRemovalService.saveVRApplication.and.returnValue(of({}));
    expect(component.save()).toBeDefined();
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

  it('if pendingFee is zero, hide payment step ', () => {
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
    const updateStepIdSpy: jasmine.Spy = spyOn(component, 'updateStepId');
    component.showHidePaymentStep(true);
    expect(updateStepIdSpy).toHaveBeenCalled();
  });

  it('if pendingFee is not zero, show payment step ', () => {
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
    const updateStepIdSpy: jasmine.Spy = spyOn(component, 'updateStepId');
    component.showHidePaymentStep(false);
    expect(updateStepIdSpy).toHaveBeenCalled();
  });  
});
