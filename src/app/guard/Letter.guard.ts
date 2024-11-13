import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot,  ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../core/service/registration.service';
import { LogService } from '../core/service/log.service';
import { AuthService } from '../core/service/auth.service';
import { LetterType } from '../registration/model/LetterType';
import { map } from 'rxjs/operators';

@Injectable()
export class LetterGuard implements CanActivate {
    letterType;
    constructor(
        private log: LogService,
        private authService: AuthService,
        private regService: RegistrationService
    ) {}
    canActivate(route: ActivatedRouteSnapshot) {
      return true;
      const letterType = parseInt(route.params.letterType, 10);
      return this.regService.getLetters().pipe(map(letters => {
        const hasLetter = !!letters.find(letter => letter.letterType === letterType);
        if (hasLetter) {
          return true;
        } else {
          this.log.routeBlock('Letter not found', route.url[0].path);
          return false;
        }
      }));
    }
}
