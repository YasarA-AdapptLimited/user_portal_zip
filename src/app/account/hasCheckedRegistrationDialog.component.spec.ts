import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { AuthService } from "../core/service/auth.service";
import { HasCheckedRegistrationDialogComponent } from "./hasCheckedRegistrationDialog.component";
import { AccountService } from "./service/account.service";

describe('Has Checked Registration Dialog component', () => {
    let component: HasCheckedRegistrationDialogComponent;
    let fixture: ComponentFixture<HasCheckedRegistrationDialogComponent>;

    let MockMatDialogRef, MockRouter, MockAuthService, MockAccountService;

    MockAccountService = jasmine.createSpyObj('AccountService', ['hasCheckedRegistrationDetails']);
    MockAuthService = jasmine.createSpyObj('AuthService', ['updateCachedHasCheckedRegistrationDetails']);
    MockMatDialogRef = {
        close: jasmine.createSpy('close')
    }
    MockRouter =  { navigate: () => Promise.resolve(true)};

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations : [ HasCheckedRegistrationDialogComponent ],
            providers: [
                {provide : MatDialogRef, useValue: MockMatDialogRef},
                {provide: Router, useValue: MockRouter},
                {provide: AuthService, useValue: MockAuthService},
                {provide: AccountService, useValue: MockAccountService}
            ]
        }).compileComponents();   
        fixture = TestBed.createComponent(HasCheckedRegistrationDialogComponent);  
        component = fixture.componentInstance;
        MockAuthService.user = {
            registrationStatus: '09809808',
            forenames: 'xxx',
            showNoticeOfEntry: true
          }
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('onInit define user value', () => {
        component.ngOnInit();
        expect(component.user).toBe(MockAuthService.user);
    });

    it('navigate to registration route on calling checkDetails', (fakeAsync(() => {        
        MockAccountService.hasCheckedRegistrationDetails.and.returnValue(of('success'));
        component.checkDetails();
        fixture.detectChanges();
        tick();
        // expect(MockMatDialogRef.close).toHaveBeenCalled();
        expect(MockAuthService.updateCachedHasCheckedRegistrationDetails).toHaveBeenCalled();
    })));

});