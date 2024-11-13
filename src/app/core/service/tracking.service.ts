import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './auth.service';

import { RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { CustomErrorHandler } from './CustomErrorHandler';
import { UserActivity } from '../model/UserActivity';
import { LogService } from './log.service';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TrackingService extends ServiceBase {

  constructor(http: HttpClient, auth: AuthService, log: LogService, errorHandler: CustomErrorHandler) {
    super(http, auth, log, errorHandler);
  }

  postActivity(activity: UserActivity, location: string, data?: any): any {

    const headers: Headers = new Headers();
    const payload = {
      A: activity,
      L: location,
      V: JSON.stringify(data)
    };
    return this.post('v1.0/t', payload);
  }

}
