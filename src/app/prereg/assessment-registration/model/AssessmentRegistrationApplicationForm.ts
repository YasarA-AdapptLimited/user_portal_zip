import { ApplicationStatus } from '../../model/ApplicationStatus';
import { FormAnswer } from '../../../dynamic/model/FormAnswer';
import { FileUpload } from '../../../shared/model/FileUpload';
import { AssessmentRegistrationStep } from './AssessmentRegistrationStep';
import { ApplicationFormMode } from '../../model/ApplicationFormMode';
import { CountersignatureResult } from '../../model/CountersignatureResult';
import { RegistrantStatus } from '../../../registration/model/RegistrantStatus';
import { ApplicationForm } from '../../model/ApplicationForm';
import { FormScope } from '../../../registration/model/FormScope';
import { Applicant } from '../../../account/model/Applicant';
import { AssessmentTutorDetails } from '../../assessment-report/models/AssessmentTutors';
import { TraineeAssessment } from './TraineeAssessment';
import { Training } from '../../model/Training';

export class AssessmentRegistrationApplicationForm implements ApplicationForm {

  id: string;

  formStatus: ApplicationStatus;
  declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }>;
  attachments: Array<FileUpload> = [];
  isOverallDeclarationConfirmed: boolean;

  step: AssessmentRegistrationStep;
  minStep: AssessmentRegistrationStep;
  mode: ApplicationFormMode;
  registrantStatus: RegistrantStatus;
  requirePayment: boolean;
  scope: FormScope;
  trainee: Applicant;
  declaration: {
    isQ1Confirmed: boolean;
    isQ2Confirmed: boolean;
    isQ3Confirmed: boolean;
    isQ4Confirmed: boolean;
  };
  training: Training;
  tutorDetails: Array<AssessmentTutorDetails>;
  assessmentAttempts: Array<TraineeAssessment>;
  isTrainingConfirmed: boolean;
  isAssessmentConfirmed: boolean;

  get readonly() {
    return !(
      this.formStatus === ApplicationStatus.NotStarted ||
      this.formStatus === ApplicationStatus.InProgress ||
      this.registrantStatus === RegistrantStatus.IneligibleToRegister
    );
  }

  constructor(data, registrantStatus) {
    Object.assign(this, data);
    this.registrantStatus = registrantStatus;

    this.requirePayment = !data.isPaid;



  }
}