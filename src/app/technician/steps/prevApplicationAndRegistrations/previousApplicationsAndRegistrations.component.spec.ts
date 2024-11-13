import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { PreviousApplicationsAndRegistrationsComponent } from './previousApplicationsAndRegistrations.component';
import { UtcDatePickerComponent } from '../../../shared/utcDatePicker.component';
import { UtcDatePipe } from '../../../shared/pipe/UtcDate.pipe';
import { PreviousRegistrationType } from '../../model/PreviousRegistrationType';
import { LayoutService } from '../../../core/service/layout.service';

describe('Previous Appications and registrations (technician)', () => {
  let component: PreviousApplicationsAndRegistrationsComponent;
  let fixture: ComponentFixture<PreviousApplicationsAndRegistrationsComponent>;
  let MockFormStepperService, MockLayoutService;

  beforeEach(waitForAsync(() => {
    const application = {
      activeForm: {
        applicationType: 981360001,
        previousApplicationsAndRegistrations: {
          applications: {
            preRegistrationTraining: {
              undertaken: true,
              preRegistrationNumber: '123213',
              startDate: new Date()
            },
            registration: {
              applied: true,
              registrationNumber: '',
              type: null,
              applicationDate: null
            }
          },
          registrations: [
            {
              registered: true,
              type: 1,
              nameOfBody: 'Caesar',
              registrationNumber: '324243',
             wasCertificateRequested: true
            },
            {
              registered: false,
              type: 0,
              nameOfBody: '',
              registrationNumber: '',
              wasCertificateRequested: false
            },
          ],
          ukRegistration: {            
              registered: true,
              type: 0,
              nameOfBody: 'ABC',
              registrationNumber: '',
              wasCertificateRequested: false
          },
          outsideUKRegistration: {            
            registered: true,
            type: 0,
            nameOfBody: 'ABC',
            registrationNumber: '',
            wasCertificateRequested: false
        }
        }
      }
    };
    MockFormStepperService = {};
    MockLayoutService = {};
    TestBed.configureTestingModule({
      declarations: [
        PreviousApplicationsAndRegistrationsComponent,
        CollapsibleComponent,
        UtcDatePickerComponent,
        UtcDatePipe
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDatepickerModule
      ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService },
        { provide: LayoutService, useValue: MockLayoutService },
      ]
    })
      .compileComponents();
      const secondDatePicker = TestBed.createComponent(UtcDatePickerComponent).componentInstance;
    fixture = TestBed.createComponent(PreviousApplicationsAndRegistrationsComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application, secondDatePicker });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form on init', () => {
    // arrange 
    const populateFormSpy: jasmine.Spy = spyOn(component, 'populateForm');
    // act 
    component.ngOnInit();
    // assert
    expect(populateFormSpy).toHaveBeenCalled();
  });

  it('able to call previous', () => {
    // arrange
    // act
    const beforePrevValue = component.beforePrev();
    // assert
    expect(component.dirty).toBeFalsy();
    expect(beforePrevValue).toBeTruthy();
  });

  it('if a user updates the value of any of the questions, update should call makeDirty() and validate()', () => {
    // arrange
    const makeDirtySpy: jasmine.Spy = spyOn(component, 'makeDirty');
    const validateSpy: jasmine.Spy = spyOn(component, 'validate');
    // act
    component.update();
    // assert
    expect(makeDirtySpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
  });

  // it('if a user updates a value of any of the questions, update should clear the datepicker.', () => {
  //   // arrange
  //   const makeDirtySpy: jasmine.Spy = spyOn(component, 'makeDirty');
  //   const validateSpy: jasmine.Spy = spyOn(component, 'validate');
  //   const secondDatePickerSpy: jasmine.Spy = spyOn(component.secondDatePicker , 'setDateToUndefined');
  //   // act
  //   fixture.detectChanges();
  //   component.update();
  //   // assert
  //   expect(makeDirtySpy).toHaveBeenCalled();
  //   expect(validateSpy).toHaveBeenCalled();
  //   expect(secondDatePickerSpy).toHaveBeenCalled();
  // });

  it('nullify detail should nullify all object prop values given to it, unless its type', () => {
    // arrange
    // act
    const registration = component.application.activeForm.
    previousApplicationsAndRegistrations.applications.registration;
    component.nullifyDetail(registration, 'confirmed');
    const { applied, registrationNumber, applicationDate
     } = registration;
    // assert
    expect(applied).toBeNull();
    expect(registrationNumber).toBeNull();
    expect(applicationDate).toBeNull();
  });

  it('answers cannot be null or undefined', () => {
    // arrange
    const { applied: hasApplied } = component.application.activeForm.
    previousApplicationsAndRegistrations.applications.registration; 
    // act
    const answerValid = component.isAnswerValid(hasApplied);
    // assert
    expect(answerValid).toBeTruthy();
  });
  
  describe('is valid detail ?', () => {
    
    it('isFirstQuestionValid should return true', () => {
      // arrange
      // act
      const isFirstQValid = component.isFirstQDetailValid;
      // assert
      expect(isFirstQValid).toBeFalsy();
    });
    
    it('isSecondQuestionValid should return true', () => {
      // arrange
      // act
      const isSecondQValid = component.isSecondQDetailValid;
      // assert
      expect(isSecondQValid).toBeTruthy();
    });

    it('isThirdQuestionValid should return true', () => {
      // arrange
      // act
      const isThirdQValid = component.isThirdQDetailValid;
      // assert
      expect(isThirdQValid).toBeTruthy();
    });

    
  });
  
   it('should validate all answers given', () => {
    // arrange
    const isAnswerValidSpy: jasmine.Spy = spyOn(component, 'isAnswerValid');
    // act
    component.validate();
    // assert
    expect(isAnswerValidSpy).toHaveBeenCalledTimes(4);
  });

  it('if has applied but has not given detail, show relevant message', () => {
    // arrange    
    const nullifyDetailSpy: jasmine.Spy = spyOn(component, 'nullifyDetail');
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    const registration = component.application.activeForm.
    previousApplicationsAndRegistrations.registrations[1];
    // act
    component.validate();
    // assert
    expect(validity$spy).toHaveBeenCalledWith({
      valid: false, 
      messages: ['Please indicate what type of application you have previously applied for.', 'Please confirm that you have, or will request a certificate of current professional status from your regulatory body', 
      'Please confirm that you have, or will request a certificate of current professional status from your regulatory body'],
      touched: undefined
    });
  });
  
  it('should populateForm conditionally', () => {
    // act
    component.populateForm();
    // assert
    expect(component.hasReducedWorkExperience).toBeTrue();
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

  it('should view be ready on call of load method',(() => {
    // arrange
    const readySpy: jasmine.Spy = spyOn(component.ready$,'next');
    component.viewReady = true;
    //act
    component.load();
    //assert
    expect(readySpy).toHaveBeenCalledWith(true);
  }));

});
