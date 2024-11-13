import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { AuthService } from '../../../../core/service/auth.service';
import { ApplicationFormMode } from '../../../../prereg/model/ApplicationFormMode';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';
import { RegistrantStatus } from '../../../../registration/model/RegistrantStatus';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { VoluntaryRemovalApplicationStep } from '../../model/VoluntaryRemovalApplicationStep';

import { VrDateReasonForRemovalRequiredStepComponent } from './vr-date-reason-for-removal-required-step.component';

describe('VrDateReasonForRemovalRequiredStepComponent', () => {
  let component: VrDateReasonForRemovalRequiredStepComponent;
  let fixture: ComponentFixture<VrDateReasonForRemovalRequiredStepComponent>;
  let MockFormStepperService, MockAuthService, MockVoluntaryRemovalService;

  MockVoluntaryRemovalService = jasmine.createSpyObj('VoluntaryRemovalService',['isOutstandingPaymentZero'])
  MockAuthService = {
    user: {
      registrant: {
        expiryDate: '2023-2-15T00:00:00'
      }
    }
  }

  let application = {
      activeForm: {
        id: '',
        formStatus: ApplicationStatus.NotStarted,
        isMentorRegistered: false,
        declarations: [],
        attachments: [],
        isOverallDeclarationConfirmed: false,
        step: VoluntaryRemovalApplicationStep.DateReasonForRemovalRequired,
        minStep: VoluntaryRemovalApplicationStep.DateReasonForRemovalRequired,
        mode: ApplicationFormMode.Editable,
        declaration: {
            isQ1Confirmed: true,
            isQ2Confirmed: false,
            isQ3Confirmed: false,
            isQ4Confirmed: false,
            isQ5Confirmed: false
        },
        voluntaryRemovalDetails: {
          dateOfRegistryRemoval: '2022-03-31T00:00:00',
          reasonForRemoval: 'Other',
          reasonForRemovalDetails: 'reason',
          superintendentName: null,
          superintendentNumber: null
      },
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VrDateReasonForRemovalRequiredStepComponent ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService },
        { provide: AuthService, useValue: MockAuthService },
        { provide: VoluntaryRemovalService, useValue: MockVoluntaryRemovalService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VrDateReasonForRemovalRequiredStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component,{application});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should validate on date change', () => {
    const validateSpy:jasmine.Spy = spyOn(component, 'validate');
    component.dateChange();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should validate on reason change', () => {
    const validateSpy:jasmine.Spy = spyOn(component, 'validate');
    component.voluntaryRemovalDetails = {
      dateOfRegistryRemoval: '',
      reasonForRemoval: '',
      reasonForRemovalDetails: '',
      superintendentName: '',
      superintendentNumber: ''
  }
    component.onReasonChange();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('validate throws error if date of removal is in past', () => {
    component.voluntaryRemovalDetails = component.application.activeForm.voluntaryRemovalDetails;
    const validity$Spy:jasmine.Spy = spyOn(component.validity$, 'next');
    component.validate();
    expect(validity$Spy).toHaveBeenCalledWith({ valid: false, messages: ['Please enter a valid date'], touched: undefined});
  });
});
