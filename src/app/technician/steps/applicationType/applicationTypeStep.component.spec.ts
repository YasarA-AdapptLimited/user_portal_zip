import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';

import { ApplicationTypeStepComponent } from './applicationTypeStep.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { GphcIconComponent } from '../../../shared/gphc-icon.component';
import { TooltipModule } from '../../../core/tooltip/tooltip.module';
import { ApplicationProcessType } from '../../model/ApplicationProcessType';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from '../../../shared/confirmDialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

describe('Application Type Step Component', () => {
  let component: ApplicationTypeStepComponent;
  let fixture: ComponentFixture<ApplicationTypeStepComponent>;
  let MockFormStepperService;

  @NgModule({
    declarations: [
        ConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
  class testingModule {}

  beforeEach(waitForAsync(() => {
    const application = {
      activeForm: {
        applicationType: null,
        attachments: [
          1, 2, 3, 4
        ],
        workExperiences: [
          {test1: 'Subutai bahadur'},
          {test1: 'Nepoleon Bonaparte'},
        ],
        clearStepsDependentOnApplicationType: () => {
          console.log('Dependent steps cleared');
        }
      }
    }
    MockFormStepperService = {};
    TestBed.configureTestingModule({
      declarations: [
        ApplicationTypeStepComponent,
        CollapsibleComponent,
        GphcIconComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        TooltipModule,
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
        testingModule
      ],
      
      providers: [
        {provide: FormStepperService, useValue: MockFormStepperService}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ApplicationTypeStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, {application});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('beforePrev should set this.dirty === true', () => {
    // arrange
    // act
    const beforePrevValue = component.beforePrev();
    // assert
    expect(component.dirty).toBeFalsy();
    expect(beforePrevValue).toBeTruthy();
  });
  
  it('should call makedirty and validate if update is called', () => {
    // arrange 
    const makeDirtySpy = spyOn(component, 'makeDirty');
    const validateSpy = spyOn(component, 'validate');
    // act 
    component.update(ApplicationProcessType.TwoYears);
    // assert
    expect(makeDirtySpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('if theres no application type, validity is false', () => {
    // arrange
    const validity$Spy = spyOn(component.validity$, 'next').and.callThrough();
    // act 
    component.validate();
    // assert
    expect(validity$Spy).toHaveBeenCalledWith(
      { valid: false, messages: [ 'You must choose one of the options displayed' ] , touched: undefined})
  });

  it('should be able to clear dependent steps if user changes app type', () => {
    // arrange
    const depententStepsSpy: jasmine.Spy = spyOn(component.dependentStepsCleared, 'emit');
    // act
    component.clearDependentSteps();
    // assert
    expect(depententStepsSpy).toHaveBeenCalledWith('cleared');

  });

  it('should method notify if view is ready',() => {
    // arrange
    const readySpy: jasmine.Spy = spyOn(component.ready$,'next');
    component.viewReady = true;
    //act
    component.load();
    //assert
    expect(readySpy).toHaveBeenCalledWith(true);
  });

  it('should view be ready after ngAfterVieInit',fakeAsync(() => {
    // arrange
    const readySpy: jasmine.Spy = spyOn(component.ready$,'next');
    component.viewReady = true;
    //act
    component.ngAfterViewInit();
    tick();
    //assert
    expect(readySpy).toHaveBeenCalledWith(true);
    expect(component.viewReady).toBeTrue();
  }));

  it('method populateForm should be defined', () => {
    component.populateForm();
    expect(component.populateForm).toBeDefined();
  });
});
