import { AfterViewInit, Component, forwardRef, OnInit } from '@angular/core';
import { ReturnToRegisterService } from '../../../../core/service/returnToRegister.service';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';

@Component({
  selector: 'app-application-declarations',
  templateUrl: './application-declarations.component.html',
  styleUrls: ['./application-declarations.component.css'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => ApplicationDeclarationsComponent)
    },
    FormValidationService
  ]
})
export class ApplicationDeclarationsComponent extends FormStepComponent
  implements OnInit, AfterViewInit {


  constructor(service: FormStepperService, private rtrService: ReturnToRegisterService) {
    super(service);
  }
  viewReady = false;
  saving = false;
  title = 'Application declarations';
  stepId = ReturnToRegisterStep.ApplicationDeclarations;
  showDetailsHelp = false;
  isNoToAllFtpDeclarations = false;
  isPartlyNotifiedYes = false;
  noticedByGphc = false;

  ngOnInit() {
  }

  update() {
    this.makeDirty();
    this.validate();
  }

  load() {
    if (this.viewReady) {
      this.ready$.next(true);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
      this.viewReady = true;
    });
  }

  validate() {
    const {
      isQ1Confirmed, isQ2Confirmed, isQ3Confirmed
    } = this.application.activeForm.appDeclaration;
    const isOverallDeclarationAcknowledged = this.application.activeForm.isOverallDeclarationAcknowledged;
    const valid = (isQ1Confirmed && isQ2Confirmed && isQ3Confirmed) || isOverallDeclarationAcknowledged;
    const messages = [];

    if (!isQ1Confirmed) {
      messages.push('You have not confirmed the 1st declaration');
    }
    if (!isQ2Confirmed) {
      messages.push('You have not confirmed the 2nd declaration');
    }
    if (!isQ3Confirmed) {
      messages.push('You have not confirmed the 3rd declaration');
    }
    if (!isOverallDeclarationAcknowledged) {
      messages.push('You have to complete over all declaration');
    }
    this.validity$.next({ valid: messages.length === 0, messages, touched: this.touched });
  }

  populateForm() { }

}
