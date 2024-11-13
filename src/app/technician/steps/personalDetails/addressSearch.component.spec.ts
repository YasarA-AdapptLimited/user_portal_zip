import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { HttpModule } from "@angular/http";
import { AccountService } from "../../../account/service/account.service";
import { AuthService } from "../../../core/service/auth.service";
import { LogService } from "../../../core/service/log.service";
import { AddressSearchComponent } from "./addressSearch.component"
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { of } from "rxjs";
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "../../../shared/shared.module";

describe('Address Search Component', () => {
    let fixture: ComponentFixture<AddressSearchComponent>;
    let component: AddressSearchComponent;

    let MockAccountService, MockLogService, MockAuthService;

    let MockAddressForm: FormGroup;

    const ukPostcodePattern = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/g;
    beforeEach(() => {

        MockAccountService = jasmine.createSpyObj('AccountService',['getCountries', 'getAddress', 'searchAddress']);

        TestBed.configureTestingModule({
            imports: [ HttpModule, BrowserAnimationsModule, SharedModule, ReactiveFormsModule ],
            declarations: [AddressSearchComponent, CollapsibleComponent],
            providers: [ { provide: AccountService, useValue: MockAccountService},
                        { provide: LogService, useVale: MockLogService},
                        { provide: AuthService, useValue: MockAuthService}] 
        }).compileComponents();

        fixture = TestBed.createComponent(AddressSearchComponent);
        component = fixture.componentInstance;


        MockAddressForm = new FormGroup({
            countryCode: new FormControl<string | null>(component.search.countryCode),
            postcode: new FormControl<string | null>('PO6 3AG', [Validators.required, Validators.pattern(ukPostcodePattern)])
        });

        component.addressForm = MockAddressForm; 
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('should ngOnInit call getCountries method', () => {
        let getCountriesSpy: jasmine.Spy = spyOn(component,'getCountries');
        fixture.detectChanges();
        expect(getCountriesSpy).toHaveBeenCalled();
    });
    
    it('should getCountries list countires', () => {
        const countriesList = ['country1','country2'];
        MockAccountService.getCountries.and.returnValue(of(countriesList));
        component.getCountries();
        expect(MockAccountService.getCountries).toHaveBeenCalled();
    });

    it('should enableManualInput allow user to enter manually', () => {
        let emitSpy: jasmine.Spy = spyOn(component.manualInput, 'emit');
        component.enableManualInput();
        expect(emitSpy).toHaveBeenCalledWith();
    });

    it('should method select, fetch complete address', () => {
        const id = 'GB|RM|A|19229619;'
        MockAccountService.getAddress.and.returnValue(of({}));
        component.select(id);
        expect(MockAccountService.getAddress).toHaveBeenCalled();
    });

    it('should method searchAddress of Account Service, filter the Address type data', () => {          
        const results = [{
            "id": "GB|RM|A|19229619",
            "type": "Address",
            "text": "44B, High Street",
            "description": "Cosham, Portsmouth, PO6 3AG"
        },
        {
            "id": "GB|RM|A|19229622",
            "type": "Address",
            "text": "54A, High Street",
            "description": "Cosham, Portsmouth, PO6 3AG"
        },
        {
            "id": "GB|RM|A|28244932",
            "type": "Address",
            "text": "Flat 1, 48F, High Street",
            "description": "Cosham, Portsmouth, PO6 3AG"
        }];
        let getCountriesSpy: jasmine.Spy = spyOn(component,'getCountries');
        let markAsTouchedSpy: jasmine.Spy = spyOn(component.postcode, 'markAsTouched');         
        MockAccountService.searchAddress.and.returnValue(of(results));    
        component.searchAddress();
        fixture.detectChanges();
        expect(component.searching).toBe(false);
    });    

    it('should method searchAddress be called on postcode valuechange', fakeAsync(() => {
        spyOn(component, 'getCountries');    
        let searchAddressSpy: jasmine.Spy =  spyOn(component, 'searchAddress');   
        fixture.detectChanges();                 
        component.addressForm.controls['postcode'].setValue('XXX');        
        fixture.detectChanges();
        tick(1000);
        fixture.whenStable().then(() => {
            expect(searchAddressSpy).toHaveBeenCalled();
        });        
    }));

    it('should setFocus method be called if user is editing the address',() => {
        let setFocusSpy: jasmine.Spy = spyOn(component,'setFocus');
        component.editing = true;
        expect(setFocusSpy).toHaveBeenCalled();    
    });

    it('should conditionally validate postcode if countrycode is changed', fakeAsync(() => {
        spyOn(component, 'getCountries');
        fixture.detectChanges();
        component.addressForm.controls['countryCode'].setValue('GB'); 
        fixture.detectChanges(); 
        let markAsUnTouchedSpy: jasmine.Spy = spyOn(component.postcode, 'markAsUntouched');   
        tick(1000);
        fixture.whenStable().then(() => {
            expect( component.addressForm.controls['postcode'].value).toBe(''); 
        });                
    }));
})