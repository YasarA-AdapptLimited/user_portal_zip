import { ApplicationStatus } from '../../../prereg/model/ApplicationStatus';
import { FormAnswer } from '../../../dynamic/model/FormAnswer';
import { FileUpload } from '../FileUpload';
import { PreregApplicationStep } from './PreregApplicationStep';
import { RegistrantStatus } from '../../../registration/model/RegistrantStatus';
import { ApplicationFormMode } from '../../../prereg/model/ApplicationFormMode';
import { Placement } from './Placement';
import { ApplicationForm } from '../../../prereg/model/ApplicationForm';
import { TrainingScheme } from './TrainingScheme';

export class PreregApplicationForm implements ApplicationForm {

  id: string;
  formStatus: ApplicationStatus;
  declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }> = [];
  attachments: Array<FileUpload> = [];
  isOverallDeclarationConfirmed: boolean;

  placements: Array<Placement> = [new Placement()];
  trainingScheme: TrainingScheme = {};

  step: PreregApplicationStep;
  minStep: PreregApplicationStep;
  mode: ApplicationFormMode;
  registrantStatus: RegistrantStatus;
  requirePayment: boolean;

  getTrainingWeeks() {
    let totalWeeks = 0;
    this.placements.forEach(placement => {
      if (placement.endDate && placement.startDate) {
        const ms = new Date(placement.endDate).getTime() - new Date(placement.startDate).getTime();
        const weeks = ms / 1000 / 60 / 60 / 24 / 7;
        totalWeeks += weeks;
      }
    });

    return Math.round(totalWeeks);
  }

  getTrainingDays() {
    let totalDays = 0;
    this.placements.forEach(placement => {
      if (placement.endDate && placement.startDate) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const endDate = new Date(placement.endDate);
        const startDate = new Date(placement.startDate);
        // Convert dates to UTC so that the days difference will come same irespective of timezone date is selcted
        const startDateUtc = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateUtc = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        // Day difference calculation
        var days_difference = ((endDateUtc - startDateUtc) / _MS_PER_DAY);
        // Add 1 to day difference to make the
        days_difference +=1 ;
        // total days after placement
        totalDays += days_difference;
      }
    });
    return totalDays;
  }

  get readonly() {
    return !(this.formStatus === ApplicationStatus.NotStarted ||
      this.formStatus === ApplicationStatus.InProgress);
  }

  constructor(data, registrantStatus) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.trainingScheme = {};
      this.placements = [new Placement()];
      this.declarations = [];
    }

    this.registrantStatus = registrantStatus;
  }



}
