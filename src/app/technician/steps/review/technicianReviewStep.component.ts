import { Input, Component, forwardRef, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../../account/model/Applicant';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';

import { FormStepperService } from '../../../shared/formStepper/formStepper.service';

import { StudentService } from '../../../core/service/student.service';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';


@Component({
  selector: 'app-technician-review-step',
  templateUrl: './technicianReviewStep.component.html',
  styleUrls: ['./technicianReviewStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => TechnicianReviewStepComponent)
    }
  ]
}) export class TechnicianReviewStepComponent extends FormStepComponent implements OnInit {
  title;
  @Input() stepId = TechnicianApplicationStep.Review;
  applicant: Applicant;
  @Input() readonly = false;

  constructor(service: FormStepperService, private studentService: StudentService) {
    super(service);
  }

  @Output() navigate = new EventEmitter<number>();

  ngOnInit() {
    this.applicant = this.application.trainee;
    this.title = this.readonly ? 'Final review' : 'Review';
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

  populateForm() { }

}
