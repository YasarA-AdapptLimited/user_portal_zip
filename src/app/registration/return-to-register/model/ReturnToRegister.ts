import { Applicant } from '../../../account/model/Applicant';
import { ReturnToRegisterApplicationForm } from './ReturnToRegisterApplicationForm';
import { RegistrantStatus } from '../../model/RegistrantStatus';
import { Application } from '../../../prereg/model/Application';
import { ApplicationStatus } from '../../../prereg/model/ApplicationStatus';
import { RegistrantPersonalDetails } from './ReturnToRegisterDetails';

export class ReturnToRegisterApplication implements Application {
    trainee: Applicant;
    forms: ReturnToRegisterApplicationForm[];
    status: ApplicationStatus;
    activeForm: ReturnToRegisterApplicationForm;
    pastApplications: ReturnToRegisterApplicationForm[];
    form: ReturnToRegisterApplicationForm;
    personalDetails: RegistrantPersonalDetails;
    returnToRegisterApplicationFeeCode : string;
    returnToRegisterApplicationFeeAmount : number;    
    restorationToRegisterFeeCode:string;
    restorationToRegisterFeeAmount:number;    
    constructor(data, registrantStatus: RegistrantStatus) {
        Object.assign(this, data);
        this.activeForm = new ReturnToRegisterApplicationForm(this.form, registrantStatus);
    }
}