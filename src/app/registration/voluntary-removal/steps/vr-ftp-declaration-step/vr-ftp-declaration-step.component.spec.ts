import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DeclarationComponent } from '../../../../renewal/declaration.component';
import { TooltipModule } from '../../../../core/tooltip/tooltip.module';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';

import { VrFtpDeclarationStepComponent } from './vr-ftp-declaration-step.component';
import { DeclarationQuestionComponent } from '../../../../renewal/declarationQuestion.component';
import { FormQuestionComponent } from '../../../../dynamic/formQuestion.component';
import { FormAlternativeComponent } from '../../../../dynamic/formAlternative.component';
import { FormQuestionControlComponent } from '../../../../dynamic/formQuestionControl.component';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { VoluntaryRemovalApplicationStep } from '../../model/VoluntaryRemovalApplicationStep';
import { VoluntaryRemovalApplication } from '../../model/VoluntaryRemovalApplication';
import { RegistrantStatus } from '../../../../registration/model/RegistrantStatus';
import { of, throwError } from 'rxjs';

describe('VrFtpDeclarationStepComponent', () => {
  let component: VrFtpDeclarationStepComponent;
  let fixture: ComponentFixture<VrFtpDeclarationStepComponent>;
  let MockVrService, MockFormValidationService, MockFormStepperService;
  MockVrService = jasmine.createSpyObj('VoluntaryRemovalService', ['getDeclarationFormTemplates']);

   const application = {
        activeForm: {
            declarations: null,
        },
        forms: [{
            declarations: null,
        }],
    }

  beforeEach(async () => {
    MockFormStepperService = {};
    MockFormValidationService = {};
    await TestBed.configureTestingModule({
      declarations: [VrFtpDeclarationStepComponent,
        DeclarationComponent,
        DeclarationQuestionComponent,
        FormQuestionComponent,
        FormAlternativeComponent,
        FormQuestionControlComponent],
      imports: [
        TooltipModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatAutocompleteModule
      ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService },
        { provide: VoluntaryRemovalService, useValue: MockVrService },
        {
          provide: FormValidationService, useValue: MockFormValidationService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(VrFtpDeclarationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get ftp form', () => {
    expect(MockFormValidationService).toBeTruthy();
  });

  it('onInit set stepId and title', () => {
   // const formIndex = 0;
    component.ngOnInit();
    expect(component.title).toBe('Ftp declarations');
});


it('on init load application', () => {
  const loadSpy: jasmine.Spy = spyOn(component, 'populateForm');
  component.beforeNext();
  expect(loadSpy).toHaveBeenCalled();
});


// it('on load application is defined', fakeAsync(() => {
//   MockVrService.getDeclarationFormTemplates.and.returnValue(of(new VoluntaryRemovalApplication(application, RegistrantStatus.Applicant)));
//   component.load();
//   tick();
//   expect(component.application).toEqual(new VoluntaryRemovalApplication(application, RegistrantStatus.Applicant));
// }));

// it('on load application is defined', fakeAsync(() => {
//   MockVrService.getDeclarationFormTemplates.and.returnValue(throwError(new Error('error')));
//   component.load();
//   tick();
//   expect(component).toBeTrue();
// }));

it('should validate the next step', () => {
  // arrange
  const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
  // act
  component.validate();
  // assert
  expect(validity$spy).toHaveBeenCalledWith({ valid: undefined, messages: ['You must answer all the questions to continue'], touched: undefined });

});


describe('( Populate form )', () => {

  it('Should return error messages when form is loaded', () => {
    component = Object.assign(component, { application });
    component.application = application;
    component.validate();
    expect(component.validity$.value.messages.length).toBe(1);
});

});

});