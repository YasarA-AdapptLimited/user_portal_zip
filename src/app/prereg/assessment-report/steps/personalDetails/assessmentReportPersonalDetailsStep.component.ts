/*import { OnInit, Component, forwardRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../../../account/model/Applicant';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';

@Component({
  selector: 'app-assessment-report-personal-details-step',
  templateUrl: './assessmentReportPersonalDetailsStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentReportPersonalDetailsStepComponent)
    }
  ]
}) export class AssessmentReportPersonalDetailsStepComponent extends FormStepComponent implements OnInit, AfterViewInit {


  @Output() navigate = new EventEmitter<number>();
  showDetailsHelp = false;
  showContactHelp = false;
  applicant: Applicant;
  selection;
  title = 'Personal details';
  stepId = AssessmentReportStep.PersonalDetails;
  viewReady = false;


  constructor(service: FormStepperService) {
    super(service);
  }


  ngOnInit() {
    this.applicant = this.application.trainee;
  }

  load() {
    if (this.viewReady) {
      this.ready$.next(true);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
      this.viewReady = true;
    });
  }

  update() {
    this.makeDirty();
    this.validate();
  }

  validate() {
    const messages = [];
    const valid = true;
    this.validity$.next({ valid, messages, touched: this.touched });
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }


  populateForm() { }




}*/
