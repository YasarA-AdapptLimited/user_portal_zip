import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TechnicianDetailsComponent } from './technicianDetails.component'
import { BannerComponent } from '../shared/banner.component';
import { FormSectionComponent } from '../shared/formSection.component';
import { UserBadgeComponent } from '../account/userBadge.component';
import { AuthService } from '../core/service/auth.service';
import { TechnicianService } from '../core/service/technician.service';
import { LayoutService } from '../core/service/layout.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GphcIconComponent } from '../shared/gphc-icon.component';
import { TooltipModule } from '../core/tooltip/tooltip.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DobDatePipe } from '../shared/pipe/DobDate.pipe';
import { of } from 'rxjs';

describe('Technician applicant details component', () => {
    let fixture: ComponentFixture<TechnicianDetailsComponent>;
    let component: TechnicianDetailsComponent;
    let MockAuthService, MockTechnicianService, MockLayoutService: Object;

    beforeEach(() => {
        MockTechnicianService = jasmine.createSpyObj('TechnicianService',['getApplication']);
        MockLayoutService = jasmine.createSpyObj('LayoutService',['setBannerState']);
        MockAuthService = {
            user: {
                registrationStatus: 717750004
            }
        };
        TestBed.configureTestingModule({
            declarations: [
                TechnicianDetailsComponent,
                BannerComponent,
                FormSectionComponent,
                UserBadgeComponent,
                GphcIconComponent,
                DobDatePipe
            ],
            providers: [
                { provide: AuthService, useValue: MockAuthService },
                { provide: TechnicianService, useValue: MockTechnicianService },
                { provide: LayoutService, useValue: MockLayoutService },
            ],
            imports: [
                MatProgressBarModule,
                TooltipModule,
                RouterTestingModule
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(TechnicianDetailsComponent);
        component = fixture.componentInstance;
    });
    it('Should intialise correctly', () => {
        expect(component).toBeTruthy();
    });    
    it('create an instance', () => {
        let pipe = new DobDatePipe();
        expect(pipe).toBeTruthy();
    });
    it('should method ngOnInit call getApplication of Technician service',() => {
        let application = {trainee:{
            title: { name: 'XXX', id: 123 },
            forenames: 'XYZ',
            middleName: 'YYY',
            surname: 'ZZZ',
            address: { line1: 'xxx',
                        line2: '',
                        line3: '',
                        town: 'yyy',
                        county: 'zzz',
                        postcode: '123',
                        country: 'xyz'
                    },
            contact: { email: 'test@test.com',
                        awaitingEmailConfirmation: true,
                        mobilePhone: '',
                        telephone1: '',
                        telephone2: ''
                    },
            dateOfBirth: '01-01-1980',
            qualification: { courseName: 'Pharmacy', courseType: 'BPharm' },
            equalityDiversity: {
                disabilityDetails: '',
                disabled: undefined,
                ethnicity: undefined,
                ethnicityOther: '',
                gender: undefined,
                nationality: 717750002,
                religion: undefined,
                religionOther: '',
                sexualOrientation: undefined,
              }
          }};
        MockTechnicianService.getApplication.and.returnValue(of(application));
        fixture.detectChanges();
        expect(component.user).toBeDefined();
        expect(MockTechnicianService.getApplication).toHaveBeenCalled();
    });
});
