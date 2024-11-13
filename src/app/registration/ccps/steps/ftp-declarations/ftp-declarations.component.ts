import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { CCPSApplicationStep } from '../../model/ccpsApplicationStep';
import { FormValidationService } from '../../../../../app/dynamic/service/formValidationService';
import { map } from 'rxjs/operators';
import { CCPSService } from '../../../../../app/core/service/ccps.service';
import { FormValidator } from '../../../../../app/dynamic/service/FormValidator';

@Component({
  selector: 'app-ftp-declarations',
  templateUrl: './ftp-declarations.component.html',
  styleUrls: ['./ftp-declarations.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => FtpDeclarationsComponent)
    },
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ]
})
export class FtpDeclarationsComponent extends FormStepComponent implements OnInit {

  title = 'Fitness to practise declarations';
  stepId = CCPSApplicationStep.FtPDeclarations;
  @Input() application;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  valid;
  dynamicFormId: any;
  formIndex: number=0;

  constructor(formStpperService: FormStepperService,private validator: FormValidationService,private ccpsService:CCPSService) {
    super(formStpperService);
    this.form$.subscribe(form => {
      if (form) {
        this.dirty = form.dirty;
        this.valid = !form.invalid && form.completed;
      }
    });
   }

  ngOnInit(): void {
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


  validate() { 
    const messages = [];
    if (!this.valid) {
      messages.push('You must answer all the questions to continue');
    }
    this.validity$.next({ valid: this.valid, messages, touched: this.touched });
  }

  load() {

    this.ccpsService.getDeclarationFormTemplates().subscribe(formTemplates => {
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
        .filter(f => currentDynamicFormIds.indexOf(f.dynamicFormId) > -1 );

      this.validator.updateState();
      this.dirty = false;
      this.touched = false;
      this.ready$.next(true);
    });
  }

}
