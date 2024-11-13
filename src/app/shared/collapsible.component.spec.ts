import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { CollapsibleComponent } from "./collapsible.component";


describe('Collapsible Component', () => {
    let component: CollapsibleComponent, fixture: ComponentFixture<CollapsibleComponent>;

    beforeEach(() => {        
        TestBed.configureTestingModule({
            declarations: [CollapsibleComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CollapsibleComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });  
    
    it('set true/false value to trigger', () => {
        component.trigger = true;
        expect(component.openState).toBe('open');
        component.trigger = false;
        expect(component.openState).toBe('closed');
    });

    it('open value will be null if trigger set to null', fakeAsync(() => {
        component.trigger = null;
        tick(300);
        expect(component.open).toBe(null);
    }));

    it('open value will be true if trigger is set to true', (() => {
        component.trigger = true;
        expect(component.open).toBe(true);
    }));

    it('no value is set to open if trigger is value is undefined', (() => {
        let triggerVal;
        component.trigger = triggerVal;
    }));
});