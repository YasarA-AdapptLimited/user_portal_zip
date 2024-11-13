import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentReportTraineePlacementComponent } from './assessmentReportTraineePlacement.component';
describe('( Assessment Report ) => Trainee placement', () => {
    let component: AssessmentReportTraineePlacementComponent;
    let fixture: ComponentFixture<AssessmentReportTraineePlacementComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AssessmentReportTraineePlacementComponent,
                UtcDatePipe
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AssessmentReportTraineePlacementComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
