import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';

@Injectable()
export class PreregAssessmentRegistrationGuard implements CanActivate {
  constructor(private authService: AuthService, private log: LogService) { }
  canActivate(route: ActivatedRouteSnapshot) {
    if (this.authService.user) {
      return true;
    } else {
      this.log.routeBlock('Please file your revalidation under your pharmacist account', route.url[0].path);
      return false;
    }

  }
}
