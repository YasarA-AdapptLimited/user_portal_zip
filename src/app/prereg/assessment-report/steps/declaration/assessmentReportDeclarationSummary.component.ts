import { Input, Component, OnInit } from '@angular/core';
import { FormValidator } from '../../../../dynamic/service/FormValidator';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormQuestion } from '../../../../dynamic/model/FormQuestion';
import { map } from 'rxjs/operators';
import { AssessmentReport } from '../../models/AssessmentReport';
import { AssessmentReportApplicationForm } from '../../models/AssessmentReportApplicationForm';
import { AssessmentReportService } from '../../../../core/service/assessmentReport.service';

@Component({
  selector: 'app-assessment-report-declaration-summary',
  templateUrl: './assessmentReportDeclarationSummary.component.html',
  providers: [
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ],
  styleUrls: ['./declarationSummary.scss']
}) export class AssessmentReportDeclarationSummaryComponent implements OnInit {
  empty = false;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  formIndex: number;
  @Input('formIndex') set setFormIndex(value) {
    this.formIndex = parseInt(value, 10);
  }
  @Input() application: AssessmentReport;
  @Input() formId;
  applicationForm: AssessmentReportApplicationForm;
  dynamicFormId;
  hasToDeclare: Array<FormQuestion> = [];
  constructor(
    private assessmentReportService: AssessmentReportService,
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
    this.assessmentReportService.getDeclarationFormTemplates().subscribe(formTemplates => {
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


