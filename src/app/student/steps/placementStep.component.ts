import { OnInit, Component, forwardRef, ViewChild, AfterViewInit, ViewChildren } from '@angular/core';
import { Applicant } from '../../account/model/Applicant';
import { FormStepComponent } from '../../shared/formStepper/formStep.component';
import { ContactEditComponent } from '../../account/contactEdit.component';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../core/tooltip/Tooltip';
import { Placement } from '../../shared/model/student/Placement';
import { PreregApplication } from '../../shared/model/student/PreregApplication';
import { IProgress } from '../../shared/IProgress';
import { StudentService } from '../../core/service/student.service';
import { TrainingSchemeType } from '../../shared/model/student/TrainingSchemeType';
import { LearningContractResponse } from '../../shared/model/student/LearningContractResponse';
import { DatePipe } from '@angular/common';
import { TrainingSiteStatus } from '../model/TrainingSiteSatus';

@Component({
  selector: 'app-placement-step',
  templateUrl: './placementStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => PlacementStepComponent)
    }
  ],
  styleUrls: ['./placementStep.scss']
}) export class PlacementStepComponent extends FormStepComponent {

  showHelp = false;
  loaded = false;
  title = 'Training';
  stepId = PreregApplicationStep.Training;
  viewReady = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };

  learningContractRejected = false;
  tutorIneligible = false;
  tutorFeedback;
  registrationDateLimit;
  feedback = false;

  trainingWindow;

  @ViewChildren('focus') vc;

  progressTooltip: Tooltip = {
    id: 'progress',
    content: `This shows the total number of training days you have entered, which must add up to 364 days.`,
    width: 310,
    placement: 'top',
    order: -1
  };

  placements: Array<Placement> = [];
  TrainingSchemeType = TrainingSchemeType;
  weeksProgress: IProgress = {
    progress: 0,
    completed: false,
    invalid: false,
    total: 52
  };
  daysProgress: IProgress = {
    progress: 0,
    completed: false,
    invalid: false,
    total: 364
  };

  beforePrev() {
    this.dirty = false;
    return true;
  }
  trainingStartDate;
  trainingEndDate;
  constructor(service: FormStepperService, private studentService: StudentService, private datePipe: DatePipe) {
    super(service);
  }

  getProgressTooltip() {
    return this.progressTooltip;
  }

  get requireTrainingSchemeNumber() {
    return this.application.activeForm.trainingScheme.type === TrainingSchemeType.Oriel;
  }
  setFocus() {
    setTimeout(function () {
      if (this.vc.first) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 200);
  }

  load() {
    this.placements = (<PreregApplication>this.application).activeForm.placements;
    this.trainingWindow = this.placements[0].trainingWindow;
    this.checkForIssues();
    this.calculateDays([]);
    this.dirty = false;
    this.ready$.next(true);
    this.trainingStartDate = this.datePipe.transform(this.application.preRegistrationApplicationScheme.trainingStartDateForCurrentYear, 'd MMMM yyyy');
    this.trainingEndDate = this.datePipe.transform(this.application.preRegistrationApplicationScheme.endDateForCurrentYear, 'd MMMM yyyy');
  }

  checkForIssues() {

    this.learningContractRejected = !!this.placements.find(placement => placement.contractRejected);
    this.tutorIneligible = !!this.placements.find(placement => !placement.tutorsEligible);

    if (this.learningContractRejected) {

      this.tutorFeedback = this.placements
        .find(placement =>
          placement.contractRejected).tutors
        .find(tutor => tutor && (tutor.learningContractResponse === LearningContractResponse.Rejected ||
          tutor.learningContractResponse === LearningContractResponse.Refused))
        .learningContractResponseFeedback;

      if (!this.tutorFeedback) {
        return false;
      } else {
        this.feedback = true;
      }
    }

    if (this.learningContractRejected || this.tutorIneligible) {
      this.touched = true;
      this.validity$.next({
        valid: false,
        messages: [],
        touched: this.touched
      });
    }
  }

  nth(i) {
    return i === 0 ? 'first' : (i === 1 ? 'second' : 'third');
  }

  changed(field?) {
    if (field === 'tutor') {
      this.application.activeForm.isLearningContractSigned = false;
    }
    this.makeDirty();
    this.validate();
  }

  trainingSchemeChanged() {
    this.changed();
    if (!this.trainingSchemeValid) {
      this.setFocus();
    }
  }

  get trainingSchemeValid() {
    return this.application.activeForm.trainingScheme.type === TrainingSchemeType.None
      || this.application.activeForm.trainingScheme.type === TrainingSchemeType.Oriel
      || !!this.application.activeForm.trainingScheme.number;
  }

  validate() {
    const messages = [];
    this.checkForIssues();

    this.placements.forEach((placement, i) => {
      const n = this.nth(i);
      if (!placement.trainingSite.premise) {
        messages.push(`You haven't selected a training site for your ${n} placement.`);
        return;
      }
      if (!placement.trainingSite.premise) {
        messages.push(`You haven't selected a training site for your ${n} placement.`);
        return;
      }
      if (placement.trainingSite.isOwner === undefined || placement.trainingSite.isRelated === undefined) {
        messages.push(`You haven't answered all the questions relating to the training site of your ${n} placement.`);
        return;
      }
      if (placement.trainingSiteValid) {

        if (!placement.startDate) {
          messages.push(`You haven't set the start date of your ${n} placement.`);
          return;
        }

        if (!placement.endDate) {
          messages.push(`You haven't set the end date of your ${n} placement.`);
          return;
        }

        if (new Date(placement.endDate) > new Date(placement.trainingSite.premise.accreditedTo) &&
          placement.trainingSite.premise.premiseStatus === TrainingSiteStatus.Accredited) {
          messages.push(`This training site approval expires before the end of your ${n} placement there.
            An application for an extension of approval has not yet been received.
            Please contact your training provider immediately as you are not currently
            able to submit an application for training at this site.`);
          return;
        }

        // if (placement.tutors[0]) {
        //   if (!placement.isWithinPermittedRange) {
        //     messages.push(`Your ${n} placement dates are not within the permitted range.`);
        //     return;
        //   }
        // }

        if (placement.datesValid) {

          if (!placement.tutors.length || !placement.tutors[0]) {
            messages.push(`You haven't selected a tutor for your ${n} placement.`);
          }
          if (placement.tutors.length > 1 && !placement.tutors[1]) {
            messages.push(`You haven't selected the other tutor for your ${n} placement.`);
          }

          if (placement.contractRejected) {
            messages.push(`A tutor on your ${n} placement has refused to sign the learning contract,
              please review their comments and make the necessary amendments.`);
          }

        }

      }

    });




    this.validateDateRanges(messages);

    if (this.placementsValid) {
      this.calculateDays(messages);
    }

    this.validity$.next({
      valid: !messages.length,
      messages,
      touched: this.touched
    });
  }


  calculateDays(messages) {
    const totalDays = (<PreregApplication>this.application).activeForm.getTrainingDays();

    const invalid = totalDays !== 364;
    if (invalid) {
      messages.push('Your training period must total 364 days');
    }

    this.daysProgress = Object.assign({}, this.daysProgress, { progress: totalDays, error: this.touched && invalid });

  }

  validateDateRanges(messages) {
    if (this.placements.length === 1) {
      return true;
    }

    if (new Date(this.placements[0].endDate) > new Date(this.placements[1].startDate)) {
      messages.push('The start date of your second placement must be after the end date of your first placement');
      this.placements[1].overlap$.next(true);
      return false;
    }
    this.placements[1].overlap$.next(false);
    if (this.placements.length === 2) {
      return true;
    }

    if (new Date(this.placements[1].endDate) > new Date(this.placements[2].startDate)) {
      messages.push('The start date of your third placement must be after the end date of your second placement');
      this.placements[2].overlap$.next(true);
      return false;
    }
    this.placements[2].overlap$.next(false);

    return true;
  }


  populateForm() { }

  removePlacement(index) {
    if (this.placements.length > 1) {
      this.placements.splice(index, 1);
    }
    this.changed();
  }



  addPlacement() {
    if (this.placements.length < 3) {
      const placement = new Placement();
      placement.trainingWindow = this.trainingWindow;
      this.placements.push(placement);
    }
    this.changed();
    this.touched = false;
  }

  get placementsValid() {
    let valid = true;
    this.placements.forEach(placement => {
      if (!placement.isValid) {
        valid = false;
      }
    });
    return valid;
  }

}
