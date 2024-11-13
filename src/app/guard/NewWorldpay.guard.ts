import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';

@Injectable()
export class NewWorldpayGuard implements CanActivate {
  constructor(private authService: AuthService, private log: LogService) {}
  canActivate(route: ActivatedRouteSnapshot) {
    if (this.authService.user && this.authService.user.useNewWorldpayFlow) {
      return true;
    } else {
      return false;
    }
  }
}