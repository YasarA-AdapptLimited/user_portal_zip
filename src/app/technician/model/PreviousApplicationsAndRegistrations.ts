import { RegistrantApplicationType } from './RegApplicationType';
import {  PreRegistrationApplicationType } from './PreRegApplicationType';
import { PreviousRegistrations } from './PreviousRegs';

export interface PreviousApplicationsAndRegistrations {
    applications?: {
        registration: RegistrantApplicationType;
        preRegistrationTraining: PreRegistrationApplicationType;
    };
    ukRegistration?: PreviousRegistrations;
    outsideUKRegistration?: PreviousRegistrations;
}