import { IAddress } from './IAddress';
import { IContact } from './IContact';
import { EqualityDiversity } from './EqualityDiversity';

export interface Applicant {
  title: { name: string, id: number };
  forenames: string;
  middleName: string;
  surname: string;
  address: IAddress;
  contact: IContact;
  dateOfBirth: string;
  qualification: { courseName: string, courseType: number };
  equalityDiversity: EqualityDiversity;
  preEntryNumber?: string;
  registrationDateLimit?: string;
  isOspap?: Boolean;
}
