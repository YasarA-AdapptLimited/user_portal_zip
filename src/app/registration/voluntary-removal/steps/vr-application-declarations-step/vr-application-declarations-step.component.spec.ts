import { async, ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from 'protractor';
import { of } from 'rxjs';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { TooltipModule } from '../../../../core/tooltip/tooltip.module';
import { CollapsibleComponent } from '../../../../shared/collapsible.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { GphcIconComponent } from '../../../../shared/gphc-icon.component';

import { VrApplicationDeclarationsStepComponent } from './vr-application-declarations-step.component';

describe('VrApplicationDeclarationsStepComponent', () => {
  let component: VrApplicationDeclarationsStepComponent;
  let fixture: ComponentFixture<VrApplicationDeclarationsStepComponent>;
  let MockFormStepperService, MockVoluntaryRemovalService;
  let setupApplicationProps, mockAnswers;
  const application = {
        activeForm: {
          appDeclaration: { isQ1Confirmed: true,
              isQ2Confirmed: true }
        }
  };
 mockAnswers = true;

  beforeEach(() => {
      MockFormStepperService = {};
      TestBed.configureTestingModule({
          declarations: [
            VrApplicationDeclarationsStepComponent,
              GphcIconComponent,
              CollapsibleComponent
          ],
          imports: [
              TooltipModule,
              FormsModule,
              ReactiveFormsModule,
              MatCheckboxModule,
              MatAutocompleteModule
          ],
          providers: [
            { provide: FormStepperService, useValue: MockFormStepperService },
            {
              provide: VoluntaryRemovalService, useValue: MockVoluntaryRemovalService
            }
          ]

      }).compileComponents();
      fixture = TestBed.createComponent(VrApplicationDeclarationsStepComponent);
      component = fixture.componentInstance;
      component = Object.assign(component, { application });
      MockVoluntaryRemovalService = TestBed.get(VoluntaryRemovalService);
      //MockVoluntaryRemovalService = jasmine.createSpyObj('VoluntaryRemovalService', ['sendFtpDeclarationAnswers']); 
  });

  it('should create', () => {
      expect(component).toBeTruthy();
  });

  it('load ngonInIt', () => {
    const AnswersSpy: jasmine.Spy = spyOn(component, 'getFtpAnswers');
    // act
    component.ngOnInit();
    // assert
    expect(AnswersSpy).toHaveBeenCalled();
  });
  it('update make calls to makeDirty and validate method', () => {
    const makeDirtySpy: jasmine.Spy = spyOn(component, 'makeDirty');
    const validateSpy: jasmine.Spy = spyOn(component, 'validate');

    component.update();
    expect(makeDirtySpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
});

it('update ftp answer', () => {
  const ansSpy:jasmine.Spy = spyOn(component, 'getFtpAnswers');
  component.ngOnInit();
  expect(ansSpy).toHaveBeenCalled();
});
  it('get ftp answers to validate', fakeAsync(() => {

const ftpData$ = fixture.debugElement.injector.get(VoluntaryRemovalService);
ftpData$.dataSource.next(mockAnswers);
fixture.detectChanges();
tick();
//const ans = fixture.debugElement.queryAll(By.directive(VrApplicationDeclarationsStepComponent));
expect(ftpData$).toHaveBeenCalled();

  }));

it('if the view is ready, set pass true into ready$', () => {
    component.viewReady = true;
    const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');
    component.load();
    expect(ready$Spy).toHaveBeenCalledWith(true);
  });

  it('should view be ready after ngAfterVieInit', fakeAsync(() => {
    // arrange
    const readySpy: jasmine.Spy = spyOn(component.ready$, 'next');
    component.viewReady = true;
    // act
    component.ngAfterViewInit();
    tick();
    // assert
    expect(readySpy).toHaveBeenCalledWith(true);
    expect(component.viewReady).toBeTrue();
  }));


describe('If user', () => {
  it('has nothing filled and tries to proceed, should display error messages', () => {
    // arrange 
    spyOn(component,'getFtpAnswers');
    const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');
    component.application.activeForm.appDeclaration.isQ1Confirmed = null;
    component.application.activeForm.appDeclaration.isQ2Confirmed = null;
    // act 
    component.validate();
    // assert
    expect(validity$Spy).toHaveBeenCalledWith({
      valid: null, messages: ['You have not confirmed the 1st declaration','You have not confirmed the 2nd declaration','You have to complete this section first'], touched: undefined
    });

  });

  it('has not confirmed Q1 declaration, should display error message', () => {
    spyOn(component,'getFtpAnswers');
    const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');
   component.application.activeForm.appDeclaration.isQ1Confirmed = true;
   component.application.activeForm.appDeclaration.isQ2Confirmed = null;
    // act 
    fixture.detectChanges();
    component.validate();
    // assert
    expect(validity$Spy).toHaveBeenCalledWith({
      valid: null, messages: ['You have not confirmed the 2nd declaration', 'You have to complete this section first'], touched: undefined
    });
  });

  it('has confirmed Q1 and Q2 declarations', () => {
    spyOn(component,'getFtpAnswers');
    component.application.activeForm.appDeclaration.isQ1Confirmed = true;
    component.application.activeForm.appDeclaration.isQ2Confirmed = true;
    const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');
    // act
    fixture.detectChanges();
    component.validate();
    // assert
    expect(validity$Spy).toHaveBeenCalledWith({
      valid: true,
      messages: [],
      touched: undefined
    });
  });

  it('has confirmed Q1 declaration and not Q2 declaration', () => {
    spyOn(component,'getFtpAnswers');
    const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');
    component.application.activeForm.appDeclaration.isQ1Confirmed = null;
    component.application.activeForm.appDeclaration.isQ2Confirmed = true;
    // act 
    fixture.detectChanges();
    component.validate();
    // assert
    expect(validity$Spy).toHaveBeenCalledWith({
      valid: null,
      messages: ['You have not confirmed the 1st declaration','You have to complete this section first'],
      touched: undefined
    });
  });
});

});