import { Injectable } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { LogService } from '../../core/service/log.service';
import { Observable } from 'rxjs/internal/Observable';
import { Payment } from '../model/Payment';
import { CustomErrorHandler } from '../../core/service/CustomErrorHandler';
import { map } from 'rxjs/operators';
import { ServiceBase } from '../../core/service/service.base';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class PaymentService extends ServiceBase {

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  getPayments(): Observable<Array<Payment>> {
    return super.get('v1.0/registrant/payments')
      .pipe(map(data => data.map(d => new Payment(d))));
  }
}
