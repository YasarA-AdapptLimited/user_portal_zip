import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { LayoutService } from "../../../../core/service/layout.service";
import { FinalDeclarationService } from "../../../../core/service/finalDeclaration.service";
import { FormStepperService } from "../../../../shared/formStepper/formStepper.service";
import { FinalDeclarationApplicationForm } from "../../model/FinalDeclarationApplicationForm";
import { FinalDeclarationSubmitStepComponent } from "./finalDeclarationSubmitStep.component";
import { of } from "rxjs";
import { ApplicationStatus } from "../../../../prereg/model/ApplicationStatus";

describe('(Final Declaration) =>  submit step', () => {
    let component: FinalDeclarationSubmitStepComponent;
    let fixture: ComponentFixture<FinalDeclarationSubmitStepComponent>;
    let mockFinalDeclarationService, MockFormStepper, MockApplication: FinalDeclarationApplicationForm;



    beforeEach(() => {
      MockFormStepper = jasmine.createSpyObj(['goToStep']);

      const application = {
        trainee: {
          title: { name: 'srimani', id: 1234 },
          forenames: 'soni',
          middleName: 'sri',
          surname: 'mani',
          middle:'test',
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
          FinalDeclarationSubmitStepComponent,
        ],
        imports: [
          FormsModule
        ],
        providers: [
          { provide: FinalDeclarationService, useValue: mockFinalDeclarationService },
          { provide: FormStepperService, useValue: MockFormStepper }
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(FinalDeclarationSubmitStepComponent);
      component = fixture.componentInstance;
      component = Object.assign(component, { application });
      console.log({ component });
    });


    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('on Init countersigner is defined', () => {
      component.ngOnInit();
      expect(component.countersigner).toBeDefined();
    });

    it('Activeform formStatus is updated to submitted,on call of beforeNext', () =>{
      mockFinalDeclarationService.submitFinalDeclarationForm.and.returnValue(of(''));
      component.ngOnInit();
      component.beforeNext();
      expect(component.application.activeForm.formStatus).toBe(ApplicationStatus.Submitted);
    });

    it('on call of validate,  if any error messages are set', () => {
      component.validate();
      expect(component.validity$.value.messages.length).toBe(0);
    });
});
