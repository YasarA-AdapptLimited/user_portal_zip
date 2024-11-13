import { Input, Component, forwardRef, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../account/model/Applicant';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { RegApplicationStep } from '../model/RegApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';


@Component({
  selector: 'app-review-step',
  templateUrl: './reviewStep.component.html',
  styleUrls: ['./reviewStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => ReviewStepComponent)
    }
  ]
}) export class ReviewStepComponent extends FormStepComponent implements OnInit {
  title;
  @Input() stepId = RegApplicationStep.Review;
  applicant: Applicant;
  RegApplicationStep = RegApplicationStep;
  @Input() readonly = false;

  constructor(service: FormStepperService) {
    super(service);
  }

  @Output() navigate = new EventEmitter<number>();

  ngOnInit() {
    this.applicant = this.application.trainee;
    this.title = this.readonly ? 'Final review' : 'Review';
  }

  validate()  {
    this.validity$.next({ valid: true, messages: [], touched: this.touched});
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }

  populateForm() {}

}
