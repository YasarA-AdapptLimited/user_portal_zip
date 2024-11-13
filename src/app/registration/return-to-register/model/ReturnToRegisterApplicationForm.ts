
import { FormAnswer } from '../../../dynamic/model/FormAnswer';
import { FileUpload } from '../../../shared/model/FileUpload';
import { ReturnToRegisterStep } from './ReturnToRegisterStep';
import { RegistrantStatus } from '../../model/RegistrantStatus';
import { FormScope } from '../../model/FormScope';
import { ApplicationForm } from '../../../prereg/model/ApplicationForm';
import { ApplicationStatus } from '../../../prereg/model/ApplicationStatus';
import { ApplicationFormMode } from '../../../prereg/model/ApplicationFormMode';
import { ReturnToRegisterDetails } from './ReturnToRegisterDetails';
import { EqualityDiversity } from '../../../account/model/EqualityDiversity';
import { LetterOfGoodStanding } from '../../../prereg/model/LetterOfGoodStanding';

export class ReturnToRegisterApplicationForm implements ApplicationForm {

    isOverallDeclarationConfirmed: boolean;
    minStep: ReturnToRegisterStep;
    mode: ApplicationFormMode;
    isOverallDeclarationAcknowledged: boolean;
    // latest get endpoint changes
    isRestorationFeePaymentAvailable:boolean;
    id: string;
    formStatus: ApplicationStatus;
    step: ReturnToRegisterStep;
    scope: FormScope;
    returnToRegisterDetail: ReturnToRegisterDetails;
    equalityDiversity: EqualityDiversity;
    declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }>;
    attachments: Array<FileUpload> = [];
    appDeclaration: { isQ1Confirmed: boolean, isQ2Confirmed: boolean, isQ3Confirmed: boolean };
    countersignatures: Array<any> = [];
    letterOfGoodStanding: LetterOfGoodStanding;
    restorationDeclarations:any[];
    ftpDeclarations;

    get readonly() {
      return (
        this.formStatus === ApplicationStatus.Submitted ||
        this.formStatus === ApplicationStatus.PendingProcessing ||
        this.formStatus === ApplicationStatus.ApprovedPendingRestorationFee ||
        this.formStatus === ApplicationStatus.Approved ||
        this.formStatus === ApplicationStatus.RestorationFeePaidPendingApproval      
      );
    }

    constructor(data, registrantStatus) {
      Object.assign(this, data);
    }
}
