import { Input, Component, OnInit } from '@angular/core';
import { PreregService } from '../../../core/service/prereg.service';
import { FormValidator } from '../../../dynamic/service/FormValidator';
import { FormValidationService } from '../../../dynamic/service/formValidationService';
import { RegApplication } from '../../model/RegApplication';
import { FormQuestion } from '../../../dynamic/model/FormQuestion';
import { RegApplicationForm } from '../../model/RegApplicationForm';
import { map } from 'rxjs/operators';

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
  formIndex: number;
  @Input('formIndex') set setFormIndex(value) {
    this.formIndex = parseInt(value, 10);
  }
  @Input() application: RegApplication;
  @Input() formId;
  applicationForm: RegApplicationForm;
  dynamicFormId;
  hasToDeclare: Array<FormQuestion> = [];
  constructor(
    private preregService: PreregService,
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
      this.preregService.getDeclarationFormTemplates().subscribe(formTemplates => {
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


