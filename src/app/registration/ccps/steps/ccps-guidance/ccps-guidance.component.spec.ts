import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcpsGuidanceComponent } from './ccps-guidance.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';

describe('CcpsGuidanceComponent', () => {
  let component: CcpsGuidanceComponent;
  let fixture: ComponentFixture<CcpsGuidanceComponent>;
  let MockFormStepperService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcpsGuidanceComponent ],
      providers: [ {provide: FormStepperService, useValue: MockFormStepperService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcpsGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('this step is always valid, since it is a static one', ()=> {
    const validitySpy = spyOn(component.validity$, 'next');
    component.validate();
    expect(validitySpy).toHaveBeenCalledOnceWith({valid: true ,messages: [],touched: undefined});
  })
});
