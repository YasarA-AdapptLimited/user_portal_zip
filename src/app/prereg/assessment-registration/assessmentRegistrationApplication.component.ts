import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { LogService } from '../../core/service/log.service';
import { User } from '../../account/model/User';
import { LayoutService } from '../../core/service/layout.service';
import { CanComponentDeactivate } from '../../guard/CanDeactivate.guard';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirmDialog.component';
import { AssessmentRegistrationStep } from './model/AssessmentRegistrationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { FormStepSummary } from '../../shared/formStepper/FormStepSummary';
import { FormStepperComponent } from '../../shared/formStepper/formStepper.component';
import { mergeMap } from 'rxjs/operators';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AssessmentRegistration } from './model/AssessmentRegistration';
import { AssessmentRegistrationService } from '../../core/service/assessmentRegistration.service';
import { AssessmentRegistrationApplicationForm } from './model/AssessmentRegistrationApplicationForm';
import { ApplicationStatus } from '../model/ApplicationStatus';

@Component({
  selector: 'app-assessment-registration-application',
  templateUrl: './assessmentRegistrationApplication.component.html',
  styleUrls: ['../application-form.scss'],
  providers: [FormStepperService]
})
export class AssessmentRegistrationComponent implements OnInit, CanComponentDeactivate {
  saving: boolean = false;
  isApplicationOpen = true;

  user: User;
  loading = false;
  ready = false;
  loadingError = false;
  application: AssessmentRegistration;
  maxStep: AssessmentRegistrationStep;
  minStep: AssessmentRegistrationStep;
  showGuidanceWarning = false;
  AssessmentRegistrationStep = AssessmentRegistrationStep;
  applicationClosedMessage: string;
  useNewPaymentFlow: boolean;

  @ViewChild(FormStepperComponent) formStepper;
  constructor(
    private router: Router,
    private auth: AuthService,
    private log: LogService,
    private service: AssessmentRegistrationService,
    public layout: LayoutService,
    private dialog: MatDialog,
    public formStepperService: FormStepperService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.load();
  }

  get ineligible() {
    return this.application.activeForm.formStatus === ApplicationStatus.Ineligible;
  }

  get allowResubmit() {
    return !this.application.activeForm.requirePayment;
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

  resubmitApplication() {
    this.layout.setFullscreenSpinner(true, 'Submitting...');
    this.service.reSubmitApplication(this.application.activeForm.id).subscribe(() => {
      this.router.navigate(['/home']);
      // invalidate cache
      delete this.service.application;
      this.layout.setFullscreenSpinner(false);
    }, error => {
      this.layout.setFullscreenSpinner(false);
    });
  }

  load() {
    var temp =new Date(); //CR-374 temp variable for date manupilation
    this.user = this.auth.user;
    this.useNewPaymentFlow = this.auth.user.useNewWorldpayFlow;
    this.loading = true;
    this.loadingError = false;
    this.service
      .getAssessmentRegistrationApplication(this.auth.user.registrationStatus)
      .subscribe(
        application => {
          this.application = application;
          /* CR - 374 : Display previous date on assessment registration application*/
          temp = new Date(this.application.assessmentRegistrationDeadlineDate);  
          temp.setDate(temp.getDate()-1);         
          this.application.assessmentRegistrationDeadlineDate = temp.toISOString();  
          /*CR - 374 changes end*/   
          this.isApplicationOpen = this.application.isOpen;

          if (!this.isApplicationOpen) {
            this.applicationClosedMessage = `Application you are trying to access is currently not available`;
            this.loading = false;
            return;
          }

          if (this.application.activeForm.step) {
            this.maxStep = this.application.activeForm.step;
          }
          if (this.application.activeForm.minStep) {
            this.minStep = this.application.activeForm.minStep;
          }

          this.loading = false;
          this.ready = true;
          setTimeout(() => {
            this.showGuidanceWarning = this.formStepper && this.formStepper.currentStep === AssessmentRegistrationStep.PersonalDetails;
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
      if (true) {
        respond(() => {
          this.saving = false;
          resolve();
        });
      }
      this.service.saveAssessmentRegistrationApplication(this.application)
        .subscribe(
          () => {
            respond(() => {
              this.saving = false;
              resolve();
            });
          },
          error => {
            respond(() => {
              this.saving = false;
              reject(error);
            });
          }
        );
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

  savingDetails(val): void {
    this.saving = val;
  }
}
