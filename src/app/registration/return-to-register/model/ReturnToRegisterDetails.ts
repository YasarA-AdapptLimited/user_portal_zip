import { Applicant } from '../../../account/model/Applicant';
import { ApplicationStatus } from '../../../prereg/model/ApplicationStatus';
import { AnnotationType } from '../../model/AnnotationType';
import { RegistrantType } from '../../model/RegistrantType';

export interface ReturnToRegisterDetails {
    confirmUserNameChange: boolean;
    title: { name: string, id: number };
    forenames: string;
    surname: string;
    middleName: string;
    oetCandidateNo: number;
    confirmAccessOETPortal: boolean;
    englishCertificateOption: EnglishQualificationType;
    hasConfirmedRevalidationSubmission: boolean;
}

export interface RegistrationDetails {
    registrationNumber: number;
    registrationStatus: ApplicationStatus;
    independentPrescriberStatus: AnnotationType;
    voluntaryRemovalReason: string;
    registrationRoute: RegistrationRoute
    contactType: RegistrantType;
    isRequiredEnglishCertificate: boolean;
    isRequiredRevalidationSubmission: boolean;
}

export interface RegistrantPersonalDetails {
    contactDetails: Applicant;
    registration: RegistrationDetails;
}

export enum EnglishQualificationType {
    IELTS = 1,
    OET,
    EmployerReference
}

export enum RegistrationRoute
{
    UK = 717750000,
    UKPlusOverseas = 717750001,
    OSPAP = 717750002,
    EEA = 717750003,
    NorthernIreland = 717750004,
    Legacy = 717750005
}