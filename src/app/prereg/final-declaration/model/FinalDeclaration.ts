import { Applicant } from '../../../account/model/Applicant';
import { ApplicationStatus } from '../../model/ApplicationStatus';
import { Training } from '../../model/Training';
import { RegistrantStatus } from '../../../registration/model/RegistrantStatus';
import { Registrant } from '../../../registration/model/Registrant';
import { Application } from '../../model/Application';
import { FileUpload } from '../../../shared/model/FileUpload';
import { CountersignatureResult } from '../../model/CountersignatureResult';
import { AssessmentTutorDetails } from '../../assessment-report/models/AssessmentTutors';
import { FinalDeclarationApplicationForm } from './FinalDeclarationApplicationForm';


export class FinalDeclaration implements Application {

  trainee: Applicant;
  registrant?: Registrant;
  training: Training;
  tutorDetails: Array<AssessmentTutorDetails>;
  isFirstYearPaymentAvailable: boolean;
  attachments: Array<FileUpload> = [];

  form: FinalDeclarationApplicationForm;

  forms: Array<FinalDeclarationApplicationForm> = [];
  status: ApplicationStatus;
  activeForm: FinalDeclarationApplicationForm;
  pastApplications: Array<FinalDeclarationApplicationForm>;
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
    this.activeForm = new FinalDeclarationApplicationForm(this.forms[0], registrantStatus);
    this.pastApplications = this.forms.filter((form, i) => {
      return i > 0;
    });


  }



}
