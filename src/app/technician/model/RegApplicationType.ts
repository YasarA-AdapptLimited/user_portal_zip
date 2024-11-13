import { PreviousRegistrationType } from './PreviousRegistrationType';

export interface RegistrantApplicationType {
    applied?: boolean;
    registrationNumber?: string;
    type?: PreviousRegistrationType;
    applicationDate?: string;
}

