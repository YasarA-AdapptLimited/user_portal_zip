import { TestBed, inject } from '@angular/core/testing';
import { AppInsights } from 'applicationinsights-js';

import { AppInsightService } from './app-insight.service';

describe('AppInsightService', () => {
  let testService: AppInsightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppInsightService]
    });
    testService = TestBed.inject(AppInsightService);
  });

  it('should be created',() => {
    expect(testService).toBeTruthy();
  });

  it('logPageView should track the page view', () => {
    const trackPageViewSpy: jasmine.Spy = spyOn(AppInsights,'trackPageView');
    testService.logPageView();
    expect(trackPageViewSpy).toHaveBeenCalled();
  });

  it('logEvent should track event', () => {
    const trackEventSpy: jasmine.Spy = spyOn(AppInsights,'trackEvent');
    testService.logEvent('');
    expect(trackEventSpy).toHaveBeenCalled();
  });

  it('logException should track exception', () => {
    const trackExceptionSpy: jasmine.Spy = spyOn(AppInsights,'trackException');
    testService.logException(new Error(),'',{},'','');
    expect(trackExceptionSpy).toHaveBeenCalled();
  });

});
