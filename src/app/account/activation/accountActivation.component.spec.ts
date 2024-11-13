import { AccountActivationComponent } from './accountActivation.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerComponent } from '../../shared/banner.component';
import { CarouselComponent } from '../../shared/carousel.component';
import { TechnicianActivationComponent } from './technicianActivation.component';
import { StudentActivationComponent } from './studentActivation.component';
import { PreregActivationComponent } from './preregActivation.component';
import { RegistrantActivationComponent } from './registrantActivation.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../core/service/layout.service';
import { LogService } from '../../core/service/log.service';
import { ActivationType } from './model/ActivationType';

describe('Account Activation Component', () => {
    let fixture: ComponentFixture<AccountActivationComponent>;
    let component: AccountActivationComponent;
    let MockLayoutService, MockLogService;

    MockLayoutService = jasmine.createSpyObj('LayoutService', ['setAccountMode']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AccountActivationComponent,
                BannerComponent,
                CarouselComponent,
                TechnicianActivationComponent,
                StudentActivationComponent,
                PreregActivationComponent,
                RegistrantActivationComponent
            ],
            providers: [{provide: LayoutService,useValue: MockLayoutService},
                        {provide: LogService,useValue: MockLogService}],
            imports: [
                MatProgressBarModule,
                FormsModule
            ]
        }).compileComponents();
        fixture  = TestBed.createComponent(AccountActivationComponent);
        component = fixture.componentInstance;
    });
    
    it('should initialise correctly', () => {
        expect(component).toBeTruthy();
    });

    it('on init setAccountMode', () => {        
        // let setAccountMode: jasmine.Spy = spyOn(MockLayoutService, 'setAccountMode');
        component.ngOnInit();
        expect(MockLayoutService.setAccountMode).toHaveBeenCalledWith(true);
    });

    it('selectedRole is set to undefined if step is 0',() => {
        component.navigateTo(0);
        expect(component.selectedRole).toBeUndefined();
    });

    it('define activation if selected Role is Technician', () => {
        component.selectRole(ActivationType.Technician);
        expect(component.activation).toEqual({
            forenames: '',
            surname: '',
            middleName: '',
            dob: ''
          });
    });

    it('define activation if selected Role is Registrant', () => {
        component.selectRole(ActivationType.Registrant);
        expect(component.activation).toEqual({
            registrationNumber: '',
            name: '',
            confirmed: false,
            dob: '',
            postcode: '',
            activationCode: ''
          });
    });

    it('define activation if selected Role is Prereg', () => {
        component.selectRole(ActivationType.Prereg);
        expect(component.activation).toEqual({
            lastname: '',
            dob: '',
            qualification: undefined
          });
    });

    it('define activation if selected Role is Student', () => {
        component.selectRole(ActivationType.Student);
        expect(component.activation).toEqual({
            lastname: '',
            dob: '',
            qualification: undefined
          });
        expect(component.currentStep).toBe(1);
    });    
});
