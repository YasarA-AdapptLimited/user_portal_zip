import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TechnicianConfirmationComponent } from './technician-confirmation.component';
import { BannerComponent } from '../../shared/banner.component';
import { CollapsibleComponent } from '../../shared/collapsible.component';
import { AuthService } from '../../core/service/auth.service';
import { TechnicianService } from '../../core/service/technician.service';
import { SpinnerComponent } from '../../shared/spinner.component';
import { CarouselComponent } from '../../shared/carousel.component';
import { UtcDatePipe } from '../../shared/pipe/UtcDate.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutService } from '../../core/service/layout.service';
import { TechnicianActivation } from './model/TechnicianActivation';
import { of } from 'rxjs';
import { LogService } from '../../core/service/log.service';
import { ValidationErrorsComponent } from '../../shared/validationErrors.component';


describe('Technician confirmation component', () => {
    let fixture: ComponentFixture<TechnicianConfirmationComponent>;
    let component: TechnicianConfirmationComponent;
    let MockAuthService: jasmine.Spy;
    let MockTechnicianService;
    let MockLayoutService, mockTechnicianDetails: TechnicianActivation,
    MockLogService;
    


    beforeEach(() => {
        MockAuthService = jasmine.createSpyObj(['logout']);
        MockTechnicianService = jasmine.createSpyObj(['getTechnicianDetails', 'confirmTechnicianDetails']);
        MockLogService = {

        }
        MockLayoutService = {
            setBannerState: () => {
                return true;
            }
        };
        mockTechnicianDetails = {
            forenames: 'Marius',
            middleName: 'Julius',
            surname: 'kwakwa',
            dob: '17/04/1996'
        };
        TestBed.configureTestingModule({
            declarations: [
                TechnicianConfirmationComponent,
                BannerComponent,
                CollapsibleComponent,
                SpinnerComponent,
                CarouselComponent,
                UtcDatePipe,
                ValidationErrorsComponent
            ],
            providers: [
                { provide: AuthService, useValue: MockAuthService},
                { provide: TechnicianService, useValue: MockTechnicianService},
                { provide: LayoutService, useValue: MockLayoutService},
                { provide: LogService, useValue: MockLogService}
            ],
            imports: [
                MatProgressBarModule,
                MatDatepickerModule,
                MatProgressSpinnerModule
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(TechnicianConfirmationComponent);
        component = fixture.componentInstance;
    });
    
    it('should initialise correctly', () => {
        expect(component).toBeTruthy();
    });


    it('should correctly get and set technician details', () => {
        // arrange
        MockTechnicianService.getTechnicianDetails.and.returnValue(of(mockTechnicianDetails));

        // act
        component.ngOnInit();

        // assert
        expect(component.activation).toEqual(mockTechnicianDetails);
    });

    it('should allow user to say whether details are correct or not ', () => {
        // arrange
        MockTechnicianService.getTechnicianDetails.and.returnValue(of(mockTechnicianDetails));
        MockTechnicianService.confirmTechnicianDetails.and.returnValue(of(true));

        // act
        component.selectWhetherConfirmed(true);
        // assert
        expect(component.selectedAnswer).toBeTruthy();
        expect(component.currentStep).toBe(1);
    });

    xit('Should logout when the user is confirmed', () => {
        // arrange
        MockTechnicianService.getTechnicianDetails.and.returnValue(of(mockTechnicianDetails));
        MockTechnicianService.confirmTechnicianDetails.and.returnValue(of(true));
        const setTimeoutSpy: jasmine.Spy = spyOn(window, 'setTimeout');
        // act
        component.selectWhetherConfirmed(true);

        // tick(3000);
        // assert
        expect(setTimeoutSpy).toHaveBeenCalled();
    });
    


});
