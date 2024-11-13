import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TechnicianActivationComponent } from './technicianActivation.component';
import { FormsModule } from '@angular/forms';
import { CollapsibleComponent } from '../../shared/collapsible.component';
import { ValidationErrorsComponent } from '../../shared/validationErrors.component';
import { DobComponent } from './dob.component';
import { SpinnerComponent } from '../../shared/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/service/auth.service';
import { TechnicianService } from '../../core/service/technician.service';
import { TechnicianActivation } from './model/TechnicianActivation';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Technician Activation component', () => {
    let fixture: ComponentFixture<TechnicianActivationComponent>;
    let component: TechnicianActivationComponent;
    let MockAuthService: jasmine.Spy;
    let MockTechnicianService;

    beforeEach(() => {
        MockAuthService = jasmine.createSpyObj(['logout']);
        MockTechnicianService = jasmine.createSpyObj(['tempSignUp']);
        TestBed.configureTestingModule({
            declarations: [
                TechnicianActivationComponent,
                CollapsibleComponent,
                ValidationErrorsComponent,
                DobComponent,
                SpinnerComponent
            ],
            imports: [
                FormsModule,
                MatProgressSpinnerModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: AuthService, useValue: MockAuthService },
                { provide: TechnicianService, useValue: MockTechnicianService },
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(TechnicianActivationComponent);
        component = fixture.componentInstance;
    });

    it('should be initialised correctly', () => {
        expect(component).toBeTruthy();
    });


    it('should move forward to email confirmation screen, if tempSign up worked', () => {
        // arrange
        component.step = 1;
        MockTechnicianService.tempSignUp.and.returnValue(of(true));
        const mockDetails: TechnicianActivation = {
            forenames: 'Marius',
            middleName: 'Subutai',
            surname: 'Mukhali',
            dob: '17-04-1996'
        };
        component.activation = mockDetails;
        const stepChange: jasmine.Spy = spyOn(component.stepChange, 'emit');
        // act
        component.tempSignUp();
        // assert
        expect(stepChange).toHaveBeenCalledWith(2);
    });

        
    it('should set validation errors if unable to temporarily sign up', fakeAsync(() => {
        // arrange
        component.step = 1;
        const mockError = {
            status: 400,
            validationErrors:  ['You have a massive error on your hands']
        };
        MockTechnicianService.tempSignUp.and.returnValue(throwError(mockError));
        const mockDetails: TechnicianActivation = {
            forenames: 'Marius',
            middleName: 'Subutai',
            surname: 'Mukhali',
            dob: '17-04-1996'
        };
        component.activation = mockDetails;
        const setFocusSpy: jasmine.Spy = spyOn(component, 'setFocus');
        // act
        fixture.detectChanges();
        component.tempSignUp();
        tick(3000);
        // assert
        expect(component.serverErrors).toEqual(mockError.validationErrors);
        expect(setFocusSpy).toHaveBeenCalled();
    }));

    
    it('should be able to correctly set the dob', () => {
        // arrange
        component.activation = {
            forenames: '',
            surname: '',
            dob: '',
            middleName: ''
        };
        const mockdob = '17/04/1996';
        // act 
        component.dobSelected(mockdob);
        // expect
        expect(component.activation.dob).toEqual(mockdob);
    });



});
