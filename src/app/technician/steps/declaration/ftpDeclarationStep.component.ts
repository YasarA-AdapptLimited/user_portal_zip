import { Input, Component, forwardRef, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { FormValidator } from '../../../dynamic/service/FormValidator';
import { FormValidationService } from '../../../dynamic/service/formValidationService';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { map, tap } from 'rxjs/operators';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { TechnicianService } from '../../../core/service/technician.service';

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
  formIndex: number;
  @Input('formIndex') set setFormIndex(value) {
    this.formIndex = parseInt(value, 10);
  }
  title;
  stepId;
  dynamicFormId;
  valid;
  constructor(private technicianService: TechnicianService, private validator: FormValidationService, service: FormStepperService) {
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
    this.title = 'Declaration ('  + (this.formIndex + 1) + ')';
    if (this.formIndex === 0) {
      this.stepId = TechnicianApplicationStep.FtpDeclaration1;
      this.declarationHeading = 'Declaration of fitness to practise';
    }
    if (this.formIndex === 1) {
      this.stepId = TechnicianApplicationStep.FtpDeclaration2;
      this.declarationHeading = 'Declarations on joining the register';
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

    this.technicianService.getDeclarationFormTemplates().subscribe(formTemplates => {
      const formTemplate = formTemplates[this.formIndex];
      const form = this.validator.addForm(formTemplate);
      this.dynamicFormId = form.dynamicFormId;
      const saved = this.application.activeForm.declarations.find(dec => dec.dynamicFormId === form.dynamicFormId);
      if (saved) {
        this.validator.loadAnswers(form, saved.answers);
      }

      const currentDynamicFormIds = formTemplates.map(template => template.dynamicFormId);
      this.application.activeForm.declarations = this.application.activeForm.declarations
        .filter(f => currentDynamicFormIds.indexOf(f.dynamicFormId) > -1 );

      this.validator.updateState();
      this.dirty = false;
      this.touched = false;
      this.ready$.next(true);
    });
  }

}


