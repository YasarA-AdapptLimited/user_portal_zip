import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../core/service/auth.service';
import { AccountService } from './service/account.service';
import { LayoutService } from '../core/service/layout.service';
import { LoggedInState } from './model/LoggedInState';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpModule } from '@angular/http';
import { LogService } from '../core/service/log.service';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { TechnicianService } from '../core/service/technician.service';
import { MaintenanceMessageService } from '../core/service/maintenanceMessage.service';
import { Router } from '@angular/router';
// import { MockAuthService } from '../core/service/auth.service.mock';

describe('Login Component', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let MockAccountService, MockLayoutService, 
    MockAuthService, MockAuthServiceBluePrint, MockLogService,
    MockCustomErrorHandler, MockTechnicianService, MockMaintenanceMessageService, MockRouter, MockMatDialog;

    MockRouter = { navigate: jasmine.createSpy('navigate')};

    beforeEach(() => {
        MockTechnicianService = jasmine.createSpyObj(['getTechnicianDetails']);
        class MockAuthServiceBluePrint {
            // loggedInState: LoggedInState = LoggedInState.loggedIn;
            public loggedInState$: BehaviorSubject<LoggedInState>;
            public user = {
                preferencesNotSet() {
                    return true;
                },
                isRegistrant: true
            }

            constructor() {
                this.loggedInState$ = new BehaviorSubject<LoggedInState>(LoggedInState.loggedIn);
            }

            public get loggedInState() {
                this.loggedInState$.subscribe();
                return this.loggedInState$.value;
            }

            checkLoggedInState(): Promise<any> {
                return Promise.resolve('User is logged in');
            }
            redirectToConfirmation() {
                return true;
            }

            redirectToActivation() {
                return true;
            }



            // this is a replica of the above function
            /// as changing the above would mean its test failed 
            // and this one passes, and vis versa
            // checkLoggedInState(): Promise<any> {
            //     const error = {
            //         status: 400
            //     };
            //     return Promise.reject(error);
            // }

            enter() {
                return true;
            }

            login() {
                return true;
            }
        }
        MockAuthService = new MockAuthServiceBluePrint();
        MockMaintenanceMessageService = {

        }
        let afterClosed = function(){ return of({})};
        let openFunc = function(){ return afterClosed};
        MockMatDialog = {
            open: openFunc
        }
        MockLayoutService = jasmine.createSpyObj(['setAccountMode']);
        MockLogService = {

        }
        MockCustomErrorHandler = {

        }
        MockAccountService = jasmine.createSpyObj('AccountService', ['startCheckingNotificationCount']);
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            imports: [
                MatProgressBarModule,
                HttpModule
            ],
            providers: [
                { provide: AuthService, useValue: MockAuthService },
                { provide: AccountService, useValue: MockAccountService },
                { provide: MatDialog, useValue: MockMatDialog },
                { provide: LayoutService, useValue: MockLayoutService },
                { provide: LogService, useValue: MockLogService },
                { provide: CustomErrorHandler, useValue: MockCustomErrorHandler },
                { provide: TechnicianService, useValue: MockTechnicianService },
                { provide: MaintenanceMessageService, useValue: MockMaintenanceMessageService },
                { provide: Router, useValue: MockRouter}
            ]
        });
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
    });

    it('should initialise correctly', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to sign in', () => {
        // arrange
        const authServiceStub: jasmine.Spy = spyOn(MockAuthService, 'login');
        // act 
        component.signin();
        // assert
        expect(component.error).toBeFalsy();
        expect(authServiceStub).toHaveBeenCalled();
    });

    it(`if the user is logged in, should get notifications and show preferences`, () => {
        // arrange
        MockLayoutService.setAccountMode.and.returnValue(true);
        const getNotificationSpy: jasmine.Spy = spyOn(component, 'getNotifications');
        const showPreferencesSpy: jasmine.Spy = spyOn(component, 'showPreferences');
        // act
        component.ngOnInit();
        // assert
        expect(getNotificationSpy).toHaveBeenCalled();
        expect(showPreferencesSpy).toHaveBeenCalled();

    });

    describe('When the user is attempting to login', () => {
        it(`should display: 'Authorising' if attepting to acquire the token silently`, () => {
            // arrange
            const attemptedLoginState = LoggedInState.attemptAcquireTokenSilently;
            // act
            const attempedloginMessage = component.getLoginMessage(attemptedLoginState);
            // assert
            expect(attempedloginMessage).toBe('Authorising');
        });

        it(`should display: 'loading details' when loading user`, () => {
            // arrange
            const loadingUserState = LoggedInState.loadingUser;
            // act
            const loadingUserloginMessage = component.getLoginMessage(loadingUserState);
            // assert
            expect(loadingUserloginMessage).toBe('Loading your details');
        });

        it(`should display: 'Redirecting to sign in' when redirecting login`, () => {
            // arrange
            const loginRedirectState = LoggedInState.loginRedirect;
            // act
            const redirectloginMessage = component.getLoginMessage(loginRedirectState);
            // assert
            expect(redirectloginMessage).toEqual('Redirecting to sign-in');
        });


        it(`should display: 'Authorisation failed' if aquiring the token fails for some reason `, () => {
            // arrange
            const acquireTokenFailState = LoggedInState.acquireTokenFail;
            // act
            const acquireTokenFailMessage = component.getLoginMessage(acquireTokenFailState);
            // assert
            expect(acquireTokenFailMessage).toEqual('Authorisation failed');
        });
    });

    it('should be able to show preference modal', () => {
        // arrange
        const showPreferencesSpy: jasmine.Spy = spyOn(component, 'showPreferenceModal');
        // act
        component.showPreferences();
        // assert
        expect(showPreferencesSpy).toHaveBeenCalled();
    });

    it(`If the user is a registrant and has not checked their registration,
        show modal which checks registration`, () => {
            environment.dev = false;
            // arrange
            const showHasCheckedRegistrationModalSpy: jasmine.Spy = spyOn(component, 'showHasCheckedRegistrationModal');
            // act
            component.checkHasCheckedRegistrationDetails();
            // assert
            expect(showHasCheckedRegistrationModalSpy).toHaveBeenCalled();
    });

    it('goToSignInFaq, helps navigating to faq page ', () => {        
        component.goToSignInFaq();
        expect(MockRouter.navigate).toHaveBeenCalledWith(['signin/faq']);
    });

    it('showPreferenceModal, asks preference option to user', fakeAsync(() => {
        const spy: jasmine.Spy = spyOn(component,'checkHasCheckedRegistrationDetails');
        component.showPreferenceModal();
        tick();
        expect(spy).toHaveBeenCalled();
    }));

    it('ask user prefernece by calling method showHasCheckedRegistrationModal', () => {
        component.showHasCheckedRegistrationModal();                
    });

    it('once user is logged in check notification count', () => {
         component.getNotifications();
         expect(MockAccountService.startCheckingNotificationCount).toHaveBeenCalled();
    });

    it('method tryGettingTechnicianDetails fetches Technician details', () => {
        MockTechnicianService.getTechnicianDetails.and.returnValue(of({}));        
        expect(component.tryGettingTechnicianDetails()).toBeDefined();
    });

    it('checkLoggedInState, verifies user account', fakeAsync(() => {
        const showPreferencesSpy: jasmine.Spy = spyOn(component,'showPreferences');
        component.checkLoggedInState();
        expect(showPreferencesSpy).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
    }));
});
