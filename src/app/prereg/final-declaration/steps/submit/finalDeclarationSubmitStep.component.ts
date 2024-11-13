import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../../../core/service/layout.service';
import { ApplicationStatus } from '../../../model/ApplicationStatus';
import { FinalDeclaration } from '../../model/FinalDeclaration';
import { FinalDeclarationStep } from '../../model/FinalDeclarationStep';
import { FinalDeclarationService } from '../../../../core/service/finalDeclaration.service';



@Component({
  selector: 'app-final-declaration-submit-step',
  templateUrl: './finalDeclarationSubmitStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => FinalDeclarationSubmitStepComponent)
    }
  ]
}) export class FinalDeclarationSubmitStepComponent extends FormStepComponent implements OnInit {
  showDetailsHelp = false;
  @Input() formId;
  @Input() application: FinalDeclaration;
  title = 'Comments';
  stepId = FinalDeclarationStep.Submit;
  serverErrors = [];
  submitting;
  traineeFeedback = '';
  countersigner;
  comments: any;
  maxChars = 2001;
  characterleft = this.maxChars;
  validationErrors: any;

  constructor(service: FormStepperService,
    private finalDeclarationService: FinalDeclarationService, private router: Router, private layout: LayoutService) {
    super(service);
  }

  ngOnInit() {
    this.countersigner = this.application.activeForm.countersignatures[0];
  }

  beforeNext() {
    const payload = {
      formId: this.application.activeForm.id,
      countersignatureId: this.countersigner.id,
      countersignerCommentId: this.countersigner.countersignerCommentId,
      traineeFeedbackOnTutorAssessment: this.traineeFeedback
    };
    this.submitting = true;
    this.serverErrors = [];
    this.finalDeclarationService.submitFinalDeclarationForm(payload).subscribe(() => {
      this.application.activeForm.formStatus = ApplicationStatus.Submitted;
      delete this.finalDeclarationService.application;
      this.router.navigate(['/home']);
      this.submitting = false;
    }, error => {
      this.layout.setOverlay(false);
      this.serverErrors = error.validationErrors;
      this.submitting = false;
    });
    return false;
  }

  validate() {
    const messages = [];
    const hasComment = this.traineeFeedback.length < this.maxChars;
    const valid = hasComment;

    if (!valid) {

      this.validity$.next({ valid: false, messages, touched: true });
    }

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  populateForm() { }


}
