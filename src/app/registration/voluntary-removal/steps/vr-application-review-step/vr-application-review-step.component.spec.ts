import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LayoutService } from '../../../../core/service/layout.service';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';

import { VrApplicationReviewStepComponent } from './vr-application-review-step.component';

describe('VrApplicationReviewStepComponent', () => {
  let component: VrApplicationReviewStepComponent;
  let fixture: ComponentFixture<VrApplicationReviewStepComponent>;
  let MockFormStepperService, MockVoluntaryRemovalService, MockRouter, MockLayoutService, MockMatDialog;

  MockVoluntaryRemovalService = jasmine.createSpyObj('VoluntaryRemovalService', ['submitVoluntaryApplicationWithoutDues']);  
  MockRouter =  { navigate: () => Promise.resolve(true)};
  MockLayoutService= jasmine.createSpyObj('LayoutService', ['setOverlay']);

  let afterClosed = () => { return of({}) };
  let openFunc = () => { return {afterClosed}};
  MockMatDialog = {
      open: openFunc
  }

  const application = {
    activeForm: {
      voluntaryRemovalDetails: {
          dateOfRegistryRemoval: '2022-12-31T00:00:00',
          reasonForRemoval: 'Other',
          reasonForRemovalDetails: 'reason',
          superintendentName: null,
          superintendentNumber: null
      },
      appDeclaration: {
          isQ1Confirmed: null,
          isQ2Confirmed: null
      },
      equalityDiversity: {
          ethnicity: 717750017,
          ethnicityOther: null,
          nationality: null,
          religion: null,
          religionOther: null,
          disabled: null,
          disabilityDetails: null,
          gender: null,
          sexualOrientation: null
      },
      isOverallDeclarationAcknowledged: false,
      ftpDeclarations: [],
      id: 123,
      formStatus: 2,
      step: 1,
      scope: 7,
      attachments: [],
      countersignatures: [],
      createdAt: '2022-04-01T11:54:00.38',
      dateApplicationSubmitted: null,
      minStep: 1
    },
    outstandingPayments: null
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VrApplicationReviewStepComponent ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService },
        { provide: VoluntaryRemovalService, useValue: MockVoluntaryRemovalService},
        { provide: Router, useValue: MockRouter },
        { provide: LayoutService, useValue: MockLayoutService },
        { provide: MatDialog, useValue: MockMatDialog }
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(VrApplicationReviewStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate on date change', () => {
    const validateSpy:jasmine.Spy = spyOn(component.validity$, 'next');
    component.validate();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('goToStep let navigate to required step', () => {
    const navigateSpy:jasmine.Spy = spyOn(component.navigate, 'emit');
    component.goToStep(1);
    expect(navigateSpy).toHaveBeenCalledWith(1);
  });

  it('on load, pass true into ready$', () => {    
    const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');    
    component.load();    
    expect(ready$Spy).toHaveBeenCalledWith(true);
  });

  it('if no payments are in due, application is submitted', fakeAsync(() => {
    const submitSpy: jasmine.Spy = spyOn(component,'submit');
    MockVoluntaryRemovalService.submitVoluntaryApplicationWithoutDues.and.returnValue(of({}));
    component.beforeNext();
    expect(submitSpy).toHaveBeenCalled();
  }));

  it('display errors if application submission failed', fakeAsync(() => {
    MockVoluntaryRemovalService.submitVoluntaryApplicationWithoutDues.and.returnValue(throwError({}));
    component.submit();
    tick();
    expect(component.submitting).toBeFalse();
  }));
});
