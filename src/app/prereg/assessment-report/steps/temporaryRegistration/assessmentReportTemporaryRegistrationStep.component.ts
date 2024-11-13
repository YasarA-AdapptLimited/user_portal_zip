import { Component, forwardRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { Tooltip } from '../../../../core/tooltip/Tooltip';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';
import { AssessmentReport } from '../../models/AssessmentReport';
import { ConfirmDialogComponent } from '../../../../shared/confirmDialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-assessment-report-temporary-registration-step',
  templateUrl: './assessmentReportTemporaryRegistrationStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentReportTemporaryRegistrationStepComponent)
    }
  ],
  styleUrls: ['./temporaryRegistration.scss']
})
export class AssessmentReportTemporaryRegistrationStepComponent extends FormStepComponent implements OnInit {
  title = 'Provisional registration application';
  stepId = AssessmentReportStep.TemporaryRegistration;
  showDetailsHelp = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  @Input() application: AssessmentReport;
  @Output() hasTempReg = new EventEmitter();
  temreg;

  constructor(service: FormStepperService, private dialog: MatDialog) {
    super(service);
  }

  ngOnInit() {
  }

  update() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: `Important`,
        confirmText: 'Yes',
        cancelText: 'No',
        message: `<p>
             Are you sure you want to proceed?
              </p>
              `,
        confirmProgressReport: false
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.validate();
      }
    });
    return dialogRef;
  }

  validate() {
    const messages = [];
    const hasTempRegistration = this.application.activeForm.confirmTempRegistration;

    this.hasTempReg.emit(hasTempRegistration);

    const valid = hasTempRegistration !== undefined && hasTempRegistration !== null;

    if (valid) {
      this.temreg = 'checked';
    }

    if (!valid) {
      messages.push(`You must complete this step to continue`);
    }


    this.validity$.next({ valid, messages, touched: this.touched });
  }

  populateForm() {
  }

}
