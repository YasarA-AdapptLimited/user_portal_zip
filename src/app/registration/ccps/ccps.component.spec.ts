import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CcpsComponent } from './ccps.component';
import { LayoutService } from '../../core/service/layout.service';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { CCPSService } from '../../core/service/ccps.service';
import { AuthService } from '../../core/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { FormStepperMenuComponent } from '../../shared/formStepper/formStepperMenu.component';
import { of } from 'rxjs';
import { BannerComponent } from '../../shared/banner.component';

describe('CcpsComponent', () => {

  const application = {
    activeForm: {
        isOverallDeclarationAcknowledged: false,
        professionalStandingDetail: {
            continueExistingName: null,
            title: null,
            titleValue: null,
            forenames: null,
            surname: null,
            middleName: null,
            country: "Hong Kong",
            regulatoryBodyId: "d7943ed1",
            contactName: null,
            telephone: null,
            emailAddress: null
        },
        initialRegistrantQualificationDetail: {
            registrationRoute: 717750002,
            eeaPharmacistQualificationDetail: null,
            ukPharmacistQualificationDetail: null,
            ospapPharmacistQualificationDetail: {
                degreeName: null,
                universityName: null,
                yearObtained: null,
                ospapCountryQualified: "Belgium",
                ospapCourseId: "b3abdaa0",
                ospapCourseName: "OSPAP Sunderland",
                ospapDateQualified: null,
                assessmentYear: null
            },
            irelandPharmacistQualificationDetail: null,
            pharmacyTechnicianQualificationDetail: null,
            trainingDetails: [
                {
                    id: "317e55a7",
                    trainingSiteName: "Abi Pharmacy",
                    trainingSiteAddress: "51f Beech Avenue,,,NORTHAMPTON,Northamptonshire,UK,NN3 2JG",
                    trainingStartDate: "2007-07-02T00:00:00",
                    trainingEndDate: "2008-06-29T00:00:00"
                }
            ]
        },
        appDeclaration: {
            isQ1Confirmed: null,
            isQ2Confirmed: null,
            isQ3Confirmed: null,
            isQ4Confirmed: null
        },
        equalityDiversity: {
            ethnicity: 717750007,
            ethnicityOther: null,
            nationality: 717750015,
            religion: null,
            religionOther: null,
            disabled: null,
            disabilityDetails: null,
            gender: null,
            sexualOrientation: null
        },
        declarations: [],
        qualificationDetailsExists: {
            courseExists: true,
            qualifiedExists: false,
            countryExists: true
        },
        trainingDetailsExists: false,
        assessmentDetailsExists: false,
        id: "0c2a0ad9",
        formStatus: 2,
        step: 3,
        scope: 9,
        attachments: [],
        countersignatures: [],
        createdAt: "2023-10-05T11:15:08.927",
        dateApplicationSubmitted: null
    },
    personalDetails: {
        title: {
            name: "Mr",
            id: 717750001
        },
        forenames: "James",
        surname: "CCPS EEA 20",
        middleName: null,
        dateOfBirth: "1977-10-14T00:00:00",
        address: {
            line1: "XYZ",
            line2: null,
            line3: null,
            town: "XYZ",
            county: "XYZ",
            postcode: "XYZ",
            country: "B0",
            homeNation: 717750000,
            latitude: 49.8943,
            longitude: -6.3467,
            countryCode: null
        },
        contact: {
            email: "test@outlook.com",
            telephone1: "123456789",
            mobilePhone: null
        },
        registration: {
            registrationNumber: 123456,
            registrationStatus: 717750008,
            independentPrescriberStatus: 0,
            voluntaryRemovalReason: null,
            registrationRoute: 717750002,
            eeaDirectiveRoute: null,
            legacyRegistrationRoute: null,
            contactType: 717750000,
            isRequiredEnglishCertificate: false,
            isRequiredRevalidationSubmission: false
        },
        otherRegulators: null
    },
    countries: [
        "Hong Kong",
        "Australia",
        "United Kingdom",
        "Switzerland"
    ],
    regulatoryBodies: [
        {
            id: "4afb3c93",
            name: "test1",
            addressLine1: null,
            addressLine2: null,
            addressLine3: null,
            countyState: null,
            country: null,
            postCode: null,
            standardEmail: null
        },
        {
            id: "d7943ed1",
            name: "Pharmacy Board",
            addressLine1: "1st Floor, Shun Feng International Centre",
            addressLine2: "182 Queen’s Road East",
            addressLine3: "Wanchai",
            countyState: null,
            country: "Hong Kong",
            postCode: "Hong Kong",
            standardEmail: "test@test.org"
        }
    ],
    certProfessionalStandingApplicationFee: 81.00
  }

  let component: CcpsComponent;
  let fixture: ComponentFixture<CcpsComponent>;
  let MockLayoutService, MockFormStepperService, MockCCPSService, MockAuthService,MockMatDialog, MockActivatedRoute, MockRouter;

  // let formStepper = jasmine.createSpyObj('FormStepper', ['goToStep']);
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

  function Step(active, stepId, title){
    this.current = active;
    this.stepId = stepId;
    this.title = title;
    this.validity = { valid: true, messages: [], touched: false };
    this.disabled =false;
    this.waiting = true;
  }
  const data = [
    new Step(true, 1, 'Guidance for this application'),
    new Step(false, 1, 'Personal details'),
    new Step(false, 1, 'Overseas regulator details'),
    new Step(false, 1, 'Initial pharmacy qualification details'),
    new Step(false, 1, 'FtP declarations'),
    new Step(false, 1, 'CCPS declarations'),
    new Step(false, 1, 'ED&I details'),
    new Step(false, 1, 'Review'),
    new Step(false, 1, 'Payment')
  ]

  MockFormStepperService = jasmine.createSpyObj('FormStepperService', ['update','getFurthestStep', 'updateStepsId', 'setCurrentStep', 'init'], {
    summary: data,
    steps: data
  });

  MockActivatedRoute = {
    snapshot:
              {
                params: {
                  id: '24fkzrw3487943uf358lovd'
                }
              }
  }

  MockAuthService = {
    user: {
      registrationStatus: 717750006,
      registrant: {
        expiryDate: '08-15-2023'
      }
    },
  }

  MockCCPSService = jasmine.createSpyObj('CCPSService', ['getApplication', 'setStep', 'saveApplication']);  

  MockLayoutService = {
    setBannerState: () => {
        return true;
    },
    state: {
        fullscreen: ''
    },
    setOverlay: () => {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [ CcpsComponent, FormStepperMenuComponent, BannerComponent ],
      providers: [ { provide: LayoutService, useValue: MockLayoutService},
        { provide: FormStepperService, useValue: MockFormStepperService},
        { provide: CCPSService, useValue: MockCCPSService },
        { provide: AuthService, useValue: MockAuthService },
        { provide: MatDialog, useValue: MockMatDialog },
        { provide: ActivatedRoute, useValue: MockActivatedRoute },
        { provide: Router, useValue: MockRouter } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcpsComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
    component.formStepper = formStepper;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init load application', () => {
    MockCCPSService.getApplication.and.returnValue(of(application));
    component.ngOnInit();
    expect(component.application).toBeDefined();
  });

  it('goToStep - helps navigate to mentioned step', () => {
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

  it('goToStepId - helps navigate to step with mentioned id', () => {
    component.goToStepId(1);
    expect(component.formStepper.goToStep).toHaveBeenCalled();
  });

  it('stepChanged updates stepId', fakeAsync(() => {
    component.formStepperService.summary = data;
    MockFormStepperService.getFurthestStep.and.returnValue(1);
    MockCCPSService.setStep.and.returnValue(of());
    component.stepChanged(1);
    tick(1000);
    expect(component.application.activeForm.step).toBe(1);
  }));

  it('cloneSteps, copies all steps of the application', () => {
    component.cloneSteps();
    expect(component.allSteps).toBeDefined();
  });

  it('save method lets to save the application data', () => {
    component.formStepperService.summary = data;
    MockCCPSService.saveApplication.and.returnValue(of({}));
    expect(component.save()).toBeDefined();
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


  it('stepChange checks if current step has no errors', () => {
    const saveSpy: jasmine.Spy = spyOn(component,'save');
    saveSpy.and.returnValue(new Promise<void>((resolve, reject) => {resolve();}));
    expect(component.stepChange()()).toBeDefined();
  });

  it('application is readonly if formStatus is submitted', () => {
    expect(component.readonly).toBe(false);
  });
});
