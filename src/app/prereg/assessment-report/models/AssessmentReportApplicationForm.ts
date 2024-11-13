import { ApplicationStatus } from '../../model/ApplicationStatus';
import { FormAnswer } from '../../../dynamic/model/FormAnswer';
import { FileUpload } from '../../../shared/model/FileUpload';
import { AssessmentReportStep } from './AssessmentReportStep';
import { LetterOfGoodStanding } from '../../model/LetterOfGoodStanding';
import { ApplicationFormMode } from '../../model/ApplicationFormMode';
import { CountersignatureResult } from '../../model/CountersignatureResult';
import { RegistrantStatus } from '../../../registration/model/RegistrantStatus';
import { ApplicationForm } from '../../model/ApplicationForm';
import { FormScope } from '../../../registration/model/FormScope';
import { AssessmentTutorDetails } from './AssessmentTutors';

export class AssessmentReportApplicationForm implements ApplicationForm {
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

  step: AssessmentReportStep;
  minStep: AssessmentReportStep;
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


    // this.requirePayment = !data.isPaid;



    if (this.formStatus === ApplicationStatus.ReadyForCountersigning ||
      this.formStatus === ApplicationStatus.CounterSigned) {
      this.step = AssessmentReportStep.Countersigning;
      this.minStep = AssessmentReportStep.Countersigning;
    }
    if (this.formStatus === ApplicationStatus.InProgress && this.step > AssessmentReportStep.Countersigning) {
      this.step = AssessmentReportStep.Countersigning;
    }

  }


  clearDeclarationSteps() {
    this.declarations = [];
  }


}
