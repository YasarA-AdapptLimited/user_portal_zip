import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcpsReviewComponent } from './ccps-review.component';

describe('CcpsReviewComponent', () => {
  let component: CcpsReviewComponent;
  let fixture: ComponentFixture<CcpsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcpsReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcpsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
