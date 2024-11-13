import { ComponentFixture, TestBed } from "@angular/core/testing"
import { CpdEntryAnnotationsComponent } from "./cpdEntryAnnotations.component";


describe('cpdEntryAnnotations Component', () => {
    let component: CpdEntryAnnotationsComponent, fixture: ComponentFixture<CpdEntryAnnotationsComponent>;

    beforeEach(() => {        

        TestBed.configureTestingModule({
            declarations: [CpdEntryAnnotationsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CpdEntryAnnotationsComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });    
});