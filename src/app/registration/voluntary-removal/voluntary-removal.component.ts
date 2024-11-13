import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormStepSummary } from '../../shared/formStepper/FormStepSummary';
import { LayoutService } from '../../core/service/layout.service';
import { FormStepperComponent } from '../../shared/formStepper/formStepper.component';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { User } from '../../account/model/User';
import { AuthService } from '../../core/service/auth.service';
import { VoluntaryRemovalService } from '../../core/service/voluntaryRemoval.service';
import { VoluntaryRemovalApplication } from './model/VoluntaryRemovalApplication';
import { ApplicationStatus } from '../../technician/model/ApplicationStatus';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { VoluntaryRemovalDetails } from './model/VoluntaryRemovalDetails';
import { VoluntaryRemovalApplicationStep } from './model/VoluntaryRemovalApplicationStep';

@Component({
  selector: 'app-voluntary-removal',
  templateUrl: './voluntary-removal.component.html',
  styleUrls: ['../../prereg/application-form.scss'],
  providers: [FormStepperService]
})
export class VoluntaryRemovalComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormStepperComponent) formStepperComponents: QueryList<FormStepperComponent>;
  formStepper: FormStepperComponent;
  loading = false;
  loadingError = false;
  application: VoluntaryRemovalApplication;
  isApplicationOpen = true;
  ready = true;
  saving = false;
  initialSteps;
  user: User;
  maxStep;
  minStep;
  superIntendentDetails;
  stepTitle;
  expiryDate: string;
  voluntaryRemovalDetails: VoluntaryRemovalDetails;  

  allSteps: FormStepComponent[];
  allStepSummary: any;
  stepsWithoutPayment;
  menuWithoutPayment;
  displayPaymentStep = true;
  useNewPaymentFlow: boolean;

  constructor(private auth: AuthService,
    public formStepperService: FormStepperService,
    public layout: LayoutService,
    private vrService: VoluntaryRemovalService,
    private cd: ChangeDetectorRef) { }

    get submitted() {
      return (this.application && (this.application.activeForm.formStatus === ApplicationStatus.Submitted ||
        this.application.activeForm.formStatus === ApplicationStatus.Approved));
    }

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.formStepperComponents.changes.subscribe((comps: QueryList <FormStepperComponent>) => {
      this.formStepper = comps.first;
      this.cloneSteps();
      this.cloneSummary();      
      this.showHidePaymentStep(this.vrService.isOutstandingPaymentZero(this.expiryDate, this.voluntaryRemovalDetails.dateOfRegistryRemoval, this.application.pendingFee));
    });     
  }

  load() {
    this.user = this.auth.user;
    this.useNewPaymentFlow = this.auth.user.useNewWorldpayFlow;
    this.expiryDate = this.auth.user.registrant.expiryDate;
    this.superIntendentDetails = this.user?.registrant ? (this.user.registrant.superIntendentPosition ? this.user.registrant.superIntendentPosition : null ) : null;
    this.loading = true;
    this.loadingError = false;
    this.vrService.getApplication(this.auth.user.registrationStatus).subscribe( application => {
      this.application = application;
      this.voluntaryRemovalDetails = this.application.activeForm.voluntaryRemovalDetails;
      const outstandingFee = this.application.pendingFee;

      if(this.vrService.isOutstandingPaymentZero(this.expiryDate, this.voluntaryRemovalDetails.dateOfRegistryRemoval, this.application.pendingFee)) {
        if(this.application.activeForm.step === 6) {
          this.application.activeForm.step = 5
        }
      }

      if (this.application.activeForm.step) {
        this.maxStep = this.application.activeForm.step;
      }
      if (this.application.activeForm.minStep) {
        this.minStep = this.application.activeForm.minStep;
      }

      this.stepTitle = 'Removal details';

      this.loading = false;
      this.ready = true;
    }, error => {
      this.loading = false;
      this.loadingError = true;
    });
  }

  cloneSteps(): void {
    this.allSteps = this.formStepper?.steps.slice();
  }

  cloneSummary(): void {
    this.allStepSummary = this.formStepperService?.summary.slice();
  }

  showHidePaymentStep(isPendingFeeZero) {

    if(this.formStepper) {
      if(!this.stepsWithoutPayment && !this.menuWithoutPayment) {
        this.stepsWithoutPayment = this.formStepper.steps.filter(step => !step.title.includes('Payment'));
        this.menuWithoutPayment = this.formStepperService.summary.filter(step => !step.title.includes('Payment'));
      }
      this.displayPaymentStep = !isPendingFeeZero;

      if (this.displayPaymentStep) {
          this.formStepper.steps = this.allSteps;
          this.formStepperService.summary = this.allStepSummary;
      } else {
          this.formStepper.steps = this.stepsWithoutPayment;
          this.formStepperService.summary = this.menuWithoutPayment;
      }
      this.updateStepId();      
      this.cd.detectChanges();
    }
  }

  goToStep(step: FormStepSummary) {
    if (step.disabled) { return; }
    this.formStepper.goToStep(step.stepId);
  }

  stepChanged(stepId) {
    setTimeout(() => {
      this.vrService.setStep(this.application.activeForm.id, this.formStepperService.getFurthestStep()).subscribe();
      this.application.activeForm.step = stepId;
    }, 1000);
  }

  stepChange(): () => Promise<any> {
    return function () {
      return new Promise<void>((resolve, reject) => {
        if (this.formStepper.currentStep.dirty || this.formStepper.currentStep.stepId) {
          if (this.application.activeForm.step === VoluntaryRemovalApplicationStep.FtPDeclarations) {
            this.formStepper.currentStep.load();
          }
          this.formStepper.serverErrors = [];
          return this.save().then(() => {
           
            resolve();
          }, error => {
            this.formStepper.serverErrors = error.validationErrors;
            reject(error);
          });
        } else {
          resolve();
        }
      });
    }.bind(this);
  }

  goToStepId(stepId) {
    this.formStepper.goToStep(stepId);
  }

  save() {
    this.saving = true;

    this.application.activeForm.step = this.formStepperService.getFurthestStep();

    
    this.formStepper.currentStep.populateForm();
    return new Promise<void>((resolve, reject) => {
      const start = performance.now();
      const minExecution = 300;
      function respond(cb) {
        const end = performance.now();
        const duration = end - start;
        if (duration < minExecution) {
          setTimeout(() => {
            cb();
          }, Math.round(minExecution - duration));
        } else {
          cb();
        }
      }
      this.vrService.saveVRApplication(this.application).subscribe(() => {
        respond(() => {
          this.saving = false;
          resolve();
        });
      }, error => {
        respond(() => {
          this.saving = false;
          reject(error);
        });
      });
    });
  }

  updateStepId(): void {
    if(this.formStepper) {
          if(this.formStepperService.updateStepsId(this.initialSteps, this.formStepper.steps)) {
            this.initialSteps = this.formStepper.steps;
          }
    }
  }

  savingDetails(val): void {
    this.saving = val;
  }
}
