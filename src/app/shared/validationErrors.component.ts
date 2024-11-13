import { Component, Input } from '@angular/core';
import { ValidationError } from '../core/model/ValidationError';

@Component({
  selector: 'app-validation-errors',
  templateUrl: './validationErrors.component.html'
}
) export class ValidationErrorsComponent {

  @Input() errors: Array<ValidationError> = [];
  @Input() block = false;

  get className() {
    if (this.block) {
      return 'form-error-block';
    }
    return  'form-error';
  }
  @Input() showAsServerError = false;
}

