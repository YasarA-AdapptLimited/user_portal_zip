import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from './../../../../core/tooltip/tooltip.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { ApplicantComponent } from './../../../../account/applicant.component';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactEditComponent } from '../../../../account/contactEdit.component';
import { AddressComponent } from '../../../../account/address.component';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';
import { FinalDeclarationFtpStepComponent } from './finalDeclarationFtpStep.component';
import { FinalDeclarationService } from '../../../../core/service/finalDeclaration.service';
import { of } from 'rxjs';



describe('( FTP Declaration ) => Declaration ', () => {
  let component: FinalDeclarationFtpStepComponent;
  let fixture: ComponentFixture<FinalDeclarationFtpStepComponent>;
  let MockFormStepperService;
  let MockFinalDeclarationService = jasmine.createSpyObj('FinalDeclarationService', ['getDeclarationFormTemplates']);

  const application = {
    trainee: null,
    activeAssessment: null,
    activeForm: {
      attachments: null,
      declarations: [
        { dynamicFormId: '1', answers: [
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
    MockFormStepperService = {};
    TestBed.configureTestingModule({
      declarations: [
        FinalDeclarationFtpStepComponent,
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
          provide: FinalDeclarationService, useValue: MockFinalDeclarationService
        }
      ]

    }).compileComponents();
    fixture = TestBed.createComponent(FinalDeclarationFtpStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should return error messages when none of the declarations are confirmed', () => {
    component.validate();
    expect(component.validity$.value.messages.length).toBe(1);
  });

  it('on component init title, stepId and declarationHeading is defined', () => {
    component.formIndex = 0;
    component.ngOnInit();
    expect(component.stepId).toBeDefined();
    expect(component.declarationHeading).toBeDefined();
  });

  it('on call of load method, step status is updated', () => {
    // @ts-ignore
    const loadAnswersSpy: jasmine.Spy = spyOn(component.validator, 'loadAnswers');

    const ready$Spy: jasmine.Spy= spyOn(component.ready$,'next');
    component.formIndex = 0;
    MockFinalDeclarationService.getDeclarationFormTemplates.and.returnValue(of([{
      dynamicFormId: '1',
      formTitle: 'title',
      formBody: 'test',
      questionGroups: [],
    }]));
    component.load();
    expect(ready$Spy).toHaveBeenCalledOnceWith(true);
  });
});
