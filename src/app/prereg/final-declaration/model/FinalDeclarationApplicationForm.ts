import { ApplicationStatus } from '../../model/ApplicationStatus';
import { FormAnswer } from '../../../dynamic/model/FormAnswer';
import { FileUpload } from '../../../shared/model/FileUpload';
import { ApplicationFormMode } from '../../model/ApplicationFormMode';
import { CountersignatureResult } from '../../model/CountersignatureResult';
import { RegistrantStatus } from '../../../registration/model/RegistrantStatus';
import { ApplicationForm } from '../../model/ApplicationForm';
import { FormScope } from '../../../registration/model/FormScope';
import { FinalDeclarationStep } from './FinalDeclarationStep';
import { AssessmentTutorDetails } from '../../assessment-report/models/AssessmentTutors';

export class FinalDeclarationApplicationForm implements ApplicationForm {
  declarations: { dynamicFormId: string; answers: FormAnswer[]; }[];

  id: string;
  formStatus: ApplicationStatus;
  attachments: Array<FileUpload> = [];
  isOverallDeclarationConfirmed: boolean;
  isTrainingConfirmed: boolean;
  isAssessmentConfirmed: boolean;
  isJointTutoringArrangmentExists: boolean;
  tutorDetails: Array<AssessmentTutorDetails>;
  confirmTempRegistration: boolean;

  step: FinalDeclarationStep;
  minStep: FinalDeclarationStep;
  mode: ApplicationFormMode;

  registrantStatus: RegistrantStatus;
  requirePayment: boolean;
  scope: FormScope;
  countersignatures: Array<CountersignatureResult>;

  traineeFullName: string;
  prgEntryNumber: number;
  trainingSiteName: string;
  trainingSiteAddress: string;
  tutorFullName: string;
  tutorGPhCId: string;
  trainingNoOfWeeks: number;

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



    if (this.formStatus === ApplicationStatus.ReadyForCountersigning ||
      this.formStatus === ApplicationStatus.CounterSigned) {
      this.step = FinalDeclarationStep.Countersigning;
      this.minStep = FinalDeclarationStep.Countersigning;
    }
    if (this.formStatus === ApplicationStatus.InProgress && this.step > FinalDeclarationStep.Countersigning) {
      this.step = FinalDeclarationStep.Countersigning;
    }

  }

  clearDeclarationSteps() {
    this.declarations = [];
  }

}
