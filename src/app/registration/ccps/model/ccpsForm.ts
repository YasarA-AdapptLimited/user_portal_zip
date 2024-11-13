import { EqualityDiversity } from "../../../../app/account/model/EqualityDiversity";
import { FormAnswer } from "../../../dynamic/model/FormAnswer";
import { ApplicationForm } from "../../../prereg/model/ApplicationForm";
import { ApplicationFormMode } from "../../../prereg/model/ApplicationFormMode";
import { ApplicationStatus } from "../../../prereg/model/ApplicationStatus";
import { FileUpload } from "../../../shared/model/FileUpload";
import { RegistrantStatus } from "../../model/RegistrantStatus";
import { CCPSApplicationStep } from "./ccpsApplicationStep";
import { InitialRegistrantQualificationDetail } from "./initialPharmacyQualificationDetail";
import { ProfessionalStandingDetail } from "./professionalStandingDetail";


export class CCPSForm implements ApplicationForm{
    id: string;
    formStatus: ApplicationStatus;
    declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }>;
    attachments: Array<FileUpload>;
    isOverallDeclarationConfirmed: boolean;

    step: CCPSApplicationStep;
    minStep: CCPSApplicationStep;
    mode: ApplicationFormMode;

    isOverallDeclarationAcknowledged: boolean;
    professionalStandingDetail:ProfessionalStandingDetail;
    initialRegistrantQualificationDetail: InitialRegistrantQualificationDetail;
    equalityDiversity: EqualityDiversity;
    appDeclaration: { isQ1Confirmed: boolean, isQ2Confirmed: boolean, isQ3Confirmed: boolean, isQ4Confirmed: boolean };
    //registrantStatus: RegistrantStatus;
    assessmentDetailsExists: boolean;
    qualificationDetailsExists: {
        courseExists: boolean,
        qualifiedExists: boolean,
        countryExists: boolean
    };
    trainingDetailsExists: boolean;
    get readonly() {
      return (this.formStatus === ApplicationStatus.NotStarted ||
        this.formStatus === ApplicationStatus.InProgress ||
        this.formStatus === ApplicationStatus.CounterSigned ||
        this.formStatus === ApplicationStatus.ReadyForCountersigning 
        //|| this.registrantStatus === RegistrantStatus.IneligibleToRegister
        );
    }
  

    constructor(data, registrantStatus) {
        if( data ) {
            Object.assign(this, data);
        }        
       // this.registrantStatus = registrantStatus;
    }
   
}
