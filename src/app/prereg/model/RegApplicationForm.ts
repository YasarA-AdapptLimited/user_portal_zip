import { ApplicationStatus } from './ApplicationStatus';
import { FormAnswer } from '../../dynamic/model/FormAnswer';
import { FileUpload } from '../../shared/model/FileUpload';
import { RegApplicationStep } from './RegApplicationStep';
import { LetterOfGoodStanding } from './LetterOfGoodStanding';
import { ApplicationFormMode } from './ApplicationFormMode';
import { CountersignatureResult } from './CountersignatureResult';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { ApplicationForm } from './ApplicationForm';
import { FormScope } from '../../registration/model/FormScope';

export class RegApplicationForm implements ApplicationForm {

  id: string;
  formStatus: ApplicationStatus;
  declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }>;
  attachments: Array<FileUpload> = [];
  isOverallDeclarationConfirmed: boolean;
  isTrainingConfirmed: boolean;
  isAssessmentConfirmed: boolean;

  letterOfGoodStanding: LetterOfGoodStanding;
  step: RegApplicationStep;
  minStep: RegApplicationStep;
  mode: ApplicationFormMode;

  registrantStatus: RegistrantStatus;

  requirePayment: boolean;
  scope: FormScope;
  countersignatures: Array<CountersignatureResult>;

  get readonly() {
    return !(this.formStatus === ApplicationStatus.NotStarted ||
      this.formStatus === ApplicationStatus.InProgress ||
      this.formStatus === ApplicationStatus.CounterSigned ||
      this.formStatus === ApplicationStatus.ReadyForCountersigning ||
      this.registrantStatus === RegistrantStatus.IneligibleToRegister);
  }

  constructor(data, registrantStatus) {
    Object.assign(this, data);
    this.registrantStatus = registrantStatus;

    if (!this.letterOfGoodStanding) {
      this.letterOfGoodStanding = {
        hasRegistered: undefined,
        isRequested: undefined,
        regulatoryBody: undefined,
        registrationNumber: undefined
      };
    }

    this.requirePayment = !data.isPaid;

    // where server returns null or empty string, convert to undefined
    if (this.letterOfGoodStanding.hasRegistered === null) {
      this.letterOfGoodStanding.hasRegistered = undefined;
    }
    if (this.letterOfGoodStanding.isRequested === null) {
      this.letterOfGoodStanding.isRequested = undefined;
    }
    if (this.letterOfGoodStanding.registrationNumber === null) {
      this.letterOfGoodStanding.registrationNumber = undefined;
    }
    if (this.letterOfGoodStanding.regulatoryBody === null) {
      this.letterOfGoodStanding.regulatoryBody = undefined;
    }

    if (this.formStatus === ApplicationStatus.ReadyForCountersigning ||
      this.formStatus === ApplicationStatus.CounterSigned) {
      this.step = RegApplicationStep.Countersigning;
      this.minStep = RegApplicationStep.Countersigning;
    }
    if (this.formStatus === ApplicationStatus.InProgress && this.step > RegApplicationStep.Countersigning) {
      this.step = RegApplicationStep.Countersigning;
    }

  }

}
