import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddressEditComponent } from "./addressEdit.component";
import { AddressComponent } from "./address.component";
import { CollapsibleComponent } from "./../../../shared/collapsible.component";
import { AddressSearchComponent } from "./addressSearch.component";
import { AccountService } from "./../../../account/service/account.service";
import { LogService } from "./../../../core/service/log.service";
import { AuthService } from "./../../../core/service/auth.service";
import { SharedModule } from "./../../../shared/shared.module";

describe('AddressEdit Component', () => {
    let fixture: ComponentFixture<AddressEditComponent>, component: AddressEditComponent;
    let MockAccountService, MockLogService, MockAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddressEditComponent, AddressComponent, CollapsibleComponent, AddressSearchComponent],
            providers: [ {provide:AccountService, useValue: MockAccountService},
            {provide:LogService, useValue: MockLogService},
            {provide: AuthService, useValue: MockAuthService},
            ],
            imports: [ SharedModule ]
        }).compileComponents();

        fixture = TestBed.createComponent(AddressEditComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('should method reselect allow selecting new address', () => {
        const propagateChangeSpy: jasmine.Spy = spyOn(component, 'propagateChange');
        component.reselect();
        expect(component.address).toBeUndefined();
        expect(component.propagateChange).toHaveBeenCalled();
        expect(component.manualInput).toBeFalsy();
        expect(component.editing).toBeTruthy();
        expect(component.lineOneFocussed).toBeFalsy();    
    });

    it('should method enableManualInput allow user to enter address manually', () => {
        component.enableManualInput();
        expect(component.manualInput).toBeTruthy();
        expect(component.lineOneFocussed).toBeTruthy();    
    });

    it('should method writeValue update address if defined', () => {
        const address = { line1: 'aaa',
            line2: '',
            line3: '',
            town: '',
            county: 'bbb',
            postcode: '123',
            country: 'abc'
        }
        component.writeValue(address);
        expect(component.address).toBe(address);    
    });

    it('should method onselect address is defined and change is propogated', () => {
        const address = { line1: 'aaa',
            line2: '',
            line3: '',
            town: '',
            county: 'bbb',
            postcode: '123',
            country: 'abc'
        }
        const propagateChangeSpy: jasmine.Spy = spyOn(component, 'propagateChange');
        component.onSelect(address);
        expect(component.address).toBeDefined();
        expect(component.propagateChange).toHaveBeenCalled();
        expect(component.lineOneFocussed).toBeTruthy();    
    });

    it('should registerOnChange set the propogate change function', () => {
        const testFunction = function test(){};
        component.registerOnChange(testFunction);
        expect(component.propagateChange).toBe(testFunction);
    });

    it('method update should be defined', () => {
        component.update();
        expect(component.update).toBeDefined();
    });

    it('method registerOnTouched should be defined', () => {
        component.registerOnTouched();
        expect(component.registerOnTouched).toBeDefined();
    });
});