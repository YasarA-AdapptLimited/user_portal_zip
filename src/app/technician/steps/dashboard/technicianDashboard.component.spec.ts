import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TechnicianDashboardComponent } from './technicianDashboard.component';
import { BannerComponent } from '../../../shared/banner.component';
import { UserBadgeComponent } from '../../../account/userBadge.component';
import { FormSectionComponent } from '../../../shared/formSection.component';
import { AuthService } from '../../../core/service/auth.service';
import { TechnicianService } from '../../../core/service/technician.service';
import { CaseSplitPipe } from '../../../shared/pipe/CaseSplit.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GphcIconComponent } from '../../../shared/gphc-icon.component';
import { TooltipModule } from '../../../core/tooltip/tooltip.module';
import { LayoutService } from '../../../core/service/layout.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('Technician Applicant Dashboard component', () => {
    let fixture: ComponentFixture<TechnicianDashboardComponent>;
    let component: TechnicianDashboardComponent;
    let MockAuthService: Object, MockTechnicianService,
    MockLayoutService: Object, MockApplication;

    beforeEach(() => {
        MockAuthService = {
            user: {
                registrationStatus: '09809808',
                forenames: 'Marius Caesar',
                showNoticeOfEntry: true
            }
        }
        MockApplication = {
            isFirstYearPaymentAvailable: false.valueOf,
            activeForm: {
              educationDetails: {
                knowledge: {
                  dateAwarded: '2019-08-31',
                  dateCommenced: '2019-08-29',
                  id: '123',
                  qualificationId: '12345',
                  qualificationType: 0
                },
                competency: {
                  dateAwarded: '2019-11-29',
                  dateCommenced: '2019-08-29',
                  id: '321',
                  qualificationId: '54321',
                  qualificationType: 1
                }
              },
              workExperiences: []
            },
            trainee: {
              title: { name: '', id: 12345 },
              forenames: 'XYZ',
              middleName: 'XYZ',
              surname: 'XYZ',
              address: {},
              contact: {},
              dateOfBirth: '',
              qualification: { courseName: '', courseType: '' },
              equalityDiversity: {}
            }
          };
        MockTechnicianService = jasmine.createSpyObj(['getApplication']);
        TestBed.configureTestingModule({
            declarations: [
                TechnicianDashboardComponent,
                BannerComponent,
                UserBadgeComponent,
                FormSectionComponent,
                CaseSplitPipe,
                GphcIconComponent,
            ],
            imports: [
                MatProgressBarModule,
                TooltipModule,
                RouterTestingModule
            ],
            providers: [
                { provide: AuthService, useValue: MockAuthService},
                { provide: TechnicianService, useValue: MockTechnicianService},
                { provide: LayoutService, useValue: MockLayoutService},
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(TechnicianDashboardComponent);
        component = fixture.componentInstance;
        component.application = Object.assign({}, MockApplication);
    });
    
    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });


    it('should be able to load application', () => {
       // arrange
        MockTechnicianService.getApplication.and.returnValue(of(MockApplication));
       // act
        component.loadApplication();
       // assert
       expect(component.application).toBeTruthy();
       expect(component.isApplicationOpen).toBeTruthy();
       expect(component.loadingApplication).toBeFalsy();
    });
    
    it('should set errors if unable to load application', () => {
        // arrange
        MockTechnicianService.getApplication
        .and.returnValue(throwError('You have a massive error'));
        // act
        component.loadApplication();
        // assert
        
        // expect(component.error).toBe('You have a massive error');
        expect(component.error).toBeTruthy();
        expect(component.loadingApplication).toBeFalsy();
    });
    

    it('should set user and call load application on init', () => {
        // arrange
        const loadApplicationSpy: jasmine.Spy = spyOn(component, 'loadApplication');
        // act 
        component.ngOnInit();
        // assert
        expect(component.user.forenames).toEqual('Marius Caesar');
        expect(loadApplicationSpy).toHaveBeenCalled();
    });

    it('should display two columns conditionally', () => {
      expect(component.twoColumns).toBeFalse();
    });
    
    it('should display three columns conditionally', () => {
      expect(component.threeColumns).toBeTruthy();
    });

    it('should firstYearPayment conditionally', () => {
      expect(component.showFirstYearPayment).toBeTruthy();
    });
});
