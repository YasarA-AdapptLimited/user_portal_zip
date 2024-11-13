import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RenewalConfig } from '../../renewal/model/RenewalConfig';
import { Renewal } from '../../renewal/model/Renewal';
import { ServiceBase } from './service.base';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { RenewalStatus } from '../../renewal/model/RenewalStatus';
import { WorldpayCartId } from '../../renewal/model/WorldpayCartId';
import { WorldpayConfig } from '../../renewal/model/WorldpayConfig';
import { RenewalPaymentMethod } from '../../renewal/model/RenewalPaymentMethod';
import { FormTemplate } from '../../dynamic/model/FormTemplate';

import { pending } from './renewal.data.mock';
import { of } from 'rxjs';

const mock = {
  templateGroup: require('./mock/renewalDeclaration.mock.json').templateGroup,
  renewal: {
    pending
  },
  worldpayConfig: {
    creditCardSurchargePercentage: 0,
    instId: 1,
    paymentUrl: '',
    testMode: 1,
    worldPayCallbackUrl: ''
  },
  worldpayCartId: {
    registrationNumber: '123',
    renewalId: '456'
  }
};

@Injectable()
export class MockRenewalService {

  getFormTemplates(): Observable<Array<FormTemplate>> {
    return of(mock.templateGroup);
  }
  getRenewal(): Observable<Renewal> {
    return of(mock.renewal.pending);
  }
  saveDeclaration(payload): Observable<WorldpayCartId> {
    return of(mock.worldpayCartId);
  }
  getWordpayConfig(): Observable<WorldpayConfig> {
    return of(mock.worldpayConfig);
  }
}
