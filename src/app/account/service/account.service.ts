import { Injectable } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { LogService } from '../../core/service/log.service';
import { Observable } from 'rxjs/internal/Observable';
import { Contact } from '../model/Contact';
import { Address } from '../model/Address';
import { UserPreference } from '../model/UserPreference';
import { CustomErrorHandler } from '../../core/service/CustomErrorHandler';
import { RegistrantActivation } from '../activation/model/RegistrantActivation';
import { StudentActivation } from '../activation/model/StudentActivation';
import { Notification } from '../model/Notification';
import { NotificationType } from '../model/NotificationType';
import { BehaviorSubject } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { PreregActivation } from '../activation/model/PreregActivation';
import { ServiceBase } from '../../core/service/service.base';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountService extends ServiceBase {

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  countries;
  salutations;
  ediOptions;
  notificationCount$ = new BehaviorSubject(0);
  startedCheckingNotificationCount = false;

  getCountries(): Observable<any> {
    if (this.countries) {
      return observableOf(this.countries);
    } else {
      return super.get('v1.0/lookup/countries').pipe(tap(result => {
        this.countries = result;
      }));
    }
  }

  getSalutations(): Observable<any> {
    if (this.salutations) {
      return observableOf(this.salutations);
    } else {
      return super.getFile('./assets/salutations.json').pipe(tap(result => {
        this.salutations = result;
      }));
    }
  }

  getEdiOptions() {
    if (this.ediOptions) {
      return observableOf(this.ediOptions);
    } else {
      return this.get('v1.0/equalitydiversity').pipe(tap(result => {
        this.ediOptions = result;
      }));
    }
  }

  getMockNotifications(): any  {
    const createNotification = (type: NotificationType) => {
      return {
        id: 'kingkong',
        type,
        priority: 1,
        sender: 'gphc',
        submissionDeadline: new Date(),
        title: 'Gaius Julius Caesar',
        data: {
          firstName: 'Fareeha',
          ReferenceNumber: 78,
          SubmittedAt: '2018-07-23T13:10:29.517',
          id: '93b30eb9-8760-4e41-9044-09c57bcaf52e',
        },
        time: new Date(),
        deactivatedAt: 'some time',
        deactivateManually: false,
        content: 'Hello'
      };
    };
    const notifications = [];

    // for testing new renewalRevalidationNotifications
    for (let i = 80; i <= 100; i++ ) {
      notifications.push(createNotification(i));
    }

/*
    const keys = new KeysPipe();
    const value = keys.transform(NotificationType, []);
    value.forEach((element: any) => {
      console.log(element.value);
      notifications.push(createNotification(NotificationType[<string>element.value]));
    });*/

    return observableOf(notifications);
  }

  getNotifications(skip = 0, pageSize = 5, props = {}): Observable<Array<Notification>> {
    // return this.getMockNotifications();
    return this.get(`v1.0/registrant/notifications?skip=${skip}&take=${pageSize}`, null, props);
  }

  hasCheckedRegistrationDetails() {
    return this.post('v1.0/registrant/?hasCheckedRegistration=true', {});
  }

  updateNotificationCount() {
    return this.get(`v1.0/registrant/notifications/unreadcount`)
    .pipe(tap(count => { setTimeout(() => { this.notificationCount$.next(count); }); } ));
  }

  startCheckingNotificationCount() {
    if (this.startedCheckingNotificationCount) {
      return;
    }
    this.startedCheckingNotificationCount = true;
    this.updateNotificationCount().subscribe(() => {
      setTimeout(this.updateNotificationCount.bind(this), 30000);
    });
  }

  markNotificationHandled(id) {
    return this.post(`v1.0/registrant/notifications/${id}/deactivate`, null);
  }

  createTestNotification() {
    return this.get(`v1.0/registrant/notifications/create`);
  }

  saveContact(contact: Contact) {
    if (contact.mobilePhone) {
      contact.mobilePhone = contact.mobilePhone.trim();
    }
    if (contact.telephone1) {
      contact.telephone1 = contact.telephone1.trim();
    }
    if (contact.telephone2) {
      contact.telephone2 = contact.telephone2.trim();
    }
    return super.put('v1.0/user/contact', contact);
  }

  savePreference(preference: UserPreference) {
    return super.put('v1.0/user/preferences', preference);
  }

  saveAddress(address: Address) {
    return super.put('v1.0/user/address', address);
  }

  requestEmailUpdate(email: string) {
    return super.put('v1.0/user/email', { email });
  }

  verifyRegistrationNumber(registrationNumber: string) {
    return super.get(`v1.0/linkaccount/name?linkId=${registrationNumber}`);
  }

  activateRegistration(activation: RegistrantActivation) {
    const payload = {
      linkId: activation.registrationNumber,
      dateOfBirth: activation.dob,
      postcode: activation.postcode,
      activationCode: activation.activationCode
    };
    return super.post(`v1.0/linkaccount/registrant`, payload);
  }

  activatePrereg(activation: PreregActivation) {
    const payload = {
      lastname: activation.lastname,
      dateOfBirth: activation.dob,
      qualificationId: activation.qualificationId
    };
    return super.post(`v1.0/linkaccount/prereg`, payload);
  }

  activateStudent(activation: StudentActivation) {
    const payload = {
      lastname: activation.lastname,
      dateOfBirth: activation.dob,
      qualificationId: activation.qualificationId
    };
    return super.post(`v1.0/linkaccount/student`, payload);
  }

  verifyStudent(activation){
    return super.get(`v1.0/linkaccount/student/verify?Lastname=${activation.lastname}&DateOfBirth=${activation.dob}&QualificationId=${activation.qualificationId}`);
  }

  verifyPrereg(activation) {
    return super.get(`v1.0/linkaccount/prereg/verify?Lastname=${activation.lastname}&DateOfBirth=${activation.dob}&QualificationId=${activation.qualificationId}`);
  }

  searchAddress(countryCode: string, postcode: string): Observable<Array<any>> {
    return super.get('v1.1/address/search', { countryCode, postcode });
  }

  getAddress(id: string) {
    return super.get('v1.0/address/details', { id })
      .pipe(map(data => {
        if (data.length) {
          const address = new Address(data[0]);
          return address;
        } else {
          return null;
        }
      }));
  }


}
