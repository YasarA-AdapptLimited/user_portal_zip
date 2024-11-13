import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../../../core/service/layout.service';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { ApplicationStatus } from '../../../../technician/model/ApplicationStatus';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { VoluntaryRemovalApplicationStep } from '../../model/VoluntaryRemovalApplicationStep';
import { ConfirmDialogComponent } from '../../../../shared/confirmDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormStepperComponent } from '../../../../shared/formStepper/formStepper.component';
import { VoluntaryRemovalDetails } from '../../model/VoluntaryRemovalDetails';
import { VoluntaryRemovalApplication } from '../../model/VoluntaryRemovalApplication';

@Component({
  selector: 'app-vr-application-review-step',
  templateUrl: './vr-application-review-step.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => VrApplicationReviewStepComponent)
    }
  ]
})
export class VrApplicationReviewStepComponent extends FormStepComponent implements OnInit {
  @Input() stepTitle;
  @Input() readonly = false;
  @Input() SIdetails: {
    endDate: string;
    ownerName: string;
    ownerNumber: string;
    startDate: string;
  }

  title = 'Application review';
  stepId = VoluntaryRemovalApplicationStep.Review;
  VoluntaryRemovalApplicationStep = VoluntaryRemovalApplicationStep;
  submitting;
  serverErrors;
  @ViewChild(FormStepperComponent) formStepper;
  application: VoluntaryRemovalApplication;
  voluntaryRemovalDetails: VoluntaryRemovalDetails;
  constructor(formStpperService: FormStepperService, private vrService: VoluntaryRemovalService,
    private router: Router, private layout: LayoutService, private dialog: MatDialog) {
    super(formStpperService);
  }

  @Output() navigate = new EventEmitter<number>();
  ngOnInit(): void {
    this.voluntaryRemovalDetails = this.application.activeForm.voluntaryRemovalDetails;
  }

  validate() {
    let isDateValid = true;
    let messages = [];

    if(this.voluntaryRemovalDetails && this.voluntaryRemovalDetails.dateOfRegistryRemoval) {
      if(new Date(this.voluntaryRemovalDetails.dateOfRegistryRemoval).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)) {
        isDateValid = false;
      }
    }

    if(!isDateValid) {
      messages.push("The date of removal from the register must be greater than today's date, please select a valid date.");
    }

    this.validity$.next({ valid: isDateValid, messages: messages, touched: this.touched });
  }

  populateForm() {}

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }

  load() {
    this.ready$.next(true);
  }

  beforeNext() {
    if (!this.vrService.isPaymentPending) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: false,
        data: {
          title: `Form submission confirmation`,
          confirmText: 'Yes',
          cancelText: 'No',
          message: `<p>
               Are you sure you want to submit voluntary removal application?
                </p>
                `,
          confirmProgressReport: false
        }
      });
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
         this.displayUserInfo();
        }
      });
      return false;
    } else {
      return true;
    }
}

  displayUserInfo() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
          allowCancel: false,
          confirmText: 'OK',
          title: `Form submission confirmation`,
          message: `You will still receive renewal and revalidation reminders until you have left the register.`
        }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
       this.submit();
      }
    });
  }

  submit() {
      const payload = {
        formId: this.application.activeForm.id
      };
      this.submitting = true;
      this.vrService.submitVoluntaryApplicationWithoutDues(payload).subscribe(() => {
        this.application.activeForm.formStatus = ApplicationStatus.Submitted;
        delete this.vrService.application;
        this.layout.setOverlay(false);
        this.router.navigate(['/application']).then(() => {
          window.location.reload();
        });
      }, error => {
        this.layout.setOverlay(false);
        this.serverErrors = error.validationErrors;
        this.submitting = false;
      });
      return false;
    }
}

