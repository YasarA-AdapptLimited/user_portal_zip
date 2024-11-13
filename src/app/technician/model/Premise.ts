import { Address } from '../../account/model/Address';

export interface Premise {
  id;
  registrationNumber;
  name;
  owner;
  address?: Address;
  expiryDate;
  accreditedTo;
  eligibleAsTrainingSite: boolean;
  premiseStatus;
}
