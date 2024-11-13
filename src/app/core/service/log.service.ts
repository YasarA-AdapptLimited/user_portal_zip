import { Injectable, EventEmitter, ReflectiveInjector } from '@angular/core';
import { Log } from '../model/Log';
import { LogLevel } from '../model/LogLevel';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { UserActivity } from '../model/UserActivity';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { ParseLocation } from '@angular/compiler';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppInsightService } from './AppInsight/app-insight.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LogService {
  private myAppInsightService: AppInsightService;
  constructor(private http?: HttpClient) {
      const injector = ReflectiveInjector.resolveAndCreate([AppInsightService]);
      this.myAppInsightService = injector.get(AppInsightService);
   }

  public onNotification = new EventEmitter<Log>();

  logs: Array<Log> = [];
  newError: Log;
  newRouteBlock: Log;
  isOffline = false;
  notifyIsOffline = false;
  notifyLoggedOut = false;

  offline(isOffline) {
    this.notifyIsOffline = isOffline;
    this.isOffline = isOffline;
    if (isOffline) {
      this.onNotification.emit();
    }
  }

  loggedOut() {
    this.notifyLoggedOut = true;
    this.onNotification.emit();
  }

  clear() {
    this.logs = [];
  }
  clearNew() {
    this.newError = undefined;
    // this.isOffline = false;
  }
  clearRouteBlock() {
    this.newRouteBlock = undefined;
  }

  private add(text: string, level: LogLevel, data: any) {
    const log: Log = { text, level, data, date: new Date() };
    this.logs.push(log);
    this.logs = this.logs.slice(this.logs.length - 100, this.logs.length);
    return log;
  }

  info(text: string, ...data: any[]) {
    const log = this.add(text, LogLevel.info, data);
    return log;
  }

  routeBlock(message: string, path: string) {
    const log = this.info(message);
    log.routeBlock = true;
    log.routeBlocked = path;
    this.newRouteBlock = log;
  }

  error(text: string, ...data: any[]) {
     const log = this.add(text, LogLevel.error, data);
     if (data && data.length && data[0].exceptionMessage) {
      log.exception = data[0];
     }
    console.error(text, data);
    this.myAppInsightService.logException(new Error(text), '', data, '', LogLevel.error);
     return log;
  }

  postActivity(activity: UserActivity, location: string, data: any = {}): any {
    const payload = {
      A: activity,
      L: location,
      V: JSON.stringify(data)
    };
    const endpoint = `${environment.api.root}/v1.0/t`;
    return this.http.post(endpoint, payload);
  }

  flag(log) {
    this.newError = log;
    this.onNotification.emit();
  }

  warn(text: string, ...data: any[]) {
     this.add(text, LogLevel.warn, data);
  }

  critical(text: string, ...data: any[]) {
     this.add(text, LogLevel.critical, data);
  }

}
