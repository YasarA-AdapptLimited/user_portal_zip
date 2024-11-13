import { ComponentFixture, TestBed } from "@angular/core/testing"
import { CpdEntryComponent } from "./cpdEntry.component"
import { CpdEntryAnswersComponent } from "./cpdEntryAnswers.component";

describe('cpdEntry Component', () => {
    let component: CpdEntryComponent, fixture: ComponentFixture<CpdEntryComponent>;

    beforeEach(() => {        

        TestBed.configureTestingModule({
            declarations: [CpdEntryComponent, CpdEntryAnswersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CpdEntryComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('onInit type should be defined', ()=> {        
        const cpdEntry = {
            id: '1',
            title: 'ABC',
            type: 1,
            otherReviewerAnnotation: '',
            currentReviewerAnnotation: '',
            form: {formQuestions: []},
            isOpen: true
          }
        component.cpdEntry = cpdEntry;
        component.ngOnInit();
        expect(component.type).toEqual({
            type: 1,
            icon: 'calendar',
            title: 'Planned CPD',
            feedbackType: 'plannedCpdFeedback'
          });
    });
});