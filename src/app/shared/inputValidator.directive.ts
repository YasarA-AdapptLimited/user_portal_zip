import {
  AbstractControl, AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors, Validator
} from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { patternToTestLatinAlphabets } from './user-address/userAddress';

@Directive({
  selector: '[inputValidator][ngModel],[inputValidator][FormControl],[inputValidator][div.content]',
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: InputValidator, multi: true }
  ]
})
export class InputValidator implements AsyncValidator {

  constructor() { }

  validate(control?: AbstractControl): Observable<ValidationErrors | null> {

    return of(this._validateInternal(control));
  }


  _validateInternal(control: AbstractControl): ValidationErrors | null {
    const val = control.value;

    const pattern = patternToTestLatinAlphabets;
    if (pattern.test(val)) {
      return null;
    } else {
      return { inputValidator: "Please only enter characters from the Latin alphabet" }
    }


  }

}
