import { FormsModule } from '@angular/forms';
import { AssessmentReportService } from './../../../../core/service/assessmentReport.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentReportReviewComponent } from './assessmentReportReview.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';
import { AssessmentReportApplicationForm } from '../../models/AssessmentReportApplicationForm';



describe('(Assessment report) =>  review', () => {
  let component: AssessmentReportReviewComponent;
  let fixture: ComponentFixture<AssessmentReportReviewComponent>;
  let mockAssessmentReportService, MockFormStepper, MockApplication: AssessmentReportApplicationForm;

  let application;
  let counterSignatureDetails = {
      registrationNumber: "123456",
      forenames: "GrH1012236",
      surname: "RiH1012236",
      town: "CHH1012236",
      countersignerGPhCId: "a1234",
      id: "e123",
      decisionMadeAt: "2020-03-05T07:29:06.88",
      decision: 999,
      feedback: null,
      isCertifiedPhoto: true,
      countersignerCommentId: "7aa0",
      countersignerComment: {
        traineeProgressComments: "test",
        anyProblemsEffected: true,
        problemDetails: "",
        annualLeaves: 1,
        sickLeaves: 1,
        otherLeaves: 0,
        otherLeaveDetails: "",
        commentsByTutor: "test",
        traineeFeedbackOnTutorAssessment: null
      }
    }

  beforeEach(() => {
    MockFormStepper = jasmine.createSpyObj(['goToStep']);

    application = {
      trainee: {
        title: { name: 'abc', id: 1234 },
        forenames: 'def',
        middleName: 'xxx',
        surname: 'xyz',
        address: {

        },
        dateOfBirth: '1/02/1998'
      },
      countersignatures: [ counterSignatureDetails ],
      activeForm: {
        countersignatures: [counterSignatureDetails],
        isTrainingConfirmed: true,
        isJointTutoringArrangmentExists: false,
        id: "be3ea02a-621b-4705-8ffa-486f30af135b",
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
      }
    }
    TestBed.configureTestingModule({
      declarations: [
        AssessmentReportReviewComponent,
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: AssessmentReportService, useValue: mockAssessmentReportService },
        { provide: FormStepperService, useValue: MockFormStepper }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AssessmentReportReviewComponent);
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

  it('should be able to check step Id', async () => {
    //arrange
    const stepChange: jasmine.Spy = spyOn(component.navigate, 'emit');
    // act
    component.goToStep(3);
    // assert
    expect(stepChange).toHaveBeenCalledWith(AssessmentReportStep.FinalReview);
  })

});
