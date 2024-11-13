import { Input, Component, forwardRef, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormValidator } from '../../../../dynamic/service/FormValidator';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { map, tap } from 'rxjs/operators';
import { AssessmentReportService } from '../../../../core/service/assessmentReport.service';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';

@Component({
  selector: 'app-assessment-report-ftp-declaration-step',
  templateUrl: './assessmentReportFtpDeclarationStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentReportFtpDeclarationStepComponent)
    },
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ]
}) export class AssessmentReportFtpDeclarationStepComponent extends FormStepComponent implements OnInit {
  declarationHeading;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  formIndex: number;
  @Input('formIndex') set setFormIndex(value) {
    this.formIndex = parseInt(value, 10);
  }
  title;
  stepId;
  dynamicFormId;
  valid;
  constructor(private assessmentReportService: AssessmentReportService, private validator: FormValidationService, service: FormStepperService) {
    super(service);
    this.form$.subscribe(form => {
      if (form) {
        this.dirty = form.dirty;
        this.valid = !form.invalid && form.completed;
        this.validate();
      }
    });
  }

  beforeNext() {
    return this.populateForm();
  }

  beforePrev() {
    return this.populateForm();
  }

  populateForm() {
    this.application.activeForm.declarations = this.application.activeForm.declarations
      .filter(d => d.dynamicFormId !== this.dynamicFormId);
    this.application.activeForm.declarations.push(this.validator.getPayload()[0]);
    return true;
  }

  ngOnInit() {
    this.title = 'Declaration (' + (this.formIndex + 1) + ')';
    if (this.formIndex === 0) {
      this.stepId = AssessmentReportStep.FtpDeclaration1;
      this.declarationHeading = 'Provisional registration: declaration of fitness to practise';
    }
    if (this.formIndex === 1) {
      this.stepId = AssessmentReportStep.FtpDeclaration2;
      this.declarationHeading = 'Provisional registration: declarations on joining the provisional register';
    }
  }

  validate() {
    const messages = [];
    if (!this.valid) {
      messages.push('You must answer all the questions to continue');
    }
    this.validity$.next({ valid: this.valid, messages, touched: this.touched });
  }

  load() {

    this.assessmentReportService.getDeclarationFormTemplates().subscribe(formTemplates => {
      const formTemplate = formTemplates[this.formIndex];
      const form = this.validator.addForm(formTemplate);
      this.dynamicFormId = form.dynamicFormId;
      const saved = this.application.activeForm.declarations.find(dec => dec.dynamicFormId === form.dynamicFormId);
      if (saved) {
        this.validator.loadAnswers(form, saved.answers);
      }

      // strip off any legacy declaration forms
      const currentDynamicFormIds = formTemplates.map(template => template.dynamicFormId);
      this.application.activeForm.declarations = this.application.activeForm.declarations
        .filter(f => currentDynamicFormIds.indexOf(f.dynamicFormId) > -1);

      this.validator.updateState();
      this.dirty = false;
      this.touched = false;
      this.ready$.next(true);
    });
  }

}


