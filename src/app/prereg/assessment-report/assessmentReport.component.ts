import { FormStepperComponent } from './../../shared/formStepper/formStepper.component';
import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { CanComponentDeactivate } from '../../guard/CanDeactivate.guard';
import { User } from '../../account/model/User';
import { AssessmentReportStep } from './models/AssessmentReportStep';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { LogService } from '../../core/service/log.service';
import { AssessmentReportService } from '../../core/service/assessmentReport.service';
import { LayoutService } from '../../core/service/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ApplicationStatus } from '../model/ApplicationStatus';
import { Observable, from, of } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/confirmDialog.component';
import { mergeMap } from 'rxjs/operators';
import { FormStepSummary } from '../../shared/formStepper/FormStepSummary';
import { CountersignatureOutcome } from '../model/CountersignatureOutcome';
import { AssessmentReport } from './models/AssessmentReport';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';

@Component({
  selector: 'app-assessment-report-application',
  moduleId: module.id,
  templateUrl: './assessmentReport.component.html',
  styleUrls: ['../application-form.scss'],
  providers: [FormStepperService]
})
export class AssessmentReportComponent implements OnInit,
  CanComponentDeactivate, AfterViewInit {

  user: User;
  loading = false;
  ready = false;
  saving = false;
  loadingError = false;
  application: AssessmentReport;
  maxStep: AssessmentReportStep;
  minStep: AssessmentReportStep;
  showGuidanceWarning = false;
  AssessmentReportStep = AssessmentReportStep;
  isApplicationOpen = true;
  applicationClosedMessage: string;
  hasRegistration;
  start;
  minExecution;

  @ViewChildren(FormStepperComponent) formStepperComponents: QueryList<FormStepperComponent>;
  formStepper: FormStepperComponent;
  allSteps: FormStepComponent[];
  hasRegistered: boolean;
  allStepSummary: any;

  initialSteps;

  constructor(private router: Router, private auth: AuthService,
    private log: LogService, private service: AssessmentReportService,
    public layout: LayoutService,
    private dialog: MatDialog,
    public formStepperService: FormStepperService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    // this.allSteps = this.formStepper.steps;
    this.formStepperComponents.changes.subscribe((comps: QueryList <FormStepperComponent>) =>
        {
            this.formStepper = comps.first;
            this.updateStepId();
        });
  }

  reopenApplication() {
    this.cancelCountersignature(1);
  }

  print() {
    return (<any>window).print();
  }

  get isSubmitted() {
    return (this.application && this.application.activeForm.formStatus) === ApplicationStatus.Submitted;
  }

  get ineligible() {
    return this.application.activeForm.formStatus === ApplicationStatus.Ineligible;
  }

  get allowResubmit() {
    return !this.application.activeForm.requirePayment;
  }
  get isAssessmentCountersigned() {
    return this.application.activeForm.formStatus === ApplicationStatus.CounterSigned;
  }

  get hasBeenApproved() {
    return this.application.activeForm.countersignatures[0].decision === CountersignatureOutcome.Approved;
  }

  get hasCountersignRejected() {
    return this.application.activeForm.formStatus === ApplicationStatus.CounterSigned &&
      this.application.activeForm.countersignatures[0].decision === CountersignatureOutcome.Rejected;
  }
  get isProvisionalApplication() {
    return (this.application && this.application.activeForm.step) === AssessmentReportStep.FtpDeclaration1 ||
      (this.application && this.application.activeForm.step) === AssessmentReportStep.FtpDeclaration2 ||
      (this.application && this.application.activeForm.step) === AssessmentReportStep.OverallDeclaration;
  }

  get isFinalReport() {
    return (this.application && this.application.activeForm.step) === AssessmentReportStep.Submit;
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
    this.loading = true;
    this.loadingError = false;
    this.service.getAssessmentReportApplication(this.auth.user.registrationStatus).subscribe(application => {
      this.application = application;
      console.log({ application })

      this.isApplicationOpen = this.application.isOpen;

      if (!this.isApplicationOpen) {
        this.applicationClosedMessage = `Your 39 week progress report will soon be available here for sign-off. Please come back once you have completed the 36th week of your training.`;
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
      // setTimeout(() => {
      //   this.showGuidanceWarning = this.formStepper && this.formStepper.currentStep === AssessmentReportStep.TrainingConfirmation;
      // });
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
          return from(this.save().then(() => {
            return true;
          }, error => {
            // show error messages
            this.layout.setFullscreenSpinner(false);
            return false;
          }));
        } else {
          return of(true);
        }
      }));
  }

  canDeactivate() {
    if (!this.formStepper || !this.formStepper.currentStep || !this.formStepper.currentStep.dirty) { return true; }
    return this.warnForDirty();
  }

  public respond(): any {
    const respondObservable = new Observable(observer => {
      const end = performance.now();
      const duration = end - this.start;
      if (duration < this.minExecution) {
        setTimeout(() => {
          observer.next();
        }, Math.round(this.minExecution - duration));
      } else {
        observer.next();
      }
    });
    return respondObservable;
  }
  getReport(resolve, reject) {
    this.service.getAssessmentReportApplication(this.auth.user.registrationStatus).subscribe(() => {
      this.respond().subscribe(() => {
        this.saving = false;
        resolve();
      });
    }, error => {
      this.respond().subscribe(() => {
        this.saving = false;
        reject(error);
      });
    });
  }

  saveReport(resolve, reject) {
    this.service.saveAssessmentReportApplication(this.application).subscribe(() => {
      this.respond().subscribe(() => {
        this.saving = false;
        resolve();
      });
    }, error => {
      this.respond().subscribe(() => {
        this.saving = false;
        reject(error);
      });
    });
  }
  save() {
    this.saving = true;
    this.application.activeForm.step = this.formStepperService.getFurthestStep();
    this.formStepper.currentStep.populateForm();
    return new Promise((resolve, reject) => {
      this.start = performance.now();
      this.minExecution = 300;
      const training = this.application.activeForm.step = AssessmentReportStep.TrainingConfirmation;
      //const supportDocs = this.application.activeForm.step = AssessmentReportStep.SupportingDocuments;
      if (training) {
        this.saveReport(resolve, reject);
      }
      const countersigned = this.application.activeForm.formStatus === ApplicationStatus.CounterSigned;
      const ReadyForCountersigning = this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
      if (countersigned || ReadyForCountersigning) {
        this.getReport(resolve, reject);
      }
      // const tempRegistration = this.application.activeForm.step = AssessmentReportStep.TemporaryRegistration;
      // if (countersigned && tempRegistration) {
      //   this.saveReport(resolve, reject);
      // }
      const finalReview = this.application.activeForm.step = AssessmentReportStep.FinalReview;
      if (!finalReview) {
        this.saveReport(resolve, reject);
      }
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
          this.formStepperService.summary.find(step => step.stepId === AssessmentReportStep.Countersigning).validity.valid = false;
          this.formStepperService.setStepRange(1, AssessmentReportStep.Countersigning);
        }
        this.formStepper.goToStep(stepId);
        this.layout.setFullscreenSpinner(false);
      });

    }, error => {
      this.layout.setFullscreenSpinner(false);
    });
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
        if (this.formStepper.currentStep.dirty || this.formStepper.currentStep.stepId) {

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

  // changedTempRegistration(hasRegistered: boolean): void {
  //   if (this.formStepper.steps.length === 9) {
  //     this.cloneSteps();
  //     this.cloneSummary();
  //   }

  //   const stepsWithoutDecl = this.formStepper.steps.filter(step => !step.title.includes('Declaration'));
  //   const menuWihoutDecl = this.formStepperService.summary.filter(step => !step.title.includes('Declaration'));

  //   if (hasRegistered) {
  //     if (this.formStepper.steps.length === 6) {
  //       this.formStepper.steps = this.allSteps;
  //       this.formStepperService.summary = this.allStepSummary;
  //     }
  //   } else {
  //     this.formStepper.steps = stepsWithoutDecl;
  //     this.formStepperService.summary = menuWihoutDecl;
  //     this.application.activeForm.clearDeclarationSteps();
  //   }
  //   this.formStepperService.update();
  // }

  // cloneSteps(): void {
  //   this.allSteps = this.formStepper.steps.slice();
  // }

  // cloneSummary(): void {
  //   this.allStepSummary = this.formStepperService.summary.slice();
  // }

}