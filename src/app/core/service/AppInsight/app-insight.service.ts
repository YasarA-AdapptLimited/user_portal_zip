import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {AppInsights} from 'applicationinsights-js';

@Injectable()
export class AppInsightService {

  private config: Microsoft.ApplicationInsights.IConfig = {
  instrumentationKey: environment.appInsights.instrumentationKey
  };
  constructor() { if (!AppInsights.config) {
    AppInsights.downloadAndSetup(this.config);
  }  }

  logPageView(name?: string, url?: string, properties?: any, measurements?: any, duration?: number) {
  AppInsights.trackPageView(name, url, properties, measurements, duration);
  }

  logEvent(name: string, properties?: any, measurements?: any) {
    AppInsights.trackEvent(name, properties, measurements);
  }

  logException(exception: Error, handledAt: string, properties: any, measurements: any, severityLevel: any) {
    AppInsights.trackException(exception, handledAt, properties, measurements, severityLevel);
  }
}
