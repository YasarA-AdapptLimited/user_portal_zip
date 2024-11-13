import { Input, Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';
import { ReturnToRegisterService } from '../../../../../app/core/service/returnToRegister.service';
import { FormQuestion } from '../../../../../app/dynamic/model/FormQuestion';
import { FormValidationService } from '../../../../../app/dynamic/service/formValidationService';
import { FormValidator } from '../../../../../app/dynamic/service/FormValidator';

import { ReturnToRegisterApplication } from '../../model/ReturnToRegister';
import { ReturnToRegisterApplicationForm } from '../../model/ReturnToRegisterApplicationForm';

@Component({
  selector: 'app-declaration-summary',
  templateUrl: './declarationSummary.component.html',
  providers: [
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ],
  styleUrls: ['./declarationSummary.scss']
}) export class DeclarationSummaryComponent implements OnInit {
  empty = false;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  formIndex = 0;
  @Input() application: ReturnToRegisterApplication;
  @Input() formId;
  applicationForm: ReturnToRegisterApplicationForm;
  dynamicFormId;
  hasToDeclare: Array<FormQuestion> = [];
  constructor(
     private rtrService: ReturnToRegisterService,
    private validator: FormValidationService
  ) {
  }

  ngOnInit() {
    this.setForm();
    this.load();
  }

  setForm() {
    if (this.formId) {
      this.applicationForm = this.application.pastApplications
        .find(pastApp => pastApp.id === this.formId);
    } else {
      this.applicationForm = this.application.activeForm;
    }
  }

  load() {
      this.rtrService.getDeclarationFormTemplates().subscribe(formTemplates => {
        const form = this.validator.addForm(formTemplates[0]);
        this.dynamicFormId = form.dynamicFormId;
        const saved = this.applicationForm.declarations.find(dec => dec.dynamicFormId === form.dynamicFormId);
        if (!saved) {
          this.empty = true;
          return;
        }
        this.validator.loadAnswers(form, saved.answers);
        this.hasToDeclare = form.questionGroups.reduce((acc, group) => {
          acc = acc.concat(group.questions.filter(q => this.validator.hasAnsweredYes(q)));
          return acc;
        }, []);
      });
  }
}


