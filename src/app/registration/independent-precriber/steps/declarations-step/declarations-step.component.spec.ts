import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from './../../../../core/tooltip/tooltip.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';
import { DeclarationsStepComponent } from './declarations-step.component';


describe('( Independent Prescriber ) => Declaration ', () => {
    let component: DeclarationsStepComponent;
    let fixture: ComponentFixture<DeclarationsStepComponent>;
    let MockFormStepperService;

    const application = {
        activeForm: {
            attachments: null,
            declaration: {
                isQ1Confirmed: null,
                isQ2Confirmed: null,
                isQ3Confirmed: null,
                isQ4Confirmed: null,
                isQ5Confirmed: null
            },
            declarations: null,
            formStatus: null,
            id: null,
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
                isQ4Confirmed: null,
                isQ5Confirmed: null
            },
            declarations: null,
            formStatus: null,
            id: null,
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
                DeclarationsStepComponent,
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
        fixture = TestBed.createComponent(DeclarationsStepComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should return 5 error messages when none of the declarations are confirmed', () => {
       
        component = Object.assign(component, { application });
        
        component.validate();
        expect(component.validity$.value.messages.length).toBe(5);
    });

    it('Should return 4 error messages if only 1 declaration is confirmed', () => {
        
        application.activeForm.declaration.isQ1Confirmed = true;
        component = Object.assign(component, { application });
       
        component.validate();
        expect(component.validity$.value.messages.length).toBe(4);
    });

    it('Should return 3 error messages if only 2 declarations are confirmed', () => {
        
        application.activeForm.declaration.isQ1Confirmed = true;
        application.activeForm.declaration.isQ2Confirmed = true;
        component = Object.assign(component, { application });
    
        component.validate();
        expect(component.validity$.value.messages.length).toBe(3);
    });

    it('Should return 2 error message if only 3 declarations are confirmed', () => {
 
        application.activeForm.declaration.isQ1Confirmed = true;
        application.activeForm.declaration.isQ2Confirmed = true;
        application.activeForm.declaration.isQ3Confirmed = true;
        component = Object.assign(component, { application });
        
        component.validate();
        expect(component.validity$.value.messages.length).toBe(2);
    });

    it('Should return 1 error message if only 4 declarations are confirmed', () => {
      
        application.activeForm.declaration.isQ1Confirmed = true;
        application.activeForm.declaration.isQ2Confirmed = true;
        application.activeForm.declaration.isQ3Confirmed = true;
        application.activeForm.declaration.isQ4Confirmed = true;
        component = Object.assign(component, { application });
        
        component.validate();
        expect(component.validity$.value.messages.length).toBe(1);
    });

    it('should return 0 error message if all the 5 declarations are confirmed', () =>{
        application.activeForm.declaration.isQ1Confirmed = true;
        application.activeForm.declaration.isQ2Confirmed = true;
        application.activeForm.declaration.isQ3Confirmed = true;
        application.activeForm.declaration.isQ4Confirmed = true;
        application.activeForm.declaration.isQ5Confirmed = true;
        component = Object.assign(component, {
            application
        });

        component.validate();
        expect(component.validity$.value.messages.length).toBe(0);
    });
    
});
