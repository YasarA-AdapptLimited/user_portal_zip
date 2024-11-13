import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CustomErrorHandler } from './core/service/CustomErrorHandler';
import { AccountModule } from './account/account.module';
import { RenewalModule } from './renewal/renewal.module';
import { PreregModule } from './prereg/prereg.module';
import { RegistrationModule } from './registration/registration.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home.component';
import { TechnicianModule } from './technician/technician.module';

import { Configuration } from 'msal';
import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration
} from '@azure/msal-angular';
import { environment } from '../environments/environment';
import { msalConfig, msalAngularConfig, apiConfig } from './app-config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StudentDashboardComponent } from './dashboard/studentDashboard.component';
import { MSALInterceptorExtended } from './core/service/MSALInterceptorExtended';
//import { LocationStrategy, HashLocationStrategy } from '@angular/common';
//const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
// const protectedResourceMap: [string, string[]][] = [
//   [apiConfig.webApi, apiConfig.b2cScopes] // i.e. [https://fabrikamb2chello.azurewebsites.net/hello, ['https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read']]
// ];

export function MSALConfigFactory(): Configuration {
  return msalConfig;
}

export function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return msalAngularConfig;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StudentDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    AccountModule,
    RenewalModule,
    RegistrationModule,
    PreregModule,
    TechnicianModule,
    MsalModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MSALInterceptorExtended,
      multi: true
    },
    MsalService
  ]
})
export class AppModule { }

