
import { ApplicationStatus } from './../../../model/ApplicationStatus';
import { LogService } from './../../../../core/service/log.service';
import { MatDialogModule } from '@angular/material/dialog';

import { MatSelectModule } from '@angular/material/select';
import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { FormsModule } from '@angular/forms';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipModule } from '../../../../core/tooltip/tooltip.module';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../../../shared/confirmDialog.component';
import { NgModule, DebugNode, DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { By } from 'protractor';
import { FinalDeclarationService } from '../../../../core/service/finalDeclaration.service';
import { FinalDeclarationStep } from '../../model/FinalDeclarationStep';
import { FinalDeclarationCountersigningStepComponent } from './finalDeclarationCountersigningStep.component';
import { FinalDeclaration } from '../../model/FinalDeclaration';

describe('( Final Declaration ) => Countersigning step', () => {
  let component: FinalDeclarationCountersigningStepComponent;
  let fixture: ComponentFixture<FinalDeclarationCountersigningStepComponent>;
  let MockFormStepper, MockFinalDeclarationService;

  @NgModule({
    declarations: [
        ConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
  class testingModule { }
  beforeEach(() => {
    MockFormStepper = jasmine.createSpyObj(['disableAllStepsExcept', 'setStepRange']);
    MockFinalDeclarationService = jasmine.createSpyObj(['sendToCountersigner', 'recallFromCountersigner']);
    const MockLogger = jasmine.createSpyObj(['info']);
    const application = {
      tutorDetails: [
        {
          tutorGPhCId: 'test',
          registrationNumber: '13517',
          name: 'srimani',
          startDate: '29/02/2020',
          endDate: '29/06/2020',
        }
      ],
      activeForm: {
        formStatus: ApplicationStatus.InProgress,
        countersignatures: [
          {
            forenames:'XXX',
            surname:'YYY',
            town:'town',
            decisionMadeAt:null,
            decision:1,
            feedback:'feedback test',
            learningContractResponse:'learning contract response',
            eligibleAsTutor:'eligible as tutor test',
            registrationNumber:'12345'
          }
        ],
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        FinalDeclarationCountersigningStepComponent,
        GphcIconComponent,
        CollapsibleComponent,
      ],
      imports: [
        FormsModule,
        MatSelectModule,
        TooltipModule,
        MatDialogModule,
        testingModule
      ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepper },
        { provide: FinalDeclarationService, useValue: MockFinalDeclarationService },
        { provide: LogService, useValue: MockLogger },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FinalDeclarationCountersigningStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On initialisation, should call populateForm', () => {
    // arrange
    const populateFormSpy: jasmine.Spy = spyOn(component, 'populateForm');
    // act
    component.ngOnInit();
    // assert
    expect(populateFormSpy).toHaveBeenCalled();
  });

  it('awaitingCountersigning returns false if application status is other than ReadyForCountersigning', () => {
    expect(component.awaitingCountersigning).toBeFalse();
  });

  it('countersigned returns false if application status is other than Countersigned', () =>{
    expect(component.countersigned).toBeFalse();
  });

  it('previous step disabled if application form status is either ReadyForCountersigning or Countersigned', () => {
    expect(component._prevDisabled).toBeFalse();
  });

  it('validate method, throws error message if the step is not valid', () => {
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    component.validate();
    expect(validity$spy).toHaveBeenCalledWith({ valid: false, messages: ['You cannot proceed until you have selected a tutor to complete your progress report'], touched: undefined });
  });

  describe('User', () => {
    it('Can send to countersigning pharmacist', () => {
      const dialog = {
        open(comp, data) { return { afterClosed: () => of({ action: true }) } }
      };
      (MockFinalDeclarationService.sendToCountersigner as jasmine.Spy)
        .and.returnValue(of(true));
      component = Object.assign(component, { dialog });
      // act
      component.sendForCountersigning();
      // assert
      expect(component.application.activeForm.formStatus).toBe(ApplicationStatus.ReadyForCountersigning);
    });

    it('Can recall application from specified Pharmacy professional', () => {
      // arrange
      const formStepSpy = (MockFormStepper.setStepRange as jasmine.Spy).and.callThrough();
      (MockFinalDeclarationService.recallFromCountersigner as jasmine.Spy)
        .and.returnValue(of(true));
      // act
      component.recall();
      // assert
      expect(component.application.activeForm.formStatus).toBe(ApplicationStatus.InProgress);
      expect(formStepSpy).toHaveBeenCalledWith(1, FinalDeclarationStep.Countersigning);

    });


  });



  describe('( Populate form )', () => {

    it('should set selected tutor if countersigning is pending', () => {
      // arrange
      // act
      component.populateForm();
      // assert
      expect(component.selectedPharmacist).toBe('12345');
    });

    it('should set selected tutor if countersigning is completed', () => {
      // arrange
      const countersignatures = [
        {
          registrationNumber: '111111',
          forenames: 'GrH1012236',
          surname: 'RiH1012236',
          town: 'CHH1012236',
          countersignerGPhCId: '607ece33-7caf-e411-80e6-005056851bfe',
          id: 'a2bd4091-f399-4d82-8cca-b4bbf8ea802e',
          decisionMadeAt: null,
          decision: 2,
          feedback: null,
          isCertifiedPhoto: null,
          countersignerCommentId: null,
          countersignerComment: 'testing script'
        }
      ]
      component.application.activeForm = Object.assign(component.application.activeForm, { countersignatures });      
      // act
      component.populateForm();
      // assert
      expect(component.selectedPharmacist).toBe('111111');
    });

    it('An error message is shown user try continuing without selecting tutor', () => {
        component.validate();
        expect(component.validity$.value.messages.length).toBe(1);
    });

    it('awaitingCounterSigning is false, if applicationStatus is not ReadyForCountersigning', () => {
        expect(component.awaitingCountersigning).toBeFalse();
    });

    it('countersigned is false, if applicationStatus is not CounterSigned', () => {
        expect(component.countersigned).toBeFalse();
    });

    it('_prevDisabled return false if applicationStatusis neither ReadyForCountersigning nor CounterSigned', () => {
        expect(component._prevDisabled).toBeFalse();
    });

    it('on load serverError is set undefined', () => {
        component.load();
        expect(component.serverErrors).toBeUndefined();
    });
  });








});
