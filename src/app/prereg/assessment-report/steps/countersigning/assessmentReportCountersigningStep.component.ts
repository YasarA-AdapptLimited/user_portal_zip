import {
  Component, forwardRef, ViewChildren,
  ViewChild, QueryList, ElementRef, Input, OnInit
} from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirmDialog.component';
import { ApplicationStatus } from '../../../model/ApplicationStatus';
import { CountersignatureResult } from '../../../model/CountersignatureResult';
import { CountersignatureOutcome } from '../../../model/CountersignatureOutcome';
import { LogService } from '../../../../core/service/log.service';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';
import { AssessmentReportService } from '../../../../core/service/assessmentReport.service';
import { AssessmentReport } from '../../models/AssessmentReport';
import { Tooltip } from '../../../../core/tooltip/Tooltip';

@Component({
  selector: 'app-assessment-report-countersigning-step',
  templateUrl: './assessmentReportCountersigningStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => AssessmentReportCountersigningStepComponent)
    }
  ],
  styleUrls: ['./assessmentReportCountersigninStep.scss']
})
export class AssessmentReportCountersigningStepComponent extends FormStepComponent implements OnInit {

  @Input() application: AssessmentReport;
  @Input() options;
  @ViewChildren('focus') focus: QueryList<any>;
  @ViewChild('resultsList') resultsListRef: ElementRef;
  stepId = AssessmentReportStep.Countersigning;
  title = 'Countersignature';
  selectedPharmacist = '';
  findersending = false;
  recalling = false;
  serverErrors;
  CountersignatureOutcome = CountersignatureOutcome;
  showTooltip = false;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  sending = false;

  load() {
    if (this.application.activeForm.formStatus === ApplicationStatus.CounterSigned ||
      this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning) {
      this.prevDisabled = true;
    }
    this.serverErrors = undefined;
    this.ready$.next(true);
  }

  get awaitingCountersigning() {
    return this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
  }

  get countersigned() {
    return this.application.activeForm.formStatus === ApplicationStatus.CounterSigned;
  }

  set _prevDisabled(disabled) { }
  get _prevDisabled() {
    return this.application.activeForm.formStatus === ApplicationStatus.CounterSigned ||
      this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
  }

  constructor(service: FormStepperService,
    private assessmentReportService: AssessmentReportService,
    private dialog: MatDialog, private log: LogService) {
    super(service);
  }

  ngOnInit() {
    this.populateForm();
  }

  sendForCountersigning() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {

      data: {
        confirmText: 'Yes',
        cancelText: 'No',
        title: `Send your progress report`,
        message: `<p>Are you sure you are ready to send your progress report to be completed by your selected designated supervisor?</p>`,
        confirmProgressReport: false
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {

        this.serverErrors = undefined;
        this.sending = true;
        this.assessmentReportService.sendToCountersigner(this.selectedPharmacist).subscribe(() => {
          this.log.info('Send to countersigner response - success');
          this.sending = false;
          this.log.info('Updating form status to ReadyForCountersigning');
          this.application.activeForm.formStatus = ApplicationStatus.ReadyForCountersigning;
          this.log.info('Updating form step validity');
          this.waiting = true;
          this.validity$.next({ valid: false, messages: [], touched: this.touched });
          setTimeout(() => {
            this.log.info('Locking form');
            this.service.disableAllStepsExcept(AssessmentReportStep.Countersigning);
          }, 50);
        }, error => {
          this.log.error('Send to countersigner response - fail', error);
          this.serverErrors = error.validationErrors;
          this.sending = false;
        });
      }

    });
    return false;

  }

  recall() {
    this.recalling = true;
    this.selectedPharmacist = null;
    this.assessmentReportService.recallFromCountersigner().subscribe(() => {
      this.recalling = false;
      this.waiting = false;
      this.application.activeForm.formStatus = ApplicationStatus.InProgress;
      this.service.setStepRange(1, AssessmentReportStep.Countersigning);
      this.validity$.next({ valid: false, messages: [], touched: undefined });
    }, error => {
      this.recalling = false;
    });
  }
  setFocus() {
    setTimeout(function () {
      if (this.focus.first && this.focus.first.nativeElement) {
        this.focus.first.nativeElement.focus();
      }
    }.bind(this), 50);
  }

  validate() {
    this.waiting = this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
    if (this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning) {
      this.validity$.next({
        valid: false, messages: [`You cannot proceed until your selected designated supervisor has completed your progress report.`], touched: this.touched
      });
      return;
    }
    const valid = this.application.activeForm.formStatus === ApplicationStatus.CounterSigned;
    const messages = [];
    if (!valid) {

      messages.push('You cannot proceed until you have selected a designated supervisor to complete your progress report');
    }
    this.validity$.next({ valid, messages, touched: this.touched });
  }


  populateForm() {
    const { countersignatures } = this.application.activeForm;
    if (countersignatures.length) {
      const resultsPending = countersignatures
        .filter(cs => cs.decision === CountersignatureOutcome.Pending);
      const hasResult = countersignatures
        .filter(cs => cs.decision === CountersignatureOutcome.Approved ||
          cs.decision === CountersignatureOutcome.Rejected);

      if (resultsPending.length) {
        this.selectedPharmacist = resultsPending[0].registrationNumber;
        return;
      }

      if (hasResult.length) {
        this.selectedPharmacist = hasResult[0].registrationNumber;
        return;
      }

    }
  }







}
