import { Injectable, EventEmitter } from '@angular/core';
import { ServiceBase } from './service.base';
import { AuthService } from './auth.service';
import { Review } from '../../review/model/Review';
import { Log } from '../model/Log';
import { LogLevel } from '../model/LogLevel';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { CustomErrorHandler } from './CustomErrorHandler';
import { UserActivity } from '../model/UserActivity';
import { LogService } from './log.service';
import { of } from 'rxjs';

@Injectable()
export class MockTrackingService  {

  postActivity(activity: UserActivity, location: string, data?: any): any {
    return of();
  }

}
