import { Input, Component, forwardRef, OnInit, EventEmitter, Output } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FinalDeclaration } from '../../model/FinalDeclaration';
import { FinalDeclarationStep } from '../../model/FinalDeclarationStep';



@Component({
  selector: 'app-final-declaration-review-step',
  templateUrl: './finalDeclarationReviewStep.component.html',

  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => FinalDeclarationReviewStepComponent)
    }
  ]
}) export class FinalDeclarationReviewStepComponent extends FormStepComponent implements OnInit {
  title;
  @Input() stepId = FinalDeclarationStep.FinalReview;
  // applicant: Applicant;
  FinalDeclarationStep = FinalDeclarationStep;
  @Input() readonly = false;
  @Input() application: FinalDeclaration;

  constructor(service: FormStepperService) {
    super(service);
  }

  @Output() navigate = new EventEmitter<number>();

  ngOnInit() {
    // this.applicant = this.application;
    this.title = this.readonly ? 'Final review' : 'Review';
  }

  validate() {
    this.validity$.next({ valid: true, messages: [], touched: this.touched });
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }

  populateForm() { }

}
