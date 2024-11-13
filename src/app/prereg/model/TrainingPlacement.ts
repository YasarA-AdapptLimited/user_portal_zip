import { IAddress } from '../../account/model/IAddress';
import { Address } from '../../account/model/Address';

export interface TrainingPlacement {
  trainingSite: string;
  startDate: string;
  endDate: string;
  address: Address;
 }
