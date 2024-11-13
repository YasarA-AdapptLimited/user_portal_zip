import { AssessmentReportStep } from './../../models/AssessmentReportStep';
import { ApplicationStatus } from './../../../model/ApplicationStatus';
import { LogService } from './../../../../core/service/log.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AssessmentReportService } from './../../../../core/service/assessmentReport.service';
import { MatSelectModule } from '@angular/material/select';
import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { FormsModule } from '@angular/forms';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentReportCountersigningStepComponent } from './assessmentReportCountersigningStep.component';
import { TooltipModule } from '../../../../core/tooltip/tooltip.module';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../../../shared/confirmDialog.component';
import { NgModule, DebugNode, DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { By } from 'protractor';

describe('( Assessment report ) => Countersigning step', () => {
  let component: AssessmentReportCountersigningStepComponent;
  let fixture: ComponentFixture<AssessmentReportCountersigningStepComponent>;
  let MockFormStepper, MockAssessmentReportService;

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
    MockAssessmentReportService = jasmine.createSpyObj(['sendToCountersigner', 'recallFromCountersigner']);
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
        formStatus: ApplicationStatus.ReadyForCountersigning,
        countersignatures: [
          {
            registrationNumber: '9036985',
            forenames: 'GrH1012236',
            surname: 'RiH1012236',
            town: 'CHH1012236',
            countersignerGPhCId: '607ece3',
            id: 'a2bd4091',
            decisionMadeAt: null,
            decision: 1,
            feedback: null,
            isCertifiedPhoto: null,
            countersignerCommentId: null,
            countersignerComment: 'testing script'
          }
        ],
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        AssessmentReportCountersigningStepComponent,
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
        { provide: AssessmentReportService, useValue: MockAssessmentReportService },
        { provide: LogService, useValue: MockLogger },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AssessmentReportCountersigningStepComponent);
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

  it('on load, indicate that step is ready', () => {
    const ready$Spy: jasmine.Spy = spyOn(component.ready$,'next');
    component.load();
    expect(ready$Spy).toHaveBeenCalledOnceWith(true);
  });

  it('awaitingCountersigning returns true if application is ready for countersigning', () => {
    expect(component.awaitingCountersigning).toBeTrue();
  });

  it('countersigned returns true if application is countersigned', () => {
    expect(component.countersigned).toBeFalse();
  });

  it('previous step disabled if application is either ready for countersigning or countersigned', () => {
    expect(component._prevDisabled).toBeTrue();
  });

  it('if user try navigatin gto next step,whe application is ready for countersigning error is shown', () => {
    const validity$Spy: jasmine.Spy = spyOn(component.validity$,'next');
    component.validate();
    expect(validity$Spy).toHaveBeenCalledOnceWith({valid: false,messages: ['You cannot proceed until your selected tutor has completed your progress report.' ],touched: undefined});
  });

  describe('User', () => {



    it('Can send to countersigning pharmacist', () => {
      const dialog = {
        open(comp, data) { return { afterClosed: () => of({ action: true }) } }
      };
      (MockAssessmentReportService.sendToCountersigner as jasmine.Spy)
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
      (MockAssessmentReportService.recallFromCountersigner as jasmine.Spy)
        .and.returnValue(of(true));
      // act
      component.recall();
      // assert
      expect(component.application.activeForm.formStatus).toBe(ApplicationStatus.InProgress);
      expect(formStepSpy).toHaveBeenCalledWith(1, AssessmentReportStep.Countersigning);

    });


  });



  describe('( Populate form )', () => {

    it('should set selected tutor if countersigning is pending', () => {
      // arrange
      component.populateForm();
      // assert
      expect(component.selectedPharmacist).toBe('9036985');
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
    });     // act


    it('awaitingCountersigning is false, if formStatus is not ready for countersigning', () => {
      expect(component.awaitingCountersigning).toBeFalse();
    });

    it('countersigned is false, if formStatus is not countersigned', () => {
      expect(component.countersigned).toBeFalse();
    });

    it('_prevDisabled is false, if formStatus is not countersigned or not ready for countersigning', () => {
      expect(component._prevDisabled).toBeFalse();
    });

    it('on call of load method serverErrors are undefined and ready$ is triggered', ()=> {
      const readySpy: jasmine.Spy = spyOn(component.ready$, 'next');
      component.load();
      expect(component.serverErrors).toBeUndefined();
      expect(readySpy).toHaveBeenCalled();
    });

    it('on validate, if formStatus is not ready for countersigning yet a error message is shown', () => {
      component.validate();    
      expect(component.validity$.value.messages.length).toBe(1);
    });
  });








});
