import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MatDialog, MatDialogRef } from "@angular/material/dialog"
import { of } from "rxjs"
import { AuthService } from "../core/service/auth.service"
import { SaveState } from "./model/SaveState"
import { PreferenceDialogComponent } from "./preferenceDialog.component"
import { AccountService } from "./service/account.service"

describe('Preference Dialog Component', () => {
    let component: PreferenceDialogComponent;
    let fixture: ComponentFixture<PreferenceDialogComponent>;
    let MockMatDialogRef, MockMatDialog, MockAuthService, MockAccountService;

    MockAccountService = jasmine.createSpyObj('AccountService', ['savePreference']);
    MockAuthService = jasmine.createSpyObj('AuthService', ['updateCachedPreference']);
    MockMatDialogRef = {
        close: jasmine.createSpy('close')
    }
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ PreferenceDialogComponent ],
            providers:[
                {provide: MatDialogRef, useValue: MockMatDialogRef}, 
                {provide: MatDialog, useValue: MockMatDialog},
                {provide: AuthService, useValue: MockAuthService},
                {provide: AccountService, useValue: MockAccountService}          
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PreferenceDialogComponent);
        component = fixture.componentInstance;
        component.preference = {
            comms: {
              essentialEmails: false,
              essentialTexts: false,
              importantEmails: false,
              importantTexts: false
            },
            ui: {
              showTooltips: true
            }
          }
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('on trySave saveState is updated', () => {
        component.trySave();
        expect(component.saveState).toBe(SaveState.touched);
    });

    it('on change saveState is updated to untouched', () => {
        component.change();
        expect(component.saveState).toBe(SaveState.untouched);
    });

    it('call confirm method is saveState is confirmed', () => {
        let confirmSpy: jasmine.Spy = spyOn(component,'confirm');
        component.onSaveStateChange(SaveState.confirmed);
        expect(confirmSpy).toHaveBeenCalled();
    });

    it('on confirm update cache prefernce', () => {
        MockAccountService.savePreference.and.returnValue(of('successful'));
        component.confirm();
        fixture.detectChanges();
        expect(MockAuthService.updateCachedPreference).toHaveBeenCalledWith(component.preference);
        expect(component.saveState).toBe(SaveState.saved);
        expect(component.saving).toBeFalse();
    });

    it('on call of close , close the dialog',() => {
        component.close();
        expect(MockMatDialogRef.close).toHaveBeenCalled();
    });
})