import { Component, OnInit, ViewChild, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormStepperComponent } from '../../shared/formStepper/formStepper.component';
import { User } from '../../account/model/User';
import { CanComponentDeactivate } from '../../guard/CanDeactivate.guard';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { AuthService } from '../../core/service/auth.service';
import { LogService } from '../../core/service/log.service';
import { LayoutService } from '../../core/service/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ReturnToRegisterApplication } from './model/ReturnToRegister';
import { ReturnToRegisterStep } from './model/ReturnToRegisterStep';
import { ConfirmDialogComponent } from '../../shared/confirmDialog.component';
import { FormStepSummary } from '../../shared/formStepper/FormStepSummary';
import { mergeMap } from 'rxjs/operators';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { ReturnToRegisterService } from '../../core/service/returnToRegister.service';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';

@Component({
  selector: 'app-return-to-register',
  moduleId: module.id,
  templateUrl: './return-to-register-application.component.html',
  styleUrls: ['../../prereg/application-form.scss'],
  providers: [FormStepperService]
})
export class ReturnToRegisterComponent implements OnInit,
  CanComponentDeactivate {

  user: User;
  loading = false;
  ready = false;
  saving = false;
  loadingError = false;
  application: ReturnToRegisterApplication;
  maxStep;
  minStep;
  isApplicationOpen = true;
  applicationClosedMessage: string;
  ReturnToRegisterStep = ReturnToRegisterStep;
  showGuidanceWarning = false;
  revalidationRecordOutstanding = false;
  allSteps: FormStepComponent[];
  allStepSummary: any;
  stepsWithoutRevalOutstanding;
  menuWithoutRevalOutstanding;
  displayRevalRecordOutstandingStep;
  initialSteps;
  onLoad = true;
  useNewPaymentFlow: boolean;

  @ViewChild(FormStepperComponent) formStepper;
  @ViewChildren(FormStepperComponent) formStepperComponents: QueryList<FormStepperComponent>;

  constructor(private router: Router, private auth: AuthService,
    private log: LogService,
    public layout: LayoutService,
    private dialog: MatDialog,
    public formStepperService: FormStepperService,
    private service: ReturnToRegisterService,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.formStepperComponents.changes.subscribe((comps: QueryList<FormStepperComponent>) => {
      this.formStepper = comps.first;
      this.cloneSteps();
      this.cloneSummary();
      this.displayRevalidationRecordOutstanding(this.revalidationRecordOutstanding);
    });
  }

  ngOnInit() {
    this.load();
  }

  canDeactivate() {
    if (
      !this.formStepper ||
      !this.formStepper.currentStep ||
      !this.formStepper.currentStep.dirty
    ) {
      return true;
    }
    return this.warnForDirty();
  }

  load() {
    this.user = this.auth.user;
    this.useNewPaymentFlow = this.auth.user.useNewWorldpayFlow;
    this.loading = true;
    this.loadingError = false;
    this.service
      .getApplication(this.auth.user.registrationStatus)
      .subscribe(
        application => {
          this.application = application;
          if (this.application.activeForm.step) {
            this.maxStep = this.application.activeForm.step;
          }
          if (this.application.activeForm.minStep) {
            this.minStep = this.application.activeForm.minStep;
          }

          this.revalidationRecordOutstanding = !!this.application.personalDetails.registration.isRequiredRevalidationSubmission;
          this.loading = false;
          this.ready = true;
          setTimeout(() => {
            this.showGuidanceWarning = this.formStepper && this.formStepper.currentStep === ReturnToRegisterStep.PersonalDetails;
          });
        },
        error => {
          this.loading = false;
          this.loadingError = true;
        }
      );
  }

  warnForDirty(): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Unsaved changes`,
        message: `<p>Do you want to save your changes before exiting your application form?</p>`
      }
    });
    return dialogRef.afterClosed().pipe(
      mergeMap(shouldSave => {
        if (shouldSave) {
          this.layout.setFullscreenSpinner(true);
          return observableFrom(
            this.save().then(
              () => {
                return true;
              },
              error => {
                // show error messages
                this.layout.setFullscreenSpinner(false);
                return false;
              }
            )
          );
        } else {
          return observableOf(true);
        }
      })
    );
  }

  save() {
    this.saving = true;

    this.application.activeForm.step = this.formStepperService.getFurthestStep();
    if (this.application.activeForm.isOverallDeclarationAcknowledged === null) {
      this.application.activeForm.isOverallDeclarationAcknowledged = false;
    }
    if (this.application.activeForm.formStatus === ApplicationStatus.NotStarted) {
      this.application.activeForm.formStatus = ApplicationStatus.InProgress;
    }

    if (this.application.activeForm.returnToRegisterDetail.confirmUserNameChange === null) {
      this.application.activeForm.returnToRegisterDetail.confirmUserNameChange = true;
    }

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
      this.service.saveApplication(this.application).subscribe(() => {
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

  goToStepId(stepId) {
    this.formStepper.goToStep(stepId);
  }

  goToStep(step: FormStepSummary) {
    if (step.disabled) {
      return;
    }
    this.formStepper.goToStep(step.stepId);
  }

  stepChanged(stepId) {
    setTimeout(() => {
      this.service.setStep(this.application.activeForm.id, stepId).subscribe();
      this.application.activeForm.step = stepId;
    }, 1000);
  }


  stepChange(): () => Promise<any> {
    return function () {
      return new Promise<void>((resolve, reject) => {
        if (
          this.formStepper.currentStep.dirty ||
          this.formStepper.currentStep.stepId
        ) {
          this.formStepper.serverErrors = [];
          return this.save().then(
            () => {
              resolve();
            },
            error => {
              this.formStepper.serverErrors = error.validationErrors;
              reject(error);
            }
          );
        } else {
          resolve();
        }
      });
    }.bind(this);
  }

  cloneSteps(): void {
    this.allSteps = this.formStepper?.steps.slice();
  }

  cloneSummary(): void {
    this.allStepSummary = this.formStepperService.summary?.slice();
  }

  displayRevalidationRecordOutstanding(display: boolean): void {
    if (this.onLoad) {
      this.cloneSteps();
      this.cloneSummary();
      this.onLoad = false;
    }

    if (this.formStepper) {
      if (this.allSteps && !this.stepsWithoutRevalOutstanding && !this.menuWithoutRevalOutstanding) {
        this.stepsWithoutRevalOutstanding = this.formStepper.steps.filter(step => !step.title.includes('RevalidationRecordOutstanding'));
        this.menuWithoutRevalOutstanding = this.formStepperService.summary.filter(step => !step.title.includes('RevalidationRecordOutstanding'));
      }
      this.displayRevalRecordOutstandingStep = display;

      if (this.displayRevalRecordOutstandingStep) {
        this.formStepper.steps = this.allSteps;
        this.formStepperService.summary = this.allStepSummary;
      } else {
        this.formStepper.steps = this.stepsWithoutRevalOutstanding;
        this.formStepperService.summary = this.menuWithoutRevalOutstanding;
      }
      this.updateStepId();
      this.cd.detectChanges();
    }
  }

  updateStepId(): void {
    if (this.formStepper) {
      if (this.formStepperService.updateStepsId(this.initialSteps, this.formStepper.steps)) {
        this.initialSteps = this.formStepper.steps;
        if(this.displayRevalRecordOutstandingStep === true) {
          this.formStepper.currentStep = this.formStepper.steps.find(s => s.stepId === this.maxStep);
          this.formStepperService.setCurrentStep(this.maxStep);
          this.formStepper.currentStep.load();
        }        
      }
    }
  }

  savingDetails(val): void {
    this.saving = val;
  }
}
