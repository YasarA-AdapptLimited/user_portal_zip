import { Address } from './Address';
import { Contact } from './Contact';
import { Registrant } from '../../registration/model/Registrant';
import { Student } from '../../shared/model/student/Student';
import { RegistrantStatus } from '../../registration/model/RegistrantStatus';
import { UserPreference } from './UserPreference';
import { Technician } from '../../technician/model/Technician';
import { TrainingPlacement } from '../../prereg/model/TrainingPlacement';
import { PreregForm } from './PreregForm';


export class User {
  title: string;
  forenames: string;
  surname: string;
  middleName: string;
  status: string;
  preference: UserPreference;
  registrationStatus: RegistrantStatus;
  showAccountTab = true;
  dateOfBirth: string;
  contact: Contact;
  address: Address;
  registrant: Registrant;
  reviewer: boolean;
  student: Student;
  technician: Technician;
  roles: Array<string>;
  hasCheckedRegistration: boolean;
  training: TrainingPlacement;
  //prereg : Prereg;
  availableApplication: PreregForm;
  useNewWorldpayFlow: boolean;

  get isPrereg() {
    return this.roles && this.roles.indexOf('prereg') > -1;
  }
  get isStudent() {
    return this.roles && this.roles.indexOf('student') > -1;
  }
  get isTechnicianApplicant() {
    return this.roles && this.roles.indexOf('technician_applicant') > -1;
  }
  get isSandwichStudent() {
    return this.registrationStatus === RegistrantStatus.PreRegistrationTraineeS;
  }

  get isRegistrant() {
    return this.roles && this.roles.indexOf('registrant') > -1;
  }

  get isReviewer() {
    return this.roles && this.roles.indexOf('reviewer') > -1;
  }

  get isJustReviewer() {
    return this.isReviewer && !this.isRegistrant;
  }

  get showNoticeOfEntry() {
    if (this.isRegistrant) {
      const now = new Date();
      const joined = new Date(this.registrant.joinedDate);
      const joinedPlusOneYear = new Date(new Date(this.registrant.joinedDate)
        .setFullYear(joined.getFullYear() + 1));
      const golive = new Date('2018-04-01');
      return joined > golive && now < joinedPlusOneYear;
    }
    return false;
  }


  toJson() {
    return {
      name: this.title + ' ' + this.forenames + ' ' + this.surname
    };
  }
  // user.roles = ['prereg'];
  // delete user.registrant;
  constructor(user) {
    if (!user.title) {
      user.title = '';
    }
    Object.assign(this, user);
    this.address = new Address(user.address);
    this.contact = new Contact(user.contact);

    if (this.isStudent) {
      this.showAccountTab = false;
    }

    if (this.isRegistrant) {
      this.registrant = new Registrant(user.registrant);
      this.registrant.title = user.title;
      this.registrant.forenames = user.forenames;
      this.registrant.surname = user.surname;
      this.registrant.status = this.registrationStatus;
      this.registrant.postalTown = this.address.town;
    }
    if (this.isTechnicianApplicant) {
      this.technician = new Technician(user.registrant);
      this.technician.title = user.title;
      this.technician.forenames = user.forenames;
      this.technician.surname = user.surname;
      this.technician.status = this.registrationStatus;
      this.technician.postalTown = this.address.town;
    }
    if (this.isReviewer) {
      this.reviewer = true;
    }
  }

  toString() {
    return this.title +
      ' ' + this.forenames +
      ' ' + this.surname;
  }

  preferencesNotSet() {
    return !this.preference || !this.preference.comms ||
      (this.preference.comms.essentialEmails === null || this.preference.comms.essentialEmails === undefined ||
        this.preference.comms.essentialTexts === null || this.preference.comms.essentialTexts === undefined);
  }

  get showReceipts() {
    return this.isRegistrant || this.isPrereg || this.isStudent || this.isTechnicianApplicant;
  }
}
