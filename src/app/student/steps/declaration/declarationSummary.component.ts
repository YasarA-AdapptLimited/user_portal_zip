import { Input, Component, OnInit } from '@angular/core';
import { PreregService } from '../../../core/service/prereg.service';
import { FormValidator } from '../../../dynamic/service/FormValidator';
import { FormValidationService } from '../../../dynamic/service/formValidationService';
import { PreregApplication } from '../../../shared/model/student/PreregApplication';
import { FormQuestion } from '../../../dynamic/model/FormQuestion';
import { PreregApplicationForm } from '../../../shared/model/student/PreregApplicationForm';
import { map } from 'rxjs/operators';
import { StudentService } from '../../../core/service/student.service';

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
  @Input() application: PreregApplication;
  @Input() formId;
  applicationForm: PreregApplicationForm;
  dynamicFormId;
  hasToDeclare: Array<FormQuestion> = [];
  constructor(
    private studentService: StudentService,
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
      this.studentService.getDeclarationFormTemplates().subscribe(formTemplates => {
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


