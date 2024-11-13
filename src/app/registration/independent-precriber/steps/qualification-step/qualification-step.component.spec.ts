import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { FormStepperService } from "../../../../shared/formStepper/formStepper.service";
import { SupportingDocumentsService } from "../../../../shared/supportingDocuments/supportingDocuments.service";
import { QualificationStepComponent } from "./qualification-step.component";

describe('Qualification Step Component', () => {
    let component: QualificationStepComponent;
    let fixture: ComponentFixture<QualificationStepComponent>;
    let MockFormStepper,MocDocService;

    let MockMatDialog = {
        open(component, config) {
            return dialogRefSpyObj;
        }
    }

    let dialogSpy: jasmine.Spy;
    let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(true), close: null });    
    dialogRefSpyObj.componentInstance = { body: '' }; 

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
            countersignatures: []
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

    const MockUKRegulators = [
        'General Medical Council (Doctors)',
        'Nursing and Midwifery Council (Nurses)',
        'Health and Care Professions Council (Physotherapists)',
        'Health and Care Professions Council (Therapeutic radiographers)',
        'Health and Care Professions Council (Podiatrists)',
        'Health and Care Professions Council (Paramedics)',
        'General Optical Council (Optometrists)'
      ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ QualificationStepComponent],
            imports:[ FormsModule],
            providers: [
                { provide: FormStepperService, useValue: MockFormStepper },
                { provide: SupportingDocumentsService, useValue: MocDocService },
                { provide: MatDialog, useValue: MockMatDialog}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(QualificationStepComponent);
        component = fixture.componentInstance;
        component = Object.assign(component, { application });        
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('onInit define UKRegulators', () => {
        component.ngOnInit();
        expect(component.regulators).toEqual(MockUKRegulators);
    });

    it('validate on documents upload', () => {
        const validateSpy: jasmine.Spy = spyOn(component, 'validate');
        component.ngOnInit();
        component.onDocUpload([]);
        expect(component.applicant.documents).toEqual([]);
        expect(validateSpy).toHaveBeenCalled();
    });

    it('validate on documents delete', () => {
        const validateSpy: jasmine.Spy = spyOn(component, 'validate');
        component.ngOnInit();
        component.onDocDelete([]);
        expect(component.applicant.documents).toEqual([]);
        expect(validateSpy).toHaveBeenCalled();
    });

    it('validation fails when mentor registration is not confirmed ', () => {
        const validateSpy: jasmine.Spy = spyOn(component.validity$, 'next');
        component.prescriberMentorNotRegistered  = true;
        component.ngOnInit();
        component.validate();
        expect(validateSpy).toHaveBeenCalledWith({ valid: false, messages:['Please provide the required information.'] , touched: undefined })
    });

    it('validation is successful when mentor registration is confirmed ', () => {
        const validateSpy: jasmine.Spy = spyOn(component.validity$, 'next');
        component.prescriberMentorNotRegistered  = false;
        component.validate();
        expect(validateSpy).toHaveBeenCalledWith({ valid: true, messages:[] , touched: undefined })
    });

    it('on propogate change call validate method', fakeAsync(() => {
        const validateSpy: jasmine.Spy = spyOn(component, 'validate');
        component.form = new NgForm([],[]);    
        component.propagate();
        expect(validateSpy).toHaveBeenCalled();
    }));

    it('if user confirms choices set choiceconfirmed as true', (() => {
        component.askConfirmation();
        expect(component.choiceConfirmed).toBe(true);        
    }));

    it('if step is valid, nextStepClicked is set true', () => {
        component.valid = true;
        component.populateForm();
        expect(component.nextStepClicked).toBeTrue();
    });
});