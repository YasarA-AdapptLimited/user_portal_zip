import { ApplicationForm } from '../../../technician/model/ApplicationForm';
import { EqualityDiversity } from '../../../account/model/EqualityDiversity';
import { ApplicationFormMode } from '../../../technician/model/ApplicationFormMode';
import { ApplicationStatus } from '../../../technician/model/ApplicationStatus';
import { VoluntaryRemovalApplicationStep } from './VoluntaryRemovalApplicationStep';
import { FormAnswer } from '../../../dynamic/model/FormAnswer';
import { FileUpload } from '../../../shared/model/FileUpload';
import { RegistrantStatus } from '../../model/RegistrantStatus';
import { VoluntaryRemovalDetails } from './VoluntaryRemovalDetails';

export class VoluntaryRemovalApplicationForm implements ApplicationForm {
    id: string;
    formStatus: ApplicationStatus;
    declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }>;
    attachments: Array<FileUpload> = [];
    isOverallDeclarationConfirmed: boolean;
    step: VoluntaryRemovalApplicationStep;
    minStep: VoluntaryRemovalApplicationStep;
    mode: ApplicationFormMode;

    equalityDiversity: EqualityDiversity;

    applicationFees: number;
    feeDescription: string;
    collectionMethod: string;
    dueDate: Date;
    amount: number;
    outStandingFee: number;
    ftpDeclarations:  Array<{ dynamicFormId: string, answers: Array<FormAnswer> }>;
    appDeclaration: { isQ1Confirmed: boolean, isQ2Confirmed: boolean };

    voluntaryRemovalDetails: VoluntaryRemovalDetails;

    constructor(data, registrantStatus: RegistrantStatus) {
        if (data) {
            Object.assign(this, data);
        }
    }

    clearApplicationDeclarations() {
        let obj = Object.keys(this.appDeclaration).forEach((i) => this.appDeclaration[i] = null);
        return obj;
      }

}


