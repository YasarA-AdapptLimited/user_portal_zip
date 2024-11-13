import { Injectable } from '@angular/core';
import { User } from '../../account/model/User';
import { Route, Router } from '@angular/router';

@Injectable()
export class MockAuthService {

  user: User;
  constructor(private router: Router) {
    this.user = new User({
      title: 'Mrs',
      forenames: 'Lisa',
      surname: 'Karlsson',
      address: { line1: 'Flat 61', line2: '59 Peckham Grove', line3: null, town: 'London', county: null },
      contact: { email: 'christer@contractingcoder.com', telephone1: '+44 7455 697681', telephone2: null },
      preference: { comms: { email: true, text: true } },
      registrant: { registrationNumber: '-1', prescriberStatuses: 'Independent' },
      registrationStatus: 717750006,
      roles: ['renewer', 'registrant', 'tester']
    });
  }

  public checkLoggedInState() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  public redirect() { }
}
