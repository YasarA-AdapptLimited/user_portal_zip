import { Address } from './Address';

export interface UnregisteredPremise {
    name: string;
    address: Address;
    id?;
    registrationNumber?;
    owner?;
    expiryDate?;
    accreditedTo?;
    eligibleAsTrainingSite?: boolean;
    premiseStatus?;
}