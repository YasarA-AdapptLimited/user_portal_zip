import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';

@Injectable()
export class NotRevalidationExemptGuard implements CanActivate {
  constructor(private authService: AuthService, private log: LogService) { }
  canActivate(route: ActivatedRouteSnapshot) {
    const authUser = this.authService.user && this.authService.user.registrant;
    if (!(authUser && authUser.exemptFromRevalidationSubmissions)) {
      return true;
    } else {
      this.log.routeBlock('Please file your revalidation under your pharmacist account', route.url[0].path);
      return false;
    }
  }
}
