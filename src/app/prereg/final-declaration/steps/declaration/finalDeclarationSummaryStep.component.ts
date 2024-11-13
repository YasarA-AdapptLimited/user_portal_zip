import { Input, Component, OnInit } from '@angular/core';
import { FormValidator } from '../../../../dynamic/service/FormValidator';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormQuestion } from '../../../../dynamic/model/FormQuestion';
import { map } from 'rxjs/operators';
import { FinalDeclaration } from '../../model/FinalDeclaration';
import { FinalDeclarationApplicationForm } from '../../model/FinalDeclarationApplicationForm';
import { FinalDeclarationService } from '../../../../core/service/finalDeclaration.service';

@Component({
  selector: 'app-final-declaration-summary',
  templateUrl: './finalDeclarationSummaryStep.component.html',
  providers: [
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ],
  styleUrls: ['./finalDeclarationSummary.scss']
}) export class FinalDeclarationSummaryComponent implements OnInit {
  empty = false;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  formIndex: number;
  @Input('formIndex') set setFormIndex(value) {
    this.formIndex = parseInt(value, 10);
  }
  @Input() application: FinalDeclaration;
  @Input() formId;
  applicationForm: FinalDeclarationApplicationForm;
  dynamicFormId;
  hasToDeclare: Array<FormQuestion> = [];
  constructor(
    private finalDeclarationService: FinalDeclarationService,
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
    this.finalDeclarationService.getDeclarationFormTemplates().subscribe(formTemplates => {
      const formTemplate = formTemplates[this.formIndex];
      const form = this.validator.addForm(formTemplate);
      this.dynamicFormId = form.dynamicFormId;
      const saved = this.applicationForm.declarations.find(dec => dec.dynamicFormId === form.dynamicFormId);
      if (!saved) {
        this.empty = true;
        return;
      }
      this.validator.loadAnswers(form, saved.answers);
      this.hasToDeclare = form.questionGroups.reduce((acc, group) => {
        acc = acc.concat(group.questions.filter(q => this.validator.hasToDeclare(q)));
        return acc;
      }, []);
    });
  }
}


