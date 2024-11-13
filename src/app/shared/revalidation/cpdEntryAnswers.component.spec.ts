import { ComponentFixture, TestBed } from "@angular/core/testing"
import { CpdEntryAnswersComponent } from "./cpdEntryAnswers.component";


describe('cpdEntryAnswers Component', () => {
    let component: CpdEntryAnswersComponent, fixture: ComponentFixture<CpdEntryAnswersComponent>;

    beforeEach(() => {        

        TestBed.configureTestingModule({
            declarations: [CpdEntryAnswersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CpdEntryAnswersComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });    
});