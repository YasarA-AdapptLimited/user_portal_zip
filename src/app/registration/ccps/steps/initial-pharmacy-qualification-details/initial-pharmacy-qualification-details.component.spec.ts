import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialPharmacyQualificationDetailsComponent } from './initial-pharmacy-qualification-details.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { AuthService } from '../../../../core/service/auth.service';
import { AccountService } from '../../../../account/service/account.service';
import { CCPSService } from '../../../../core/service/ccps.service';
import { SupportingDocumentsService } from '../../../../shared/supportingDocuments/supportingDocuments.service';
import { of } from 'rxjs';
import { RegistrationRoute } from '../../model/CCPSDetails';
import { LegacyRegistrationRoute } from '../../model/initialPharmacyQualificationDetail';


describe('InitialPharmacyQualificationDetailsComponent', () => {
  
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
            country: "Austria",
            regulatoryBodyId: "d7943ed1",
            contactName: null,
            telephone: null,
            emailAddress: null
        },
        initialRegistrantQualificationDetail: {
            registrationRoute: 717750000,
            eeaPharmacistQualificationDetail: null,
            ukPharmacistQualificationDetail: {
                courseName: 'course Name',
                assessmentYear: '2001',
                courseId: 'asd123',
                yearQualified: '2000'
            },
            ospapPharmacistQualificationDetail: null,
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
            registrationRoute: 717750000,
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

  let component: InitialPharmacyQualificationDetailsComponent;
  let fixture: ComponentFixture<InitialPharmacyQualificationDetailsComponent>;

  let MockFormStepperService, MockAuthService, MockAccountService, MockCCPSService, 
  MockSupportingDocumentService, MockHttp, MockLogService, MockCustomErrorHandler, MockBroadcastService, MockMsalService;
  
  MockAuthService = jasmine.createSpyObj('AuthService',['getAccount', 'confirmEmail','forgotPassword','isCallback','loggerCallback','tokenReceivedCallback','getUserId','setState','updateCachedAddress',
                                                        'updateCachedContact','updateCachedPreference','updateCachedHasCheckedRegistrationDetails','saveUserToLocalStorage',
                                                        'loadUserFromLocalStorage','handleError','login','logout','setToken','deleteToken','loggedInPolCheckTimeout','loggedInPolCheck',
                                                        'setLoggedOut','getCachedToken','redirectToActivation','redirectToConfirmation','enter',
                                                        'getToken','tryAcquireTokenSilently','getTokenFromRemote','ngOnDestroy']);
  MockAccountService = jasmine.createSpyObj('AccountService',['getCountries']);
  MockCCPSService = jasmine.createSpyObj('CCPSService',['getQualificationsList']);
  MockMsalService = jasmine.createSpyObj('MSAL',['getAccount']);
  MockBroadcastService = jasmine.createSpyObj('BroadcastService',['getMSALSubject']);

  MockAccountService = {
    getCountries: () => {
      return of([
        {key: "AU", value: "Australia"},
        {key: "BE", value: "Belgium"}
      ])
    }
  };

  MockCCPSService = {
    getQualificationsList: () => {
      return of({
        qualifications: [
        {
          country : null,
          courseName : "B.Pharm",
          courseType : 981360001,
          id : "730e05a7"
        },
        {
          country : null,
          courseName : "B.Pharm Aston",
          courseType : 981360001,
          id : "730e0abc"
        }
      ]})
    },
    setIsEEARegulatorSelected(coutry) {

    }
  }

  MockAuthService = {
    user: {
        registrant : {
            type: 1
        }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialPharmacyQualificationDetailsComponent ],
      providers: [{ provide: FormStepperService, useValue: MockFormStepperService},
                  { provide: AuthService, useValue: MockAuthService},
                  { provide: AccountService, useValue: MockAccountService},
                  { provide: CCPSService, useValue: MockCCPSService},
                  { provide: SupportingDocumentsService, useValue: MockSupportingDocumentService}] 
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialPharmacyQualificationDetailsComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, {application});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setRouteDetailsNull sets all the route details as null', () => {
    component.setRouteDetailsNull();
    expect(component.initQualDetail.irelandPharmacistQualificationDetail).toBeNull();
  });

  it('enforceMax, does not allow user to enter more than 4 digits', () => {
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.UK;
    component.getRegistrationRoute();
    component.enforceMax({target:{value: 20005}},'UK','yearQualified');
    expect(component.initQualDetail.ukPharmacistQualificationDetail.yearQualified).toBe(2000);
  });

  it('isYearInvalid checks if qualified year is in the required range', () => {
    let currentYear = new Date().getFullYear(); 
    expect(component.isYearInvalid(1930,'yearQualified')).toBe(`Year passed should be between 1955 and ${currentYear}`);
  });

  it('isYearInvalid checks if assessment year is in the right range', () => {
    let currentYear = new Date().getFullYear(); 
    expect(component.isYearInvalid(1930,'assessmentYear')).toBe(`Assessment year should be between 1993 and ${currentYear}`);
  });

  it('validate on documents upload', () => {
    const validateSpy: jasmine.Spy = spyOn(component, 'validate');
    component.ngOnInit();
    component.onDocUpload([]);
    expect(component.application.activeForm.attachments).toEqual([]);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('validate on documents delete', () => {
    const validateSpy: jasmine.Spy = spyOn(component, 'validate');
    component.ngOnInit();
    component.onDocDelete();
    expect(component.application.activeForm.attachments).toEqual([]);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('if no pharmacy technician details are entered, isPTDetailsEntered returns null', () => {
    component.initQualDetail.pharmacyTechnicianQualificationDetail = {
        degreeName1: null,
        degreeName2: null,
        qualifiedDate1: null,
        qualifiedDate2: null
    }
    expect(component.isPTDetailsEntered).toBeNull();
  });

  it('setCourseName, sets course name based on the route', () => {
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.UK;
    component.getRegistrationRoute();
    component.setCourseName('730e05a7');
    expect(component.initQualDetail.ukPharmacistQualificationDetail.courseName).toBeDefined();
  });

  it('checkIfInValid - returns true if value is either "" or null', () => {
    expect(component.checkIfInValid('')).toBe(true);
  });

  it('method populateForm should be defined', () => {
    component.populateForm();
    expect(component.populateForm).toBeDefined();
  });

  it('updateTrainingDetails, updates the training details as provided', () => {
    let trainingDetails = [{
        id: "123456",
        trainingSiteName: "Pharmacy",
        trainingSiteAddress: "51f Beech Avenue,,,NORTHAMPTON,Northamptonshire,UK,NN3 2JG",
        trainingStartDate: "2007-07-01T00:00:00",
        trainingEndDate: "2008-06-20T00:00:00"
    }];
    component.updateTrainingDetails(trainingDetails);
    expect(component.initQualDetail.trainingDetails).toBeDefined();

  });

  it('checkIfTrainingDetailsExists, returns true if training details exist', () => {
    expect(component.checkIfTrainingDetailsExists).toBeTrue();
  });

  it('on call of onDateSelection, set date and validate', () => {
    const validateSpy = spyOn(component,'validate');
    component.initQualDetail.pharmacyTechnicianQualificationDetail = {
        degreeName1: null,
        degreeName2: null,
        qualifiedDate1: null,
        qualifiedDate2: null
    }
    component.onDateSelection('qualifiedDate1','11/17/2023');
    expect(validateSpy).toHaveBeenCalled();
  });

  it('isEEARegulatorSelected, returns true if the country selected is a EEA regulator', () => {
    expect(component.isEEARegulatorSelected).toBeTrue();
  });

  it('setCourseName, sets course name based on the route(northern ireland)', () => {
    component.registrationRouteSwitchValue = 'Northern Ireland';
    component.initQualDetail.irelandPharmacistQualificationDetail = {
        courseId: null,
        courseName: null,
        yearObtained: null
    }
    component.setCourseName('730e05a7');
    expect(component.initQualDetail.irelandPharmacistQualificationDetail.courseName).toBeDefined();
  });

  it('CV upload is only required if EEA Directive route is Article23/GS', () => {
    component.initQualDetail.eeaPharmacistQualificationDetail = {
        countryQualified: 'Austria',
        eeaDirectiveRoute: 'GS',
        countryFirstRecognized: 'Austria'
    }
    expect(component.isCVUploadRequired()).toBeTrue();
  });

  it('getRegistrationRoute, set route details based on route - EEA', () => {
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.EEA;
    component.getRegistrationRoute();
    expect(component.registrationRouteSwitchValue).toBe('EEA');
  });

  it('EEA - on validation error messages are shown if any of the mandatory fields are not entered', () => {
    const validitySpy = spyOn(component.validity$,'next');

    component.initQualDetail.eeaPharmacistQualificationDetail = {
        countryQualified: 'Austria',
        eeaDirectiveRoute: 'GS',
        countryFirstRecognized: 'Austria'
    };
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.EEA;
    
    component.getRegistrationRoute();
    component.validate();
    expect(validitySpy).toHaveBeenCalledWith({valid: false, messages: [ 'Please select the EEA directive route', 'Please provide the course details'],touched: undefined});
  });

  it('getRegistrationRoute, set route details based on route - OSPAP', () => {
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.OSPAP;
    component.application.personalDetails.registration.legacyRegistrationRoute = LegacyRegistrationRoute.Adjudicating;
    component.getRegistrationRoute();
    expect(component.registrationRouteSwitchValue).toBe('OSPAP');
  });

  
  it('OSPAP - on validation error messages are shown if any of the mandatory fields are not entered', () => {
    const validitySpy = spyOn(component.validity$,'next');

    component.initQualDetail.ospapPharmacistQualificationDetail = {
                ospapCountryQualified: null,
                degreeName: null,
                universityName: null,
                yearObtained: null,
                ospapCourseId: null,
                ospapCourseName: null,
                ospapDateQualified: null,
                assessmentYear: null
            }
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.OSPAP;
    component.application.personalDetails.registration.legacyRegistrationRoute = LegacyRegistrationRoute.Adjudicating;

    component.getRegistrationRoute();
    component.validate();

    expect(validitySpy).toHaveBeenCalledWith({valid: false, messages: ['Please enter all the OSPAP qualification details'],touched: undefined});
  });

  it('getRegistrationRoute, set route details based on route - Reciprocity', () => {
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.Legacy;
    component.application.personalDetails.registration.legacyRegistrationRoute = LegacyRegistrationRoute.Reciprocity;
    component.getRegistrationRoute();
    expect(component.registrationRouteSwitchValue).toBe('Reciprocity');
  });

  it('Reciprocity - no error messages are shown if all mandatroy details are entered', () => {
    const validitySpy = spyOn(component.validity$,'next');

    component.initQualDetail.ospapPharmacistQualificationDetail = {
                ospapCountryQualified: null,
                degreeName: null,
                universityName: null,
                yearObtained: null,
                ospapCourseId: null,
                ospapCourseName: null,
                ospapDateQualified: null,
                assessmentYear: null
            }
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.Legacy;
    component.application.personalDetails.registration.legacyRegistrationRoute = LegacyRegistrationRoute.Reciprocity;

    component.getRegistrationRoute();
    component.validate();

    expect(validitySpy).toHaveBeenCalledWith({valid: false, messages: [ 'Please enter all the qualification details'],touched: undefined});
  });

  it('getRegistrationRoute, set route details based on route - Northern Ireland', () => {
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.NorthernIreland;
    component.getRegistrationRoute();
    expect(component.registrationRouteSwitchValue).toBe('Northern Ireland');
  });

  
  it('Northern Ireland - no error messages are shown if all mandatroy details are entered', () => {
    const validitySpy = spyOn(component.validity$,'next');

    component.initQualDetail.irelandPharmacistQualificationDetail = {
        courseId: null,
        courseName: null,
        yearObtained: null
    }
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.NorthernIreland;

    component.getRegistrationRoute();
    component.validate();

    expect(validitySpy).toHaveBeenCalledWith({valid: false, messages: [ 'Please enter year passed'],touched: undefined});
  });
  
  it('UK - on validation error messages are shown if any of the mandatory fields are not entered', () => {
    const validitySpy = spyOn(component.validity$,'next');

    component.initQualDetail.ukPharmacistQualificationDetail = {
        courseName: 'course Name',
        assessmentYear: '2001',
        courseId: 'asd123',
        yearQualified: 2000
    }
    component.application.personalDetails.registration.registrationRoute = RegistrationRoute.UK;

    component.getRegistrationRoute();
    component.validate();
    expect(validitySpy).toHaveBeenCalledWith({valid: true, messages: [],touched: undefined});
  });

});
