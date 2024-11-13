import {
  Component, forwardRef, ViewChildren, ViewChild, QueryList, ElementRef
} from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { RegistrationService } from '../../../core/service/registration.service';
import { RegisterSearchParams, RegisterSearchBy, RegisterSearchResult } from '../../../registration/model/RegisterSearchParams';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirmDialog.component';
import { ApplicationStatus } from '../../model/ApplicationStatus';
import { CountersignatureResult } from '../../model/CountersignatureResult';
import { CountersignatureOutcome } from '../../model/CountersignatureOutcome';
import { environment } from '../../../../environments/environment.cblocal';
import { LogService } from '../../../core/service/log.service';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { TechnicianService } from '../../../core/service/technician.service';

@Component({
  selector: 'app-countersigning-step',
  templateUrl: './countersigningStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => CountersigningStepComponent)
    }
  ],
  styleUrls: ['./countersigningStep.scss']
})
export class CountersigningStepComponent extends FormStepComponent {

  showHelp = false;
  stepId = TechnicianApplicationStep.Countersigning;
  title = 'Countersignature';
  searchParams: RegisterSearchParams = new RegisterSearchParams();
  RegisterSearchBy = RegisterSearchBy;
  pharmacists: Array<RegisterSearchResult>;
  selectedPharmacist: RegisterSearchResult;
  searching = false;
  loadingMore = false;
  showLoadMore = false;
  noResultsVisible = false;
  sending = false;
  recalling = false;
  sent = false;
  serverErrors;
  lastResult: CountersignatureResult;
  CountersignatureOutcome = CountersignatureOutcome;

  @ViewChildren('focus') focus: QueryList<any>;
  @ViewChild('resultsList') resultsListRef: ElementRef;

  load() {
    this.serverErrors = undefined;
    this.loadResults();
    if (!this.lastResult) {
      this.setFocus();
    }
    this.ready$.next(true);
  }

  get inProgress() {
    return this.application.activeForm.formStatus === ApplicationStatus.InProgress;
  }

  get _prevDisabled() {
    return this.application.activeForm.formStatus === ApplicationStatus.CounterSigned ||
      this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
  }
  set _prevDisabled(disabled) { }

  get showCountersigningResult() {
    return this.inProgress && this.lastResult !== undefined && this.lastResult.decision !== CountersignatureOutcome.Approved &&
      this.lastResult.decision !== CountersignatureOutcome.Unknown &&
      this.lastResult.decision !== CountersignatureOutcome.Pending;
  }
  loadResults() {
    if (this.application.activeForm.countersignatures &&
      this.application.activeForm.countersignatures.length) {
      const countersignatures = this.application.activeForm.countersignatures.sort((a, b) => {
        return new Date(a.decisionMadeAt) < new Date(b.decisionMadeAt) ? 1 : -1;
      });
      this.lastResult = countersignatures[0];
      this.selectedPharmacist = this.lastResult;
    }
  }

  constructor(service: FormStepperService, private technicianService: TechnicianService,
    public regService: RegistrationService, private dialog: MatDialog, private log: LogService) {
    super(service);
  }

  get _waiting() {
    return this.awaitingCountersigning;
  }

  search() {
    this.searchParams.skip = 0;
    this.searching = true;
    this.searchParams.applicationType = 'IncludePharmacyTechnician';
    this.regService.searchRegister(this.searchParams)
      .subscribe(results => {
        this.pharmacists = results;
        this.searching = false;
        this.showLoadMore = results.length === this.searchParams.take;
        this.resultsListRef.nativeElement.scrollTop = 0;
        this.noResultsVisible = results.length === 0;
      }, error => {
        this.searching = false;
        this.showLoadMore = false;
      });
  }


  clearNoResults() {
    this.noResultsVisible = false;
  }

  loadMore() {
    this.searchParams.skip += this.searchParams.take;
    this.loadingMore = true;
    this.searchParams.applicationType = 'IncludePharmacyTechnician';
    this.regService.searchRegister(this.searchParams)
      .subscribe(results => {
        this.showLoadMore = results.length === this.searchParams.take;
        this.pharmacists = this.pharmacists.concat(results);
        this.loadingMore = false;
      }, error => {
        this.loadingMore = false;
      });
  }

  cancelSelection() {
    this.selectedPharmacist = undefined;
    this.touched = false;
    this.validate();
  }

  sendForCountersigning() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        confirmText: 'Yes',
        cancelText: 'No',
        title: `Send for countersigning`,
        message: `<p>Are you sure you are ready to have your application countersigned ?</p>`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.serverErrors = undefined;
        this.sending = true;
        this.technicianService.sendToCountersigner(this.selectedPharmacist.registrationNumber).subscribe(() => {
          this.log.info('Send to countersigner response - success');
          this.lastResult = undefined;
          this.sending = false;
          this.log.info('Updating form status to ReadyForCountersigning');
          this.application.activeForm.formStatus = ApplicationStatus.ReadyForCountersigning;
          this.log.info('Updating form step validity');
          this.validity$.next({ valid: false, messages: [], touched: this.touched });

          setTimeout(() => {
            this.log.info('Locking form');
            this.service.disableAllStepsExcept(TechnicianApplicationStep.Countersigning);
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
    // to be added when we have the recall endpoint
    this.technicianService.recallFromCountersigner().subscribe(() => {
      this.recalling = false;
      this.application.activeForm.formStatus = ApplicationStatus.InProgress;
      this.service.setStepRange(1, TechnicianApplicationStep.Countersigning);
      this.validity$.next({ valid: false, messages: [], touched: false });
    }, error => {

      this.recalling = false;
    });
  }

  get searchByName() {
    return this.searchParams.searchBy === RegisterSearchBy.Name;
  }
  get searchByNumber() {
    return this.searchParams.searchBy === RegisterSearchBy.Number;
  }

  setFocus() {
    setTimeout(function () {
      if (this.focus.first && this.focus.first.nativeElement) {
        this.focus.first.nativeElement.focus();
      }
    }.bind(this), 50);
  }

  setSelectedPharmacist(pharmacist: RegisterSearchResult) {
    this.selectedPharmacist = pharmacist;
    this.validate();
  }

  validate() {
    if (this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning) {
      this.validity$.next({
        valid: false, messages: [`Waiting for a response from your countersigning pharmacist.
      You cannot proceed until your application has been countersigned.`], touched: this.touched
      });
      return;
    }
    const valid = this.application.activeForm.formStatus === ApplicationStatus.CounterSigned;
    const messages = [];
    if (!valid) {
      if (!this.selectedPharmacist) {
        messages.push('You must choose a countersigning pharmacist');
      }
      messages.push('You cannot proceed until your application has been countersigned');
    }

    this.validity$.next({ valid, messages, touched: this.touched });
  }

  get isDirty() {
    return false;
  }

  populateForm() {
  }

  get awaitingCountersigning() {
    return this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
  }

  get countersigned() {
    return this.application.activeForm.formStatus === ApplicationStatus.CounterSigned;
  }

  get showDiagnosticsLink() {
    return environment.target !== 'PROD';
  }
}
