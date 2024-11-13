import { Applicant } from '../../../account/model/Applicant';
import { ApplicationStatus } from '../../model/ApplicationStatus';
import { AssessmentReportApplicationForm } from './AssessmentReportApplicationForm';
import { Training } from '../../model/Training';
import { RegistrantStatus } from '../../../registration/model/RegistrantStatus';
import { Registrant } from '../../../registration/model/Registrant';
import { Application } from '../../model/Application';
import { FileUpload } from '../../../shared/model/FileUpload';
import { AssessmentTutorDetails } from './AssessmentTutors';
import { CountersignatureResult } from '../../model/CountersignatureResult';


export class AssessmentReport implements Application {

  trainee: Applicant;
  registrant?: Registrant; // populated by the api once application status = approved pending registration, used for notice of entry
  training: Training;
  tutorDetails: Array<AssessmentTutorDetails>;
  isFirstYearPaymentAvailable: boolean;
  attachments: Array<FileUpload> = [];

  form: AssessmentReportApplicationForm;

  forms: Array<AssessmentReportApplicationForm> = [];
  status: ApplicationStatus;
  activeForm: AssessmentReportApplicationForm;
  pastApplications: Array<AssessmentReportApplicationForm>;
  countersignatures: Array<CountersignatureResult>;

  registrationFees: {
    applicationFee: number;
    registrationFee: number;
  };
  isOpen: boolean;
  thirtyNineWeekReportResult: string;


  constructor(data, registrantStatus: RegistrantStatus) {
    Object.assign(this, data);
    this.status = this.forms.length ? this.forms[0].formStatus : ApplicationStatus.NotStarted;
    this.activeForm = new AssessmentReportApplicationForm(this.forms[0], registrantStatus);
    this.pastApplications = this.forms.filter((form, i) => {
      return i > 0;
    });


  }



}
