import { ViewChild, TemplateRef, Input, Directive } from '@angular/core';
import { StepValidity } from './StepValidity';
import { BehaviorSubject } from 'rxjs';
import { FormStepperService } from './formStepper.service';

@Directive()
export abstract class FormStepComponent  {

  @ViewChild('content') content: TemplateRef<any>;

  protected service: FormStepperService;

  constructor(service: FormStepperService) {
    this.service = service;
  }

  prevDisabled = false;
  nextDisabled = false;
  dirty: boolean;
  touched: boolean;
  waiting: boolean;
  ready$ = new BehaviorSubject<boolean>(false);
  validity$ = new BehaviorSubject<StepValidity>({ valid: undefined, messages: [], touched: false });
  abstract title: string;
  abstract stepId;
  @Input() application;

  abstract validate();

  load() {
    this.ready$.next(true);
  }

  makeDirty() {
    this.dirty = true;
  }

  beforeNext() {
    return true;
  }
  beforePrev() {
    return true;
  }

  abstract populateForm();

}
