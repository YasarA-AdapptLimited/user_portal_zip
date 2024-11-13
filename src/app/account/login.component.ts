import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from '../core/service/layout.service';
import { AuthService } from '../core/service/auth.service';
import { AccountService } from './service/account.service';
import { User } from './model/User';
import { environment } from '../../environments/environment';
import { LoggedInState } from './model/LoggedInState';
import { PreferenceDialogComponent } from './preferenceDialog.component';
import { HasCheckedRegistrationDialogComponent } from './hasCheckedRegistrationDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TechnicianService } from '../core/service/technician.service';
import { MaintenanceMessageService } from '../core/service/maintenanceMessage.service';
import { Router } from '@angular/router';
import { BrowserDialogComponent } from './browser-dialog/browser-dialog.component';

interface LoginChangeArgs {
  loggedIn: boolean;
  user?: User;
  error?: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  userId: any;
  user: User;
  loading = false;
  redirecting = false;
  forgotPassword = false;
  acquireTokenFailed = false;
  loggedOut = true;
  loggedInStateSub;
  loginMessage = 'Loading...';
  error: any;
  showLogin = true;
  url: string;
  OSName;



  constructor(public authService: AuthService, private accountService: AccountService,
    private dialog: MatDialog, private layout: LayoutService,
    private technicianService: TechnicianService, public maintenance: MaintenanceMessageService,
    private router: Router,
  ) {
  }

  ngOnInit() {

    this.showLogin = false;

    this.checkBrowserForPopup();

    this.layout.setAccountMode(true);
    this.loggedInStateSub = this.authService.loggedInState$.subscribe(this.onLoggedInStateChange.bind(this));

    if (this.authService.loggedInState === LoggedInState.loggedIn) {
      this.authService.enter();
      this.getNotifications();
      this.showPreferences();
    }
    this.checkLoggedInState();
    this.getOs();
  }

  get showHeavyLoadMessage() {
    return this.maintenance.showHeavyLoad;
  }

  get heavyLoadMessage() { 
    return (this.maintenance.heavyLoadMessage?.length > 0 ? this.maintenance.heavyLoadMessage : 'Due to high demand, we are currently limiting new user access to our website. Please try again in a short while.');
  }

  getNotifications() {
    if (this.authService.loggedInState === LoggedInState.loggedIn) {
      this.accountService.startCheckingNotificationCount();
    }
  }

  showPreferences() {
    if (this.authService.user && this.authService.user.preferencesNotSet()) {
      this.showPreferenceModal();
    } else {
      this.checkHasCheckedRegistrationDetails();
    }
  }


  checkLoggedInState() {
    this.loginMessage = 'Verifying account...';
    this.loading = true;
    this.authService.checkLoggedInState().then(loggedIn => {
      this.authService.enter();
      this.getNotifications();
      this.showPreferences();
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      if (error.status === 404) {
        this.tryGettingTechnicianDetails().subscribe(() => {
          this.authService.redirectToConfirmation();
        }, (cannotGetTechnicianDetails) => {
          this.authService.redirectToActivation();
        });
      }
    });
  }

  tryGettingTechnicianDetails() {
    return this.technicianService.getTechnicianDetails();
  }



  onLoggedInStateChange(state) {
    this.acquireTokenFailed = state === LoggedInState.acquireTokenFail;
    this.loggedOut = state === LoggedInState.loggedOut || this.acquireTokenFailed;
    if (state === LoggedInState.loginRedirect) {
      this.redirecting = true;
    }
    if (state === LoggedInState.forgotPassword) {
      this.forgotPassword = true;
    }
    this.loginMessage = this.getLoginMessage(state);
    /*  // popup when browser failed to acquire token
    var browserDetail = this.getBrowser();
     //added additional condition for chrome browser running on iOS devices
     var iOSChrome = browserDetail.navigatorUserAgent.match(/CriOS/i);
     // added condition to check browser is chrome or not for windows
     var isChrome = navigator.userAgent.includes("Chrome") && navigator.vendor.includes("Google Inc");
     // added condition to check browser is IE or not for windows
     var isIE = navigator.userAgent.includes("Trident");

     var iOSEdge = browserDetail.navigatorUserAgent.match(/EdgiOS/i);

     var isEdge = navigator.userAgent.includes("Edg");

     var iOSFirefox = browserDetail.navigatorUserAgent.match(/FxiOS/i);

     //aaded popup's to show when browser failed to login
     if(Number.isNaN(parseInt(localStorage.getItem('tokenExpires'), 10)) &&  this.acquireTokenFailed){
      if(this.OSName === 'MacOS' && iOSChrome && browserDetail.browserName === "Safari"){
        this.dialog.open(BrowserDialogComponent, {
          disableClose: true,
          data: {
            alertTitle: `Important Information !`,
            content: `If you experience any difficulties accessing myGPhC, please either use an alternative browser or change the settings on your device.
            Go to ‘Settings’ on your device, select ‘Chrome’, and then select the option ‘Allow Cross-Website Tracking’`,
            isBlockedByCookies: true
          }
        });
      }else if(this.OSName === 'MacOS' && browserDetail.browserName === "Safari" && browserDetail.majorVersion > 12 && !(Boolean(iOSChrome) || Boolean(iOSFirefox) || Boolean(iOSEdge))){
        this.dialog.open(BrowserDialogComponent, {
          disableClose: true,
          data: {
            alertTitle: `Important Information !`,
            content: `If you experience any difficulties accessing myGPhC, please either use an alternative browser or change the settings on your device.
             Go to ‘Settings’ on your device, and select ‘Safari’. Under the ‘Privacy & Security’ heading, uncheck ‘Prevent Cross Site Tracking’`,
            isBlockedByCookies: true
          }
        });
      }else if(this.OSName === 'Windows' && isEdge){
        this.dialog.open(BrowserDialogComponent, {
          disableClose: true,
          data: {
            alertTitle: `Important Information !`,
            content: `If you experience any difficulties accessing myGPhC, please use an alternative browser e.g. Microsoft Edge, Google Chrome or Mozilla Firefox. Alternatively,
            disable 'block third-party cookies' in browser settings.`,
            isBlockedByCookies: true
          }
        });
      } else if(this.OSName === 'Windows' && !isEdge ){
        this.dialog.open(BrowserDialogComponent, {
          disableClose: true,
          data: {
            alertTitle: `Important Information !`,
            content: `If you experience any difficulties accessing myGPhC, please use an alternative browser e.g. Microsoft Edge, Google Chrome or Mozilla Firefox. Alternatively,
            disable 'block third-party cookies' in browser settings.`,
            isNotEdge: true,
            isBlockedByCookies: true
          }
        });
      }
     }*/
  }

  getLoginMessage(state: LoggedInState): string {
    switch (state) {
      case LoggedInState.attemptAcquireTokenSilently:
        return 'Authorising';
      case LoggedInState.loadingUser:
        return 'Loading your details';
      case LoggedInState.loginRedirect:
        return 'Redirecting to sign-in';
      case LoggedInState.forgotPassword:
        return 'Redirecting to forgot password';
      case LoggedInState.acquireTokenFail:
        return 'Authorisation failed';
      default:
        return 'Verifying your account';
    }
  }

  // cancelLogin() {
  //   window.location.reload();
  // }

  showPreferenceModal() {
    const dialogRef = this.dialog.open(PreferenceDialogComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.checkHasCheckedRegistrationDetails();
    });
  }

  checkHasCheckedRegistrationDetails() {
    if (environment.dev) {
      return;
    }
    if (this.authService.user && this.authService.user.isRegistrant && !this.authService.user.hasCheckedRegistration) {
      this.showHasCheckedRegistrationModal();
    }
  }

  showHasCheckedRegistrationModal() {
    const dialogRef = this.dialog.open(HasCheckedRegistrationDialogComponent, {
      disableClose: true
    });
  }

  signin() {
    this.error = false;
    this.authService.login();
  }

  ngOnDestroy() {
    // this.loggedInStateSub.unsubscribe();
  }

  goToSignInFaq() {
    this.router.navigate(['signin/faq']);
  }

  getOs() {
    this.OSName = 'Unknown';
    if (navigator.appVersion.indexOf('Win') !== -1) { this.OSName = 'Windows'; }
    if (navigator.appVersion.indexOf('Mac') !== -1) { this.OSName = 'MacOS'; }
    if (navigator.appVersion.indexOf('X11') !== -1) { this.OSName = 'UNIX'; }
    if (navigator.appVersion.indexOf('Linux') !== -1) { this.OSName = 'Linux'; }
    return this.OSName;
  }


  getBrowser() {
    try {


      const nVer = navigator.appVersion;
      const nAgt = navigator.userAgent;
      let browserName = navigator.appName;
      let fullVersion = '' + parseFloat(navigator.appVersion);
      let majorVersion = parseInt(navigator.appVersion, 10);
      let nameOffset, verOffset, ix;

      // In Opera, the true version is after 'Opera' or after 'Version'
      if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
        browserName = 'Opera';
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
          fullVersion = nAgt.substring(verOffset + 8);
        }
      } else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
        // In MSIE, the true version is after 'MSIE' in userAgent
        browserName = 'Microsoft Internet Explorer';
        fullVersion = nAgt.substring(verOffset + 5);
      } else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
        // In Chrome, the true version is after 'Chrome'
        browserName = 'Chrome';
        fullVersion = nAgt.substring(verOffset + 7);
      } else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
        // In Safari, the true version is after 'Safari' or after 'Version'
        browserName = 'Safari';
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
          fullVersion = nAgt.substring(verOffset + 8);
        }
      } else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
        // In Firefox, the true version is after 'Firefox'
        browserName = 'Firefox';
        fullVersion = nAgt.substring(verOffset + 8);
      } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        // In most other browsers, 'name/version' is at the end of userAgent
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() === browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix = fullVersion.indexOf(';')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }
      if ((ix = fullVersion.indexOf(' ')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }
      majorVersion = parseInt('' + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }

      return {
        browserName,
        fullVersion,
        majorVersion,
        navigatorAppName: navigator.appName,
        navigatorUserAgent: navigator.userAgent
      };
    } catch (e) {
      // this.log.error('Error getting browser details', e);
    }

  }

  checkBrowserForPopup() {
    var obj = this.getBrowser();
    // to validate internet explorer browser
    var iE = obj.navigatorUserAgent.match(/Trident/i);
    /*//added additional condition for chrome browser running on iOS devices
    var iOSSafari = obj.navigatorUserAgent.match(/CriOS/i);
    // to validate Firefox browser on iOS devices
    var iOSFirefox = obj.navigatorUserAgent.match(/FxiOS/i);
    // to validate Edge browser on iOS devices
    var iOSEdge = obj.navigatorUserAgent.match(/EdgiOS/i);

    var chromeVersion=[];
    if (Boolean(iOSSafari)) //check the chrome version
    {
      var value = obj.navigatorUserAgent;
      var version = value.split(' ');
      version.forEach(element => {
        if (element.startsWith("CriOS")) {
          chromeVersion = element.split('/');
        }
      });
    }

    if (obj.browserName === "Safari" && obj.majorVersion > 12 && !(Boolean(iOSSafari) || Boolean(iOSFirefox) || Boolean(iOSEdge))) {

      this.dialog.open(BrowserDialogComponent, {
        disableClose: true,
        data: {
          alertTitle: `Important Information !`,
          title: `You are using Safari browser version 13 or higher`,
          content: `If you experience any difficulties accessing myGPhC, please either use an alternative browser or change the settings on your device.
           Go to ‘Settings’ on your device, and select ‘Safari’. Under the ‘Privacy & Security’ heading, uncheck ‘Prevent Cross Site Tracking’`,

        }
      });
    } else if (obj.browserName === "Safari" && parseInt(chromeVersion[chromeVersion.length - 1]) >= 86 && Boolean(iOSSafari)) {

      this.dialog.open(BrowserDialogComponent, {
        disableClose: true,
        data: {
          alertTitle: `Important Information !`,
          title: `You are using chrome browser version 86`,
          content: `If you experience any difficulties accessing myGPhC, please either use an alternative browser or change the settings on your device. Go to ‘Settings’ on your device, select ‘Chrome’, and then select the option ‘Allow Cross-Website Tracking’`,
        }
      });
    }
    else*/ if(iE){
      this.dialog.open(BrowserDialogComponent, {
        disableClose: true,
        data: {
          alertTitle: `Important Information !`,
          title:`You are using internet explorer browser`,
          content: `If you experience any difficulties accessing myGPhC, please use an alternative browser e.g. Microsoft Edge, Google Chrome or Mozilla Firefox`,
        }
      });
    }
  }
}

