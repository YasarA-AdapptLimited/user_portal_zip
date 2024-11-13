import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { Route, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Headers, RequestOptions } from '@angular/http';

import { LogService } from './log.service';
import { User } from '../../account/model/User';
import { LoggedInState } from '../../account/model/LoggedInState';
import { CustomErrorHandler } from './CustomErrorHandler';
import { BehaviorSubject } from 'rxjs';
import { UserActivity } from '../model/UserActivity';
import { map } from 'rxjs/operators';
import { tokenRequest, apiConfig } from '../../app-config';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';

declare function require(moduleName: string): any;
const sjcl = require('sjcl');

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

@Injectable()
export class AuthService {

  // private msalObj: any;
  public userId: any;
  public token: any;
  public tokenExpires = 0;
  public loginRedirect: string;
  public user: User;
  public isLoggedIn: any;
  public loggedInState$ = new BehaviorSubject<LoggedInState>(LoggedInState.checking);

  public get loggedInState() {
    return this.loggedInState$.value;
  }
  idTokenReceivedInCallback;
  expiryTimer: any;
  encpwd = '&12gUytaJ07a';

  public forgotPasswordRedirectUrl = `${environment.sso.pwdreset}&client_id=${environment.sso.clientID}&nonce=defaultNonce&` +
    `redirect_uri=${environment.webRoot}&scope=openid&response_type=id_token&prompt=login`;

  constructor(private http: HttpClient, private log: LogService, private router: Router,
    private errorHandler: CustomErrorHandler, private zone: NgZone,
    private broadcastService: BroadcastService, private msalService: MsalService) {
  }

  isCallback() {
    return this.msalService.isCallback(window.location.hash);
  }

  public forgotPassword() {
    this.setState(LoggedInState.forgotPassword);
    setTimeout(() => {
      this.zone.runOutsideAngular(() => {
        window.location.href = this.forgotPasswordRedirectUrl;
      });
    });
  }


  loggerCallback(level, log, containsPii) {

    let levelString = '';
    switch (level) {
      case 0:
        levelString = 'Error';
        break;
      case 1:
        levelString = 'Warning';
        break;
      case 2:
        levelString = 'Info';
        break;
      case 3: levelString = 'Verbose';
    }

    if (level === 0) {
      this.log.error(log);
    }
    if (level === 1) {
      this.log.warn(log);
    }
    if (level === 2 || level === 3) {
      this.log.info(log);
    }

    if (level < 2) {
      try {
        this.log.postActivity(UserActivity.Unknown, 'msal loggerCallback',
          {
            msalUserId: this.userId,
            level: levelString,
            log
          }).subscribe();
      } catch (e) {
      }
    }
  }

  tokenReceivedCallback(errorDesc: any, token: any, error: any, tokenType: any) {
    if (error || errorDesc) {
      if (errorDesc && errorDesc.indexOf('AADB2C90118') > -1) {
        // forgot password
        this.forgotPassword();
      } else {
        try {
          this.log.postActivity(UserActivity.Unknown, 'msal tokenReceivedCallback',
            {
              msalUserId: this.userId,
              errorDesc,
              token,
              error,
              tokenType
            }).subscribe();
        } catch (e) {
        }
      }
      this.log.error('token received callback', { errorDesc, token, error, tokenType });
    }
    else {
      this.log.info('token received callback', { token, tokenType });
    }
    if (token) {
      if (tokenType === 'id_token') {
        this.idTokenReceivedInCallback = token;
        this.log.info('Set idTokenReceivedInCallback', token);
      }
      else {
        this.log.info('Token of type other than id_token received in callback', { token, tokenType });
      }
    }
  }

  public getUserId() {
    this.userId = this.msalService.getAccount();
    if (this.userId) {
      this.log.info('Got msal userId', this.userId);
    } else {
      this.log.info('Msal userid is null');
    }
    return this.userId;
  }

  setState(state: LoggedInState) {
    this.loggedInState$.next(state);
    this.log.info(`Logged in state change: ${LoggedInState[this.loggedInState]}`);
  }

  updateCachedAddress(address) {
    const user = this.loadUserFromLocalStorage();
    user.address = address;
    this.saveUserToLocalStorage(user);
    this.user = new User(user);
  }

  updateCachedContact(contact) {
    const user = this.loadUserFromLocalStorage();
    user.contact = contact;
    this.saveUserToLocalStorage(user);
    this.user = new User(user);
  }

  updateCachedPreference(preference) {
    const user = this.loadUserFromLocalStorage();
    user.preference = preference;
    this.saveUserToLocalStorage(user);
    this.user = new User(user);
  }

  updateCachedHasCheckedRegistrationDetails() {
    const user = this.loadUserFromLocalStorage();
    user.hasCheckedRegistration = true;
    this.saveUserToLocalStorage(user);
    this.user = new User(user);
  }

  saveUserToLocalStorage(user) {
    const encrypted = sjcl.encrypt(this.encpwd, JSON.stringify(user));
    localStorage.setItem('user', encrypted);
  }

  loadUserFromLocalStorage(): User {
    const data = localStorage.getItem('user');
    const decrypted = sjcl.decrypt(this.encpwd, data);
    return JSON.parse(decrypted);
  }

  getAccount(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.setState(LoggedInState.loadingUser);
      const endpoint = `${apiConfig.webApi}/v1.0/user`;
      const headers = { 'Authorization': `Bearer ${this.token}` };

      this.http.get(endpoint, {headers})
        .catch((err, caught) => {
          if (err.status === 302) {
            this.log.info('302 returned from get user (authorisation required)');
            return;
          }
          reject(err);
          return this.errorHandler.handleServerError(err, caught);
        })
        .subscribe(response => {
          const user = response.data;
          this.saveUserToLocalStorage(user);
          this.user = new User(user);
          resolve(this.user);
        });
    });
  }

  confirmEmail(token: string) {
    return this.http.post(`${apiConfig.webApi}/v1.0/user/email/confirm`, { token })
      .pipe(map(response => {
        if (response) {
          if (response && response['data']) {
            return response['data'];
          } else {
            return response;
          }
        } else {
          return null;
        }
      }))
      .catch(this.handleError.bind(this));
  }

  private handleError(err, caught) {
    return this.errorHandler.handleServerError(err, caught);
  }

  public login() {
    if (this.loggedInState === LoggedInState.loginRedirect) {
      return;
    }
    this.setState(LoggedInState.loginRedirect);
    this.msalService.loginRedirect();

  }

  public logout() {
    this.deleteToken();
    return this.msalService.logout();

  }



  setToken(token) {
    this.token = token;
    this.tokenExpires = new Date().getTime() + (60000 * 55);
    localStorage.setItem('token', this.token);
    localStorage.setItem('tokenExpires', this.tokenExpires.toString());
  }

  deleteToken() {
    this.token = undefined;
    this.tokenExpires = 0;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpires');
    localStorage.removeItem('user');
  }

  public checkLoggedInState(callGetUser = true) {

    this.setState(LoggedInState.checking);

    return new Promise((resolve, reject) => {
      if (inIframe()) {
        resolve(true);
      }
      if (!callGetUser || this.getUserId()) {
        this.tryAcquireTokenSilently()
          .then(
            () => {
              this.getAccount().then(() => {
                this.setState(LoggedInState.loggedIn);

                resolve(true);
              }, err => { reject(err); });
            },
            error => {
              this.setState(LoggedInState.acquireTokenFail);
              resolve(false);
            }).catch(error => {
              reject(error);
            });
      } else {

        // try again in case we have an id token but msal not ready
        if (this.idTokenReceivedInCallback) {
          this.log.info('authService.checkLoggedInState(): id token received but msal.getUserId returned null, trying again... ');
          setTimeout(() => {
            this.userId = this.idTokenReceivedInCallback;
            this.idTokenReceivedInCallback = undefined;
            this.checkLoggedInState(false).then(() => {
              this.log.info('second call to authService.checkLoggedInState() succeeded !');
              resolve(true);
            },
              () => {
                this.log.info('second call to authService.checkLoggedInState() failed !');
                resolve(false);
              });
          }, 1500);
        } else {
          this.setState(LoggedInState.loggedOut);
          resolve(false);
        }

      }
    });
  }

  public loggedInPolCheckTimeout() {
    setTimeout(this.loggedInPolCheck.bind(this), 1800000);
  }

  public loggedInPolCheck() {
    if (this.getUserId()) {
      this.tryAcquireTokenSilently()
        .then(
          () => {
            this.setState(LoggedInState.loggedIn);
            this.log.info('Acquire token silently succeeded');
            this.loggedInPolCheckTimeout();
          },
          error => {
            this.log.info('Acquire token silently failed');
            this.setLoggedOut();
          });
    } else {
      this.log.info('Get user id returned false');
      this.setLoggedOut();
    }
  }

  private setLoggedOut() {
    this.log.loggedOut();
    // this.setState(LoggedInState.loggedOut);
    setTimeout(this.logout.bind(this), 3000);
  }

  public getCachedToken() {

    if (!this.tokenExpires) {
      this.tokenExpires = parseInt(localStorage.getItem('tokenExpires'), 10);
    }

    if (this.tokenExpires > new Date().getTime()) {
      if (!this.token) {
        this.token = localStorage.getItem('token');
      }
      return this.token;
    }
    return null;
  }

  public redirectToActivation() {
    this.router.navigate(['/account/activate']);
  }

  public redirectToConfirmation() {
    this.router.navigate(['/account/confirm']);
  }

  public enter() {
    if (inIframe()) {
      return;
    }
    if (this.user) {
      if (this.loginRedirect && this.loginRedirect.toLowerCase() !== '/signin') {
        this.router.navigate([this.loginRedirect]);
        this.loginRedirect = undefined;
      } else if (window.location.pathname === '/' ||
        window.location.pathname === '' ||
        window.location.pathname.toLowerCase() === '/signin') {
        this.router.navigate(['/home']);
        this.loggedInPolCheckTimeout();
      }
    } else if (window.location.pathname === '/' || window.location.pathname === '') {
      this.router.navigate(['/signin']);
    }
  }

  public getToken() {
    return new Promise((resolve, reject) => {
      const cachedToken = this.getCachedToken();
      if (cachedToken) {
        this.log.info(`Using cached token`);
        resolve(cachedToken);
        return;
      } else {
        this.getTokenFromRemote().then(token => resolve(token), err => reject(err));
      }
    });
  }

  public tryAcquireTokenSilently() {
    this.setState(LoggedInState.attemptAcquireTokenSilently);
    tokenRequest.account = this.userId;
    return new Promise((resolve, reject) => {
      this.msalService.acquireTokenSilent(tokenRequest)
        .then(token => {
          this.setToken(token.accessToken);
          this.log.info('Acquired token silently', token);
          resolve(token);

        }, error => {
          this.log.info('Unable to acquire token silently', error);
          try {
            this.log.postActivity(UserActivity.Unknown, 'msal acquireTokenSilent - failed',
              {
                msalUserId: this.userId,
                error
              }).subscribe();
          } catch (e) {
          }
          reject(error);
        });
    });

  }

  getTokenFromRemote() {
    return new Promise((resolve, reject) => {
      this.setState(LoggedInState.attemptAcquireTokenSilently);
      this.tryAcquireTokenSilently()
        .then(token => {
          this.setState(LoggedInState.tokenAcquired);
          resolve(token);
        },
          error => {
            this.logout();
            this.deleteToken();
            this.router.navigate(['/signin']);
          });
    });

  }

  ngOnDestroy() {

    this.msalService.getAccount();
    this.broadcastService.getMSALSubject().next(1);
  }
}
