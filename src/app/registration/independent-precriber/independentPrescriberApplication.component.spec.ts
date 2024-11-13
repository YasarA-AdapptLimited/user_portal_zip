import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { BannerComponent } from "../../shared/banner.component";
import { AuthService } from "../../core/service/auth.service";
import { IndependentPrescriberService } from "../../core/service/independentPrescriber.service";
import { LayoutService } from "../../core/service/layout.service";
import { LogService } from "../../core/service/log.service";
import { IndependentPrescriberApplicationComponent } from "./independentPrescriberApplication.component";
import { FormStepperMenuComponent } from "../../shared/formStepper/formStepperMenu.component";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { IndependentPrescriberApplication } from "./model/IndependentPrescriberApplication";
import { RegistrantStatus } from "../model/RegistrantStatus";
import { FormStepperService } from "../../shared/formStepper/formStepper.service";
import { ApplicationStatus } from "../../prereg/model/ApplicationStatus";
import { QualificationStepComponent } from "./steps/qualification-step/qualification-step.component";
import { CounterSignatureStepComponent } from "./steps/counter-signature-step/counter-signature-step.component";
import { PaymentStepComponent } from "./steps/payment-step/payment-step.component";
import { DeclarationsStepComponent } from "./steps/declarations-step/declarations-step.component";
import { EdiStepComponent } from "./steps/edi-step/edi-step.component";
import { EdiService } from "../../account/service/edi.service";
import { RenewalService } from "../../core/service/renewal.service";
import { FormStepperComponent } from "../../shared/formStepper/formStepper.component";
import { RegistrationService } from "../../core/service/registration.service";
import { GphcIconComponent } from "../../shared/gphc-icon.component";
import { IndependentPrescriberFinalReviewComponent } from "./steps/final-review-step/independentPrescriberApplicationFinalReview.component";
import { FormsModule } from "@angular/forms";

describe('Independent Prescriber Application Component', () => {
    let component: IndependentPrescriberApplicationComponent;
    let fixture: ComponentFixture<IndependentPrescriberApplicationComponent>;
    let MockAuthService, MockIndependentPrescriberService, MockLayoutService, MockLogService, MockMatDialog, MockFormStepperService;
    let MockEdiService, MockRenewalService, MockRegistrationService;

    MockIndependentPrescriberService = jasmine.createSpyObj('IndependentPrescriberService', ['getApplication','setStep', 'saveApplication']);
    MockAuthService = {
        user: {
            registrationStatus: '09809808',
            forenames: 'XYZ',
            registrant: {
                isIndyPrescAppAvailable : true
            }
          }
    };


    MockFormStepperService = jasmine.createSpyObj('FormStepperService', ['update','getFurthestStep', 'updateStepsId', 'setCurrentStep', 'init'],{
        summary: [
            {'title': 'Qualification Details',
             'validity':  {
                touched: true,
                valid: true,
                messages: []
              }},
            {'title': 'Countersignature',
            'validity':  {
                touched: true,
                valid: true,
                messages: []
              }},
            {'title': 'Payment',
            'validity':  {
                touched: false,
                valid: null,
                messages: []
              }
            },
            {'title': 'ED&I Details',
            'validity':  {
                touched: false,
                valid: null,
                messages: []
              }
            },
            {'title': 'Declarations',
            'validity':  {
                touched: false,
                valid: null,
                messages: []
              }}
        ],
        steps: [
            {
                current: true,
                stepId: 1,
                title: 'Qualification Details',
                validity: { valid: true, messages: [], touched: false },
                disabled: false,
                waiting: true
            },
            {
                current: false,
                stepId: 2,
                title: 'Countersignature',
                validity: { valid: true, messages: [], touched: false },
                disabled: false,
                waiting: true
            },
            {
                current: false,
                stepId: 3,
                title: 'Payment',
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
                title: 'Declarations',
                validity: { valid: true, messages: [], touched: false },
                disabled: false,
                waiting: true
            }
        ]
    });

    MockLayoutService = {
        setBannerState: () => {
            return true;
        },
        state: {
            fullscreen: ''
        },
        setOverlay: () => {}
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
                                                        title: 'Qualification Details'
                                                    },
                                                    {
                                                        stepId: 2,
                                                        title: 'CounterSignature'
                                                    },
                                                    {
                                                        stepId: 3,
                                                        title: 'EDI'
                                                    },
                                                    {
                                                        stepId: 4,
                                                        title: 'Declaration'
                                                    },{
                                                        stepId: 5,
                                                        title: 'Payment'
                                                    },
                                                    
                                                ]
                                        });

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
            formStatus: ApplicationStatus.InProgress,
            countersignatures: [
                {
                    "id": "xxx",
                    "isMentorRegistered": false,
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
        form: 
            {
                "countersignatures": [
                    {
                        "id": "xxx",
                        "isMentorRegistered": false,
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
                ],
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
        ,
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
            declarations: [IndependentPrescriberApplicationComponent,
                           BannerComponent,
                           FormStepperMenuComponent,
                           QualificationStepComponent,
                           CounterSignatureStepComponent,
                           DeclarationsStepComponent,
                           EdiStepComponent,
                           PaymentStepComponent,
                           FormStepperComponent,
                           GphcIconComponent,
                           IndependentPrescriberFinalReviewComponent
                        ],
            imports: [
                        MatMenuModule,
                        FormsModule
                    ],
            providers: [
                { provide: AuthService, useValue: MockAuthService},
                { provide: IndependentPrescriberService, useValue: MockIndependentPrescriberService},
                { provide: LayoutService, useValue: MockLayoutService},
                { provide: LogService, useValue: MockLogService},
                { provide: MatDialog, useValue: MockMatDialog },
                { provide: EdiService, useValue: MockEdiService},
                { provide: RenewalService, useValue: MockRenewalService},
                { provide: RegistrationService, useValue: MockRegistrationService }
            ]
        }).compileComponents();

        TestBed.overrideComponent(IndependentPrescriberApplicationComponent, {
            set: {
                providers: [
                    { provide: FormStepperService, useValue: MockFormStepperService}
                ]
            }
        })
        fixture = TestBed.createComponent(IndependentPrescriberApplicationComponent);
        component = fixture.componentInstance;
        component = Object.assign(component, { application });
        component.formStepperComponents = formStepperComponents;
        component.formStepper = formStepper;
    });

    it('should init correctly', () => {
        expect(component).toBeDefined();
    });

    it('on init load application', () => {
        const loadSpy: jasmine.Spy = spyOn(component, 'load');
        component.ngOnInit();
        expect(loadSpy).toHaveBeenCalled();
    });


    it('on load application is defined', fakeAsync(() => {
        MockIndependentPrescriberService.getApplication.and.returnValue(of(new IndependentPrescriberApplication(application, RegistrantStatus.Applicant)));
        component.load();
        tick();
        expect(component.application).toEqual(new IndependentPrescriberApplication(application, RegistrantStatus.Applicant));
    }));
    
    it('on load application is defined', fakeAsync(() => {
        MockIndependentPrescriberService.getApplication.and.returnValue(throwError(new Error('error')));
        component.load();
        tick();
        expect(component.loadingError).toBeTrue();
    }));

    it('navigate to paticular step', () => {
        component.goToStepId(1);
        expect(component.formStepper.goToStep).toHaveBeenCalled();
    });

    it('if step is disabled navigation is not allowed', () => {
        expect(component.goToStep({
            stepId: 1,
            title: 'ABC',
            current: true,
            validity:  {
                touched: true,
                valid: true,
                messages: []
              },
            disabled: true,
            waiting: false
        })).toBeUndefined();
    });

    it('navigate to paticular step if not disabled', () => {
        component.goToStep({
            stepId: 1,
            title: 'ABC',
            current: true,
            validity:  {
                touched: true,
                valid: true,
                messages: []
              },
            disabled: false,
            waiting: false
        });
        expect(component.formStepper.goToStep).toHaveBeenCalled();
    });

    it('update step of application on change', () => {
        component.stepChanged(1);
        expect(component.application.activeForm.step).toBeDefined();
    });

    it('cloneSteps keeps a copy of all steps', () => {
        component.formStepper.steps = [];
        component.cloneSteps();
        expect(component.allSteps).toBeDefined();
    });

    it('cloneSummary keeps a copy of all steps summary', () => {
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
        expect(component.allStepSummary).toBeDefined();
    });

    it('warn user of unsaved changes', () => {
        const dialog = { open(component, data) { return {afterClosed() : Observable<any>{ return new Observable(undefined) }} }}; 
        component = Object.assign(component, { dialog });
        const dialogRef = dialog.open('',{});
        expect(component.warnForDirty()).toBeDefined();
    });

    it('warn user during deactivation', () => {
        const warnForDirtySpy: jasmine.Spy = spyOn(component,'warnForDirty');
        expect(component.canDeactivate()).toBe(true);
    });

    it('stepChange checks if current step has no errors', () => {
        const saveSpy: jasmine.Spy = spyOn(component,'save');
        saveSpy.and.returnValue(new Promise<void>((resolve, reject) => {resolve();}));
        expect(component.stepChange()).toBeDefined();
    });

    it('stepChange checks if current step has errors', () => {
        const saveSpy: jasmine.Spy = spyOn(component,'save');
        const err = {
            error: {
                validationErrors: ['error']
            }
        }
        saveSpy.and.returnValue(new Promise<void>((resolve, reject) => {reject(err)}));
        // component.formStepper = { currentStep: { dirty: true, serverErrors: []}};
        expect(component.stepChange()).toBeDefined();
        // expect(component.stepChange()()).toBeDefined();
    });

    it('stepChange allows to proceed if currentStep is not dirty', () => {
        expect(component.stepChange()).toBeDefined();
    });

    it('submitted prop returns true if formStatus is submitted', () => {
        component.application.activeForm.formStatus = ApplicationStatus.Submitted;
        expect(component.submitted).toBeTrue();
    });

    it('canDeactivate returns true currentStep is not defined', () => {
        expect(component.canDeactivate()).toBeTrue();
    });

    it('stepChanged updates stepId', fakeAsync(() => {
        MockIndependentPrescriberService.setStep.and.returnValue(of());
        component.stepChanged(1);
        tick(1000);
        expect(component.application.activeForm.step).toBe(1);
    }));

    it('getPrescriber fetches application', fakeAsync(() => {
        MockIndependentPrescriberService.getApplication.and.returnValue(of(''));
        const resolveFunction = function() {};
        const rejectFunction = function() {};
        component.respond = function() {
                return of(true)
        }
        component.getPrescriber(resolveFunction, rejectFunction);
        tick();
        expect(component.saving).toBeFalse();
    }));

    it('getPrescriber throws error if something goes wrong while fetching application', fakeAsync(() => {
        MockIndependentPrescriberService.getApplication.and.returnValue(throwError(new Error('error')));
        const resolveFunction = function() {};
        const rejectFunction = function() {};
        component.respond = function() {
                return of(true)
        }
        component.getPrescriber(resolveFunction, rejectFunction);
        tick();
        expect(component.saving).toBeFalse();
    }));

    it('save calls savePrescriber', () => {
        const savePrescriberSpy: jasmine.Spy = spyOn(component, 'savePrescriber');
        MockFormStepperService.getFurthestStep.and.returnValue(of(1));
        component.save();
        expect(savePrescriberSpy).toHaveBeenCalled();
    });

    it('savePrescriber updates application formStatus', () => {
        const resolveFunction = function() {};
        const rejectFunction = function() {};
        const respondSpy: jasmine.Spy = spyOn(component, 'respond');
        MockIndependentPrescriberService.saveApplication.and.returnValue(of(''));
        component.savePrescriber(resolveFunction, rejectFunction);
        component.application.activeForm.formStatus = ApplicationStatus.CounterSigned;
        expect(component.saving).toBeFalse();
    });

    it('respond method returns observable', () => {
        expect(component.respond()).toBeDefined();
    });

    it('checkIfCounterSignatureHasToBeDisplayed allow display of Countersignature step is true is passed', () => {
        const updateStepIdSpy: jasmine.Spy = spyOn(component, 'updateStepId');
        const cloneStepsSpy: jasmine.Spy = spyOn(component, 'cloneSteps');
        const cloneSummarySpy: jasmine.Spy = spyOn(component, 'cloneSummary');
        component.checkIfCounterSignatureHasToBeDisplayed(true);
        expect(updateStepIdSpy).toHaveBeenCalled();
    });

    it('updateStepId defines initialSteps', () => {
        component.cloneSummary();
        MockFormStepperService.updateStepsId.and.returnValue(of(true));
        component.updateStepId();
        expect(component.initialSteps).toBeDefined();
    });
});
