import { Application } from '../../../prereg/model/Application';
import { ApplicationStatus } from '../../../prereg/model/ApplicationStatus';
import { ApplicationForm } from '../../../prereg/model/ApplicationForm';
import { Applicant } from '../../../account/model/Applicant';
import { RegistrantStatus } from '../../model/RegistrantStatus';
import { Input } from '@angular/core';
import { VoluntaryRemovalApplicationForm } from './VoluntaryRemovalApplicationForm';
import { CollectionMethod } from '../../../payment/model/CollectionMethod';

export class VoluntaryRemovalApplication implements Application {
    trainee: Applicant;

  forms: Array<VoluntaryRemovalApplicationForm> = [];
  status: ApplicationStatus;
  activeForm: VoluntaryRemovalApplicationForm;
  pastApplications: Array<VoluntaryRemovalApplicationForm>;
  form: VoluntaryRemovalApplicationForm;
  pendingFee: number;
  outstandingPayments: Array<{paymentDescription: string, collectionMethod: CollectionMethod,
    paymentDate: Date, paymentAmount: number }>;

    constructor(data, registrantStatus: RegistrantStatus) {
        Object.assign(this, data);
        this.activeForm = new VoluntaryRemovalApplicationForm(this.form, registrantStatus);
    }
}
