import { Component, forwardRef, ViewChildren, AfterViewInit } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../../core/tooltip/Tooltip';
import { IProgress } from '../../../shared/IProgress';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { TechnicianApplication } from '../../model/TechnicianApplication';
import { WorkExperience } from '../../model/WorkExperience';
import { ApplicationProcessType } from '../../model/ApplicationProcessType';
import { DatePipe } from '@angular/common';
import { UtcDatePipe } from '../../../shared/pipe/UtcDate.pipe';

@Component({
  selector: 'app-work-experience-step',
  templateUrl: './workExperienceStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => WorkExperienceStepComponent)
    }, DatePipe
  ],
  styleUrls: ['./workExperienceStep.scss']
}) export class WorkExperienceStepComponent extends FormStepComponent implements AfterViewInit {

  showHelp = false;
  loaded = false;
  title = 'Work experience';
  stepId = TechnicianApplicationStep.WorkExperience;
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
  applicationTypeValue: ApplicationProcessType;
  ApplicationProcessType = ApplicationProcessType;

  trainingWindow;

  @ViewChildren('focus') vc;

  progressTooltip: Tooltip = {
    id: 'progress',
    content: `This shows the total number of training weeks you have entered, which must add up to 104/2 years.`,
    width: 310,
    placement: 'top',
    order: -1
  };
  hourProgressTooltip: Tooltip = {
    id: 'progress',
    content: `This shows the total number of hours you have entered, which must be
      a minumum of 1260hr over a two year period
    .`,
    width: 310,
    placement: 'top',
    order: -1
  };

  workExperiences: Array<WorkExperience> = [];
  weeksProgress: IProgress = {
    progress: 0,
    completed: false,
    invalid: false,
    total: 104
  };
  hoursProgress: IProgress = {
    progress: 0,
    completed: false,
    invalid: false,
    total: 1260
  }
  constructor(service: FormStepperService, private datePipe: DatePipe) {
    super(service);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
      this.viewReady = true;
    });
  }


  beforePrev() {
    this.dirty = false;
    return true;
  }

  getProgressTooltip() {
    return this.progressTooltip;
  }

  getHourProgressTooltip() {
    return this.hourProgressTooltip;
  }


  setFocus() {
    setTimeout(function () {
      if (this.vc.first) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 200);
  }

  load() {
    this.getWorkExperiences();
    this.getApplicationTypeValue();
    this.calculateWeeks([]);
    this.calculateHoursWorked([]);
    this.dirty = false;
    this.ready$.next(true);
    this.populateForm();
  }

  getWorkExperiences() {
    const hasWorkExperiences = (<TechnicianApplication>this.application).activeForm.workExperiences.length;
    if (this.application.activeForm.step === TechnicianApplicationStep.WorkExperience) {
      (!hasWorkExperiences) ?  this.createNewWorkExperience() : this.mapWorkExperience();
    }
  }

  createNewWorkExperience() {
    (<TechnicianApplication>this.application).activeForm.workExperiences = [new WorkExperience()];
    this.workExperiences = (<TechnicianApplication>this.application).activeForm.workExperiences;

  }

  mapWorkExperience() {
    this.workExperiences = (<TechnicianApplication>this.application).activeForm
    .workExperiences.sort((a, b) => {
      return new Date(a.startDate) < new Date(b.startDate) ? -1 : 1;
    });
  }

  getApplicationTypeValue() {
    this.applicationTypeValue = (<TechnicianApplication>this.application).activeForm.applicationType;
  }

  nth(i) {
    return i === 0 ? 'first' : (i === 1 ? 'second' : (i === 2 ? 'third' : 'fourth'));
  }

  changed(field?) {
    this.touched = true;
    this.makeDirty();
    this.validate();
  }


  calcEducationDetailsEarliestDate(knowledgeDate, competencyDate) {
    const dates = [new Date(knowledgeDate), new Date(competencyDate)]
    .sort((a, b) => new Date(a) < new Date(b) ? -1 : 1);
    const threeMonthsEarlier = new Date(
      dates[0].getFullYear(),
      dates[0].getMonth() - 3,
      dates[0].getDate()
    );
    return threeMonthsEarlier;
  }

  calcCombinedEducationDetailsEarliestDate(combinedDate) {
    const dates = new Date(combinedDate);
    const threeMonthsEarlier = new Date(
      dates.getFullYear(),
      dates.getMonth() - 3,
      dates.getDate()
    );
    return threeMonthsEarlier;
  }

  validate() {

  const { dateCommenced: competencyDateCommenced } = this.application.activeForm.educationDetails.competency;
  const { dateCommenced: knowledgeDateCommenced } = this.application.activeForm.educationDetails.knowledge;
  const { dateCommenced: combinedDateCommenced } = this.application.activeForm.educationDetails.combined;

 const earliestSubmissionDate = this.calcEducationDetailsEarliestDate(knowledgeDateCommenced, competencyDateCommenced);
 const earliestCombinedSubmissionDate = this.calcCombinedEducationDetailsEarliestDate(combinedDateCommenced);

    const messages = [];

    this.workExperiences.forEach((workExperience, i) => {
      const n = this.nth(i);
      const hasWorkingHoursSet = !!workExperience.workedHoursPerWeek;
      const hasJobTitle = !!workExperience.jobTitle;


      if (!hasJobTitle) {
        messages.push('You must include a job title');
      }

      if (!hasWorkingHoursSet) {
        messages.push('You must set your working hours');
      }

      if (workExperience.workedHoursPerWeek < 14) {
        messages.push('To meet the work experience requirement you must work at least 14 hours a week');
      }


      if (!workExperience.premise) {
        messages.push(`You haven't selected a training site for your ${n} placement.`);
        return;
      }

      if (workExperience.premiseValid) {

        if (workExperience.workingHoursValid) {

          if (!workExperience.startDate) {
            messages.push(`You haven't set the start date of your ${n} placement.`);
            return;
          }

          if (!workExperience.endDate) {
            messages.push(`You haven't set the end date of your ${n} placement.`);
            return;
          }
        }


        if (workExperience.datesValid) {

          if (!workExperience.supervisingPharmacists.length || !workExperience.supervisingPharmacists[0]) {
            messages.push(`You haven’t selected a supervising pharmacist or pharmacy technician for your ${n} placement.`);
          }
        }

      }


      if (new Date(workExperience.startDate) < earliestSubmissionDate) {
        messages.push(`Your start date of the ${n} work experience must be after
        ${this.datePipe.transform(earliestSubmissionDate)}`);
      }


   if (new Date(workExperience.startDate) < earliestCombinedSubmissionDate) {
     messages.push(`Your start date of the ${n} work experience must be after
     ${this.datePipe.transform(earliestCombinedSubmissionDate)}`);
   }
 
    });


    this.validateDateRanges(messages);

    if (this.workExperiencesValid) {
      this.calculateWeeks(messages);
      this.calculateHoursWorked(messages);
    }

    this.validity$.next({
      valid: !messages.length,
      messages,
      touched: true
    });
  }


  calculateWeeks(messages) {
    const totalWeeks = (<TechnicianApplication>this.application).activeForm.getTrainingWeeks();
    let invalid = false;
    if (this.applicationTypeValue === ApplicationProcessType.TwoYears) {
      invalid = totalWeeks < 104;
      if (invalid) {
        messages.push('At least 104 weeks (2 years) of work experience must be completed in order to apply for registration.');
      }
    }
    this.weeksProgress = Object.assign({}, this.weeksProgress, { progress: totalWeeks, error: this.touched && invalid });
  }

  calculateHoursWorked(messages) {
    const totalHours = (<TechnicianApplication>this.application).activeForm.getHoursWorked();
    const totalWeeks = (<TechnicianApplication>this.application).activeForm.getTrainingWeeks();
    let invalid;
    if (this.workExperiences.length === 1 && this.applicationTypeValue === ApplicationProcessType.TwoYears) {
      invalid = (totalHours >= 1260 && totalWeeks === 52);
      // if (invalid) {
      //   messages.push('You cannot do a full 1260hr in one full year, please adjust your dates and times')
      //   messages.push('You are required to work between 315hr - 1260hr per year') // we will change this error message
      // }
    } else if (this.workExperiences.length === 1 && this.applicationTypeValue === ApplicationProcessType.LessThanTwoYears) {
      invalid = (totalHours <= 315 && totalWeeks >= 52);
      if (invalid) {
        messages.push('You cannot do a full 1260hr in one full year, please adjust your dates and times')
        messages.push('You are required to work between 315hr - 1260hr per year') // we will change this error message
      }
    }
    this.hoursProgress = Object.assign({}, this.hoursProgress, { progress: totalHours, error: this.touched && invalid });
  }

  validateDateRanges(messages) {
    if (this.workExperiences.length >= 2) {
      // return true;
      if (new Date(this.workExperiences[0].endDate) > new Date(this.workExperiences[1].startDate)) {
        messages.push('The start date of your second placement must be after the end date of your first placement');
        this.workExperiences[1].overlap$.next(true);
        return false;
      }
      this.workExperiences[1].overlap$.next(false);
      if (this.workExperiences.length === 2) {
        return true;
      }

      if (new Date(this.workExperiences[1].endDate) > new Date(this.workExperiences[2].startDate)) {
        messages.push('The start date of your third placement must be after the end date of your second placement');
        this.workExperiences[2].overlap$.next(true);
        return false;
      }
      this.workExperiences[2].overlap$.next(false);
    }
    return true;
  }


  populateForm() {}




  removePlacement(index) {
    if (this.workExperiences.length > 1) {
      this.workExperiences.splice(index, 1);
    }
    this.changed();
  }



  addWorkExperience() {
    const workExperience = new WorkExperience();
    this.workExperiences.push(workExperience);

    this.changed();
    this.touched = false;
  }

  get workExperiencesValid() {
    let valid = true;
    this.workExperiences.forEach(experience => {
      if (!experience.isValid) {
        valid = false;
      }
    });
    return valid;
  }

}
