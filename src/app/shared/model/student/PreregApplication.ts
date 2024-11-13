import { Applicant } from '../../../account/model/Applicant';
import { ApplicationStatus } from '../../../prereg/model/ApplicationStatus';
import { PreregApplicationForm } from './PreregApplicationForm';
import { RegistrantStatus } from '../../../registration/model/RegistrantStatus';
import { Application } from '../../../prereg/model/Application';
import { AssessmentReport } from '../../../prereg/assessment-report/models/AssessmentReport';

export class PreregApplication implements Application {

  trainee: Applicant; // student
form;
  forms: Array<PreregApplicationForm> = [];
  status: ApplicationStatus;
  activeForm: PreregApplicationForm;
  pastApplications: Array<PreregApplicationForm> = [];

  registrationFees: {
    applicationFee: number;
    registrationFee: number;
  };

  preRegistrationApplicationScheme: {
    isOpened: boolean;
    startDateForCurrentYear: string;
    endDateForCurrentYear: string;
  };

  constructor(data, registrantStatus: RegistrantStatus) {

    Object.assign(this, data);

    this.status = this.forms[0].formStatus;
    this.activeForm = new PreregApplicationForm(this.forms[0], registrantStatus);
    this.pastApplications = this.forms.filter((form, i) => {
      return i > 0;
    });

/*
    this.preRegistrationApplicationScheme = {
      isOpened: false,
      startDateForCurrentYear: '4/1/2019',
      endDateForCurrentYear: '11/8/2019'
    };
    */
  }

}
