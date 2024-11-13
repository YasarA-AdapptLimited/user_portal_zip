import { Input, Component, forwardRef, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../account/model/Applicant';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { Placement } from '../../shared/model/student/Placement';
import { PreregApplication } from '../../shared/model/student/PreregApplication';
import { StudentService } from '../../core/service/student.service';


@Component({
  selector: 'app-prereg-review-step',
  templateUrl: './preregReviewStep.component.html',
  styleUrls: ['./preregReviewStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PreregReviewStepComponent)
    }
  ]
}) export class PreregReviewStepComponent extends FormStepComponent implements OnInit {
  title;
  @Input() stepId = PreregApplicationStep.Review;
  applicant: Applicant;
  PreregApplicationStep = PreregApplicationStep;
  @Input() readonly = false;
  placements: Array<Placement>;

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
    this.placements = (<PreregApplication>this.application).activeForm.placements;
    if (this.placements[0].isValid) {
      this.ready$.next(true);
    } else {
      this.studentService.getPlacements().subscribe(data => {
        (<PreregApplication>this.application).activeForm.placements = data.placements;
        (<PreregApplication>this.application).activeForm.trainingScheme = data.trainingScheme;
        this.placements = data.placements;
        this.ready$.next(true);
      });

    }
  }

  populateForm() { }

}
