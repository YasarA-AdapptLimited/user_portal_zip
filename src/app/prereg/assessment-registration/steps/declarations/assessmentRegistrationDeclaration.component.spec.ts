import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from './../../../../core/tooltip/tooltip.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { ApplicantComponent } from './../../../../account/applicant.component';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ContactEditComponent } from '../../../../account/contactEdit.component';
import { AddressComponent } from '../../../../account/address.component';
import { AssessmentRegistrationDeclarationComponent } from './assessmentRegistrationDeclaration.component';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';


describe('( Assessment Registration ) => Declaration ', () => {
    let component: AssessmentRegistrationDeclarationComponent;
    let fixture: ComponentFixture<AssessmentRegistrationDeclarationComponent>;
    let MockFormStepperService;

    const application = {
        trainee: null,
        activeAssessment: null,
        activeForm: {
            attachments: null,
            declaration: {
                isQ1Confirmed: null,
                isQ2Confirmed: null,
                isQ3Confirmed: null,
                isQ4Confirmed: null
            },
            declarations: null,
            formStatus: null,
            id: null,
            isOverallDeclarationConfirmed: true,
            minStep: null,
            mode: null,
            get readonly() {
                return true;
            },
            step: null,
            registrantStatus: null,
            requirePayment: null,
            trainee: null,
            scope: null
        },
        attachments: null,
        forms: [{
            attachments: null,
            declaration: {
                isQ1Confirmed: null,
                isQ2Confirmed: null,
                isQ3Confirmed: null,
                isQ4Confirmed: null
            },
            declarations: null,
            formStatus: null,
            id: null,
            isOverallDeclarationConfirmed: true,
            minStep: null,
            mode: null,
            get readonly() {
                return true;
            },
            step: null,
            registrantStatus: null,
            requirePayment: null,
            trainee: null,
            scope: null
        }],
        pastApplications: null,
        registrationFees: { applicationFee: 250, registrationFee: 250 },
        status: ApplicationStatus.InProgress,
    }

    beforeEach(() => {
        MockFormStepperService = {};
        TestBed.configureTestingModule({
            declarations: [
                AssessmentRegistrationDeclarationComponent,
                GphcIconComponent,
                CollapsibleComponent
            ],
            imports: [
                TooltipModule,
                FormsModule,
                ReactiveFormsModule,
                MatCheckboxModule,
                MatAutocompleteModule
            ],
            providers: [
                { provide: FormStepperService, useValue: MockFormStepperService }
            ]

        }).compileComponents();
        fixture = TestBed.createComponent(AssessmentRegistrationDeclarationComponent);
        component = fixture.componentInstance;
        component = Object.assign(component, { application });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should return 4 error messages when none of the declarations are confirmed', () => {
        component.application.activeForm.declaration.isQ1Confirmed = null;
        component.application.activeForm.declaration.isQ2Confirmed = null;
        component.application.activeForm.declaration.isQ3Confirmed = null;
        component.application.activeForm.declaration.isQ4Confirmed = null;
        component.validate();
        expect(component.validity$.value.messages.length).toBe(4);
    });

    it('Should return 3 error messages if only 1 declaration is confirmed', () => {
        //  const application = getDefaultApplication;
        component.application.activeForm.declaration.isQ1Confirmed = true;
        component.application.activeForm.declaration.isQ2Confirmed = null;
        component.application.activeForm.declaration.isQ3Confirmed = null;
        component.application.activeForm.declaration.isQ4Confirmed = null;
        component.validate();
        expect(component.validity$.value.messages.length).toBe(3);
    });

    it('Should return 2 error messages if only 2 declarations are confirmed', () => {
        component.application.activeForm.declaration.isQ1Confirmed = true;
        component.application.activeForm.declaration.isQ2Confirmed = true;
        component.application.activeForm.declaration.isQ3Confirmed = null;
        component.application.activeForm.declaration.isQ4Confirmed = null;
        component.validate();
        expect(component.validity$.value.messages.length).toBe(2);
    });

    it('Should return 1 error message if only 3 declarations are confirmed', () => {
        component.application.activeForm.declaration.isQ1Confirmed = true;
        component.application.activeForm.declaration.isQ2Confirmed = true;
        component.application.activeForm.declaration.isQ3Confirmed = true;
        component.application.activeForm.declaration.isQ4Confirmed = null;
        component.validate();
        expect(component.validity$.value.messages.length).toBe(1);
    });

    it('Should return 0 error message if only 3 declarations are confirmed', () => {
        component.application.activeForm.declaration.isQ1Confirmed = true;
        component.application.activeForm.declaration.isQ2Confirmed = true;
        component.application.activeForm.declaration.isQ3Confirmed = true;
        component.application.activeForm.declaration.isQ4Confirmed = true;
        component = Object.assign(component, { application });
        component.validate();
        expect(component.validity$.value.messages.length).toBe(0);
    });

    it('update make calls to makeDirty and validate method', () => {
        const makeDirtySpy: jasmine.Spy = spyOn(component, 'makeDirty');
        const validateSpy: jasmine.Spy = spyOn(component, 'validate');

        component.update();
        expect(makeDirtySpy).toHaveBeenCalled();
        expect(validateSpy).toHaveBeenCalled();
    });

    it('on viewReady, load method triggers ready$ ', fakeAsync(() => {
        const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');
        component.ngAfterViewInit();
        tick();
        expect(ready$Spy).toHaveBeenCalledWith(true);
    }));
});
