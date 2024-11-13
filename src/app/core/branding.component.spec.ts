import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { BrandingComponent } from "./branding.component";
import { AuthService } from "./service/auth.service";
import { LayoutService } from "./service/layout.service";

describe('Account Activation Component', () => {
    let fixture: ComponentFixture<BrandingComponent>;
    let component: BrandingComponent;
    let MockLayoutService, MockAuthService, MockRouter;

    MockLayoutService = jasmine.createSpyObj('LayoutService', ['setAccountMode']);
    MockRouter = { navigate: jasmine.createSpy('navigate')};
    MockAuthService = { 
        login: () => {},
        user: {
        registrationStatus: '09809808',
        forenames: 'xyz',
        showNoticeOfEntry: true
      }
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BrandingComponent
            ],
            providers: [{provide: LayoutService, useValue: MockLayoutService},
                        {provide: AuthService,useValue: MockAuthService},
                        {provide: Router,useValue: MockRouter}],
            imports: [
            ]
        }).compileComponents();
        fixture  = TestBed.createComponent(BrandingComponent);
        component = fixture.componentInstance;
    });
    
    it('should initialise correctly', () => {
        expect(component).toBeTruthy();
    });

    it('define version on init', () => {
        component.ngOnInit();
        expect(component.showVersion).toBe(true);
    }); 
    
    it('on call of goHome, home page is loaded', () => {
        MockAuthService.user = {
            registrationStatus: '09809808',
            forenames: 'xyz',
            showNoticeOfEntry: true
          }
        const url = '/home';
        component.goHome();
        expect(MockRouter.navigate).toHaveBeenCalledWith([url]);
    });

    it('if user is not authenticated, user will be asked to login', () => {
        MockAuthService.user = null;
        const loginSpy: jasmine.Spy = spyOn(MockAuthService,'login');
        component.login();
        expect(loginSpy).toHaveBeenCalled();
    });
});
