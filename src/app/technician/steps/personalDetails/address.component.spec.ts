import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { of } from "rxjs";
import { Address } from "../../../account/model/Address";
import { AccountService } from "../../../account/service/account.service";
import { CollapsibleComponent } from "./../../../shared/collapsible.component";
import { AddressComponent } from "./address.component";

describe('Address Component', () => {
    let component: AddressComponent, fixture: ComponentFixture<AddressComponent>;
    let MockAccountService = jasmine.createSpyObj('AccountService', ['getCountries']);
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:[ AddressComponent, CollapsibleComponent ],
            providers: [{provide: AccountService, useValue: MockAccountService}],
            imports: [ FormsModule]
        }).compileComponents;

        fixture = TestBed.createComponent(AddressComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('should getCountries method be called on ngOnInit', () => {
        let getCountriesSpy: jasmine.Spy = spyOn(component, 'getCountries');
        fixture.detectChanges();
        expect(getCountriesSpy).toHaveBeenCalled();
    });

    it('should method getCountires fetch countries list', () => {
        const countriesList = ['a','b','c'];
        const getCountriesSpy = MockAccountService.getCountries.and.returnValue(of(countriesList));
        component.getCountries();
        expect(getCountriesSpy).toHaveBeenCalled();
    });
    
    it('should method propagate, propogate the changes', () => {
        const propagateChangeSpy: jasmine.Spy = spyOn(component, 'propagateChange');
        component.propagate();
        expect(propagateChangeSpy).toHaveBeenCalled();
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

    it('should method registerOnChange, register propogateChange function', () => {
        const fun = function test(){};
        component.registerOnChange(fun);
        expect(component.propagateChange).toBeDefined();
    });

    it('should setAddress input set address of the component', () => {
        const addr = { line1: 'aaa',
        line2: '',
        line3: '',
        town: '',
        county: 'bbb',
        postcode: '123',
        country: 'abc'
        };
        component.setAddress = new Address(addr);
        expect(component.address).toEqual(new Address(addr));
    });

    it('should setManualInput input set manualInput of the component', () => {        
        component.setManualInput = false;
        expect(component.manualInput).toEqual(false);
    });

    it('should lineOneFocussed input set manualInput of the component', () => {   
        spyOn(component, 'setFocus');
        component.lineOneFocussed = true;
        expect(component.setFocus).toHaveBeenCalled();
    });

    it('method registerOnTouched should be defined', () => {
        component.registerOnTouched();
        expect(component.registerOnTouched).toBeDefined();
      });
});