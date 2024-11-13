import { Component, NgZone, OnInit, OnDestroy, HostBinding, HostListener, ErrorHandler, ReflectiveInjector, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LayoutState } from './core/model/LayoutState';
import { LoggedInState } from './account/model/LoggedInState';
import { LayoutService } from './core/service/layout.service';
import { TooltipService } from './core/tooltip/tooltip.service';
import { ConfirmDialogComponent } from './shared/confirmDialog.component';
import { AuthService } from './core/service/auth.service';
import { AccountService } from './account/service/account.service';
import { User } from './account/model/User';
import { LogService } from './core/service/log.service';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from '../environments/environment';
import { UpdaterService } from './core/service/updater.service';
import { CustomErrorHandler } from './core/service/CustomErrorHandler';
import { MatDialog } from '@angular/material/dialog';
import { UserActivity } from './core/model/UserActivity';
import { MaintenanceMessageService } from './core/service/maintenanceMessage.service';
import { AppInsightService } from './core/service/AppInsight/app-insight.service';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { isIE, b2cPolicies } from './app-config';

(<any>window).dataLayer = (<any>window).dataLayer || [];
function gtag(...args) {
  if (environment.analytics) {
    (<any>window).dataLayer.push(arguments);
  }
}
if (environment.analytics) {
  gtag('js', new Date());
  gtag('config', environment.analytics);
}

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./style/app.scss'],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
})
export class AppComponent implements OnInit {
  /*
    @HostBinding('style.overflow-y') overflowy = 'auto';
    @HostBinding('style.overflow-x') get overflowx() {
      return this.layout.state.fullscreen ? 'hidden' : 'auto';
    }
  */
    currentYear: number = new Date().getFullYear(); //return current year for copyright in footer
  pageClass = '';
  private myAppInsightService: AppInsightService;
  constructor(public log: LogService,
    private authService: AuthService,
    private accountService: AccountService,
    public layout: LayoutService,
    public updater: UpdaterService,
    private router: Router,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private tooltip: TooltipService,
    private dialog: MatDialog,
    public maintenanceMessage: MaintenanceMessageService,
    private broadcastService: BroadcastService, private msalService: MsalService
  ) {
    const injector = ReflectiveInjector.resolveAndCreate([AppInsightService]);
    this.myAppInsightService = injector.get(AppInsightService);
  }

  skipLinkFocused = false;
  @ViewChild('skipLink') skipLink: ElementRef;
  @ViewChild('mainContent') mainContent: ElementRef;

  @HostBinding('class.fullscreen') get fulscreen() {
    return this.layout.state$.value.fullscreen;
  }

  private logNavigation() {
    this.myAppInsightService.logPageView();
  }
  reload() {
    window.location.reload();
  }

  checkLocation() {
    try {
      const rootLocation = window.location.protocol + '//' + window.location.host;
      const locationInfo = { current: rootLocation, correct: environment.webRoot };
      const redirected = window.location.href.indexOf('redirected=true') > -1;
      if (redirected) {
        this.log.info('Redirected from incorrect protocol / host');
      } else if (environment.webRoot.indexOf(rootLocation) !== 0) {
        let redirect = window.location.href.replace(rootLocation, environment.webRoot);
        if (redirect.indexOf('?') > -1) {
          redirect += '&redirected=true&t=' + new Date().getTime();
        } else {
          redirect += '?redirected=true&t=' + new Date().getTime();
        }
        this.log.postActivity(UserActivity.Unknown, 'Incorrect protocol / host', locationInfo);
        setTimeout(() => {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            data: {
              allowCancel: false,
              confirmText: 'OK',
              title: `Website location`,
              message: `<p>You have accessed myGPhC from a url other than ${environment.webRoot}</p>
              <p>Please ensure that you update your bookmark to avoid seeing this message again.
              You will now be redirected automatically.</p>`
            }
          });
          dialogRef.afterClosed().subscribe(() => {
            window.location.replace(redirect);
          });
        });
      }
      this.log.info('location check', locationInfo);
    } catch (e) {
      this.log.error('Error checking location', e);
    }

  }

  onLinkFocus(event) {
    this.skipLinkFocused = true;
  }

  onLinkBlur(event) {
    this.skipLinkFocused = false;
  }

  onLinkClick(event) {
    event.preventDefault();
    this.mainContent.nativeElement.scrollIntoView();
    this.mainContent.nativeElement.focus();
  }

  ngOnInit() {

    // event listeners for authentication status
    this.broadcastService.subscribe('msal:loginSuccess', (success) => {
      // We need to reject id tokens that were not issued with the default sign-in policy.
      // "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr")
      // To learn more about b2c tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
      if (success.idToken.claims['tfp'] === b2cPolicies.names.resetPassword) {
        // window.alert("Password has been reset successfully. \nPlease sign-in with your new password");
        return this.authService.logout();
      }
      // this.checkAccount();
    });

    this.broadcastService.subscribe('msal:loginFailure', (error) => {
      // Check for forgot password error
      // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
      if (error.errorMessage.indexOf('AADB2C90118') > -1) {
        if (isIE) {
          this.msalService.loginRedirect(b2cPolicies.authorities.resetPassword);
        } else {
          this.msalService.loginRedirect(b2cPolicies.authorities.resetPassword);
          //this.authService.forgotPassword();
        }
      }
    });

    // redirect callback for redirect flow (IE)
    this.msalService.handleRedirectCallback((authError, response) => {
      if (authError) {
        return;
      }
    });
    this.checkLocation();

    setTimeout(() => {
      const x = 0;
      const y = 10 / x;
    }, 100);

    fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe(this.setSize.bind(this));

    this.setSize();

    this.updater.startChecking();

    this.log.onNotification.subscribe(() => {
      window.scroll(0, 0);
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) { route = route.firstChild; }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        map((route) => route.snapshot.routeConfig))
      .subscribe((config) => {
        this.configurePage(config);
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {

        this.log.clearRouteBlock();
        this.tooltip.close();
      });
  }

  configurePage(config) {
    let title = 'myGPhC';
    let pageTitle = '';
    const pagePath = '/' + config.path;
    const fullscreen = config.data && config.data.fullscreen ? true : false;
    this.layout.reset(fullscreen);
    if (config && config.data && !this.log.newRouteBlock) {
      pageTitle = config.data['title'];
      this.pageClass = config.data['classname'];
    } else {
      this.pageClass = '';
    }

    if (pageTitle) {
      title += ' - ' + pageTitle;
    }
    if (environment.analytics) {
      gtag('config', environment.analytics, {
        'page_title': pageTitle,
        'page_path': pagePath
      });
    }
    this.logNavigation();
    this.titleService.setTitle(title);
  }

  setSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.layout.setSize(width, height);
  }

  get loggedIn(): boolean {
    return !!this.authService.user && !!this.authService.token && !!this.authService.userId;
  }

  logout() {
    this.log.notifyLoggedOut = false;
    this.authService.logout();
  }
}
