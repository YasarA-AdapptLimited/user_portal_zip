import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { EqualityDiversityStepComponent } from './equalityDiversityStep.component';
import { GphcIconComponent } from '../../../shared/gphc-icon.component';
import { EdiComponent } from '../../../account/edi.component';
import { CaseSplitPipe } from '../../../shared/pipe/CaseSplit.pipe';
import { EdiService } from '../../../account/service/edi.service';
import { TooltipModule } from '../../../core/tooltip/tooltip.module';
import { of } from 'rxjs';

describe('Equality diversity Step Component (technician)', () => {
  let component: EqualityDiversityStepComponent;
  let fixture: ComponentFixture<EqualityDiversityStepComponent>;
  let MockFormStepperService, MockEdiService;

  beforeEach(waitForAsync(() => {
    const application = {
      trainee: {
          equalityDiversity: {
            disabilityDetails: '',
            disabled: undefined,
            ethnicity: undefined,
            ethnicityOther: '',
            gender: undefined,
            nationality: 717750002,
            religion: undefined,
            religionOther: '',
            sexualOrientation: undefined,
          }
      }
    }
    MockFormStepperService = {};
    MockEdiService = jasmine.createSpyObj(['validate', 'load']);
    TestBed.configureTestingModule({
      declarations: [
        EqualityDiversityStepComponent,
        EdiComponent,
        CollapsibleComponent,
        GphcIconComponent,
        CaseSplitPipe
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatProgressBarModule,
        TooltipModule
      ],
      providers: [
        {provide: FormStepperService, useValue: MockFormStepperService},
        {provide: EdiService, useValue: MockEdiService},
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(EqualityDiversityStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, {application});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sould set this.applicant to application.trainee', () => {
    // arrange
    // act
    component.ngOnInit();
    // assert
    expect(component.applicant).toBe(component.application.trainee);
  });

  it('should be able to validate edi info', () => {
    // arrange
    const valid = { valid: true, messages: [], touched: undefined};
    MockEdiService.validate.and.returnValue(valid);
    const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');
    // act
    component.validate();
    // assert
    expect(validity$Spy).toHaveBeenCalledWith(Object.assign({}, valid));
  });

  it('update should call make dirty and validate', () => {
    // arrange
    const validateSpy: jasmine.Spy = spyOn(component, 'validate');
    const makeDirtySpy: jasmine.Spy = spyOn(component, 'makeDirty');
    // act
    component.ngOnInit();
    component.update({});
    // assert
    expect(makeDirtySpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
  });

  it(`load should load all edi's and set ready$ to true`, () => {
    // arrange
    const mockFunction = () => {
      const subscribe = () => {
        return of(true);
      };
      return subscribe;
    };
    MockEdiService.load.and.returnValue(of(mockFunction));
    const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');
    // act
    component.load();
    // assert
    expect(ready$Spy).toHaveBeenCalled();
  });
  
  it('method populateForm should be defined', () => {
    component.populateForm();
    expect(component.populateForm).toBeDefined();
  });

});
