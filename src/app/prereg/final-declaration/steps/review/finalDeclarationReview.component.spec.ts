import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FinalDeclarationReviewComponent } from './finalDeclarationReview.component';
import { FinalDeclarationApplicationForm } from '../../model/FinalDeclarationApplicationForm';
import { FinalDeclarationService } from '../../../../core/service/finalDeclaration.service';
import { FinalDeclarationStep } from '../../model/FinalDeclarationStep';
import { RegistrantStatus } from '../../../../registration/model/RegistrantStatus';
import { CountersignatureOutcome } from '../../../../prereg/model/CountersignatureOutcome';


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
          countersignerGPhCId: "607e",
          id: "e6b10",
          decisionMadeAt: "2020-03-05T07:29:06.88",
          decision: 999,
          feedback: null,
          learningContractResponse: {},
          eligibleAsTutor: {},
          countersignerCommentId: "7aa0c",
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
      id: "be3ea",
      formStatus: 4,
      step: 4,
      createdAt: "2020-03-05T07:27:22.9633333",
      isOverallDeclarationConfirmed: false,
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
    },
    countersignatures: [
        {
          forenames: "GrH1012236",
          registrationNumber: "2036985",
          surname: "RiH1012236",
          town: "CHH1012236",
          countersignerGPhCId: "607ece33",
          decisionMadeAt: "2020-03-05T07:29:06.88",
          id: "e6b10367",

          feedback: null,
          countersignerCommentId: "7aa0ce34",
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
  }

describe('(Final Declaration) =>  review', () => {
  let component: FinalDeclarationReviewComponent;
  let fixture: ComponentFixture<FinalDeclarationReviewComponent>;
  let mockFinalDeclarationService, MockFormStepper, MockApplication: FinalDeclarationApplicationForm;

  beforeEach(() => {
    MockFormStepper = jasmine.createSpyObj(['goToStep']);

    TestBed.configureTestingModule({
      declarations: [
        FinalDeclarationReviewComponent,
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: FinalDeclarationService, useValue: mockFinalDeclarationService },
        { provide: FormStepperService, useValue: MockFormStepper }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FinalDeclarationReviewComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should correctly get and set review details', () => {
    beforeEach(() => {
      component.ngOnInit();
    })
    it('Trainee to be defined', () => {
      expect(component.trainee).toBeDefined(component.application.trainee);
    })
    it('TutorDetails to be defined', () => {
      expect(component.trainee).toBeDefined(component.application.tutorDetails);
    })
    it('should correctly format address', () => {
      // arragne
      const formartAddressSpy: jasmine.Spy = spyOn(component, 'formatAddress');

      component.ngOnInit();
      // assert
      expect(formartAddressSpy).toHaveBeenCalled();
    })
    it('Expecting Map Comments to be called', () => {
      // arrange
      const mapCommentsSpy: jasmine.Spy = spyOn(component, 'mapComments');
      component.ngOnInit();
      // assert
      expect(mapCommentsSpy).toHaveBeenCalledWith(component.application.activeForm);
    })
    it('Countersignatures to be defined', () => {
      expect(component.countersigner).toEqual(component.application.activeForm.countersignatures[0]);
    })
  });


  describe('should correctly map countersigner comments ', () => {

    it('should map progress report application', async () => {

      const countersigner = MockApplication;
      component.application.countersignatures[0].decision = CountersignatureOutcome.Approved;
      // act
      component.mapComments(countersigner)
      // assert
      expect(countersigner).toHaveBeenCalled();
    })

    it('should correctly map comments', async () => {
      const countersigner = MockApplication;
      const countersignerComment = [
        {
          traineeProgressComments: 'test comments',
          anyProblemsEffected: 1,
          problemDetails: 'no problem details',
          annualLeaves: 2,
          sickLeaves: 1,
          otherLeaves: 1,
          otherLeaveDetails: 'other leaves',
          commentsByTutor: 'no comments from tutor',
          traineeFeedbackOnTutorAssessment: 'good work'
        }
      ]
component.application.activeForm.countersignatures[0] = Object.assign(component.application.activeForm.countersignatures[0],
  { countersignerComment });
      // act
      component.mapComments(countersigner);
      // assert
      expect(component.comments).toBe(component.application.activeForm.countersignatures[0].countersignerComment);
    });
  });

  it('should be able to check step Id', async () => {
    //arrange
    const stepChange: jasmine.Spy = spyOn(component.navigate, 'emit');
    // act
    component.goToStep(3);
    // assert
    expect(stepChange).toHaveBeenCalledWith(FinalDeclarationStep.FinalReview);
  });

  it('should be able to check step Id', async () => {
    const stepChange: jasmine.Spy = spyOn(component.navigate, 'emit');
    component.goToStep(4);
    expect(stepChange).toHaveBeenCalledWith(FinalDeclarationStep.FinalReview);
  });

  it('should be able to check the validate', async () => {
    expect(component).toBeTruthy();
  });

});
