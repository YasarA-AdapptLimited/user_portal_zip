import { Input, Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';
import { FormQuestion } from '../../../../../app/dynamic/model/FormQuestion';
import { FormValidationService } from '../../../../../app/dynamic/service/formValidationService';
import { FormValidator } from '../../../../../app/dynamic/service/FormValidator';
import { CCPSApplication } from '../../model/ccpsApplication';
import { CCPSForm } from '../../model/ccpsForm';
import { CCPSService } from '../../../../../app/core/service/ccps.service';

@Component({
  selector: 'app-ccps-declaration-summary',
  templateUrl: './declarationSummary.component.html',
  providers: [
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ],
  styleUrls: ['./declarationSummary.scss']
}) export class CCPSDeclarationSummaryComponent implements OnInit {
  empty = false;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  formIndex = 0;
  @Input() application: CCPSApplication;
  @Input() formId;
  applicationForm: CCPSForm;
  dynamicFormId;
  hasToDeclare: Array<FormQuestion> = [];
  constructor(
     private ccpsService: CCPSService,
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
      this.ccpsService.getDeclarationFormTemplates().subscribe(formTemplates => {
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


