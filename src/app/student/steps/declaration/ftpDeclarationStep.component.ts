import { Input, Component, forwardRef, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { FormValidator } from '../../../dynamic/service/FormValidator';
import { FormValidationService } from '../../../dynamic/service/formValidationService';
import { PreregApplicationStep } from '../../../shared/model/student/PreregApplicationStep';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { map, tap } from 'rxjs/operators';
import { StudentService } from '../../../core/service/student.service';

@Component({
  selector: 'app-ftp-declaration-step',
  templateUrl: './ftpDeclarationStep.component.html',
  styleUrls: ['./ftpDeclarationStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => FtpDeclarationStepComponent)
    },
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ]
}) export class FtpDeclarationStepComponent extends FormStepComponent implements OnInit {
  declarationHeading;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));

  title;
  stepId = PreregApplicationStep.FtpDeclaration;
  dynamicFormId;
  valid;
  constructor(private studentService: StudentService, private validator: FormValidationService, service: FormStepperService) {
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
    this.title = 'FtP declaration';

    this.declarationHeading = 'Declaration of fitness to practise';

  }

  validate() {
    const messages = [];
    if (!this.valid) {
      messages.push('You must answer all the questions to continue');
    }
    this.validity$.next({ valid: this.valid, messages, touched: this.touched });
  }

  load() {

    this.studentService.getDeclarationFormTemplates().subscribe(formTemplates => {
      const form = this.validator.addForm(formTemplates[0]);
      this.dynamicFormId = form.dynamicFormId;
      const saved = this.application.activeForm.declarations.find(dec => dec.dynamicFormId === form.dynamicFormId);
      if (saved) {
        this.validator.loadAnswers(form, saved.answers);
      }

      this.validator.updateState();
      this.dirty = false;
      this.touched = false;
      this.ready$.next(true);
    });
  }

}


