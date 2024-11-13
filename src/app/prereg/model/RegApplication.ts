import { Applicant } from '../../account/model/Applicant';
import { ApplicationStatus } from './ApplicationStatus';
import { RegApplicationForm } from './RegApplicationForm';
import { Training } from './Training';
import { TraineeAssessment } from './TraineeAssessment';
import { Address } from '../../account/model/Address';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { CourseType } from '../../shared/model/student/CourseType';
import { Registrant } from '../../registration/model/Registrant';
import { Application } from './Application';
import { FormScope } from '../../registration/model/FormScope';
import { FinalTrainingReport } from './FinalTrainingReport';

const mockAssessments = [
  {
    sitting: 10,
    outcome: 'passed',
    session: '4'
  },
  {
    sitting: 200,
    outcome: 'failed',
    session: '2'
  },
  {
    sitting: 50,
    outcome: 'passed',
    session: '1'
  },
  {
    sitting: 30,
    outcome: 'failed',
    session: '3'
  },
];

export class RegApplication implements Application {
  form;
  trainee: Applicant;
  registrant?: Registrant; // populated by the api once application status = approved pending registration, used for notice of entry
  training: Training;
  assessment: {
    assessments: Array<TraineeAssessment>;
  };

  isFirstYearPaymentAvailable: boolean;

  forms: Array<RegApplicationForm> = [];
  status: ApplicationStatus;
  activeForm: RegApplicationForm;
  pastApplications: Array<RegApplicationForm>;

  registrationFees: {
    applicationFee: number;
    registrationFee: number;
  };

  registrationApplicationScheme: {
    isOpened: boolean,
    openingDate: string
  };
  //isProvisionalRegistered: boolean;
  thirteenWeekResult: number;
  finalTrainingResult = FinalTrainingReport;

  constructor(data, registrantStatus: RegistrantStatus) {


    Object.assign(this, data);
    if (this.forms && this.forms.length > 0) {
      if (!!this.forms[0].scope && this.forms[0].scope != FormScope.TechnicianApplicant) {
        this.training.trainedAt.forEach(placement => {
          placement.address = new Address(placement.address);
        });

        this.status = this.forms.length ? this.forms[0].formStatus : ApplicationStatus.NotStarted;
        this.activeForm = new RegApplicationForm(this.forms[0], registrantStatus);
        this.pastApplications = this.forms.filter((form, i) => {
          return i > 0;
        });

        this.trainee.isOspap = this.trainee.qualification.courseType === CourseType.OSPAP;
        // this.trainee.dateOfBirth = '2017-06-11T00:00:00';
      }
      else {

        this.status = this.forms.length ? this.forms[0].formStatus : ApplicationStatus.NotStarted;
        this.activeForm = new RegApplicationForm(this.forms[0], registrantStatus);
        this.pastApplications = this.forms.filter((form, i) => {
          return i > 0;
        });
      }

    }
  }

}
