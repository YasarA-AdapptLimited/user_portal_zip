import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/finally';
import { environment } from '../../../environments/environment';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MaintenanceMessageService extends ServiceBase {
  header = 'MyGphc service announcement';
  body = `MyGPhC is currently unavailable due to essential maintenance. Please try again later.`;
  active = false;
  open = false;
  allowClose = true;
  // state representing hideLogin
  stateOfLogin$ = new BehaviorSubject(true);
  showHeavyLoad = false;
  heavyLoadMessage = '';

  close() {
    this.open = false;
  }

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
    this.getMaintenanceMessage();
  }

  getMaintenanceMessage() {
    return this.http.request('GET',`${environment.maintenanceAPIURL}/maintenance-message`)
      .subscribe((response) => {
        if(response) {
        const { messageBody, messageTitle,
          messageActive, showLogin, showHeavyLoad, heavyLoadMessage } = response['value'];
          this.header = messageTitle;
          this.body = messageBody;
          this.open = messageActive;
          this.showHeavyLoad = true;
          this.heavyLoadMessage = null;
          this.stateOfLogin$.next(showLogin);
          // console.table(JSON.parse(response['_body']).value);
        }
      });
  }
}
