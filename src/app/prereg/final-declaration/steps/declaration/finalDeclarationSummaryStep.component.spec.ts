import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalDeclarationSummaryComponent } from './finalDeclarationSummaryStep.component';
import { FinalDeclarationService } from '../../../../core/service/finalDeclaration.service';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';
import { of } from 'rxjs';

describe('( Final Declaration ) => summary step', () => {
  let component: FinalDeclarationSummaryComponent;
  let fixture: ComponentFixture<FinalDeclarationSummaryComponent>;
  let MockFinalDeclarationService = jasmine.createSpyObj('FinalDeclarationService', ['getDeclarationFormTemplates']);
  let MockFormStepper;

  const application = {
    trainee: null,
    activeAssessment: null,
    activeForm: {
      attachments: null,
      declarations: [
        { dynamicFormId: 'id-1', answers: [
          {
          questionId: 'question-one',
          answer: 'answer'
          }
        ]
        }
      ],
      formStatus: null,
      id: null,
      isOverallDeclarationConfirmed: true,
      minStep: null,
      mode: null,
      get readonly() {
        return true;
      },
      step: null,
      registrantStatus: null,
      requirePayment: null,
      trainee: null,
      scope: null
    },
    attachments: null,
    forms: [{
      attachments: null,
      declarations: null,
      formStatus: null,
      id: null,
      isOverallDeclarationConfirmed: true,
      minStep: null,
      mode: null,
      get readonly() {
        return true;
      },
      step: null,
      registrantStatus: null,
      requirePayment: null,
      trainee: null,
      scope: null
    }],
    pastApplications: null,
    registrationFees: { applicationFee: 250, registrationFee: 250 },
    status: ApplicationStatus.InProgress,
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FinalDeclarationSummaryComponent,
        UtcDatePipe
      ],
      providers: [
        { provide: FinalDeclarationService, useValue: MockFinalDeclarationService },
        { provide: FormStepperService, useValue: MockFormStepper }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FinalDeclarationSummaryComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on component load, form is set', () => {
    // @ts-ignore
    const loadAnswersSpy: jasmine.Spy = spyOn(component.validator, 'loadAnswers');

    component.formIndex = 0;
    MockFinalDeclarationService.getDeclarationFormTemplates.and.returnValue(of([{
      dynamicFormId: 'id',
      formTitle: 'title',
      formBody: 'test',
      questionGroups: [],
    }]));

    component.ngOnInit();
  });

});
