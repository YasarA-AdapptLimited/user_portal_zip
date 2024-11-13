import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalDeclarationTraineePlacementComponent } from './finalDeclarationTraineePlacement.component';

describe('( Final Declaration ) => Trainee placement', () => {
  let component: FinalDeclarationTraineePlacementComponent;
  let fixture: ComponentFixture<FinalDeclarationTraineePlacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FinalDeclarationTraineePlacementComponent,
        UtcDatePipe
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FinalDeclarationTraineePlacementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
