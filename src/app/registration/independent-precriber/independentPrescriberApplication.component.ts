
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Observable, of } from 'rxjs';
import { IndependentPrescriberService } from '../../core/service/independentPrescriber.service';
import { User } from '../../account/model/User';
import { AuthService } from '../../core/service/auth.service';
import { LayoutService } from '../../core/service/layout.service';
import { CanComponentDeactivate } from '../../guard/CanDeactivate.guard';
import { ConfirmDialogComponent } from '../../shared/confirmDialog.component';
import { FormStepperComponent } from '../../shared/formStepper/formStepper.component';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { FormStepSummary } from '../../shared/formStepper/FormStepSummary';
import { IndependentPrescriberApplication } from './model/IndependentPrescriberApplication';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { ApplicationStatus } from '../../technician/model/ApplicationStatus';
import { IndependentPrescriberApplicationStep } from './model/IndependentPrescriberApplicationStep';
import { mergeMap } from 'rxjs/operators';
import { RegistrationService } from '../../core/service/registration.service';
import { ApplicationDetails } from '../model/ApplicationDetails';

@Component({
  selector: 'app-independent-prescriber-application',
  moduleId: module.id,
  templateUrl: './independentPrescriberApplication.component.html',
  styleUrls: ['../../prereg/application-form.scss'],
  providers: [FormStepperService]
})
export class IndependentPrescriberApplicationComponent implements OnInit, AfterViewInit,
  CanComponentDeactivate {

  user: User;
  loading = false;
  ready = true;
  saving = false;
  loadingError = false;
  application: IndependentPrescriberApplication;
  maxStep;
  minStep;
  showGuidanceWarning = false;
  isApplicationOpen = true;
  applicationClosedMessage: string;
  ineligible = false;
  allowResubmit = false;
  displayCounterSigningPage = false;
  allSteps: FormStepComponent[];
  allStepSummary: any;
  IndependentPrescriberStep = IndependentPrescriberApplicationStep;
  initialSteps;
  displayCounterSignaturePage = true;
  stepsWithoutCounterSign;
  menuWithoutCounterSign;
  onLoad = true;
  useNewPaymentFlow: boolean;

  @ViewChildren(FormStepperComponent) formStepperComponents: QueryList<FormStepperComponent>;
  formStepper: FormStepperComponent;
  minExecution: number;
  start: number;
  constructor(private auth: AuthService,
    public layout: LayoutService,
    private dialog: MatDialog,
    public formStepperService: FormStepperService,
    private independentPrescriberService: IndependentPrescriberService,
    private cd: ChangeDetectorRef,
    private registrationService: RegistrationService
  ) { }

  get submitted() {
    return (this.application && (this.application.activeForm?.formStatus === ApplicationStatus.Submitted ||
      this.application.activeForm?.formStatus === ApplicationStatus.Approved ||
      this.application.activeForm?.formStatus === ApplicationStatus.PendingProcessing));
  }

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    this.formStepperComponents.changes.subscribe((comps: QueryList <FormStepperComponent>) => {
      this.formStepper = comps.first;
      this.cloneSteps();
      this.cloneSummary();
      this.checkIfCounterSignatureHasToBeDisplayed(this.application.form.countersignatures[0].isMentorRegistered);
    });    
  }

  load() {
    this.user = this.auth.user;
    this.useNewPaymentFlow = this.auth.user.useNewWorldpayFlow;
    this.loading = false;
    this.loadingError = false;
    this.registrationService.getAvailableForms().subscribe((details : ApplicationDetails) => {
      this.isApplicationOpen = details.isIndyPrescAppAvailable;
    });
    this.independentPrescriberService.getApplication(this.auth.user.registrationStatus).subscribe( application => {
      this.application = application;

      if (this.application.activeForm.step) {
        this.maxStep = this.application.activeForm.step;
      }
      if (this.application.activeForm.minStep) {
        this.minStep = this.application.activeForm.minStep;
      }

      this.loading = false;
      this.ready = true;
    // setTimeout(() => {
    //     this.showGuidanceWarning = this.formStepper && this.formStepper.currentStep === IndependentPrescriberApplicationStep.QualificationDetails;
    //   });
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

  getPrescriber(resolve, reject) {
    this.independentPrescriberService.getApplication(this.auth.user.registrationStatus).subscribe(() => {
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

  savePrescriber(resolve, reject) {
    let counterSignatures = this.application.activeForm.countersignatures[0];
    

    if(this.application.pastApplications) {
      delete this.application.pastApplications;
      delete this.application.status;
    }

    if(this.application.activeForm.formStatus === ApplicationStatus.CounterSigned) {
      this.application.activeForm.attachments = [];
    }

    this.independentPrescriberService.saveApplication(this.application).subscribe(() => {
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
    this.savePrescriber(resolve,reject);
   
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
    setTimeout(() => {
      this.independentPrescriberService.setStep(this.application.activeForm.id, stepId).subscribe();
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


  checkIfCounterSignatureHasToBeDisplayed(display: boolean): void {
    if (this.formStepper?.steps.length === 5) {
      this.cloneSteps();
      this.cloneSummary();
    }

    if(this.formStepper) {
      if(this.allSteps && !this.stepsWithoutCounterSign && !this.menuWithoutCounterSign) {
        this.stepsWithoutCounterSign = this.formStepper.steps.filter(step => !step.title.includes('Countersignature'));
        this.menuWithoutCounterSign = this.formStepperService.summary.filter(step => !step.title.includes('Countersignature'));
      }
      this.displayCounterSignaturePage = display;

      if (this.displayCounterSignaturePage) {
          this.formStepper.steps = this.allSteps;
          this.formStepperService.summary = this.allStepSummary;
      } else {
          this.formStepper.steps = this.stepsWithoutCounterSign;
          this.formStepperService.summary = this.menuWithoutCounterSign;
      }
      this.updateStepId();
      this.cd.detectChanges();
    }
  }

  cloneSteps(): void {
    this.allSteps = this.formStepper?.steps.slice();
  }

  cloneSummary(): void {
    this.allStepSummary = this.formStepperService.summary?.slice();
  }

  updateStepId(): void {
      if(this.formStepper) {
            if(this.formStepperService.updateStepsId(this.initialSteps, this.formStepper.steps)) {
              this.initialSteps = this.formStepper.steps;        
              if(this.onLoad) {
                this.formStepper.currentStep = this.formStepper.steps.find(s => s.stepId === this.maxStep);
                this.formStepperService.setCurrentStep(this.maxStep);
                if(this.formStepper.currentStep.title !== 'Countersignature'){
                  this.allStepSummary.forEach( item => {
                    item.current = item.title === this.formStepper.currentStep.title ? true: false;
                  });
                  this.allStepSummary[1].validity.valid = undefined;
                }
                
                this.formStepperService.summary.forEach( item => {
                    item.current = item.title === this.formStepper.currentStep.title ? true: false;                                                            
                      item.validity = { valid: item.stepId < this.maxStep ? true : undefined, messages: [], touched: false };
                });
                this.formStepper.currentStep.ready$.subscribe(ready => {
                  if (ready) {
                    this.formStepper.currentStep.validate();
                  }
                });
                this.formStepper.currentStep.load();         
                this.onLoad = false;
              }              
            }
          }
      }

  savingDetails(val): void {
    this.saving = val;
  }
}