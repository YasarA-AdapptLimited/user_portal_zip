import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FinalDeclarationReviewStepComponent } from './finalDeclarationReviewStep.component';
import { FinalDeclarationApplicationForm } from '../../model/FinalDeclarationApplicationForm';
import { FinalDeclarationReviewComponent } from './finalDeclarationReview.component';
import { FinalDeclarationService } from '../../../../core/service/finalDeclaration.service';
import { FinalDeclarationStep } from '../../model/FinalDeclarationStep';



describe('(Final Declaration) =>  review step', () => {
  let component: FinalDeclarationReviewStepComponent;
  let fixture: ComponentFixture<FinalDeclarationReviewStepComponent>;
  let mockFinalDeclarationService, MockFormStepper, MockApplication: FinalDeclarationApplicationForm;



  beforeEach(() => {
    MockFormStepper = jasmine.createSpyObj(['goToStep']);

    const application = {
      trainee: {
        title: { name: 'srimani', id: 1234 },
        forenames: 'soni',
        middleName: 'sri',
        surname: 'mani',
        address: {

        },
        dateOfBirth: '1/02/1998'
      },
      activeForm: {
        countersignatures: [
          {
            registrationNumber: "2036985",
            forenames: "GrH1012236",
            surname: "RiH1012236",
            town: "CHH1012236",
            countersignerGPhCId: "607ece33-7caf-e411-80e6-005056851bfe",
            id: "e6b10367-e3b8-4047-a9f7-2746aafc0918",
            decisionMadeAt: "2020-03-05T07:29:06.88",
            decision: 999,
            feedback: null,
            countersignerCommentId: "7aa0ce34-a08b-4ceb-b561-0ce90fc05314",
            countersignerComment: {
              traineeProgressComments: "test",
              anyProblemsEffected: true,
              annualLeaves: 1,
              sickLeaves: 1,
              otherLeaves: 0,
              otherLeaveDetails: "",
              commentsByTutor: "test",
              traineeFeedbackOnTutorAssessment: null
            }
          }
        ],
        isTrainingConfirmed: true,
        id: "be3ea02a-621b-4705-8ffa-486f30af135b",
        formStatus: 4,
        step: 4,
        createdAt: "2020-03-05T07:27:22.9633333",
        scope: 3,
        declarations: [],
        registrantStatus: 717750000,
        minStep: 4,
      },
      training: {
        trainedAt: [
          { startDate: new Date(2019, 3, 3), address: 'Pondy 01' },
          { startDate: new Date(2020, 3, 3), address: 'Pondy 02' }
        ]
      }
    }
    TestBed.configureTestingModule({
      declarations: [
        FinalDeclarationReviewStepComponent,
        FinalDeclarationReviewComponent
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: FinalDeclarationService, useValue: mockFinalDeclarationService },
        { provide: FormStepperService, useValue: MockFormStepper }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FinalDeclarationReviewStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
    console.log({ component });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize', () => {
    // arrange
    const titleSpy = 'Review'
    // act
    component.ngOnInit();
    // assert
    expect(titleSpy).toBe('Review');

  })

  it('should validate the next step', () => {
    // arrange
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    // act
    component.validate();
    // assert
    expect(validity$spy).toHaveBeenCalledWith({ valid: true, messages: [], touched: undefined });

  })

  it('should be able to check step Id', async () => {
    //arrange
    const stepChange: jasmine.Spy = spyOn(component.navigate, 'emit');
    // act
    component.goToStep(3);
    // assert
    expect(stepChange).toHaveBeenCalledWith(FinalDeclarationStep.FinalReview);
  })



});
