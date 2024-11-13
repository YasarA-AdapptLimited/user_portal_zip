import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';
import { LayoutService } from '../../core/service/layout.service';
import { AccountService } from '../service/account.service';

import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let MockAccountService, MockRouter, MockLayoutService, MockAuthService, MockChangeDetection;

  MockAccountService = jasmine.createSpyObj('AccountService', ['updateNotificationCount', 'getNotifications', 'createTestNotification']);
  let routerSpy =  { navigate: jasmine.createSpy('navigate')};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsComponent ],
      providers: [{ provide: AccountService, useValue: MockAccountService},
                  { provide: Router, useValue: routerSpy},
                  { provide: LayoutService, useValue: MockLayoutService},
                  { provide: AuthService, useValue: MockAuthService},
                  { provide: ChangeDetectorRef, useValue: MockChangeDetection}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    const openSpy: jasmine.Spy = spyOn(component, 'open');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on ngOnInit call load and updateCount', () => {
    let loadSpy: jasmine.Spy = spyOn(component,'load');
    let updateCountSpy: jasmine.Spy = spyOn(component,'updateCount');
    component.ngOnInit();
    expect(loadSpy).toHaveBeenCalled();
    expect(updateCountSpy).toHaveBeenCalled();
  });

  it('updateCount method updates notifications count', () => {
    const updateNotificationsSpy = MockAccountService.updateNotificationCount.and.returnValue(of({}));
    component.updateCount();
    expect(updateNotificationsSpy).toHaveBeenCalled();
  });

  it('load method fetches notifications', () => {
    const getNotificationsSpy = MockAccountService.getNotifications.and.returnValue(of({}));
    component.load();
    expect(getNotificationsSpy).toHaveBeenCalled();
  });

  it('if notifications not fetched user should be notified', () => {
    const getNotificationsSpy = MockAccountService.getNotifications.and.returnValue(throwError('error'));
    component.load();
    expect(component.loading).toBe(false);
    expect(component.failed).toBe(true);
    // expect(getNotificationsSpy).toHaveBeenCalled();
  });

  it('nextPage increments the page number and loads the next page ', () => {
    let loadSpy: jasmine.Spy = spyOn(component,'load');
    component.nextPage();
    expect(loadSpy).toHaveBeenCalled();
  });

  it('prevPage decrements the page number and loads the previous page ', () => {
    let loadSpy: jasmine.Spy = spyOn(component,'load');
    component.prevPage();
    expect(loadSpy).toHaveBeenCalled();
  });

  it('createTestNotification method creates notification', () => {
    const createTestNotificationSpy = MockAccountService.createTestNotification.and.returnValue(of({}));
    component.createTestNotification();
    expect(createTestNotificationSpy).toHaveBeenCalled();
  });

  it('navigate method takes care of navigating to url given', () => { 
    const item = { url: '/abc'};   
    component.navigate(item);
    expect(routerSpy.navigate).toHaveBeenCalledWith([item.url]);
  });

  it('pageTo returns next page count', () => {
    expect(component.pageTo).toBe(5);
  });

  it('pageFrom returns prev page count', () => {
    expect(component.pageFrom).toBe(1);
  });
});
