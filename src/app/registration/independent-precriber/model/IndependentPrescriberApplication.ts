import { Application } from "../../../prereg/model/Application";
import { ApplicationStatus } from "../../../prereg/model/ApplicationStatus";
import { Applicant } from "../../../account/model/Applicant";
import { RegistrantStatus } from "../../model/RegistrantStatus";
import { Registrant } from "../../model/Registrant";
import { IndependentPrescriberForm } from './IndependentPrescriberForm';

export class IndependentPrescriberApplication implements Application {
  trainee: Applicant;
  activeForm: IndependentPrescriberForm;
  status: ApplicationStatus;
  forms: Array<IndependentPrescriberForm> = [];
  form: IndependentPrescriberForm;
  pastApplications = [];
  registrant: Registrant;
  clinicalSpecialities: string;
  courseTitle: string;
  dateAwarded: Date;
  indyPrescriberApplicationFee: number;

  constructor(data, registrantStatus: RegistrantStatus) {
    Object.assign(this, data);
    this.status = this.form.formStatus;
    this.activeForm = new IndependentPrescriberForm(this.form, registrantStatus);
    this.pastApplications = this.forms.filter((form, i) => {
      return i > 0;
    });
  }
}