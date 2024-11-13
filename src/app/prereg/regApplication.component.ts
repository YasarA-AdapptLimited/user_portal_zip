import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { LogService } from '../core/service/log.service';
import { RegApplication } from './model/RegApplication';
import { User } from '../account/model/User';
import { PreregService } from '../core/service/prereg.service';
import { LayoutService } from '../core/service/layout.service';
import { CanComponentDeactivate } from '../guard/CanDeactivate.guard';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { RegApplicationStep } from './model/RegApplicationStep';
import { FormStepperService } from '../shared/formStepper/formStepper.service';
import { FormStepSummary } from '../shared/formStepper/FormStepSummary';
import { FormStepperComponent } from '../shared/formStepper/formStepper.component';
import { ApplicationStatus } from './model/ApplicationStatus';
import { mergeMap } from 'rxjs/operators';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reg-application',
  moduleId: module.id,
  templateUrl: './regApplication.component.html',
  styleUrls: ['./application-form.scss'],
  providers: [FormStepperService]
})
export class RegApplicationComponent implements OnInit,
  CanComponentDeactivate {

  user: User;
  loading = false;
  ready = false;
  saving = false;
  loadingError = false;
  application: RegApplication;
  maxStep: RegApplicationStep;
  minStep: RegApplicationStep;
  showGuidanceWarning = false;
  RegApplicationStep = RegApplicationStep;
  isApplicationOpen = true;
  applicationClosedMessage: string;
  useNewPaymentFlow: boolean;

  initialSteps;

  @ViewChild(FormStepperComponent) formStepper;

  constructor(private router: Router, private auth: AuthService,
    private log: LogService, private service: PreregService,
    public layout: LayoutService,
    private dialog: MatDialog,
    public formStepperService: FormStepperService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.load();
  }

  reopenApplication() {
    this.cancelCountersignature(1);
  }

  get ineligible() {
    return this.application.activeForm.formStatus === ApplicationStatus.Ineligible;
  }

  get terminated() {
    return this.application.activeForm.formStatus === ApplicationStatus.Terminated;
  }

  get refused() {
    return this.application.activeForm.formStatus === ApplicationStatus.Refused;
  }

  get allowResubmit() {
    return !this.application.activeForm.requirePayment;
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
    this.user = this.auth.user;
    this.useNewPaymentFlow = this.auth.user.useNewWorldpayFlow;
    this.loading = true;
    this.loadingError = false;
    this.service.getRegApplication(this.auth.user.registrationStatus).subscribe(application => {
      this.application = application;

      this.isApplicationOpen = this.application.registrationApplicationScheme.isOpened;

      if (!this.isApplicationOpen) {
        const startDate = this.datePipe.transform(this.application.registrationApplicationScheme.openingDate, 'd MMMM yyyy');
        this.applicationClosedMessage = `Your application for registration will be available towards the end or your foundation year on ${startDate}`;
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
        this.showGuidanceWarning = this.formStepper && this.formStepper.currentStep === RegApplicationStep.PersonalDetails;
        this.updateStepId();
      });
    }, error => {
      this.loading = false;
      this.loadingError = true;
    });
  }


  warnForDirty(): Observable<any> {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Unsaved changes`,
        message: `<p>Do you want to save your changes before exiting your application form?</p>`
      }
    });
    return dialogRef.afterClosed()
      .pipe(mergeMap(shouldSave => {
        if (shouldSave) {
          this.layout.setFullscreenSpinner(true);
          return observableFrom(this.save().then(() => {
            return true;
          }, error => {
            // show error messages
            this.layout.setFullscreenSpinner(false);
            return false;
          }));
        } else {
          return observableOf(true);
        }
      }));
  }

  canDeactivate() {
    if (!this.formStepper || !this.formStepper.currentStep || !this.formStepper.currentStep.dirty) { return true; }
    return this.warnForDirty();
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
      this.service.saveRegApplication(this.application).subscribe(() => {
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
    if (this.application.activeForm.formStatus === ApplicationStatus.CounterSigned) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: `Form is countersigned`,
          message: `<p>If you need to edit these details you will have to get the form countersigned again. </p>
          <p>Are you sure ?</p>
          `
        }
      });
      dialogRef.afterClosed().subscribe(cancelCountersignature => {
        if (cancelCountersignature) {
          this.cancelCountersignature(stepId);
        }
      });
    } else {
      this.formStepper.goToStep(stepId);
    }
  }


  goToStep(step: FormStepSummary) {
    if (step.disabled) { return; }
    this.formStepper.goToStep(step.stepId);
  }

  cancelCountersignature(stepId) {
    this.layout.setFullscreenSpinner(true, 'Reverting...');
    this.service.cancelCountersignature(this.application.activeForm.id).subscribe(() => {
      this.application.activeForm.formStatus = ApplicationStatus.InProgress;
      setTimeout(() => {
        if (this.formStepperService.summary) {
          this.formStepperService.summary.find(step => step.stepId === RegApplicationStep.Countersigning).validity.valid = false;
          this.formStepperService.setStepRange(1, RegApplicationStep.Countersigning);
        }
        this.formStepper.goToStep(stepId);
        this.layout.setFullscreenSpinner(false);
      });

    }, error => {
      this.layout.setFullscreenSpinner(false);
    });
  }

  stepChanged(stepId) {
    this.service.setStep(this.application.activeForm.id, stepId).subscribe();
    this.application.activeForm.step = stepId;
  }

  stepChange(): () => Promise<any> {
    return function () {
      return new Promise<void>((resolve, reject) => {

        if (this.formStepper.currentStep.dirty) {
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
