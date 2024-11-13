import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { TooltipModule } from './../../../../core/tooltip/tooltip.module';
import { FormsModule } from '@angular/forms';
import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { MatRadioModule } from '@angular/material/radio';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalDeclarationOverallConfirmationStepComponent } from './finalDeclarationOverallConfirmationStep.component';




describe('( Final Declaration ) => Confirm training ', () => {
  let component: FinalDeclarationOverallConfirmationStepComponent;
  let fixture: ComponentFixture<FinalDeclarationOverallConfirmationStepComponent>;
  let MockFormStepper;
  let setupApplicationProps;

  beforeEach(() => {
    MockFormStepper = {};

    TestBed.configureTestingModule({
      declarations: [
        FinalDeclarationOverallConfirmationStepComponent,
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
    fixture = TestBed.createComponent(FinalDeclarationOverallConfirmationStepComponent);
    component = fixture.componentInstance;

    /* helperFunctions */

    setupApplicationProps = (isoveralldeclarationsconfirmed: boolean) => {
      const application = {
        activeForm: {

          isoveralldeclarationsconfirmed: isoveralldeclarationsconfirmed,
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

      const application = setupApplicationProps(null);

      component = Object.assign(component, { application });
      // act
      component.validate();
      // assert
      expect(validity$Spy).toHaveBeenCalledWith({
        valid: undefined,
        messages: ['You must tick the box to continue'],
        touched: undefined
      });

    });

    it('has not confirmed training, should display error message', () => {
      const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');

      const application = setupApplicationProps(true);

      component = Object.assign(component, { application });
      // act
      fixture.detectChanges();
      component.validate();
      // assert
      expect(validity$Spy).toHaveBeenCalledWith({
        valid: undefined,
        messages: ['You must tick the box to continue'],
        touched: undefined
      });
    });

  });






});
