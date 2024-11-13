import { Applicant } from "../../../account/model/Applicant";
import { ApplicationStatus } from "../../../prereg/model/ApplicationStatus";
import { Application } from "../../../prereg/model/Application";
import { RegistrantStatus } from "../../model/RegistrantStatus";
import { CCPSForm } from "./ccpsForm";
import { RegulatoryBodies } from "./regulatoryBodies";
import { RegistrantPersonalDetails } from "./CCPSDetails";
import { LegacyRegistrationRoute } from "./initialPharmacyQualificationDetail";

export class CCPSApplication implements Application {
    trainee: Applicant;
    status: ApplicationStatus;
    form: CCPSForm;
    pastApplications : CCPSForm[];
    activeForm: CCPSForm;
    forms:CCPSForm[];
    countries;
    regulatoryBodies:RegulatoryBodies[];
    personalDetails: RegistrantPersonalDetails;
    certProfessionalStandingApplicationFee: number;
    LegacyRegistrationRoute: string;

    constructor(data, registrantStatus: RegistrantStatus) {
        Object.assign(this, data);
        this.activeForm = new CCPSForm(this.form, registrantStatus);
    }
}
