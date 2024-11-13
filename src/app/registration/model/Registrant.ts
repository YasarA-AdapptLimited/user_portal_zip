import { RegistrantType } from './RegistrantType';
import { RegistrantStatus } from './RegistrantStatus';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { RTREligibilityType } from './RTREligibilityType';

export class Registrant {
  registrationNumber: string;
  status: RegistrantStatus;
  type: RegistrantType;
  postalTown: string;
  prescriberStatuses: string;
  superIntendentPosition: { ownerName: string, startDate: string, endDate: string };
  superintendent = '';

  // for registrants who are both pharmacists and pharmacy technicians
  // this will be true when they sign into their pharmacy technician account
  // v1.0/registrant/revalidation will return null so should not be called
  exemptFromRevalidationSubmissions: boolean;

  title: string;
  forenames: string;
  surname: string;

  expiryDate: string;
  renewalDate: string;
  joinedDate: string;

  isRTRAppAvailable: RTREligibilityType;
  returnToRegisterFormStatus: ApplicationStatus;
  
  constructor(data) {
    Object.assign(this, data);

    if (this.superIntendentPosition && this.superIntendentPosition.ownerName) {
      this.superintendent =  this.superIntendentPosition.ownerName;
    }

  }

  toString() {
    return this.title +
      ' ' + this.forenames +
      ' ' + this.surname;
  }


}
