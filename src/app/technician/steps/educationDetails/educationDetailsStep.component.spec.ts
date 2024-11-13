import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { EducationDetailsStepComponent } from './educationDetailsStep.component';
import { DaterangeComponent } from '../../../shared/daterange.component';
import { TechnicianService } from '../../../core/service/technician.service';
import { UtcDatePickerComponent } from '../../../shared/utcDatePicker.component';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { UtcDatePipe } from '../../../shared/pipe/UtcDate.pipe';
import { of } from 'rxjs';
import { GphcIconComponent } from '../../../shared/gphc-icon.component';
import { TooltipModule } from '../../../core/tooltip/tooltip.module';
import { WorkExperience } from '../../model/WorkExperience';
import { LogService } from '../../../core/service/log.service';
import { ConfirmDialogComponent } from '../../../shared/confirmDialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

describe('Education details step component', () => {
  let component: EducationDetailsStepComponent;
  let fixture: ComponentFixture<EducationDetailsStepComponent>;
  let MockFormStepperService, MockTechnicianService, MockKnowledgeQualifications,
    MockCompentencyQualifications, MockCombinedQualifications;

    
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
    MockFormStepperService = {};
    MockTechnicianService = jasmine.createSpyObj(['getQualificationList']);
    const MockLogger = jasmine.createSpyObj(['info']);
    MockKnowledgeQualifications = [
      {
        courseName: 'Buttercups BCP/14/001',
        courseType: 717750003,
        id: 'bbabdaa0-77af-e411-80d8-00505685383b'
      },
      {
        courseName: 'Buttercups Level 3 Know Based (no code)',
        courseType: 717750003,
        id: 'bcabdaa0-77af-e411-80d8-00505685383b'
      },
      {
        courseName: 'City & Guilds Dip Pharm Serv Level 3 500/9959/0',
        courseType: 717750003,
        id: 'bdabdaa0-77af-e411-80d8-00505685383b'
      }
    ];
    MockCompentencyQualifications = [
      {
        courseName: 'City & Guilds Pharm Serv NVQ Level 3 100/2201/6',
        courseType: 717750002,
        id: 'b4abdaa0-77af-e411-80d8-00505685383b'
      },
      {
        courseName: 'City & Guilds NVQ L3 Pharm Serv Skills (QCF) 500/9576/6',
        courseType: 717750002,
        id: 'b6abdaa0-77af-e411-80d8-00505685383b'
      },
      {
        courseName: 'City & Guilds Level 3 NVQ 500/9576/6',
        courseType: 717750002,
        id: 'b5abdaa0-77af-e411-80d8-00505685383b'
      }
    ];
    MockCombinedQualifications = [
      {
        courseName: 'City & Guilds Pharm Serv NVQ Level 3 100/2201/6',
        courseType: 717750002,
        id: 'b4abdaa0-77af-e411-80d8-00505685383b'
      },
      {
        courseName: 'City & Guilds NVQ L3 Pharm Serv Skills (QCF) 500/9576/6',
        courseType: 717750002,
        id: 'b6abdaa0-77af-e411-80d8-00505685383b'
      },
      {
        courseName: 'City & Guilds Level 3 NVQ 500/9576/6',
        courseType: 717750002,
        id: 'b5abdaa0-77af-e411-80d8-00505685383b'
      }
    ];
    let application = {
      activeForm: {
        educationDetails: {
          knowledge: {
            dateAwarded: '2019-08-31',
            dateCommenced: '2019-08-29',
            id: '4da5e242-9469-4cfc-93c5-4d5f3b0dbe69',
            qualificationId: 'beabdaa0-77af-e411-80d8-00505685383b',
            qualificationType: 0
          },
          competency: {
            dateAwarded: '2019-11-29',
            dateCommenced: '2019-08-29',
            id: '3c9dfa52-ccc9-4641-af24-36344cfca081',
            qualificationId: 'b7abdaa0-77af-e411-80d8-00505685383b',
            qualificationType: 1
          },
          combined: {
            dateAwarded: '2019-11-29',
            dateCommenced: '2019-08-29',
            id: '3c9dfa52-ccc9-4641-af24-36344cfca081',
            qualificationId: 'b7abdaa0-77af-e411-80d8-00505685383b',
            qualificationType: 2
          }
        },
        workExperiences: [
          {
            id: '123',
            startDate: '06-01-2020',
            endDate: '01-01-2021',
            jobTitle: 'XX',
            premise: {
                id: '',
                registrationNumber: '',
                name: '',
                owner: '',
                expiryDate: '',
                accreditedTo: '',
                eligibleAsTrainingSite: true,
                premiseStatus: ''
            },
            supervisingPharmacists: [
                {
                    id: '123',
                    forenames: 'XXX',
                    surname: 'YYY',
                    registrationNumber: 'A123',
                    eligibleAsTutor: true,
                    initialRegistrationDate: '03-01-2008',
                    gPhCId: 'B123',
                    gphcId: '12345'
                }
            ],
            workedHoursPerWeek: 14,
            trainingWindow: {
                start: {
                  from: '06-01-2020',
                  to: '06-01-2021'
                },
                end: {
                  to: '12-01-2021'
                }
              }
        }
        ],
      
          clearQualificationAttachments: () => {
            console.log('Dependent steps cleared');
          }
      
       
      },
      trainee: {
        title: { name: '', id: 12345 },
        forenames: 'XYZ',
        middleName: 'XYZ',
        surname: 'XYZ',
        address: {},
        contact: {},
        dateOfBirth: '',
        qualification: { courseName: '', courseType: '' },
        equalityDiversity: {}
      }
    };
    TestBed.configureTestingModule({
      declarations: [
        EducationDetailsStepComponent,
        DaterangeComponent,
        UtcDatePickerComponent,
        UtcDatePipe,
        CollapsibleComponent,
        GphcIconComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatSelectModule,
        MatDatepickerModule,
        TooltipModule
      ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService },
        { provide: TechnicianService, useValue: MockTechnicianService },
        { provide: LogService, useValue: MockLogger },
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(EducationDetailsStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load knowledge/competency qualification', () => {
    // arrange
    const knowledge = spyOn(component, 'loadKnowledgeQualifications');
    const compentency = spyOn(component, 'loadCompetencyQualifications');
    const combined = spyOn(component, 'loadCombinedQualifications');
    // act
    component.ngOnInit();
    // assert
    expect(knowledge).toHaveBeenCalled();
    expect(compentency).toHaveBeenCalled();
    expect(combined).toHaveBeenCalled();
  });

  it('loadKnowledge should load all knowledge qualification', () => {
    // arrange
    MockTechnicianService.getQualificationList.and.returnValue(of(MockKnowledgeQualifications));
    // act
    component.loadKnowledgeQualifications();
    // assert
    expect(component.knowledgeQualifications).toEqual(MockKnowledgeQualifications);
  });

  it('loadKnowledge should load all knowledge qualification', () => {
    // arrange
    MockTechnicianService.getQualificationList.and.returnValue(of(MockCompentencyQualifications));
    // act
    component.loadCompetencyQualifications();
    // assert
    expect(component.competencyQualifications).toEqual(MockCompentencyQualifications);
  });

  it('loadCombineQualification should load all combined qualification', () => {
    // arrange
    MockTechnicianService.getQualificationList.and.returnValue(of(MockCombinedQualifications));
    // act
    component.loadCombinedQualifications();
    // assert
    expect(component.combinedQualifications).toEqual(MockCombinedQualifications);
  });

  it('can update knowledge date commenced and date awarded', () => {
    // arrange
    const dateRange = { to: 'January 31 1980', from: 'January 30 1980' };
    const validateSpy = spyOn(component, 'validate');
    // act
    component.updateKnowledgeDates(dateRange);
    // assert
    expect(component.application.activeForm
      .educationDetails.knowledge.dateCommenced)
      .toBe(dateRange.from);
    expect(component.application.activeForm
      .educationDetails.knowledge.dateAwarded)
      .toBe(dateRange.to);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('can update competency date commenced and date awarded', () => {
    // arrange
    const dateRange = {
      to: '27-09-2019',
      from: '17-04-96'
    };
    const validateSpy = spyOn(component, 'validate');
    // act
    component.updateCompetencyDates(dateRange);
    // assert
    expect(component.application.activeForm.educationDetails.competency.dateCommenced).toBe(dateRange.from);
    expect(component.application.activeForm
      .educationDetails.competency.dateAwarded).toBe(dateRange.to);
    expect(validateSpy).toHaveBeenCalled();
  });
  it('can update combined date commenced and date awarded', () => {
    // arrange
    const dateRangeCombine = {
      to: '27-09-2021',
      from: '17-04-1996'
    };
    const validateSpy = spyOn(component, 'validate');
    // act
    component.updateCombinedDates(dateRangeCombine);
    // assert
    expect(component.application.activeForm.educationDetails.combined.dateCommenced).toBe(dateRangeCombine.from);
    expect(component.application.activeForm.educationDetails.combined.dateAwarded).toBe(dateRangeCombine.to);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('update should call makeDirty and validate', () => {
    // arrange
    const validateSpy = spyOn(component, 'validate');
    const makeDirtySpy = spyOn(component, 'makeDirty');
    // act
    component.update();
    // assert
    expect(validateSpy).toHaveBeenCalled();
    expect(makeDirtySpy).toHaveBeenCalled();

  });

  it('beforePRev should set dirty to false', () => {
    // arrange
    // act
    const beforePrevVal = component.beforePrev();
    // assert
    expect(beforePrevVal).toBeTruthy();
    expect(component.dirty).toBeFalsy();
  });

  it('if the view is ready, call true on ready$', () => {
    // arrange
    component.viewReady = true;
    const ready$Spy = spyOn(component.ready$, 'next');
    // act
    component.load();
    // assert
    expect(ready$Spy).toHaveBeenCalledWith(true);
  });

  it('method populateForm should be defined', () => {
    component.populateForm();
    expect(component.populateForm).toBeDefined();
  });

  it('should be able to clear work experience if user changes course type type', () => {
    // arrange
    const depententStepsSpy: jasmine.Spy = spyOn(component.dependentDocsStepsCleared, 'emit');
    // act
    component.clearDependentSteps();
    // assert
    expect(depententStepsSpy).toHaveBeenCalledWith('cleared');


  });
  it('if theres no course type, validity is false', () => {
    // arrange
    const knowledge = {
      dateAwarded: '2019-08-31',
            dateCommenced: '2019-08-29',
    };
    const competency = {
      dateAwarded: '2019-11-29',
      dateCommenced: '2019-08-29',
    };
    const combined = {
      dateAwarded: '2019-11-29',
      dateCommenced: '2019-08-29',
    };
   
    const validateSpy = spyOn(component, 'validate');
   
     component.validate();

    // assert
    expect(component.application.activeForm.educationDetails.combined.dateCommenced).toBe(combined.dateCommenced);
    expect(component.application.activeForm.educationDetails.combined.dateAwarded).toBe(combined.dateAwarded);
    expect(component.application.activeForm.educationDetails.knowledge.dateCommenced).toBe(knowledge.dateCommenced);
    expect(component.application.activeForm.educationDetails.knowledge.dateAwarded).toBe(knowledge.dateAwarded);
    expect(component.application.activeForm.educationDetails.competency.dateCommenced).toBe(competency.dateCommenced);
    expect(component.application.activeForm.educationDetails.competency.dateAwarded).toBe(competency.dateAwarded);
    
    expect(validateSpy).toHaveBeenCalled();

  });

  });
 



