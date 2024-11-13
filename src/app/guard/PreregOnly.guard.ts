import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';

@Injectable()
export class PreregOnlyGuard implements CanActivate {
  constructor(private authService: AuthService, private log: LogService) {}
  canActivate(route: ActivatedRouteSnapshot) {
    if (this.authService.user && this.authService.user.isPrereg) {
      return true;
    } else {
      this.log.routeBlock('You must be a pre-reg trainee to view this page', route.url[0].path);
      return false;
    }
  }
}
