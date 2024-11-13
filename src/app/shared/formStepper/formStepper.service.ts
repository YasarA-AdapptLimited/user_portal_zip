import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormStepSummary } from './FormStepSummary';
import { FormStepComponent } from './formStep.component';

@Injectable()
export class FormStepperService {


  maxStep;
  minStep;
  summary: Array<FormStepSummary>;
  summary$ = new BehaviorSubject<Array<FormStepSummary>>([]);
  steps: Array<FormStepComponent>;
  initialSummary;

  init(steps: Array<FormStepComponent>, maxStep = 1, minStep = 1) {

    this.summary = steps.map(step => ({
      current: step.stepId === maxStep,
      stepId: step.stepId,
      title: step.title,
      validity: { valid: step.stepId < maxStep ? true : undefined, messages: [], touched: false },
      disabled: step.stepId > maxStep || step.stepId < minStep,
      waiting: step.waiting
     }));

    this.steps = steps;
    this.minStep = minStep;
    this.maxStep = maxStep;

    this.update();

    steps.forEach(step => {

      step.validity$.subscribe(validity => {
        //Assigned tick marks to form stepper menu as per saved status
        const index =  this.summary.findIndex(s => s.stepId === step.stepId)
        if (validity.valid !== undefined && this.summary[index].validity.valid !== validity.valid ) {
          this.summary[index].validity = validity;
        }
        // if (step.stepId >= maxStep ||  validity.valid ) {
        //   this.summary.find(s => s.stepId === step.stepId).validity = validity;
        // }
      //  this.summary.find(s => s.stepId === step.stepId).validity = validity;
        const furthestStep = this.getFurthestStep();
        if (validity.valid !== undefined && step.stepId <= furthestStep) {

         this.summary.forEach(s => s.disabled = s.stepId > furthestStep || s.stepId < this.minStep);
          const currentStep = this.summary.find(s => s.current);
          if (currentStep && currentStep.validity.valid) {
            const nextStep = this.summary.find(s => s.stepId === currentStep.stepId + 1);
            if (nextStep) {
              nextStep.disabled = false;
            }
          }
          this.update();
        }
      });
    });
  }

  getFurthestStep() {
    let stepId = 0;
    for (let i = 0; i < this.summary.length; i++ ) {
      const s = this.summary[i];
      if (!s.validity.valid) {
        break;
      }
      if (s.validity.valid && s.stepId > stepId) {
        stepId = s.stepId;
      }
    }

    return stepId + 1;
  }

  setCurrentStep(stepId) {
    this.summary.forEach(s => {
      s.current = s.stepId === stepId;
    });
    this.summary.filter(s => s.current).forEach(s => s.disabled = false);
    this.update();
  }

  setMinStep(stepId) {
    this.minStep = stepId;
    this.summary.forEach(s => {
      s.disabled = s.stepId < stepId;
    });
    this.update();
  }
  setMaxStep(stepId) {
    this.maxStep = stepId;
    this.summary.forEach(s => {
      s.disabled = s.stepId > stepId;
    });
    this.update();
  }
setStepRange(minStepId, maxStepId) {
    this.minStep = minStepId;
    this.maxStep = maxStepId;
    this.summary.forEach(s => {
      s.disabled = s.stepId > maxStepId || s.stepId < minStepId;
    });
    this.update();
  }

  disableAllStepsExcept(stepId) {
    this.summary.forEach(s => {
      s.disabled = s.stepId !== stepId;
    });
    this.minStep = stepId;
    this.maxStep = stepId;
    this.update();
  }



  getStep(stepId) {
    return this.steps.find(step => step.stepId === stepId);
  }

  get currentStepId() {
    if (!this.summary) { return undefined; }
    return this.summary.find(s => s.current).stepId;
  }

  update() {
    setTimeout(() => {
      this.summary$.next(this.summary);
    });
  }

  // method returns true/false to update already stored steps,
  // if previously stored steps are different from the latest one.
  // and also updates stepid of the latest steps.
  updateStepsId(initialSteps, formStepperSteps): boolean {
    if(initialSteps !== formStepperSteps) {
      let stepNumber = 1;
      initialSteps = formStepperSteps;

      if(this.steps.length !== formStepperSteps.length) {
        this.steps = formStepperSteps;
      }

      formStepperSteps.forEach((step, index) => {
        step.stepId = stepNumber;
        this.summary[index].stepId = this.steps[index].stepId = stepNumber;
        stepNumber++;
      });
      return true;
    } else {
      return false;
    }
  }
}
