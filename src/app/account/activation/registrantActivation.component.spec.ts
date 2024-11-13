import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';
import { LogService } from '../../core/service/log.service';
import { AccountService } from '../service/account.service';
import { RegistrantActivationComponent } from './registrantActivation.component';

describe('Registarnt Activation Component', () => {
    let fixture, component: RegistrantActivationComponent;
    let MockAccountService, MockAuthService, MockMatDialog, MockLogService, activationChangeSpy;

    MockAccountService = jasmine.createSpyObj('AccountService', ['activateRegistration', 'verifyRegistrationNumber']);
    MockAuthService = {
        logout() {}
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RegistrantActivationComponent],
            imports:[],
            providers: [
                { provide: AccountService, useValue: MockAccountService},
                { provide: AuthService, useValue: MockAuthService},
                { provide: MatDialog, useValue: MockMatDialog}, 
                { provide : LogService, useValue: MockLogService}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegistrantActivationComponent);
        component = fixture.componentInstance;
        activationChangeSpy = spyOn(component.activationChange,'emit');
        fixture.detectChanges();
        component.activation = {
            registrationNumber: '123',
            name: 'name',
            confirmed: true,
            dob: '01-01-1990',
            postcode: 'na123',
            activationCode: '123'
        }
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('on call of dobSelected, define dob', () => {
        let dob = '01-01-1990';
        component.dobSelected(dob);
        expect(component.activation.dob).toEqual(dob);
    });

    it('clearErrors, empties validationErrors', () => {
        component.clearErrors();
        expect(component.validationErrors.length).toBe(0);
    });

    it('prev loads one previous step', () => {
        const stepChangeSpy: jasmine.Spy = spyOn(component.stepChange, 'emit');
        component.prev();
        expect(stepChangeSpy).toHaveBeenCalled();
    });

    it('when the registration details is not correct, activation is not confirmed', () => {
        const setFocusSpy : jasmine.Spy = spyOn(component,'setFocus');
        const stepChangeSpy: jasmine.Spy = spyOn(component.stepChange, 'emit');  
        component.incorrect();
        expect(setFocusSpy).toHaveBeenCalled();
    });

    it('when the registration details is correct, activation is confirmed', () => {
        const setFocusSpy : jasmine.Spy = spyOn(component,'setFocus');
        const stepChangeSpy: jasmine.Spy = spyOn(component.stepChange, 'emit');  
        component.confirm();
        expect(activationChangeSpy).toHaveBeenCalled();
    });

    it('stepChange is triggered on call of activate method', fakeAsync(() => {
        const stepChangeSpy: jasmine.Spy = spyOn(component.stepChange,'emit')
        MockAccountService.activateRegistration.and.returnValue(of('successful'));        
        component.activate();
        tick();
        expect(stepChangeSpy).toHaveBeenCalledWith(4);
    }));

    it('user is logged out on call of logout method', () => {
        const logoutSpy: jasmine.Spy = spyOn(MockAuthService, 'logout');
        component.logout();
        expect(logoutSpy).toHaveBeenCalled();
    });

    it('on verification of registration number, update user name', fakeAsync(() => {
        const stepChangeSpy: jasmine.Spy = spyOn(component.stepChange,'emit');
        const setFocusSpy : jasmine.Spy = spyOn(component,'setFocus');
        MockAccountService.verifyRegistrationNumber.and.returnValue(of('xxx'));
        component.verifyRegistrationNumber();
        tick();
        expect(setFocusSpy).toHaveBeenCalled();
    }));
});