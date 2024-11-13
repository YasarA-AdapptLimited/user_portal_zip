import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AutocompleteComponent } from "./autocomplete.component";

describe('AuoComplete Component', () => {
    let component: AutocompleteComponent, fixture: ComponentFixture<AutocompleteComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AutocompleteComponent],
            imports: [ MatAutocompleteModule ]
        }).compileComponents();
    
        fixture = TestBed.createComponent(AutocompleteComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', ()=> {
        expect(component).toBeTruthy();
    });

    it('method ngOnInit should control value', () => {
        component.options = ['A','B','C'];        
        let controlSpy: jasmine.Spy = spyOn(component.myControl, 'setValue');
        fixture.detectChanges();
        expect(controlSpy).toHaveBeenCalled();
    });

    it('method filter should return value passed in upper case', () => {
        component.options = ['A','B','C'];                
        expect(component.filter('a')).toEqual(['A']);
    });

    it('method trySelect should propogate the change', () => {
        let propogateSpy: jasmine.Spy = spyOn(component,'propagate');
        component.myControl.setValue('a');
        component.options = ['A','B','C'];   
        component.trySelect();             
        expect(propogateSpy).toHaveBeenCalled();
    });

    it('method onOptionSelected should propogate the change', () => {
        let propogateSpy: jasmine.Spy = spyOn(component,'propagate');
        component.myControl.setValue('a');
        component.options = ['A','B','C'];   
        component.onOptionSelected({option: {value : 'a'}});             
        expect(propogateSpy).toHaveBeenCalled();
    });

    it('method writeValue should set control value', () => {        
        component.writeValue('a');             
        expect(component.myControl.value).toBe('a');
    });

    it('method registerOnChange should register propogateChange function', () => {   
        const functn = function() {};
        component.registerOnChange(functn);             
        expect(component.propagateChange).toEqual(functn);
    });

    it('method registerOnTouched should be defined', () => {           
        component.registerOnTouched();             
        expect(component.registerOnTouched).toBeDefined();
    });

    it('method propogate should pass control value to propogatChange function', () => {           
        let propogateSpy: jasmine.Spy = spyOn(component,'propagateChange');
        component.propagate();    
        expect(propogateSpy).toHaveBeenCalled();
    });
});