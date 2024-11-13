import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';

import { RevalidationRecordOutstandingComponent } from './revalidation-record-outstanding.component';

describe('RevalidationRecordOutstandingComponent', () => {
  let component: RevalidationRecordOutstandingComponent;
  let fixture: ComponentFixture<RevalidationRecordOutstandingComponent>;
  let MockformStepperService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevalidationRecordOutstandingComponent ],
      providers : [{ provide: FormStepperService , useValue: MockformStepperService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevalidationRecordOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if user has not acknowledged, throw error message', () => {
    component.hasAcknowledged = false;
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    component.validate();
    expect(validity$spy).toHaveBeenCalledWith({ valid: false, messages:['Please select the checkbox'], touched: undefined });
  });
});
