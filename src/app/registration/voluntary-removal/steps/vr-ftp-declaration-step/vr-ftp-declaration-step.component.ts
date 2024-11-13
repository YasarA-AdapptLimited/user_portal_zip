import { Input, Component, forwardRef, OnInit, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormValidator } from '../../../../dynamic/service/FormValidator';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { map, tap } from 'rxjs/operators';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { VoluntaryRemovalApplicationStep } from '../../model/VoluntaryRemovalApplicationStep';
import { FormQuestion } from '../../../../dynamic/model/FormQuestion';
import { Form } from '../../../../dynamic/model/Form';
import { FormTemplate } from '../../../../dynamic/model/FormTemplate';
import { MatDialog } from '@angular/material/dialog';
import { FormType } from '../../../../dynamic/model/FormType';



@Component({
  selector: 'app-vr-ftp-declaration-step',
  templateUrl: './vr-ftp-declaration-step.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => VrFtpDeclarationStepComponent)
    },
    FormValidationService,
    { provide: FormValidator, useExisting: FormValidationService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
}) export class VrFtpDeclarationStepComponent extends FormStepComponent implements OnInit {
  declarationHeading;
  form$ = this.validator.state$.pipe(map(forms => forms[0]));
  formIndex: number;
  form: Form;
  formTemplate: FormTemplate;
  formType:FormType;
  saved: any;
  getFtpAnswers: void;
  isFtpQ1DeclareYes: any;
  @Input() question: FormQuestion;
  @Input('formIndex') set setFormIndex(value) {
    this.formIndex = parseInt(value, 10);
  }
  title;
  stepId;
  dynamicFormId;
  valid;
  isDeclareYes: Array<FormQuestion> = [];
  isPartlyNo = [];
  @Output() navigate = new EventEmitter();
  hasDeclareYes: Array<FormQuestion> = [];
  currentDynamicFormIds;
 
  constructor(private vrService: VoluntaryRemovalService, private validator: FormValidationService,
    service: FormStepperService, private dialog: MatDialog) {
    super(service);
    this.form$.subscribe(form => {
      if (form) {
        this.dirty = form.dirty;
        this.valid = !form.invalid && form.completed;
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
    this.application.activeForm.ftpDeclarations = this.application.activeForm.ftpDeclarations
      .filter(d => d.dynamicFormId !== this.dynamicFormId);

    this.application.activeForm.ftpDeclarations.push(this.validator.getPayload()[0]);

    return true;
  }

  sendFtpAnsers(ftpAnsers) {
    this.vrService.sendFtpDeclarationAnswers(ftpAnsers);
  }

  ngOnInit() {
    this.title = 'Ftp declarations';
    if (this.formIndex === 0) {
      this.stepId = VoluntaryRemovalApplicationStep.FtPDeclarations;
      this.declarationHeading = 'Voluntary removal: declaration of fitness to practise';
    }
   
  }

  getFtpUpdatedAnswers() {
    if (this.isPartlyNo.length > 0 ) {
     return this.sendFtpAnsers(true);
    } else if ( this.isDeclareYes.length > 0) {
     return this.sendFtpAnsers(false);
    } else if (this.isDeclareYes.length === 0 && this.isPartlyNo.length === 0) {
     return this.sendFtpAnsers(null);
    }
  }


validate() {
  const messages = [];
 
 this.getFtpUpdatedAnswers();
  if (!this.valid) {
    messages.push('You must answer all the questions to continue');
  }
  this.validity$.next({ valid: this.valid, messages, touched: this.touched });
}


 load() {
    this.vrService.getDeclarationFormTemplates().subscribe(formTemplates => {
      this.formTemplate = formTemplates[this.formIndex];
      this.form = this.validator.addForm(this.formTemplate);
      this.dynamicFormId = this.form.dynamicFormId;
      this.formType = formTemplates[this.formIndex].type;
      this.saved = this.application.activeForm.ftpDeclarations.find(dec => dec.dynamicFormId === this.form.dynamicFormId);
      if (this.saved) {
      this.validator.loadAnswers(this.form, this.saved.answers);
      }
      this.isPartlyNo = this.form.questionGroups.reduce((acc, group) => {
        acc = acc.concat(group.questions.filter(q => this.validator.hasToDeclare(q)));
        return acc;
      }, []);
  
      this.isDeclareYes = this.form.questionGroups.reduce((acc, group) => {
        acc = acc.concat(group.questions.filter(q => this.validator.hasAnsweredYes(q)));
        return acc;
      }, []);


      this.currentDynamicFormIds = formTemplates.map(template => template.dynamicFormId);
      this.application.activeForm.ftpDeclarations = this.application.activeForm.ftpDeclarations
        .filter(f => this.currentDynamicFormIds.indexOf(f.dynamicFormId) > -1);

      this.validator.updateState();
      this.dirty = false;
      this.touched = false;
      this.ready$.next(true);

    });
  }
}


