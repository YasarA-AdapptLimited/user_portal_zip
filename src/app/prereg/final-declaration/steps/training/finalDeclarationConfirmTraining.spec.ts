import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { TooltipModule } from './../../../../core/tooltip/tooltip.module';
import { FormsModule } from '@angular/forms';
import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { MatRadioModule } from '@angular/material/radio';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalDeclarationConfirmTrainingStepComponent } from './finalDeclarationConfirmTrainingStep.component';
import { FinalDeclarationTraineePlacementComponent } from './finalDeclarationTraineePlacement.component';



describe('( Final Declaration ) => Confirm training ', () => {
  let component: FinalDeclarationConfirmTrainingStepComponent;
  let fixture: ComponentFixture<FinalDeclarationConfirmTrainingStepComponent>;
  let MockFormStepper;
  let setupApplicationProps;

  beforeEach(() => {
    MockFormStepper = {};

    TestBed.configureTestingModule({
      declarations: [
        FinalDeclarationConfirmTrainingStepComponent,
        FinalDeclarationTraineePlacementComponent,
        CollapsibleComponent,
        GphcIconComponent,
        UtcDatePipe
      ],
      imports: [
        MatRadioModule,
        FormsModule,
        TooltipModule
      ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepper }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FinalDeclarationConfirmTrainingStepComponent);
    component = fixture.componentInstance;

    /* helperFunctions */

    setupApplicationProps = (isJointTutor: boolean, isTraining: boolean) => {
      const application = {
        activeForm: {
          isJointTutoringArrangmentExists: isJointTutor,
          isTrainingConfirmed: isTraining
        }
      };
      return application;
    };
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('If user', () => {
    it('has nothing filled and tries to proceed, should display error messages', () => {
      // arrange 
      const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');

      const application = setupApplicationProps(null, null);

      component = Object.assign(component, { application });
      // act 
      component.validate();
      // assert
      expect(validity$Spy).toHaveBeenCalledWith({
        valid: false, messages: ['You must complete this step to continue'], touched: undefined
      });

    });

    it('has not confirmed training, should display error message', () => {
      const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');

      const application = setupApplicationProps(true, false);

      component = Object.assign(component, { application });
      // act 
      fixture.detectChanges();
      component.validate();
      // assert
      expect(validity$Spy).toHaveBeenCalledWith({
        valid: false, messages: ['You must complete this step to continue'], touched: undefined
      });
    });

    it('has confirmed training and joint tutor', () => {
      const application = setupApplicationProps(true, true);
      const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');
      component = Object.assign(component, { application });
      // act
      fixture.detectChanges();
      component.validate();
      // assert
      expect(validity$Spy).toHaveBeenCalledWith({
        valid: true,
        messages: [],
        touched: undefined
      });
    });

    it('has confirmed training and no joint tutor', () => {
      const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');

      const application = setupApplicationProps(false, true);

      component = Object.assign(component, { application });
      // act 
      fixture.detectChanges();
      component.validate();
      // assert
      expect(validity$Spy).toHaveBeenCalledWith({
        valid: true,
        messages: [],
        touched: undefined
      });
    });
  });






});
