import { DatePipe } from '@angular/common';
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Address } from '../account/model/Address';
import { UserBadgeComponent } from '../account/userBadge.component';
import { AssessmentRegistrationService } from '../core/service/assessmentRegistration.service';
import { AssessmentReportService } from '../core/service/assessmentReport.service';
import { AuthService } from '../core/service/auth.service';
import { FinalDeclarationService } from '../core/service/finalDeclaration.service';
import { LayoutService } from '../core/service/layout.service';
import { PreregService } from '../core/service/prereg.service';
import { CurrentApplicationService } from '../core/service/prereg/currentApplication.service';
import { TooltipModule } from '../core/tooltip/tooltip.module';
import { FormScope } from '../registration/model/FormScope';
import { RegistrantStatus } from '../registration/model/RegistrantStatus';
import { BannerComponent } from '../shared/banner.component';
import { FormSectionComponent } from '../shared/formSection.component';
import { GphcIconComponent } from '../shared/gphc-icon.component';
import { CaseSplitPipe } from '../shared/pipe/CaseSplit.pipe';
import { AssessmentRegistrationApplicationForm } from './assessment-registration/model/AssessmentRegistrationApplicationForm';
import { AssessmentReportApplicationForm } from './assessment-report/models/AssessmentReportApplicationForm';
import { AssessmentReportStep } from './assessment-report/models/AssessmentReportStep';
import { ApplicationFormMode } from './model/ApplicationFormMode';
import { ApplicationStatus } from './model/ApplicationStatus';
import { TraineeReportType } from './model/TraineeReportType';
import { PreregDashboardComponent } from './preregDashboard.component';

describe('Prereg Dashboard component', () => {
  let fixture: ComponentFixture<PreregDashboardComponent>;
  let component: PreregDashboardComponent;
  let MockAuthService: Object, MockLayoutService: Object, MockApplication: Object;
  let MockAssessmentReportService: jasmine.SpyObj<any>, 
  MockAssessmentRegistrationService: jasmine.SpyObj<any>, 
  MockFinalDeclarationService: jasmine.SpyObj<any>, 
  MockCurrentApplicationService: jasmine.SpyObj<any>,
  MockPreregService: jasmine.SpyObj<any>,
  MockAssessmentReport, MockRegApplication, MockAssessmentRegistration, MockFinalDeclaration;  

  let routerSpy =  { navigate: jasmine.createSpy('navigate')};
  let addressDetails =  {
    line1: 'XXX',
    line2: '',
    line3: '',
    town: 'YYY',
    county: 'ZZZ',
    postcode: 'X123',
    country: 'XYZ'
  };
  let formDetails = {
    declarations: [],
    id:'123',
    formStatus: ApplicationStatus.CounterSigned,
    attachments:[],
    isOverallDeclarationConfirmed: false,
    isTrainingConfirmed: false,
    isAssessmentConfirmed: false,
    isJointTutoringArrangmentExists: null,
    tutorDetails: [],
    confirmTempRegistration: true,
    step: AssessmentReportStep.TemporaryRegistration,
    minStep: AssessmentReportStep.TemporaryRegistration,
    mode: ApplicationFormMode.Editable,
    registrantStatus: RegistrantStatus.Applicant,
    requirePayment: true,
    scope: FormScope.AssessmentRegistration,
    countersignatures: [
      {
            registrationNumber: '123456',
            forenames: 'GrH1012236',
            surname: 'RiH1012236',
            town: 'CHH1012236',
            decisionMadeAt: null,
            decision: 1,
            feedback: null,
            isCertifiedPhoto: null,
            countersignerCommentId: null,
            learningContractResponse: null,
            eligibleAsTutor: null
      }
    ],
    traineeFullName: 'XXX ZZZ',
    prgEntryNumber: 123456,
    trainingSiteName: 'qwe',
    trainingSiteAddress: 'asd',
    tutorFullName: 'abc',
    tutorGPhCId: 'a123',
    trainingNoOfWeeks: 12
  }

  let traineeDetails = {            
    title: { name: 'XYZ', id: 0 },
    forenames: '',
    middleName: '',
    surname: '',
    address: addressDetails,
    contact: {
        email: 'test@test.com',
        mobilePhone: '123456789',
        telephone1: ''
    },
    dateOfBirth: '01-01-1985',
    qualification: { courseName: 'pharmacy', courseType: 1 },
    equalityDiversity: {
        ethnicity: 0,
        ethnicityOther: '',
        nationality: 0,
        religion: 0,
        religionOther: '',
        disabled: 0,
        disabilityDetails: '',
        gender: 0,
        sexualOrientation: 0
    }
  };

  let assessmentReport = {
    trainee: {            
      title: { name: 'XYZ', id: 0 },
      forenames: '',
      middleName: '',
      surname: '',
      address: addressDetails,
      contact: {
          email: 'test@test.com',
          mobilePhone: '123456789',
          telephone1: ''
      },
      dateOfBirth: '01-01-1985',
      qualification: { courseName: 'pharmacy', courseType: 1 },
      equalityDiversity: {
          ethnicity: 0,
          ethnicityOther: '',
          nationality: 0,
          religion: 0,
          religionOther: '',
          disabled: 0,
          disabilityDetails: '',
          gender: 0,
          sexualOrientation: 0
      }
    },
    training: {
      trainedAt: [
          {
              trainingSite: 'xyz',
              startDate: '01-06-2021',
              endDate: '01-12-2021',
              address: addressDetails
          }
      ],
      tutoredBy: [{ tutorName: 'abc' }],
      reports: [{
          type: TraineeReportType.ThirteenWeekReport,
          result: 'result'
      }],
      numberOfWeeks: 26
    },
    tutorDetails: [{
      tutorGPhCId: '123',
      registrationNumber: '123456',
      name: 'pqr',
      startDate: '01-06-2021',
      endDate: '01-12-2021',
    }],
    isFirstYearPaymentAvailable: true,
    attachments: [],
    form:{},
    forms: [],
    status: ApplicationStatus.InProgress,
    activeForm: new AssessmentReportApplicationForm(formDetails, RegistrantStatus.Applicant),
    pastApplications:[],
    countersignatures: [],
    registrationFees: {
      applicationFee: 100,
      registrationFee: 50,
    },
    isOpen: true,
    thirtyNineWeekReportResult: true
  }

  let regApplication = {
    trainee: {
        title: { name: 'XYZ', id: 0 },
        forenames: '',
        middleName: '',
        surname: '',
        address: {
            line1: 'XXX',
            line2: '',
            line3: '',
            town: 'YYY',
            county: 'ZZZ',
            postcode: 'X123',
            country: 'XYZ'
        },
        contact: {
            email: 'test@test.com',
            mobilePhone: '123456789',
            telephone1: ''
        },
        dateOfBirth: '01-01-1985',
        qualification: { courseName: 'pharmacy', courseType: 1 },
        equalityDiversity: {
            ethnicity: 0,
            ethnicityOther: '',
            nationality: 0,
            religion: 0,
            religionOther: '',
            disabled: 0,
            disabilityDetails: '',
            gender: 0,
            sexualOrientation: 0
        }
    },
    training: {
        trainedAt: [{
            trainingSite: 'ABC',
            startDate: '01-01-2000',
            endDate: '',
            address: new Address({
                line1: 'line 1',
                line2: '',
                line3: '',
                town: 'town x',
                county: 'county',
                postcode: 'a123',
                country: 'ABC'
            })
        }],
        tutoredBy: [],
        reports: [],
        numberOfWeeks: 52
    },
    forms: [{
            id: '123',
            formStatus: 3,
            declarations: [{ dynamicFormId: '345', answers: [] }],
            attachments: [],
            isOverallDeclarationConfirmed: true,
            isTrainingConfirmed: true,
            isAssessmentConfirmed: true,
            letterOfGoodStanding: {
                hasRegistered: true,
                regulatoryBody: 'test',
                registrationNumber: 123,
                isRequested: false
            },
            step: 12,
            minStep: 13,
            mode: 0,
            registrantStatus: 717750006,
            requirePayment: true,
            scope: 4,
            countersignatures: []
    }],
    activeForm: {
      id: '123',
      formStatus: 3,
      declarations: [{ dynamicFormId: '345', answers: [] }],
      attachments: [],
      isOverallDeclarationConfirmed: true,
      isTrainingConfirmed: true,
      isAssessmentConfirmed: true,
      letterOfGoodStanding: {
          hasRegistered: true,
          regulatoryBody: 'test',
          registrationNumber: 123,
          isRequested: false
      },
      step: 12,
      minStep: 13,
      mode: 0,
      registrantStatus: 717750006,
      requirePayment: true,
      scope: 4,
      countersignatures: []
  },
  registrationApplicationScheme : {
    isOpened: true
  }
  };

  let assessmentRegistration = {
    trainee: traineeDetails,      
    activeAssessment: 'yes',
    forms: [new AssessmentRegistrationApplicationForm(formDetails, RegistrantStatus.Applicant)],
    status: ApplicationStatus.NotStarted,
    activeForm: new AssessmentRegistrationApplicationForm(formDetails, RegistrantStatus.Applicant) ,        
    pastApplications: [],
    training:{
        trainedAt: [
            {
                trainingSite: 'xyz',
                startDate: '01-06-2021',
                endDate: '01-12-2021',
                address: new Address(addressDetails)
            }
        ],
        tutoredBy: [{ tutorName: 'abc' }],
        reports: [{
            type: TraineeReportType.ThirteenWeekReport,
            result: 'result'
        }],
        numberOfWeeks: 26
    },
    tutorDetails: [{
        tutorGPhCId: '123',
        registrationNumber: '123456',
        name: 'pqr',
        startDate: '01-06-2021',
        endDate: '01-12-2021',
    }],
    assessmentAttempts: [{
        sitting: 2,
        outcome: 'pass',
        session: 'session'
    }],
    declaration: {
        isQ1Confirmed: null,
        isQ2Confirmed: null,
        isQ3Confirmed: null,
        isQ4Confirmed: null,
      },
    registrationFees: {
        applicationFee: 50,
        registrationFee: 50
    },
    form: {},
    assessmentRegistrationDeadlineDate: '01-06-2022',
    registrationApplicationScheme: {
        isOpened: true,
        openingDate: '01-01-2022'
    },
    isOpen: {}
  };

  let finalDeclaration = {
    trainee: {            
        title: { name: 'XYZ', id: 0 },
        forenames: '',
        middleName: '',
        surname: '',
        address: addressDetails,
        contact: {
            email: 'test@test.com',
            mobilePhone: '123456789',
            telephone1: ''
        },
        dateOfBirth: '01-01-1985',
        qualification: { courseName: 'pharmacy', courseType: 1 },
        equalityDiversity: {
            ethnicity: 0,
            ethnicityOther: '',
            nationality: 0,
            religion: 0,
            religionOther: '',
            disabled: 0,
            disabilityDetails: '',
            gender: 0,
            sexualOrientation: 0
        }
    },
    training: {
        trainedAt: [
            {
                trainingSite: 'xyz',
                startDate: '01-06-2021',
                endDate: '01-12-2021',
                address: addressDetails
            }
        ],
        tutoredBy: [{ tutorName: 'abc' }],
        reports: [{
            type: TraineeReportType.ThirteenWeekReport,
            result: 'result'
        }],
        numberOfWeeks: 26
    },
    tutorDetails: [{
        tutorGPhCId: '123',
        registrationNumber: '123456',
        name: 'pqr',
        startDate: '01-06-2021',
        endDate: '01-12-2021',
    }],
    isFirstYearPaymentAvailable: true,
    attachments: [],
    form: {},
    forms: [],
    status: ApplicationStatus.CounterSigned,
    activeForm: formDetails,
    pastApplications: [],
    countersignatures: [
      {
        registrationNumber: '456789',
        forenames: 'GrH1012236',
        surname: 'RiH1012236',
        town: 'CHH1012236',
        decisionMadeAt: null,
        decision: 2,
        feedback: null,
        isCertifiedPhoto: null,
        countersignerCommentId: null,
        learningContractResponse: null,
        eligibleAsTutor: null
      }
    ],
    registrationFees: {
        applicationFee: 100,
        registrationFee: 50
    },
    isOpen: true,
    thirtyNineWeekReportResult: 'no'
  };

  beforeEach(() => {
    MockAuthService = {
      user: {
        registrationStatus: '09809808',
        forenames: 'srimani',
        showNoticeOfEntry: true
      }
    }
    MockApplication = {
      isFirstYearPaymentAvailable: false
    }
    MockLayoutService = jasmine.createSpyObj('LayoutService',['setBannerState']);
    MockPreregService = jasmine.createSpyObj('PreregService',['getAvailableForm','getRegApplication']);
    MockAssessmentReportService = jasmine.createSpyObj('AssessmentReportService',['getAssessmentReportApplication'] );
    MockAssessmentRegistrationService = jasmine.createSpyObj('AssessmentRegistrationService',['getAssessmentRegistrationApplication'] );
    MockFinalDeclarationService = jasmine.createSpyObj('FinalDeclarationService',['getFinalDeclarationApplication']);
    MockCurrentApplicationService = jasmine.createSpyObj('CurrentApplicationService',['setTrainee']);

    TestBed.configureTestingModule({
      declarations: [
        PreregDashboardComponent,
        BannerComponent,
        UserBadgeComponent,
        FormSectionComponent,
        CaseSplitPipe,
        GphcIconComponent,
      ],
      imports: [
        MatProgressBarModule,
        TooltipModule,
        RouterTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: AuthService, useValue: MockAuthService },
        { provide: PreregService, useValue: MockPreregService },
        { provide: LayoutService, useValue: MockLayoutService },
        { provide: AssessmentReportService, useValue: MockAssessmentReportService},
        { provide: AssessmentRegistrationService, useValue: MockAssessmentRegistrationService},
        { provide: FinalDeclarationService, useValue: MockFinalDeclarationService},
        { provide: CurrentApplicationService, useValue: MockCurrentApplicationService},
        { provide: Router, useValue: routerSpy},
        DatePipe
      ]
    }).compileComponents();    
    fixture = TestBed.createComponent(PreregDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should init correctly', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAvailableForm on ngOnInit ', () => {
    spyOn(component, 'getAvailableForm');
    fixture.detectChanges();
    expect(component.getAvailableForm).toHaveBeenCalled();
  });

  it('should user be defined on ngoninit', () => {
    spyOn(component, 'getAvailableForm');
    fixture.detectChanges();
    expect(component.user).toBeDefined();
  });

  it('should display intro text conditionally', () => {
    spyOn(component, 'getAvailableForm');
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Home');
    const spy = spyOnProperty(component,'showPreregApp', 'get').and.returnValue(true);
    fixture.detectChanges();
    const introText = fixture.nativeElement.querySelector('.intro-text');
    expect(introText.textContent).toContain('A summary of the status of your application for registration');
  });

  it('should display intro text conditionally', () => {
    spyOn(component, 'getAvailableForm');
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Home');
    const spy = spyOnProperty(component,'showPreregApp', 'get').and.returnValue(true);
    fixture.detectChanges();
    const introText = fixture.nativeElement.querySelector('.intro-text');
    expect(introText.textContent).toContain('A summary of the status of your application for registration');
  });

  it('should display intro text conditionally', () => {
    spyOn(component, 'getAvailableForm');
    const spy = spyOnProperty(component,'showAssessmentRegistration', 'get').and.returnValue(true);
    fixture.detectChanges();
    const introText = fixture.nativeElement.querySelector('.intro-text');
    expect(introText.textContent).toContain('A summary of the status of your application to sit the registration assessment');
  });

  it('should display preregTile and applicationTile when condition satisfied', () => {
    spyOn(component, 'getAvailableForm');
    const spyShowPreregApp = spyOnProperty(component,'showPreregApp', 'get').and.returnValue(true);
    const spyTwoColumns = spyOnProperty(component,'twoColumns', 'get').and.returnValue(true);
    fixture.detectChanges();
    var elementArray = fixture.debugElement.queryAll(By.css('.section-header .section-header'));
    expect(elementArray.length).toBeGreaterThan(0);
    expect(elementArray[0].nativeElement.textContent).toBe('Trainee');
    expect(elementArray[1].nativeElement.textContent).toBe('Registration application');
  });

  it('should display preregTile and assessmentReportTile when condition satisfied', () => {
    spyOn(component, 'getAvailableForm');
    const spyAssessmentReport = spyOnProperty(component,'showAssessmentReport', 'get').and.returnValue(true);
    const spyTwoColumns = spyOnProperty(component,'twoColumns', 'get').and.returnValue(true);
    fixture.detectChanges();
    var elementArray = fixture.debugElement.queryAll(By.css('.section-header .section-header'));
    expect(elementArray.length).toBeGreaterThan(0);
    expect(elementArray[0].nativeElement.textContent).toBe('Trainee');
    expect(elementArray[1].nativeElement.textContent).toBe('39 week progress report');
  });

  it('should display preregTile and assessmentRegistrationTile when condition satisfied', () => {
    spyOn(component, 'getAvailableForm');
    const spyAssessmentRegistration = spyOnProperty(component,'showAssessmentRegistration', 'get').and.returnValue(true);
    const spyTwoColumns = spyOnProperty(component,'twoColumns', 'get').and.returnValue(true);
    fixture.detectChanges();
    var elementArray = fixture.debugElement.queryAll(By.css('.section-header .section-header'));
    expect(elementArray.length).toBeGreaterThan(0);
    expect(elementArray[0].nativeElement.textContent).toBe('Trainee');
    expect(elementArray[1].nativeElement.textContent).toBe('Application to sit the registration assessment  (  )');
  });

  it('should call getAssessmentReport when  formScope is ProgressReport', () => {
    const getAssessmentReportSpy: jasmine.Spy = spyOn(component,'getAssessmentReport');
    MockPreregService.getAvailableForm.and.returnValue(of(FormScope.ProgressReport));
    component.getAvailableForm();
    expect(getAssessmentReportSpy).toHaveBeenCalled();
  });

  it('should call getRegApplication when  formScope is Trainee', () => {
    const getRegApplicationSpy: jasmine.Spy = spyOn(component,'getRegApplication');
    MockPreregService.getAvailableForm.and.returnValue(of(FormScope.Trainee));
    component.getAvailableForm();
    expect(getRegApplicationSpy).toHaveBeenCalled();
  });

  it('should call getAssessmentReport when  formScope is AssessmentRegistration', () => {
    const getAssessmentRegistrationApplicationSpy: jasmine.Spy = spyOn(component,'getAssessmentRegistrationApplication');
    MockPreregService.getAvailableForm.and.returnValue(of(FormScope.AssessmentRegistration));
    component.getAvailableForm();
    expect(getAssessmentRegistrationApplicationSpy).toHaveBeenCalled();
  });

  it('should call getFinalDeclarationApplication when  formScope is FinalDeclaration', () => {
    const getFinalDeclarationApplicationSpy: jasmine.Spy = spyOn(component,'getFinalDeclarationApplication');
    MockPreregService.getAvailableForm.and.returnValue(of(FormScope.FinalDeclaration));
    component.getAvailableForm();
    expect(getFinalDeclarationApplicationSpy).toHaveBeenCalled();
  });

  it('should call getAssessmentReportApplication when getAssessmentReport method of component is called', fakeAsync(() => {
    spyOn(component,'getAvailableForm');
    MockAssessmentReportService.getAssessmentReportApplication.and.returnValue(of(assessmentReport));
    component.getAssessmentReport();
    tick();
    expect(component.loadingApplication).toBeFalse();
  }));

  it('should call getRegApplication when getRegApplication method of component is called', () => {
    MockPreregService.getRegApplication.and.returnValue(of(regApplication));
    component.getRegApplication();
    expect(component.loadingApplication).toBeFalse();
  });

  it('should call getAssessmentRegistrationApplication when getAssessmentRegistrationApplication method of component is called', () => {
    MockAssessmentRegistrationService.getAssessmentRegistrationApplication.and.returnValue(of(assessmentRegistration));
    component.getAssessmentRegistrationApplication();
    expect(component.loadingApplication).toBeFalse();
  });

  it('should call getAssessmentRegistrationApplication when getFinalDeclarationApplication method of component is called', () => {
    MockFinalDeclarationService.getFinalDeclarationApplication.and.returnValue(of(finalDeclaration));
    component.getFinalDeclarationApplication();
    expect(component.loadingApplication).toBeFalse();
  });

  it('should display application closed message conditionally', (() => {
    MockAssessmentReportService.getAssessmentReportApplication.and.returnValue(of(assessmentReport));
    component.getAssessmentReport();
    expect(component.applicationClosedMessage).toBeDefined();
    expect(component.applicationClosedMessage).toBe('Not Applicable');
  }));

  it('applicationLink is conditionally set', () => {
    expect(component.applicationLink).toBe('/prereg/application');
  });
});
