import { AfterViewInit, Component, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormValidationService } from '../../../../dynamic/service/formValidationService';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { VoluntaryRemovalApplication } from '../../model/VoluntaryRemovalApplication';
import { VoluntaryRemovalApplicationStep } from '../../model/VoluntaryRemovalApplicationStep';
import { VrFtpDeclarationStepComponent } from '../vr-ftp-declaration-step/vr-ftp-declaration-step.component';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-vr-application-declarations-step',
  templateUrl: './vr-application-declarations-step.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => VrApplicationDeclarationsStepComponent)
    },
    FormValidationService, VrFtpDeclarationStepComponent
  ]
})
export class VrApplicationDeclarationsStepComponent  extends FormStepComponent
implements OnInit, AfterViewInit, OnDestroy {


constructor(service: FormStepperService, private vrService: VoluntaryRemovalService) {
  super(service);
  this.getFtpAnswers();
}
viewReady = false;

@Input() application: VoluntaryRemovalApplication;

saving = false;
title = 'Application declarations';
stepId = VoluntaryRemovalApplicationStep.Declarations;
showDetailsHelp = false;
isNoToAllFtpDeclarations = false;
isPartlyNotifiedYes = false;
noticedByGphc = false;
data;
public subscription: Subscription;
@ViewChild(VrFtpDeclarationStepComponent) ftp: VrFtpDeclarationStepComponent;
ngOnInit() {
  this.vrService.sendFtpDeclarationAnswers(this.application.activeForm.appDeclaration.isQ2Confirmed);
 }

getFtpAnswers() {
    this.subscription = this.vrService.data$.subscribe(response => {
      this.data = response;
        if (this.data === true ) {
          this.noticedByGphc = false;
          this.application.activeForm.clearApplicationDeclarations();
          this.isNoToAllFtpDeclarations = false;
          this.isPartlyNotifiedYes = true;
        } else if ( this.data === false) {
          this.isPartlyNotifiedYes = false;
          this.noticedByGphc = true;
          this.isNoToAllFtpDeclarations = false;
          this.application.activeForm.clearApplicationDeclarations();
        } else if (this.data === null) {
          this.isPartlyNotifiedYes = false;
          this.noticedByGphc = false;
          this.isNoToAllFtpDeclarations = true;
          this.application.activeForm.clearApplicationDeclarations();
        }
    });
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
  isQ1Confirmed, isQ2Confirmed
 } = this.application.activeForm.appDeclaration;

  const valid = isQ1Confirmed && isQ2Confirmed;
  const messages = [];

  if (!isQ1Confirmed) {
    messages.push('You have not confirmed the 1st declaration');
  }
  if (!isQ2Confirmed) {
    messages.push('You have not confirmed the 2nd declaration');
  }
  if (!valid) {
    messages.push('You have to complete this section first');
  }
  this.validity$.next({ valid, messages, touched: this.touched });
}

populateForm() { }

ngOnDestroy() {
  this.subscription.unsubscribe();
}
}
