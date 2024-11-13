import { IContact } from './IContact';

export class Contact implements IContact {
  email: string;
  awaitingEmailConfirmation: boolean;
  mobilePhone: string;
  telephone1: string;
  telephone2: string;

  constructor(data) {
    Object.assign(this, data);
    if (!!this.email) {
      this.email = this.email.toLowerCase();
    }
  }

}
