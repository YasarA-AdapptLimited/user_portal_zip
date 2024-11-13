import { Component, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { FormStepSummary } from '../../shared/formStepper/FormStepSummary';
import { User } from '../../account/model/User';
import { FormStepperComponent } from '../../shared/formStepper/formStepper.component';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { LayoutService } from '../../core/service/layout.service';
import { CCPSService } from '../../core/service/ccps.service';
import { CCPSApplication } from './model/ccpsApplication';
import { AuthService } from '../../core/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormStepComponent } from '../../../app/shared/formStepper/formStep.component';
import { ApplicationStatus } from '../../../app/prereg/model/ApplicationStatus';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrantStatus } from '../../../app/registration/model/RegistrantStatus';
@Component({
  selector: 'app-ccps',
  templateUrl: './ccps.component.html',
  styleUrls: ['../../prereg/application-form.scss'],
  providers: [FormStepperService]
})
export class CcpsComponent implements OnInit {

  @ViewChildren(FormStepperComponent) formStepperComponents: QueryList<FormStepperComponent>;
  loading = false;
  loadingError = false;
  isApplicationOpen = true;
  ready = true;
  saving = false;
  showGuidanceWarning = false;
  user: User;
  formId: number;
  onLoad = true;
  get readonly() {
    return (this.application && (
      this.application.activeForm.formStatus === ApplicationStatus.Submitted ||
      this.application.activeForm.formStatus === ApplicationStatus.Approved ||
      this.application.activeForm.formStatus === ApplicationStatus.WaitingForApplicant ||
      this.application.activeForm.formStatus === ApplicationStatus.PendingProcessing
    ));
  }
  maxStep;
  minStep;

  allSteps: FormStepComponent[];
  allStepSummary: any;
  stepsWithoutFtP;
  menuWithoutFtP;
  initialSteps;
  displayFtPStep = true;
  useNewPaymentFlow: boolean;

  application: CCPSApplication;
  @ViewChild(FormStepperComponent) formStepper;

  constructor(public formStepperService: FormStepperService,
    public layout: LayoutService, public ccpsService: CCPSService, private auth: AuthService,
    private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.formStepperComponents.changes.subscribe((comps: QueryList<FormStepperComponent>) => {
      this.formStepper = comps.first;
      this.cloneSteps();
      this.cloneSummary();
      this.showHideFtPStep();
    });
  }

  ngOnInit(): void {
    this.formId = this.route.snapshot.params['id'];
    if (this.formId) localStorage.setItem('ccpsFormActive', JSON.stringify(this.formId));
    else {
      let formId = localStorage.getItem('ccpsFormActive');
      if (!formId) {
        this.router.navigate(['application']);
      }
      if (JSON.parse(formId) !== 'noFormIdYet') this.formId = JSON.parse(formId);
    }
    this.load();
  }

  load() {
    this.user = this.auth.user;
    this.useNewPaymentFlow = this.auth.user.useNewWorldpayFlow;
    this.loading = true;
    this.loadingError = false;
    this.ccpsService.getApplication(this.auth.user.registrationStatus, this.formId).subscribe((app : CCPSApplication) => {
      this.application = app;

      if (this.application.activeForm.step) {
        this.maxStep = this.application.activeForm.step;
      }
      if (this.application.activeForm.minStep) {
        this.minStep = this.application.activeForm.minStep;
      }

      this.loading = false;
      this.ready = true;
    }, error => {
      this.loading = false;
      this.loadingError = true;
    });
  }

  get isRegisteredSuspended() {
    return (this.application.personalDetails?.registration?.registrationStatus === RegistrantStatus.Registered || this.application.personalDetails?.registration?.registrationStatus === RegistrantStatus.Suspended);
  }

  goToStep(step: FormStepSummary) {
    if (step.disabled) { return; }
    this.formStepper.goToStep(step.stepId);
  }

  save() {
    this.saving = true;

    if (this.application.activeForm.formStatus === ApplicationStatus.NotStarted) {
      this.application.activeForm.formStatus = ApplicationStatus.InProgress;
    }

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
      this.ccpsService.saveApplication(this.application).subscribe(() => {
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


  stepChanged(stepId) {
    this.ccpsService.setStep(this.application.activeForm.id, stepId).subscribe();
    this.application.activeForm.step = stepId;
  }



  cloneSteps(): void {
    this.allSteps = this.formStepper?.steps.slice();
  }

  cloneSummary(): void {
    this.allStepSummary = this.formStepperService.summary?.slice();
  }

  showHideFtPStep() {

    if(this.formStepper) {
      if(!this.stepsWithoutFtP && !this.menuWithoutFtP) {
        this.stepsWithoutFtP = this.formStepper.steps.filter(step => !step.title.includes('Fitness to practise declarations'));
        this.menuWithoutFtP = this.formStepperService.summary.filter(step => !step.title.includes('Fitness to practise declarations'));
      }
      
      this.displayFtPStep = this.isRegisteredSuspended;

      if (this.displayFtPStep) {
          this.formStepper.steps = this.allSteps;
          this.formStepperService.summary = this.allStepSummary;
      } else {
          this.formStepper.steps = this.stepsWithoutFtP;
          this.formStepperService.summary = this.menuWithoutFtP;
      }
      this.updateStepId();      
      this.cd.detectChanges();
    }
  }

  updateStepId(): void {
    if(this.formStepper) {
          if(this.formStepperService.updateStepsId(this.initialSteps, this.formStepper.steps)) {
            this.initialSteps = this.formStepper.steps;
            if(this.onLoad) {
              this.formStepper.currentStep = this.formStepper.steps.find( s => s.stepId === this.maxStep);
              this.formStepperService.setCurrentStep(this.maxStep);
              this.formStepperService.summary.forEach( item => {
              item.current = item.title === this.formStepper.currentStep.title ? true: false;                                                            
                  item.validity = { valid: item.stepId < this.maxStep ? true : undefined, messages: [], touched: false };
              });
              this.formStepper.currentStep.load();      
              this.formStepper.currentStep.validate();   
              this.onLoad = false;
            }
          }
    }
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

  savingDetails(val): void {
    this.saving = val;
  }
}
