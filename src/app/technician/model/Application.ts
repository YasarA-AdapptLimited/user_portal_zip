import { Applicant } from '../../account/model/Applicant';
import { ApplicationStatus } from './ApplicationStatus';
import { ApplicationForm } from './ApplicationForm';

export interface Application {
  trainee: Applicant;
  forms: Array<ApplicationForm>;
  status: ApplicationStatus;
  activeForm: ApplicationForm;
  pastApplications: Array<ApplicationForm>;
}
