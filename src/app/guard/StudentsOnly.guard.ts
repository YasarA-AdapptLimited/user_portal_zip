import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';

@Injectable()
export class StudentsOnlyGuard implements CanActivate {
  constructor(private authService: AuthService, private log: LogService) {}
  canActivate(route: ActivatedRouteSnapshot) {
    if (this.authService.user && this.authService.user.isStudent) {
      return true;
    } else {
      this.log.routeBlock('You must be a student to view this page', route.url[0].path);
      return false;
    }
  }
}
