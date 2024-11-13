import { Input, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { FormQuestion } from '../../../../dynamic/model/FormQuestion';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormValidator } from '../../../../dynamic/service/FormValidator';
import { VoluntaryRemovalApplication } from '../../model/VoluntaryRemovalApplication';
import { VoluntaryRemovalApplicationForm } from '../../model/VoluntaryRemovalApplicationForm';

@Component({
  selector: 'app-vr-declaration-summary',
  templateUrl: './vr-declaration-summary.component.html',
  providers: [
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ],
  styleUrls: ['./vr-declaration-summary.scss']
}) export class VrDeclarationSummaryComponent implements OnInit {
  empty = false;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  formIndex: number;
  @Input('formIndex') set setFormIndex(value) {
    this.formIndex = parseInt(value, 10);
  }
  @Input() application: VoluntaryRemovalApplication;
  @Input() formId;
  applicationForm: VoluntaryRemovalApplicationForm;
  dynamicFormId;
  hasToDeclare: Array<FormQuestion> = [];
  constructor(
    private vrService: VoluntaryRemovalService,
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
      this.vrService.getDeclarationFormTemplates().subscribe(formTemplates => {
        const formTemplate = formTemplates[this.formIndex];
        const form = this.validator.addForm(formTemplate);
        this.dynamicFormId = form.dynamicFormId;
        const saved = this.applicationForm.ftpDeclarations.find(dec => dec.dynamicFormId === form.dynamicFormId);
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


