import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/service/auth.service';
import { LogService } from '../core/service/log.service';

@Injectable()
export class UserLoadedGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private log: LogService,
    private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot):Observable<boolean> | Promise<boolean> | boolean {
     // this fix has been implemented to resolve browser reload issue after signing in
      return new Promise((resolve) => {
      setTimeout(() => {
      if (this.authService.user) {
        resolve(true);
      } else {
        this.log.routeBlock('You must sign in to view this page', route.url[0].path);
        this.authService.loginRedirect = window.location.pathname;
        this.router.navigate(['./signin']);
        resolve(false);
      }
    }, 0);
  })
      
    }
}
