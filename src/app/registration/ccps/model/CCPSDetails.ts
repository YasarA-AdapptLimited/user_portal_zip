import { QualificationType } from "../../../../app/technician/model/QualificationType";
import { ApplicationStatus } from "../../../prereg/model/ApplicationStatus";
import { AnnotationType } from "../../model/AnnotationType";
import { RegistrantType } from "../../model/RegistrantType";
import { CourseType } from "../../../../app/technician/model/CourseType";
import { LegacyRegistrationRoute, trainingSites } from "./initialPharmacyQualificationDetail";
import { RegistrantStatus } from "../../model/RegistrantStatus";

export interface RegistrationDetails {
  registrationNumber: number;
  registrationStatus: RegistrantStatus;
  independentPrescriberStatus: AnnotationType;
  voluntaryRemovalReason: string;
  registrationRoute: RegistrationRoute;
  contactType: RegistrantType;
  isRequiredEnglishCertificate: EnglishQualificationType;
  isRequiredRevalidationSubmission: boolean;
  eeaDirectiveRoute: string;
  legacyRegistrationRoute: LegacyRegistrationRoute;
}
export interface RegistrantPersonalDetails {
  title: Title;
  forenames: string;
  surname: string;
  middleName: string;
  dateOfBirth: Date;
  address: Address;
  contact: ContactDetails;
  registration: RegistrationDetails;
  assessmentName: string;
  otherRegulators: string;
}

export enum EnglishQualificationType {
  IELTS = 1,
  OET,
  EmployerReference,
}

export enum RegistrationRoute {
  UK = 717750000,
  UKPlusOverseas = 717750001,
  OSPAP = 717750002,
  EEA = 717750003,
  NorthernIreland = 717750004,
  Legacy = 717750005,
}

export interface Address {
  line1: string;
  line2: string;
  line3: string;
  town: string;
  county: string;
  postcode: string;
  country: string;
  homeNation: number;
  latitude: string;
  longitude: string;
  countryCode: string;
}

export interface ContactDetails {
  email: string;
  telephone1: string;
  mobilePhone: string;
}

export interface Qualification {
  id?: string;
  courseName: string;
  courseType: CourseType;
  country: string;
  dateAwarded?: Date;
  qualificationType?: QualificationType;
}

export interface Title {
  name: string;
  id: number;
}
