import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AccountActivationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private log: LogService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {

   // if (environment.dev) {
      return true;
   // }
   /*
    if (this.authService.userId && !this.authService.user) {
      return true;
    } else if (this.authService.user) {
      this.log.routeBlock('Your account has already been activated', route.url[0].path);
     // this.authService.logout();
      return false;
    } else {
      this.log.routeBlock('You must sign to activate your account', route.url[0].path);
      return false;
    }
    */
  }
}
