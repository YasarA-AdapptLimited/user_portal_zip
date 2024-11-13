import { ApplicationStatus } from "../../prereg/model/ApplicationStatus";
import { CPSCFormDetails } from "./CPSCFormDetails";
export class ApplicationDetails {
    certOfProfStandingFormStatus: ApplicationStatus;
    indyPrescriberFormStatus: ApplicationStatus;
    isCPSCAppAvailable: boolean;
    isIndyPrescAppAvailable: boolean;
    isVRAppAvailable: boolean;
    voluntaryRemovalFormStatus: ApplicationStatus;
    cpscFormsDetails: CPSCFormDetails[];
}