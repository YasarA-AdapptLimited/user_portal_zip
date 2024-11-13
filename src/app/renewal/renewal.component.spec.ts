import { TestBed, ComponentFixture, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { } from 'jasmine';

import { APP_BASE_HREF } from '@angular/common';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { RenewalComponent } from './renewal.component';
import { CoreModule } from '../core/core.module';
import { RenewalService } from '../core/service/renewal.service';
import { MockRenewalService } from '../core/service/renewal.service.mock';
import { RenewalStatus } from './model/RenewalStatus';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicModule } from '../dynamic/dynamic.module';
import { SharedModule } from '../shared/shared.module';
import { AccountModule } from '../account/account.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { AppComponent } from '../app.component';
import { DeclarationComponent } from './declaration.component';
import { DeclarationQuestionComponent } from './declarationQuestion.component';
import { PaymentComponent } from './payment.component';
import { RenewalSplashComponent } from './renewalSplash.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { AuthService } from '../core/service/auth.service';
import { MockAuthService } from '../core/service/auth.service.mock';
import { MockTrackingService } from '../core/service/tracking.service.mock';
import { TrackingService } from '../core/service/tracking.service';

export class RenewModule { }

xdescribe('RenewComponent', () => {
  let fixture: ComponentFixture<RenewalComponent>;
  let component: RenewalComponent;
  let compiled;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AccountModule,
        CoreModule,
        HttpModule,
        FormsModule,
        CommonModule,
        DynamicModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [
        RenewalComponent,
        DeclarationComponent,
        DeclarationQuestionComponent,
        PaymentComponent,
        RenewalSplashComponent
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ErrorHandler, useClass: CustomErrorHandler },
        { provide: AuthService, useClass: MockAuthService },
        { provide: RenewalService, useClass: MockRenewalService },
        { provide: TrackingService, useClass: MockTrackingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RenewalComponent);
    component = fixture.debugElement.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  }));

  it('should create the component', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should load worldpay config', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.worldpayConfig).toBeTruthy();
      expect(component.worldpayConfig.testMode).toEqual(1);
    });
  }));

  it('should load renewal', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.renewal).toBeTruthy();
      expect(component.renewal.status).toEqual(RenewalStatus.Pending);
    });
  }));

  it('should show the renewal splash screen', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const splashElement = compiled.querySelector('app-renewal-splash');
      expect(splashElement).toBeTruthy();
      const declarationElement = compiled.querySelector('app-declaration');
      expect(declarationElement).toBeFalsy();
      expect(component.step).toEqual(0);
    });
  }));

  it('should show the renewal start button', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const renewalStartButton = compiled.querySelector('button[aria-label="Start your renewal"]');
      expect(renewalStartButton).toBeTruthy();
    });
  }));

  it('should show declaration screen when renewal start button is clicked', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const renewalStartButton = compiled.querySelector('button[aria-label="Start your renewal"]');
      renewalStartButton.click();
      fixture.detectChanges();
      const declarationElement = compiled.querySelector('app-declaration');
      expect(declarationElement).toBeTruthy();
      const splashElement = compiled.querySelector('app-renewal-splash');
      expect(splashElement).toBeFalsy();
      const titleElement = compiled.querySelector('h1');
      expect(titleElement.innerText).toEqual('Declaration of Fitness to Practise');
      expect(component.step).toEqual(1);
      console.log('aaaa');
    });
  }));


  describe('When renewal is started', () => {

    const startRenewal = () => {
      return fixture.whenStable().then(() => {
        fixture.detectChanges();
        const renewalStartButton = compiled.querySelector('button[aria-label="Start your renewal"]');
        renewalStartButton.click();
        fixture.detectChanges();
      });
    };

    const completeFirstDeclaration = () => {
      return startRenewal().then(() => {
        const questionElements = compiled.querySelectorAll('app-declaration-question');
        questionElements.forEach(questionElement => {
          const answerNo = questionElement.querySelector('[aria-label="No"]');
          answerNo.click();
          tick(5000);
        });
        tick(5000);
        fixture.detectChanges();
        const continueButton = compiled.querySelector('button[aria-label="Continue"]');
        expect(continueButton.disabled).toBeFalsy();
        continueButton.click();
        tick(5000);
        fixture.detectChanges();
      });
    };

    const completeSecondDeclaration = () => {
      return completeFirstDeclaration().then(() => {
        const questionElements = compiled.querySelectorAll('app-declaration-question');
        questionElements.forEach(questionElement => {
          const answerYes = questionElement.querySelector('[aria-label="Yes"]');
          answerYes.click();
          tick(5000);
        });
        tick(5000);
        fixture.detectChanges();
        const employerOption = compiled.querySelector('[aria-label="Employer"]');
        employerOption.click();
        tick(5000);
        fixture.detectChanges();
        const continueButton = compiled.querySelector('button[aria-label="Continue"]');
        expect(continueButton.disabled).toBeFalsy();
        continueButton.click();
        tick(5000);
        fixture.detectChanges();
      });
    };

    it('should show declaration content', waitForAsync(() => {
      startRenewal().then(() => {
        const titleElement = compiled.querySelector('h1');
        expect(titleElement.innerText).toEqual('Declaration of Fitness to Practise');
      });
    }));

    it('should prevent navigation to step 2 when questions are not answered', waitForAsync(() => {
      startRenewal().then(() => {
        const continueButton = compiled.querySelector('button[aria-label="Continue"]');
        expect(continueButton.disabled).toBeTruthy();
        continueButton.click();
        fixture.detectChanges();
        expect(component.step).toEqual(1);
      });
    }));

    it('should allow navigation to step 2 when all questions are answered', fakeAsync(() => {
      completeFirstDeclaration().then(() => {
        fixture.detectChanges();
        expect(component.step).toEqual(2);
      });
    }));

    it('should prevent navigation to step 3 when questions are not answered', fakeAsync(() => {
      completeFirstDeclaration().then(() => {
        const continueButton = compiled.querySelector('button[aria-label="Continue"]');
        continueButton.click();
        tick();
        fixture.detectChanges();
        expect(component.step).toEqual(2);
      });
    }));

    it('should allow navigation to step 3 when all questions are answered', fakeAsync(() => {
      completeSecondDeclaration().then(() => {
        expect(component.step).toEqual(3);
      });
    }));

    it('should prevent navigation to payment when agreement not checked', fakeAsync(() => {
      completeSecondDeclaration().then(() => {
        const continueButton = compiled.querySelector('button[aria-label="Continue"]');
        expect(continueButton.disabled).toBeTruthy();
        continueButton.click();
        tick(5000);
        fixture.detectChanges();
        expect(component.step).toEqual(3);
      });
    }));

    it('should allow navigation to payment when agreement check and card selected', fakeAsync(() => {
      const spy = spyOn(component, 'redirectToWorldpay').and.stub();
      completeSecondDeclaration().then(() => {
        const continueButton = compiled.querySelector('button[aria-label="Continue"]');
        expect(continueButton.disabled).toBeTruthy();
        expect(component.renewal.agreed).toBeFalsy();
       // const spy = spyOn(component, 'redirectToWorldpay');

        const agreementCheckbox = compiled.querySelector('[aria-label="Declaration agreement"]  .mat-checkbox-input');
        agreementCheckbox.click();
        tick(5000);
        fixture.detectChanges();
        expect(component.renewal.agreed).toBeTruthy();

        const visaButton = compiled.querySelector('[aria-label="VISA"]');
        visaButton.click();
        tick(5000);
        fixture.detectChanges();
        expect(continueButton.disabled).toBeFalsy();

        continueButton.click();
        tick(5000);
        tick(5000);
        fixture.detectChanges();

    /*
       tick(5000);
        fixture.whenStable().then(() => {
          tick(5000);
          fixture.detectChanges();
          tick(5000);
          expect(spy).toHaveBeenCalled();
        });
        */
      });

    }));
  });

});
