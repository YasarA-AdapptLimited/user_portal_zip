import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { MatDialog } from "@angular/material/dialog";
import { of, throwError } from "rxjs";
import { ApplicationStatus } from "../../../../prereg/model/ApplicationStatus";
import { AssessmentReportService } from "../../../../core/service/assessmentReport.service";
import { IndependentPrescriberService } from "../../../../core/service/independentPrescriber.service";
import { LogService } from "../../../../core/service/log.service";
import { FormStepperService } from "../../../../shared/formStepper/formStepper.service";
import { CounterSignatureStepComponent } from "./counter-signature-step.component"
import { RegistrationService } from "../../../../core/service/registration.service";
import { AuthService } from "../../../../core/service/auth.service";
import { RegisterSearchBy } from "../../../../registration/model/RegisterSearchParams";

describe('Counter Signature Component', () => {
    let component: CounterSignatureStepComponent;
    let fixture: ComponentFixture<CounterSignatureStepComponent>;
    let MockFormStepper, MockLogger, MockIndependentPrescriberService, MockMatDialog, MockRegistrationService, MockAuthService;

    MockIndependentPrescriberService = jasmine.createSpyObj(['sendToCountersigner', 'recallFromCountersigner']);
    MockLogger = jasmine.createSpyObj(['info', 'error']);
    MockFormStepper = jasmine.createSpyObj(['disableAllStepsExcept','setStepRange']);
    MockAuthService = {
        user: {
            registrationStatus: '09809808',
            forenames: 'xxx',
            showNoticeOfEntry: true
        }        
    };
    MockRegistrationService = jasmine.createSpyObj(['searchRegister']);

    const application = { 
        courseProvider: 'ABC',
        dateAwarded: new Date('08-30-2020'),
        clinicalSpecialities: '',
        isPrescriberRegistered: null,
        prescriberMentorName: '',
        registrationNumber: '',
        UKregulatoryBody: '',    
        documents: [],
        activeForm: {
            step: 1,
            declaration: {
                isQ1Confirmed: false,
                isQ2Confirmed: false,
                isQ3Confirmed: false,
                isQ4Confirmed: false,
                isQ5Confirmed: false
              },
            formStatus: 1,
            countersignatures: [
                {
                    "id": "xxx",
                    "isMentorRegistered": true,
                    "prescriberMentorName": null,
                    "prescriberRegistrationNo": null,
                    "ukRegulatoryBody": null,
                    "registrationNumber": null,
                    "forenames": null,
                    "surname": null,
                    "countersignerGPhCId": null,
                    "decisionMadeAt": null,
                    "decision": 1,
                    "feedback": null
                }
            ]
        },
        mentorDetails: [
            {
                "tutorGPhCId": "b1875ac5-7aaf-e411-80e6-005056851bfe",
                "name": "Mr Test Tutor 1",
                "registrationNumber": "2044541",
                "startDate": "2019-09-19T00:00:00",
                "endDate": "2020-09-16T00:00:00"
            }
        ],
        forms: [
            {
                "countersignatures": [],
                "id": "xyz",
                "formStatus": 4,
                "step": 1,
                "declaration":{
                "isQ1Confirmed": false,
                "isQ2Confirmed": false,
                "isQ3Confirmed": false,
                "isQ4Confirmed": false,
                "isQ5Confirmed": false
                }
            }
        ],
        equalityDiversity:{
            ethnicity: 1,
            ethnicityOther: 'asd',
            nationality: 2,
            religion: 1,
            religionOther: 'dfg',
            disabled: 1,
            disabilityDetails: 'str',
            gender: 3,
            sexualOrientation: 2
        },
        registrant:{
            title: 'mr',
            forenames: 'str',
            surname: 'ing'
        },
        applicationFee: 250
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ CounterSignatureStepComponent ],
            imports:[],
            providers: [
                { provide: FormStepperService, useValue: MockFormStepper },
                { provide: LogService, useValue: MockLogger },
                { provide: IndependentPrescriberService, useValue: MockIndependentPrescriberService },
                { provide: MatDialog, useValue: MockMatDialog },
                { provide: RegistrationService, useValue: MockRegistrationService},
                { provide: AuthService, useValue: MockAuthService}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(CounterSignatureStepComponent);
        component = fixture.componentInstance;
        component = Object.assign(component, { application });
        component.selectedPharmacist = {
            gphcId: 'xxx',
            registrationNumber: '123',
            forenames: 'abc',
            surname: 'cde',
            town: '',
            learningContractResponse: null,
            eligibleAsTutor: true
          };
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('Call sendToCountersigner method from sendForCountersigning method', () => {
        const dialog = {
          open(comp, data) { return { afterClosed: () => of({ action: true }) } }
        };
        MockIndependentPrescriberService.sendToCountersigner.and.returnValue(of(true));
        component = Object.assign(component, { dialog });
        component.sendForCountersigning();
        expect(MockIndependentPrescriberService.sendToCountersigner).toHaveBeenCalled();        
    });

    it('Can send to countersigning pharmacist', fakeAsync(() => {
        const dialog = {
          open(comp, data) { return { afterClosed: () => of({ action: true }) } }
        };
        MockIndependentPrescriberService.sendToCountersigner.and.returnValue(of(true));
        component = Object.assign(component, { dialog });
        component.sendForCountersigning();
        tick(50);
        expect(component.sending).toBeFalse();      
    }));

    it('Errors should be captured to user if encountered', fakeAsync(() => {
        const dialog = {
          open(comp, data) { return { afterClosed: () => of({ action: true }) } }
        };
        MockIndependentPrescriberService.sendToCountersigner.and.returnValue(throwError({validationErrors: ['error']}));
        component = Object.assign(component, { dialog });
        component.sendForCountersigning();
        tick();
        expect(component.serverErrors).toEqual(['error']);      
    }));

    it('validate form when it is ready for countersigning', () => {
        const validitySpy: jasmine.Spy = spyOn(component.validity$, 'next');
        component.application.activeForm.formStatus = ApplicationStatus.ReadyForCountersigning;
        component.validate();
        expect(validitySpy).toHaveBeenCalledWith(
            {
                valid: false, messages: [`You cannot proceed until your selected prescriber mentor has completed your application.`], touched: undefined
            }
        );
    });

    it('validate form when it is countersigned', () => {
        const validitySpy: jasmine.Spy = spyOn(component.validity$, 'next');
        component.application.activeForm.formStatus = ApplicationStatus.CounterSigned;
        component.validate();
        expect(validitySpy).toHaveBeenCalledWith(
            {
                valid: true, messages: [], touched: undefined
            }
        );
    });

    it('should awaitingCountersigning let know if form is ready for countersigning', () => {
        component.application.activeForm.formStatus = ApplicationStatus.ReadyForCountersigning;       
        expect(component.awaitingCountersigning).toBeTrue();
    });

    it('should countersigned let know if form is countersigned', () => {
        component.application.activeForm.formStatus = ApplicationStatus.CounterSigned;       
        expect(component.countersigned).toBeTrue();
    });

    it('Can recall application from specified Pharmacy professional', () => {
        const validitySpy: jasmine.Spy = spyOn(component.validity$, 'next');
        (MockIndependentPrescriberService.recallFromCountersigner as jasmine.Spy)
          .and.returnValue(of(true));
        (MockFormStepper.setStepRange as jasmine.Spy)
          .and.returnValue(of());
        component.recall();
        expect(component.application.activeForm.formStatus).toBe(ApplicationStatus.InProgress);
        expect(validitySpy).toHaveBeenCalledWith({ valid: false, messages: [], touched: undefined });
    });

    it('populateForm should be defined', () => {
        component.populateForm();
        expect(component.populateForm).toBeDefined();
    });

    it('searchByName property returns true if searchBy is set to name', () => {
        component.searchParams.searchBy = RegisterSearchBy.Name;
        expect(component.searchByName).toBeTrue();
    });

    it('searchByNumber property returns true if searchBy is set to number', () => {
        component.searchParams.searchBy = RegisterSearchBy.Number;
        expect(component.searchByNumber).toBeTrue();
    });

    it('loadResults sets selectedPharmacist value if countersigned',() => {
        component.loadResults();
        expect(component.selectedPharmacist).toBeDefined();
    });

    it('on load loadResults is called', () => {
        const loadResultsSpy: jasmine.Spy = spyOn(component,'loadResults');
        const nextSpy: jasmine.Spy = spyOn(component.ready$,'next');
        component.load();   
        expect(loadResultsSpy).toHaveBeenCalled();
        expect(nextSpy).toHaveBeenCalled();
    });

    it('onInit, if countersigned/readyForcountersigning disable previous step', () => {
        component.application.activeForm.formStatus = ApplicationStatus.CounterSigned;
        component.ngOnInit();
        expect(component.prevDisabled).toBeTrue();
    });

    it('cancelSelection sets selectedPharmaist as undefined', () => {
        const validitySpy: jasmine.Spy = spyOn(component, 'validate');
        component.cancelSelection();
        expect(component.selectedPharmacist).toBeUndefined();
        expect(component.validate).toHaveBeenCalled();
    });

    it('clearNoResults sets noResultsVisisble as false', () => {
        component.clearNoResults();
        expect(component.noResultsVisible).toBeFalse();
    });

    it('search calls searchRegister to fetch pharmacists results', () => {
        MockRegistrationService.searchRegister.and.returnValue(of(''));
        component.search();
        expect(MockRegistrationService.searchRegister).toHaveBeenCalled();
    });

    it('loadMore requests for more results', () => {
        MockRegistrationService.searchRegister.and.returnValue(of(''));        
        component.searchParams.take = component.searchParams.skip = 0;
        component.pharmacists = [];
        component.loadMore();
        expect(MockRegistrationService.searchRegister).toHaveBeenCalled();
    });
})