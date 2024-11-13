import { Applicant } from '../../../account/model/Applicant';
import { ApplicationStatus } from '../../model/ApplicationStatus';
import { AssessmentRegistrationApplicationForm } from './AssessmentRegistrationApplicationForm';
import { Training } from '../../model/Training';
import { TraineeAssessment } from '../../model/TraineeAssessment';
import { Address } from '../../../account/model/Address';
import { RegistrantStatus } from '../../../registration/model/RegistrantStatus';
import { CourseType } from '../../../shared/model/student/CourseType';
import { Registrant } from '../../../registration/model/Registrant';
import { Application } from '../../model/Application';
import { FormScope } from '../../../registration/model/FormScope';
import { TrainingPlacement } from '../../model/TrainingPlacement';
import { FileUpload } from '../../../shared/model/FileUpload';
import { AssessmentTutorDetails } from '../../assessment-report/models/AssessmentTutors';

export class AssessmentRegistration implements Application {
  trainee: Applicant;
  registrant?: Registrant; // populated by the api once application status = approved pending registration, used for notice of entry
  activeAssessment: string;
  forms: Array<AssessmentRegistrationApplicationForm> = [];
  status: ApplicationStatus;
  activeForm: AssessmentRegistrationApplicationForm;
  pastApplications: Array<AssessmentRegistrationApplicationForm>;

  training: Training;
  tutorDetails: Array<AssessmentTutorDetails>;
  assessmentAttempts: Array<TraineeAssessment>;

  declaration: {
    isQ1Confirmed: boolean;
    isQ2Confirmed: boolean;
    isQ3Confirmed: boolean;
    isQ4Confirmed: boolean;
  };

  registrationFees: {
    applicationFee: number;
    registrationFee: number;
  };

  form;
  assessmentRegistrationDeadlineDate: string;

  registrationApplicationScheme: {
    isOpened: boolean,
    openingDate: string
  };
  isOpen;

  constructor(data, registrantStatus: RegistrantStatus) {
    Object.assign(this, data);
    if (this.forms && this.forms.length > 0) {
      if (!!this.forms[0].scope && this.forms[0].scope != FormScope.TechnicianApplicant) {

        this.status = this.forms.length ? this.forms[0].formStatus : ApplicationStatus.NotStarted;
        this.activeForm = new AssessmentRegistrationApplicationForm(this.forms[0], registrantStatus);
        this.pastApplications = this.forms.filter((form, i) => {
          return i > 0;
        });
      }
      else {
        this.status = this.forms.length ? this.forms[0].formStatus : ApplicationStatus.NotStarted;
        this.activeForm = new AssessmentRegistrationApplicationForm(this.forms[0], registrantStatus);
        this.pastApplications = this.forms.filter((form, i) => {
          return i > 0;
        });
      }
    }
  }
}
