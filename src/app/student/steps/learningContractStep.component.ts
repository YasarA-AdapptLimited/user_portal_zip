import { Component, forwardRef, OnInit } from '@angular/core';
import { EdiService } from '../../account/service/edi.service';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { EqualityDiversity } from '../../account/model/EqualityDiversity';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../core/tooltip/Tooltip';
import { Applicant } from '../../account/model/Applicant';
import { PreregApplication } from '../../shared/model/student/PreregApplication';
import { StudentService } from '../../core/service/student.service';
import { Placement } from '../../shared/model/student/Placement';
import { Tutor } from '../../shared/model/student/Tutor';
import { LearningContractResponse } from '../../shared/model/student/LearningContractResponse';
import { CustomErrorHandler } from '../../core/service/CustomErrorHandler';

@Component({
  selector: 'app-learning-contract-step',
  templateUrl: './learningContractStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => LearningContractStepComponent)
    }
  ]
}) export class LearningContractStepComponent extends FormStepComponent implements OnInit {


  constructor(service: FormStepperService,
    private studentService: StudentService, private customError: CustomErrorHandler) {
    super(service);
  }
  title = 'Learning contract';
  stepId = PreregApplicationStep.LearningContract;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  showDetailsHelp = false;
  serverError = false;

  LearningContractResponse = LearningContractResponse;
  tutors: Array<Tutor>;

  sending = false;

  ngOnInit() {

  }

  validate() {

    const messages = [];

    if (!this.application.activeForm.isLearningContractSigned) {
      messages.push('Please tick the box to agree to the learning cotreact');
    } else if (!this.allSigned) {
      messages.push('All tutors must have signed the contract before you can continue');
    }

    this.validity$.next({
      valid: !messages.length,
      messages,
      touched: this.touched
    });

  }

  setAgreed() {
    this.validate();
    this.makeDirty();
  }

  populateForm() { }

  personalDetailsErrorMessage: string;

  sendLearningContracts() {
    this.sending = true;

    this.studentService.saveApplication(this.application, this.stepId).subscribe(() => {

      this.studentService.sendLearningContracts().subscribe(result => {
        this.serverError = false;
        this.studentService.getPlacements().subscribe(data => {
          this.setTutors(data.placements);
          this.sending = false;
        });
      }, error => {
        console.table(error);
        if (error.validationErrors) {
          this.serverError = true;
          this.personalDetailsErrorMessage = error.validationErrors[0].errors[0];
        } else if (error.serverError) {
          this.serverError = true;
          this.personalDetailsErrorMessage = error.message;
        }
        this.sending = false;
      });

    });


  }

  get hasUnsentContracts() {
    return this.tutors && !!this.tutors.filter(t => !t.learningContractResponse).length;
  }

  get allSigned() {
    return this.tutors && !this.tutors.find(t => t.learningContractResponse !== LearningContractResponse.Approved);
  }

  load() {
    const placements = (<PreregApplication>this.application).activeForm.placements;
    if (!placements[0].isValid) {
      this.studentService.getPlacements().subscribe(data => {
        this.setTutors(data.placements);
        this.ready$.next(true);
      });
    } else {
      this.setTutors(placements);
      this.ready$.next(true);
    }
  }

  setTutors(placements) {
    // this.tutors = placements.reduce((tutors, placement: Placement) => tutors.concat(placement.tutors), []);

    this.tutors = placements.reduce((tutors: Array<Tutor>, placement: Placement) => {
      placement.tutors.forEach(tutor => {
        //   if (!tutors.find(t => t.gphcId === tutor.gphcId)) {
        tutors.push(tutor);
        //  }
      });
      return tutors;
    }, []);
  }


}
