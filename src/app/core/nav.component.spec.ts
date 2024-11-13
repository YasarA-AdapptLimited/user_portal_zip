import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router } from "@angular/router";
import { BehaviorSubject, of, Subscription } from "rxjs";
import { AccountService } from "../account/service/account.service";
import { NavComponent } from "./nav.component";
import { AuthService } from "./service/auth.service";
import { LayoutService } from "./service/layout.service";
import { CurrentApplicationService } from "./service/prereg/currentApplication.service";

describe('Nav Component', () => {
    let fixture: ComponentFixture<NavComponent>;
    let component: NavComponent;
    let MockLayoutService, MockAuthService, MockAccountService, MockCurrentApplicationService;

    MockLayoutService = jasmine.createSpyObj('LayoutService', ['setAccountMode']);
    MockAuthService = { 
        login: () => {},
        logout: () => {},
        user: {
        registrationStatus: '09809808',
        forenames: 'xyz',
        showNoticeOfEntry: true,
        isRegistrant: true,
        registrant : { exemptFromRevalidationSubmissions : false }
      },
      loggedInState$ : new BehaviorSubject<any>('')
    };

    MockCurrentApplicationService = {
        availableForm : new BehaviorSubject<any>(4)
    };

    MockAccountService = {
        notificationCount$: new BehaviorSubject(1)
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavComponent
            ],
            providers: [{provide: LayoutService, useValue: MockLayoutService},
                        {provide: AuthService,useValue: MockAuthService},
                        {provide: AccountService,useValue: MockAccountService},
                        {provide: CurrentApplicationService,useValue: MockCurrentApplicationService}],
            imports: [
            ]
        }).compileComponents();
        fixture  = TestBed.createComponent(NavComponent);
        component = fixture.componentInstance;
    });
    
    it('should initialise correctly', () => {
        expect(component).toBeTruthy();
    });

    it('define version on init', () => {
        // const loggedInStateSpy: jasmine.Spy = spyOn(MockAuthService,'loggedInState$');
        component.direction = 'horizontal';
        component.ngOnInit();
        expect(component.openState).toBe('open');
    }); 
    
    // it('currentApplicationLink is update `prereg/assessment-report` if formscope is progressreport', fakeAsync(() => {  
    //     MockCurrentApplicationService = {
    //         availableForm : new BehaviorSubject<any>(3)
    //     };
    //     component.ngOnInit();        
    //     tick();
    //     expect(component.currentApplicationLink).toBe('prereg/assessment-report');
    // })); 

    it('showIneligibleToRegister returns true/false depending on the user`s eligibility to register', () => {
        expect(component.showIneligibleToRegister).toBe(false);
    });

    it('user is shown with revalidation if eligible', () => {
        expect(component.showRevalidation).toBe(true);
    });

    it('notificationCount provides count of notifications', () => {
        expect(component.notificationCount).toBe(1);
    });

    it('on call of signout method, user is logged out', () => {
        const logoutSpy: jasmine.Spy = spyOn(MockAuthService,'logout');
        component.signout();
        expect(logoutSpy).toHaveBeenCalled();
    });

    it('log method, logs the value in console', () => {
        const logSpy: jasmine.Spy = spyOn(console,'log');
        component.log('a');
        expect(logSpy).toHaveBeenCalledWith('a');
    });

    // it('on ngOnDestroy, userSub is unsubscribed', () => {
    //     component.userSub = {return of({})};
    //     const userSubSpy: jasmine.Spy = spyOn(component.userSub,'unsubscribe');
    //     component.ngOnDestroy();
    //     expect(userSubSpy).toHaveBeenCalled();
    // })
});
