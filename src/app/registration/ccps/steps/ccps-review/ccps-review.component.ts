import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { CCPSApplicationStep } from '../../model/ccpsApplicationStep';

@Component({
  selector: 'app-ccps-review',
  templateUrl: './ccps-review.component.html',
  styleUrls: ['./ccps-review.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => CcpsReviewComponent)
    }
  ]
})
export class CcpsReviewComponent extends FormStepComponent implements OnInit {

  title = 'Review';
  stepId = CCPSApplicationStep.Review;
  @Input() application;
  @Input() formId;
  @Input() readonly = false;
  @Input() showEdi = true;
  @Output() navigate = new EventEmitter<number>();
  @Input() displayFtPStep: boolean = false;

  constructor(formStpperService: FormStepperService) {
    super(formStpperService);
   }

  ngOnInit(): void {
  }

  populateForm() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
     //this.viewReady = true;
    });
  }

  validate() {
    this.validity$.next({ valid: true, messages: [], touched: this.touched });
  }

  goToStep(stepId) {    
    this.navigate.emit(stepId);
}

load() {
  this.ready$.next(true);
}
}
