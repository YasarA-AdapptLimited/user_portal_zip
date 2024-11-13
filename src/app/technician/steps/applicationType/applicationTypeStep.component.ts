import { Component, forwardRef, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { Tooltip } from '../../../core/tooltip/Tooltip';
import { ApplicationProcessType } from '../../model/ApplicationProcessType';
import { EvidenceType } from '../../model/EvidenceType';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirmDialog.component';
import { TechnicianApplication } from '../../model/TechnicianApplication';


@Component({
  selector: 'app-application-type-step',
  templateUrl: './applicationTypeStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => ApplicationTypeStepComponent)
    }
  ],
  styleUrls: ['./applicationTypeStep.component.scss']
})
export class ApplicationTypeStepComponent extends FormStepComponent implements AfterViewInit {
  showDetailsHelp = false;
  stepId = TechnicianApplicationStep.EvidenceType;
  ApplicationProcessType = ApplicationProcessType;
  @Output() dependentStepsCleared = new EventEmitter();
  EvidenceType = EvidenceType;
  title = 'Application type';
  viewReady = false;
  showHelp = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };


  constructor(service: FormStepperService, private dialog: MatDialog) {
    super(service);
  }


  beforePrev() {
    this.dirty = false;
    return true;
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


  update($value) {
    const hasWorkExperiences = !!this.application.activeForm.workExperiences.length;
    const hasSupportingDocs = !!this.application.activeForm.attachments.length;
    if (hasWorkExperiences || hasSupportingDocs) {
      this.warnForChangeAppType().afterClosed().subscribe(confirmed => {
        confirmed ?
          this.clearDependentSteps() :
          ($value === ApplicationProcessType.TwoYears) ?
          this.application.activeForm.applicationType = ApplicationProcessType.LessThanTwoYears :
          this.application.activeForm.applicationType = ApplicationProcessType.TwoYears;
      });
    }

    this.makeDirty();
    this.validate();
  }

  clearDependentSteps() {
   (<TechnicianApplication>this.application).activeForm.clearStepsDependentOnApplicationType();
   this.dependentStepsCleared.emit('cleared');
  }

  warnForChangeAppType() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message:
          `Changing the data on this step will clear the following steps if they are filled:
          - Work experience
          - Previous applications and registrations
          - Supporting documents. Do you wish to continue ?
        `
      }
    });
    return dialogRef;
  }

  validate() {
    // console.log(this.application.activeForm);
    const messages = [];
    const hasApplicationTypeValue = !!this.application.activeForm.applicationType;

    if (!hasApplicationTypeValue) {
      messages.push('You must choose one of the options displayed');
    }

    this.validity$.next({ valid: !messages.length, messages, touched: this.touched });
  }

  populateForm() { }
}

