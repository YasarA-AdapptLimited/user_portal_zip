import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { FormAnswer } from '../../dynamic/model/FormAnswer';
import { FileUpload } from '../../shared/model/FileUpload';
import { TechnicianApplicationStep } from './TechnicianApplicationStep';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { ApplicationFormMode } from '../../prereg/model/ApplicationFormMode';
import { ApplicationForm } from '../../prereg/model/ApplicationForm';
import { ApplicationProcessType } from './ApplicationProcessType';
import { EducationDetails } from './EducationDetails';
import { WorkExperience } from './WorkExperience';

import { PreviousApplicationsAndRegistrations } from './PreviousApplicationsAndRegistrations';
import { AttachmentType } from '../../shared/model/AttachmentType';

export class TechnicianApplicationForm implements ApplicationForm {

  id: string;
  formStatus: ApplicationStatus;
  declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }> = [];
  attachments: Array<FileUpload> = [];
  isOverallDeclarationConfirmed: boolean;
  applicationType: ApplicationProcessType;
  educationDetails: EducationDetails;

  workExperiences: Array<WorkExperience> = [new WorkExperience()];
  previousApplicationsAndRegistrations: PreviousApplicationsAndRegistrations;

  isSupportingDocumentsForwardedConfirmed: boolean;

  step: TechnicianApplicationStep;
  minStep: TechnicianApplicationStep;
  mode: ApplicationFormMode;
  registrantStatus: RegistrantStatus;
  requirePayment: boolean;

  getTrainingWeeks() {
    let totalWeeks = 0;
    this.workExperiences.forEach(experience => {
      if (experience.endDate && experience.startDate) {
        const ms = new Date(experience.endDate).getTime() - new Date(experience.startDate).getTime();
        const weeks = ms / 1000 / 60 / 60 / 24 / 7;
        totalWeeks += weeks;
      }
    });
    return Math.round(totalWeeks);
  }

  getHoursWorked() {
    let totalHours = 0;
    const totalWeeks = this.getTrainingWeeks();
    this.workExperiences.forEach(experience => {
      totalHours += experience.workedHoursPerWeek;
    });
    totalHours = (totalHours / this.workExperiences.length) * totalWeeks;
    return Math.round(totalHours);
  }

  get readonly() {
    return !(this.formStatus === ApplicationStatus.NotStarted ||
      this.formStatus === ApplicationStatus.InProgress ||
      this.formStatus === ApplicationStatus.CounterSigned ||
      this.formStatus === ApplicationStatus.ReadyForCountersigning ||
      this.registrantStatus === RegistrantStatus.IneligibleToRegister);
  }


  constructor(data, registrantStatus) {
    if (data) {
      const hasWorkExperiences = !!data.workExperiences.length;
      if (hasWorkExperiences) {
        data.workExperiences = data.workExperiences.map(experience => new WorkExperience(experience));
      }
      Object.assign(this, data);
    } else {
      this.workExperiences = [new WorkExperience()];
      this.declarations = [];
    }

    this.registrantStatus = registrantStatus;

    if (this.formStatus === ApplicationStatus.ReadyForCountersigning ||
      this.formStatus === ApplicationStatus.CounterSigned) {
      this.step = TechnicianApplicationStep.Countersigning;
      this.minStep = TechnicianApplicationStep.Countersigning;
    }

    if (this.formStatus === ApplicationStatus.InProgress && this.step > TechnicianApplicationStep.Countersigning) {
      this.step = TechnicianApplicationStep.Countersigning;
    }


  }

  clearWorkExperience() {
    this.workExperiences = [];
  }

  clearAttachments() {
    this.attachments = [];
  }

  clearQualificationDocs() {
    if (this.attachments.length) {
      if (this.educationDetails.combined.qualificationId !== null) {
        this.attachments = this.attachments.filter(
          this.removeTechnicianApplicationCombinedQualificationDocs);
      } else if (this.educationDetails.combined.qualificationId === null) {
        this.attachments = this.attachments.filter(
          this.removeTechnicianApplicationKnowledgeCOmpetencyQualificationDocs);
      }
    }
  }

  removeTechnicianApplicationCombinedQualificationDocs(element, index, array) {
    return element.type !== AttachmentType.CombinedQualification;
  }

  removeTechnicianApplicationKnowledgeCOmpetencyQualificationDocs(element, index, array) {
    return (element.type !== AttachmentType.KnowledgeBasedQualification && element.type !== AttachmentType.CompetencyBasedQualification);
  }

  clearPreviousApplicationAndRegistrations() {
    for (const prop in this.previousApplicationsAndRegistrations) {
      if (prop === 'ukRegistration' || prop === 'outsideUKRegistration') {
        for (const appProp in this.previousApplicationsAndRegistrations[prop]) {
          this.previousApplicationsAndRegistrations[prop][appProp] = null;
        }
      }
    }

    for (const prop in this.previousApplicationsAndRegistrations.applications.preRegistrationTraining) {
      this.previousApplicationsAndRegistrations.applications.preRegistrationTraining[prop] = null;
    }

    for (const prop in this.previousApplicationsAndRegistrations.applications.registration) {
      this.previousApplicationsAndRegistrations.applications.registration[prop] = null;
    }

    this.isSupportingDocumentsForwardedConfirmed = null;

  }

  clearStepsDependentOnApplicationType() {
    this.clearWorkExperience();
    this.clearAttachments();
    this.clearPreviousApplicationAndRegistrations();
  }

  clearQualificationAttachments() {
    this.clearQualificationDocs();
  }



}
