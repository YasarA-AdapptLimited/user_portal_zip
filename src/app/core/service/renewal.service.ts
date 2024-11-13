import { Injectable } from '@angular/core';
import { RenewalConfig } from '../../renewal/model/RenewalConfig';
import { Renewal } from '../../renewal/model/Renewal';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { RenewalStatus } from '../../renewal/model/RenewalStatus';
import { WorldpayConfig } from '../../renewal/model/WorldpayConfig';
import { RenewalPaymentMethod } from '../../renewal/model/RenewalPaymentMethod';
import { FormTemplate } from '../../dynamic/model/FormTemplate';
import { CustomErrorHandler } from './CustomErrorHandler';
import { Observable } from 'rxjs/internal/Observable';

import { of as observableOf, from as observableFrom, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';
import { RenewalPaymentResponse } from '../../renewal/model/RenewalPaymentResponse';
import { WorldpayCartId } from '../../renewal/model/WorldpayCartId';

@Injectable()
export class RenewalService extends ServiceBase {

  templateGroup;
  applicationStatus$ = new BehaviorSubject(null);

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  failTest(): Observable<any> {
    return super.get(`api/nosuchthing`);
  }

  getFormTemplates(): Observable<Array<FormTemplate>> {
    if (this.templateGroup) {
      return observableOf(this.templateGroup);
    } else {
      return super.get(`v1.0/forms?group=1`)
        .pipe(map(data => {
          this.templateGroup = data;
          return this.templateGroup;
        }));
    }
  }


  getRenewal(): Observable<Renewal> {
    this.log.info('loading renewal...');
    return super.get(`v1.0/registrant/renewals2`).pipe(map(data => {

      if (!data.renewals || !data.renewals.length) {
        this.log.info('get renewals returned null or empty');
        return {
          status: RenewalStatus.NotDue,
          revalidationCompleted: false,
          paymentMethod: RenewalPaymentMethod.Unknown,
          isCash: false,
          isDD: false,
          isDue: false,
          notDue: true,
          selectedCard: undefined,
          agreed: false,
          renewalFee: undefined,
          renewalDate: undefined,
          windowCloseDate: undefined,
          isComplete: false
        };
      }
      const renewal: Renewal = <Renewal>data.renewals[0];
      renewal.notDue = !renewal.isRenewable;
      renewal.isDue = renewal.isRenewable;
      if (!renewal.isRenewable) {
        renewal.status = RenewalStatus.NotDue;
      }
      renewal.isCash = renewal.paymentMethod === RenewalPaymentMethod.PaymentCard;

      renewal.isDD = renewal.paymentMethod === RenewalPaymentMethod.DirectDebitAnnual ||
        renewal.paymentMethod === RenewalPaymentMethod.DirectDebitQuarterly;

      renewal.isComplete = renewal.status === RenewalStatus.Complete ||
        renewal.status === RenewalStatus.PaymentInProgress ||
        renewal.status === RenewalStatus.DDPaymentPending;

      this.log.info('renewal loaded', renewal);

      return renewal;
    }));
  }

  getRenewalOld(): Observable<Renewal> {
    this.log.info('loading renewal...');
    return super.get(`v1.0/registrant/renewals`).pipe(map(data => {

      if (!data.renewals || !data.renewals.length) {
        this.log.info('get renewals returned null or empty');
        return {
          status: RenewalStatus.NotDue,
          revalidationCompleted: false,
          paymentMethod: RenewalPaymentMethod.Unknown,
          isCash: false,
          isDD: false,
          isDue: false,
          notDue: true,
          selectedCard: undefined,
          agreed: false,
          renewalFee: undefined,
          renewalDate: undefined,
          windowCloseDate: undefined,
          isComplete: false
        };
      }
      const renewal: Renewal = <Renewal>data.renewals[0];
      renewal.notDue = !renewal.isRenewable;
      renewal.isDue = renewal.isRenewable;
      if (!renewal.isRenewable) {
        renewal.status = RenewalStatus.NotDue;
      }
      renewal.isCash = renewal.paymentMethod === RenewalPaymentMethod.PaymentCard;

      renewal.isDD = renewal.paymentMethod === RenewalPaymentMethod.DirectDebitAnnual ||
        renewal.paymentMethod === RenewalPaymentMethod.DirectDebitQuarterly;

      renewal.isComplete = renewal.status === RenewalStatus.Complete ||
        renewal.status === RenewalStatus.PaymentInProgress ||
        renewal.status === RenewalStatus.DDPaymentPending;

      this.log.info('renewal loaded', renewal);

      return renewal;
    }));
  }

  saveDeclaration(payload): Observable<RenewalPaymentResponse> {
     return super.post(`v1.0/registrant/renewals2`, payload);
  }

  saveDeclarationOld(payload): Observable<WorldpayCartId> {
    return super.post(`v1.0/registrant/renewals`, payload)
      .pipe(map(data => new WorldpayCartId(data.renewalIdentifier)));;
  }
  
  getWordpayConfig(): Observable<WorldpayConfig> {
    return super.get(`v1.0/worldpay/configuration`);
  }


}
