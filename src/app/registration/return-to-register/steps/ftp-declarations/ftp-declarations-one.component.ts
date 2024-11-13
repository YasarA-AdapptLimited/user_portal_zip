import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReturnToRegisterService } from '../../../../core/service/returnToRegister.service';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormValidator } from '../../../../dynamic/service/FormValidator';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';

@Component({
  selector: 'app-ftp-declarations-one',
  templateUrl: './ftp-declarations-one.component.html',
  styleUrls: ['./ftp-declarations-one.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => FtpDeclarationOneComponent)
    },
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }    
  ]
})

export class FtpDeclarationOneComponent extends FormStepComponent implements OnInit {

  stepId = ReturnToRegisterStep.FtpDeclarationsOne;
  title = 'Fitness to practise declarations (1)';
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  valid;
  formIndex: number;
  @Input('formIndex') set setFormIndex(value) {
    this.formIndex = parseInt(value, 10);
  }
  dynamicFormId;
  declarationHeading;
  
  constructor(private formStepperService: FormStepperService, private validator: FormValidationService,
    private rtrService: ReturnToRegisterService) {
    super(formStepperService);
    this.form$.subscribe(form => {
      if (form) {
        this.dirty = form.dirty;
        this.valid = !form.invalid && form.completed;
      }
    });
   }

  ngOnInit(): void {            
      if (this.formIndex === 0) {
        this.title = 'Fitness to practise declarations (1)';
        this.stepId = ReturnToRegisterStep.FtpDeclarationsOne;        
      }
      if (this.formIndex === 1) {
        this.title = 'Declarations on joining the register';
        this.stepId = ReturnToRegisterStep.RegistrationJoinDeclarations;        
      }
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

  load(): void {
    this.rtrService.getDeclarationFormTemplates().subscribe(formTemplates => {
      const formTemplate = formTemplates[this.formIndex];
      const form = this.validator.addForm(formTemplate);
      this.dynamicFormId = form.dynamicFormId;
      if(this.application.activeForm.declarations && this.application.activeForm.declarations.length > 0) {
        const saved = this.application.activeForm.declarations.find(dec => dec.dynamicFormId === form.dynamicFormId);
        if (saved) {
          this.validator.loadAnswers(form, saved.answers);
        }
      }    

      // strip off any legacy declaration forms
      const currentDynamicFormIds = formTemplates.map(template => template.dynamicFormId);
      this.application.activeForm.declarations = this.application.activeForm.declarations
        .filter(f => currentDynamicFormIds.indexOf(f.dynamicFormId) > -1 );

      this.validator.updateState();
      this.dirty = false;
      this.touched = false;
      this.ready$.next(true);
    });
  }

  validate() { 
    const messages = [];
    if (!this.valid) {
      messages.push('You must answer all the questions to continue');
    }
    this.validity$.next({ valid: this.valid, messages, touched: this.touched });
  }

}
