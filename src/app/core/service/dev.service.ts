import { Injectable } from '@angular/core';
import { ServiceBase } from './service.base';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { RenewalStatus } from '../../renewal/model/RenewalStatus';
import { CollectionMethod } from '../../payment/model/CollectionMethod';
import { RenewalPaymentMethod } from '../../renewal/model/RenewalPaymentMethod';
import { CustomErrorHandler } from './CustomErrorHandler';
import { ApplicationStatus } from '../../prereg/model/ApplicationStatus';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DevService extends ServiceBase  {

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  resetRevalidation() {
    return super.get('v1.0/tester/revalidation/reset');
  }

  resetReview(id) {
    return super.get(`v1.0/tester/reviews/${id}/reset`);
  }

  setRenewalStatus(status: RenewalStatus) {
    return super.get(`v1.0/tester/renewal/status?status=${status}`);
  }

  getApplicationStatus(formId) {
    return this.http.get(`${environment.api.admin}/v1.0/admin/testing/registrationform/${formId}`)
    .pipe(map((response: any) => {
      const json = response.json();
      if (json) {
        return json.data;
      } else {
        return null;
      }
    }));

  }

  setApplicationStatus(formId, paymentDate: string, status: ApplicationStatus) {
    return this.http.post(`${environment.api.admin}/v1.0/admin/testing/registrationform`, { formId, status, paymentDate })
    .pipe(map(response => {
      const json = response;
      if (json) {
        return json['data'];
      } else {
        return null;
      }
    }));
  }

  getAssessmentApplicationStatus(formId) {
    return this.http.get(`${environment.api.admin}/v1.0/admin/testing/progressreportform/${formId}`)
    .pipe(map((response: any) => {
      const json = response.json();
      if (json) {
        return json.data;
      } else {
        return null;
      }
    }));

  }

  setAssessmentApplicationStatus(formId, paymentDate: string, status: ApplicationStatus) {
    return this.http.post(`${environment.api.admin}/v1.0/admin/testing/progressreportform`, { formId, status, paymentDate })
    .pipe(map(response => {
      const json = response;
      if (json) {
        return json['data'];
      } else {
        return null;
      }
    }));
  }


  setRevalidationSubmitDate() {
    return super.get(`v1.0/registrant/revalidation/earlier`);
  }

  setPaymentMethod(renewalPaymentMethod: RenewalPaymentMethod) {
    /*
    let paymentMethod: PaymentMethod;
    let quarterly = false;
    switch (+renewalPaymentMethod) {
        case RenewalPaymentMethod.PaymentCard:
          paymentMethod = PaymentMethod.Card;
          break;
        case RenewalPaymentMethod.DirectDebitAnnual:
          paymentMethod = PaymentMethod.DirectDebit;
          quarterly = false;
          break;
        case RenewalPaymentMethod.DirectDebitQuarterly:
          paymentMethod = PaymentMethod.DirectDebit;
          quarterly = true;
    }

    let url = `v1.0/tester/renewal/paymentmethod?paymentMethod=${paymentMethod}`;
    if (paymentMethod === PaymentMethod.DirectDebit) {
      url += `&quarterly=${quarterly}`;
    }
    return super.get(url);

    */
  }

}
