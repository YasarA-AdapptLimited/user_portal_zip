import { OnInit, Component, forwardRef, AfterViewInit, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { ContactEditComponent } from '../../../../account/contactEdit.component';
import { Tooltip } from '../../../../core/tooltip/Tooltip';
import { Applicant } from '../../../../account/model/Applicant';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { AssessmentRegistrationStep } from '../../model/AssessmentRegistrationStep';

@Component({
  selector: 'app-assessment-registration-personal-details',
  templateUrl: './assessmentRegistrationPersonalDetails.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentRegistrationPersonalDetailsComponent)
    }
  ]
}) export class AssessmentRegistrationPersonalDetailsComponent extends FormStepComponent implements OnInit, AfterViewInit {


  showDetailsHelp = false;
  showContactHelp = false;
  applicant: Applicant;
  contactValid;
  hasAddress;
  hasTitle;
  hasNationality;
  selection;
  title = 'Contact details';
  @Input() stepId = AssessmentRegistrationStep.PersonalDetails;
  @Output() navigate = new EventEmitter<number>();
  viewReady = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };

  constructor(service: FormStepperService) {
    super(service);
  }

  @ViewChild('contact') contact: ContactEditComponent;
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

  populateForm() { }




}
