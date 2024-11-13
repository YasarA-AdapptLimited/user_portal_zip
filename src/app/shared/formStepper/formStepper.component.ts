import { Component, AfterContentInit, ContentChildren, QueryList, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LayoutService } from '../../core/service/layout.service';
import { FormStepComponent } from './formStep.component';
import { RegApplicationStep } from '../../prereg/model/RegApplicationStep';
import { BehaviorSubject } from 'rxjs';
import { FormStepperService } from './formStepper.service';
import { trigger, transition, animate, style } from '@angular/animations';

interface StepChangeArgs {
  from: string;
  to: string;
}
@Component({
  moduleId: module.id,
  selector: 'app-form-stepper',
  templateUrl: './formStepper.component.html',
  styleUrls: ['./formStepper.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({
          transform: 'translateY(10px)',
          opacity: 0.7
        }),
        animate('600ms cubic-bezier(0, 0, 0.2, 1)',
          style({
            transform: 'translateY(0)',
            opacity: 1
          }))
      ])
    ])
  ]
})
export class FormStepperComponent implements AfterContentInit {

  constructor(private layout: LayoutService, private service: FormStepperService) { }

  currentStep: FormStepComponent;
  ready = false;
  nextTouched = false;
  prevTouched = false;
  saving = false;
  loading = new EventEmitter<boolean>();
  serverErrors = [];
  stepSub;

  @Output() stepChanged = new EventEmitter<number>();
  @Input() maxStep;
  @Input() minStep;
  @Input('saving') set setSaving(saving) {
    this.saving = saving;
    if (saving) {
      this.layout.setOverlay(true);
    } else {
      setTimeout(() => {
        this.layout.setOverlay(false);
      }, 100);
    }
  }
  @Input('ready') set setReady(ready) {
    setTimeout(() => {
      this.ready = ready;
    });
  }
  @Input() stepChange;

  steps: Array<FormStepComponent>;
  @ContentChildren(FormStepComponent) stepComponents: QueryList<FormStepComponent>;

  ngAfterContentInit() {
    this.steps = this.stepComponents.toArray();
    // console.log(this.steps);

    this.service.init(this.steps, this.maxStep, this.minStep);

    let currentStep;
    // navigate to max step
    if (this.maxStep) {
      currentStep = this.steps.find(s => s.stepId === this.maxStep);
    }
    if (!currentStep) {
      currentStep = this.steps[0];
    }
    this.currentStep = currentStep;
    this.stepSub = this.currentStep.ready$.subscribe(ready => {
      if (ready) {
        this.currentStep.validate();
      }
    });
    this.currentStep.load();
  }

  goToStep(stepId) {
    if (stepId === this.currentStep.stepId) { return; }
    const step = this.steps.filter(s => s.stepId === stepId)[0];
    if (step) {
      if (stepId > this.currentStep.stepId) {
        if (this.currentStep.beforeNext()) {
          this.changeStep(this.steps.indexOf(step));
        }
      } else {
        if (this.currentStep.beforePrev()) {
          this.changeStep(this.steps.indexOf(step));
        }
      }
    } else {
      throw new Error('No step with id ' + stepId);
    }
  }

  get stepIndex() {
    return this.steps.indexOf(this.currentStep);
  }

  get allowPrev() {
    return this.stepIndex > 0 && !this.currentStep.prevDisabled;
  }
  get allowNext() {
    return this.currentStep.validity$.value.valid;
  }

  next() {
    this.prevTouched = false;
    this.nextTouched = true;
    this.currentStep.validity$.value.touched = true;
    this.currentStep.touched = true;
    this.currentStep.populateForm();
    this.currentStep.validate();
    if (this.allowNext) {
      if (this.currentStep.beforeNext()) {
        this.changeStep(this.stepIndex + 1);
      }
    }
  }

  prev() {
    this.nextTouched = false;
    this.prevTouched = true;
    this.currentStep.touched = true;
    this.currentStep.populateForm();
    if (this.allowPrev) {
      if (this.currentStep.beforePrev()) {
        this.changeStep(this.stepIndex - 1);
      }
    }
  }

  public changeStep(newStepIndex) {

    this.stepChange(this.currentStep).then(() => {
      if (this.stepSub) {
        this.stepSub.unsubscribe();
      }
      this.nextTouched = false;
      this.prevTouched = false;
      this.currentStep = this.steps[newStepIndex];
      this.service.setCurrentStep(this.currentStep.stepId);
      this.currentStep.dirty = false;
      //  this.currentStep.touched = false;
      this.currentStep.ready$.next(false);
      this.stepSub = this.currentStep.ready$.subscribe(ready => {
        if (ready) {
          this.currentStep.validate();
        }
      });
      this.stepChanged.emit(this.currentStep.stepId);
      this.currentStep.load();
      if (this.layout.state.fullscreen) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 208);
      }

    }).catch(error => {
      console.error(error);
    });
  }

  isObjectType(value: any): boolean {
    return typeof value === 'object';
  }

}
