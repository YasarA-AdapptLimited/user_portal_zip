
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { LogService } from '../core/service/log.service';
import { PreregApplication } from '../shared/model/student/PreregApplication'
import { User } from '../account/model/User';
import { LayoutService } from '../core/service/layout.service';
import { CanComponentDeactivate } from '../guard/CanDeactivate.guard';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { PreregApplicationStep } from '../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../shared/formStepper/formStepper.service';
import { FormStepSummary } from '../shared/formStepper/FormStepSummary';
import { FormStepperComponent } from '../shared/formStepper/formStepper.component';
import { mergeMap } from 'rxjs/operators';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { StudentService } from '../core/service/student.service';
import { ApplicationStatus } from '../prereg/model/ApplicationStatus';
import { Placement } from '../shared/model/student/Placement';
import { DatePipe } from '@angular/common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-prereg-application',
  moduleId: module.id,
  templateUrl: './preregApplication.component.html',
  styleUrls: ['./preregApplication.scss', '../prereg/application-form.scss'],
  providers: [FormStepperService]
})
export class PreregApplicationComponent implements OnInit,
  CanComponentDeactivate {

  user: User;
  loading = false;
  ready = false;
  saving = false;
  loadingError = false;
  application: PreregApplication;
  maxStep: PreregApplicationStep;
  minStep: PreregApplicationStep;
  showGuidanceWarning = false;
  ApplicationStep = PreregApplicationStep;
  ignoreBackendSaveErrors = false;
  regDateLimit;
  applicationOpen = true;
  useNewPaymentFlow: boolean;

  @ViewChild(FormStepperComponent) formStepper;
  applicationClosedMessage: string;

  constructor(private router: Router, private auth: AuthService,
    private log: LogService, private service: StudentService,
    public layout: LayoutService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    public formStepperService: FormStepperService
  ) { }

  ngOnInit() {
    this.load();
  }

  reopenApplication() {
  }

  get ineligible() {
    return this.application.activeForm.formStatus === ApplicationStatus.Ineligible;
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

  isApplicationClosed(application) {
    this.applicationOpen = application.preRegistrationApplicationScheme.isOpened;
    // will return true is it is closed, false if its open
    return !this.applicationOpen;
  }

  load() {

    this.user = this.auth.user;
    this.useNewPaymentFlow = this.auth.user.useNewWorldpayFlow;
    this.loading = true;
    this.loadingError = false;
    this.service.getApplication(this.auth.user.registrationStatus).subscribe(application => {
      this.application = application;
      if (this.isApplicationClosed(this.application)) {
        const from = this.datePipe.transform(this.application.preRegistrationApplicationScheme.startDateForCurrentYear, 'd MMMM yyyy');
        const to = this.datePipe.transform(this.application.preRegistrationApplicationScheme.endDateForCurrentYear, 'd MMMM yyyy');
        this.applicationClosedMessage = `Applications open between ${from} and ${to}.`;
        this.loadComplete();
        return;
      }
      if (this.application.activeForm.step) {
        this.maxStep = this.application.activeForm.step;
      }
      if (this.application.activeForm.minStep) {
        this.minStep = this.application.activeForm.minStep;
      }

      this.initPlacements();

    }, error => {
      this.loading = false;
      this.loadingError = true;
    });
  }

  initPlacements() {
    if (this.application.activeForm.id) {
      this.getPlacements().subscribe(() => {
        this.loadComplete();
      }, error => {
        this.loading = false;
        this.loadingError = true;
      });
    } else {
      this.service.saveApplication(this.application, 1).subscribe(() => {
        this.getPlacements().subscribe(() => {
          this.loadComplete();
        }, error => {
          this.loading = false;
          this.loadingError = true;
        });
      }, error => {
        this.loading = false;
        this.loadingError = true;
      });
    }
  }

  getPlacements() {
    return this.service.getPlacements().pipe(tap(data => {
      data.placements.forEach(placement => {
        placement.trainingWindow.end.to = new Date(this.application.trainee.registrationDateLimit.split('T')[0]);
      });
      data.placements.sort((placement1, placement2) => {
        return new Date(placement1.startDate).getTime() - new Date(placement2.startDate).getTime();
      });
      this.application.activeForm.placements = data.placements;
      this.application.activeForm.trainingScheme = data.trainingScheme;
      const hasInvalidPlacement = data.placements
        .filter(placement => !!placement.tutors && !!placement.tutors.length && !!placement.tutors[0])
        .find(placement => !placement.isValid);
      if (hasInvalidPlacement) {
        this.application.activeForm.step = PreregApplicationStep.Training;
        this.maxStep = this.application.activeForm.step;
      }
    }));
  }

  loadComplete() {
    this.loading = false;
    this.ready = true;
    setTimeout(() => {
      this.showGuidanceWarning = this.formStepper && this.formStepper.currentStep === PreregApplicationStep.PersonalDetails;
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
      this.service.saveApplication(this.application, this.formStepper.currentStep.stepId).subscribe(() => {
        respond(() => {
          this.saving = false;
          resolve();
        });
      }, error => {
        respond(() => {
          this.saving = false;
          if (this.ignoreBackendSaveErrors) {
            resolve();
          } else {
            reject(error);
          }

        });
      });
    });
  }

  goToStepId(stepId) {
    this.formStepper.goToStep(stepId);
  }
  goToStep(step: FormStepSummary) {
    if (step.disabled) { return; }
    this.formStepper.goToStep(step.stepId);
  }


  stepChanged(stepId) {
    this.service.setStep(this.application.activeForm.id, this.formStepperService.getFurthestStep()).subscribe();
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

  savingDetails(val): void {
    this.saving = val;
  }
}
