import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Form } from '../dynamic/model/Form';
import { RenewalService } from '../core/service/renewal.service';
import { FormValidationService } from '../dynamic/service/formValidationService';
import { FormQuestion } from '../dynamic/model/FormQuestion';
import { AuthService } from '../core/service/auth.service';
import { api } from '../shared/service/utils';

@Component({
  selector: 'app-declaration',
  moduleId: module.id,
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeclarationComponent {

  @Input('form') set setForm(form: Form) {
    this.form = form;
    this.checkForRevalidationQuestion();
  }

  @Input() titleVisible = true;
  @Input() revalidationCompleted = true;
  constructor(
    private validator: FormValidationService,
    private auth: AuthService
  ) { }

  form: Form;
  showRevalidationWarning = false;

  checkForRevalidationQuestion() {
    if (this.auth.user.isRegistrant) {
      const revalidationQuestion: FormQuestion = this.validator.getQuestionByShortname(this.form, 'QE');
      const dateOfFirstCohort = new Date(api.formatDate('2018-12-31'));
      const userRenewalDate = new Date(api.formatDate(this.auth.user.registrant.renewalDate));
      if (revalidationQuestion !== undefined) {
        revalidationQuestion.alternativeSelected.subscribe(alternative => {
          // if the users renewal date is on or after december 31st show message
          this.showRevalidationWarning =
            (alternative.name === 'Y' && !this.revalidationCompleted && (userRenewalDate >= dateOfFirstCohort));
        });
      }
    }
  }

}
