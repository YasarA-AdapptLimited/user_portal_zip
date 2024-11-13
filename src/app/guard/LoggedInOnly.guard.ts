import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';

@Injectable()
export class LoggedInOnlyGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private log: LogService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.authService.user) {
      return true;
    } else {
      this.log.routeBlock('You must sign in to view this page', route.url[0].path);
      this.authService.loginRedirect = window.location.pathname;
      this.router.navigate(['./signin']);
      return false;
    }
  }
}
