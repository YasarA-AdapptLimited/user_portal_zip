import { EqualityDiversity } from "../../../account/model/EqualityDiversity";
import { FormAnswer } from "../../../dynamic/model/FormAnswer";
import { ApplicationForm } from "../../../prereg/model/ApplicationForm";
import { ApplicationFormMode } from "../../../prereg/model/ApplicationFormMode";
import { ApplicationStatus } from "../../../prereg/model/ApplicationStatus";
import { FileUpload } from "../../../shared/model/FileUpload";
import { FormScope } from "../../model/FormScope";
import { RegistrantStatus } from "../../model/RegistrantStatus";
import { IndependentPrescriberApplicationStep } from "./IndependentPrescriberApplicationStep";

export interface Countersignature{
  id: string,
  isMentorRegistered: boolean,
  prescriberMentorName: string,
  prescriberRegistrationNo: string,
  ukRegulatoryBody: string,
  registrationNumber: string,
  forenames: string,
  surname: string,
  countersignerGPhCId: string,
  decisionMadeAt: Date,
  decision: number,
  feedback: string
  }

export class IndependentPrescriberForm implements ApplicationForm{
    id: string;
    formStatus: ApplicationStatus;
    declarations: Array<{ dynamicFormId: string, answers: Array<FormAnswer> }>;
    attachments: Array<FileUpload>;
    clinicalSpecialities: string;
    scope: FormScope;
    indyPrescriberApplicationFee:number;
    countersignatures: Array<Countersignature>;
    isOverallDeclarationConfirmed: boolean;

    step: IndependentPrescriberApplicationStep;
    minStep: IndependentPrescriberApplicationStep;
    mode: ApplicationFormMode;

    declaration: {
        isQ1Confirmed: boolean;
        isQ2Confirmed: boolean;
        isQ3Confirmed: boolean;
        isQ4Confirmed: boolean;
        isQ5Confirmed: boolean;
      };
    registrantStatus: RegistrantStatus;
   equalityDiversity: EqualityDiversity;

    get readonly() {
      return !(this.formStatus === ApplicationStatus.NotStarted ||
        this.formStatus === ApplicationStatus.InProgress ||
        this.formStatus === ApplicationStatus.CounterSigned ||
        this.formStatus === ApplicationStatus.ReadyForCountersigning ||
        this.registrantStatus === RegistrantStatus.IneligibleToRegister);
    }
  

    constructor(data, registrantStatus) {
        if( data ) {
            Object.assign(this, data);
        }        
        this.registrantStatus = registrantStatus;

        if (this.formStatus === ApplicationStatus.ReadyForCountersigning ||
          (this.formStatus === ApplicationStatus.CounterSigned && this.countersignatures[0].isMentorRegistered === true)) {
          this.step = IndependentPrescriberApplicationStep.Countersigning;
          this.minStep = IndependentPrescriberApplicationStep.Countersigning;
        }
    }
   
}