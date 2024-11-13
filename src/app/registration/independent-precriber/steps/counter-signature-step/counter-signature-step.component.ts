import { Component, ElementRef, forwardRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IndependentPrescriberService } from '../../../../core/service/independentPrescriber.service';
import { LogService } from '../../../../core/service/log.service';
import { ConfirmDialogComponent } from '../../../../shared/confirmDialog.component';
import { ApplicationStatus } from '../../../../prereg/model/ApplicationStatus';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { IndependentPrescriberApplicationStep } from '../../model/IndependentPrescriberApplicationStep';
import { RegisterSearchBy, RegisterSearchParams, RegisterSearchResult } from '../../../../registration/model/RegisterSearchParams';
import { RegistrationService } from '../../../../core/service/registration.service';
import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-counter-signature-step',
  templateUrl: './counter-signature-step.component.html',
  styleUrls: ['./counter-signature-step.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => CounterSignatureStepComponent)
    }
  ]
})
export class CounterSignatureStepComponent extends FormStepComponent implements OnInit {

  @Input() application;
  title = 'Countersignature';
  stepId = IndependentPrescriberApplicationStep.Countersigning;
  selectedMentor;
  sending = false;
  serverErrors;
  recalling = false;
  waiting = false;
  loadingMore = false;
  user;
  searchedSelf = false;

  @ViewChildren('focus') focus: QueryList<any>;
  @ViewChild('resultsList') resultsListRef: ElementRef;
  searchParams: RegisterSearchParams = new RegisterSearchParams();
  RegisterSearchBy = RegisterSearchBy;
  noResultsVisible = false;
  searching = false;
  showLoadMore = false;
  pharmacists: Array<RegisterSearchResult>;
  selectedPharmacist: RegisterSearchResult;
  prevDisabled = false;

  get awaitingCountersigning() {
    return this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
  }

  get countersigned() {
    return this.application.activeForm.formStatus === ApplicationStatus.CounterSigned;
  }

  get _prevDisabled() {
    return this.application.activeForm.formStatus === ApplicationStatus.CounterSigned ||
      this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
  }
  set _prevDisabled(disabled) { }

  constructor(formStpperService: FormStepperService,
    private dialog: MatDialog,
    private log: LogService,
    private independentPrescriberService: IndependentPrescriberService,
    public regService: RegistrationService,
    private auth: AuthService) { 
    super(formStpperService);
  }

  load() {
    this.serverErrors = undefined;
    this.loadResults();
    if(!this.selectedPharmacist) {
      this.setFocus();
    }
    this.touched = false;
    this.ready$.next(true);    
  }

  loadResults() {
    if (this.application.activeForm.countersignatures &&
      this.application.activeForm.countersignatures[0].registrationNumber &&
      this.application.activeForm.countersignatures[0].registrationNumber !=='') {      
      this.selectedPharmacist = this.application.activeForm.countersignatures[0];
    }
  }

  ngOnInit() {
    this.user = this.auth.user;
    if (this.application.activeForm.formStatus === ApplicationStatus.CounterSigned ||
      this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning) {
      this.prevDisabled = true;
    }
  }

  validate(){
    this.waiting = this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning;
    if (this.application.activeForm.formStatus === ApplicationStatus.ReadyForCountersigning) {
      this.validity$.next({
        valid: false, messages: [`You cannot proceed until your selected prescriber mentor has completed your application.`], touched: this.touched
      });
      return;
    }
    const valid = this.application.activeForm.formStatus === ApplicationStatus.CounterSigned;
    const messages = [];
    if (!valid) {
      messages.push('You cannot proceed until you have selected a prescriber mentor to complete your application');
    }
    this.validity$.next({ valid, messages, touched: this.touched });
  }

  sendForCountersigning() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        confirmText: 'Yes',
        cancelText: 'No',
        title: `Send your request`,
        message: `<p>Are you sure you are ready to send your request to be completed by your selected mentor?</p>`,
        confirmProgressReport: false
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.serverErrors = undefined;
        this.sending = true;
        this.independentPrescriberService.sendToCountersigner(this.selectedPharmacist.registrationNumber).subscribe(() => {
          this.log.info('Send to countersigner response - success');
          this.sending = false;
          this.log.info('Updating form status to ReadyForCountersigning');
          this.application.activeForm.formStatus = ApplicationStatus.ReadyForCountersigning;
          this.log.info('Updating form step validity');
          this.waiting = true;
          this.validity$.next({ valid: false, messages: [], touched: this.touched });
          this.prevDisabled = true;
          setTimeout(() => {
            this.log.info('Locking form');
            this.service.disableAllStepsExcept(IndependentPrescriberApplicationStep.Countersigning);
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
    this.selectedMentor = null;
    this.independentPrescriberService.recallFromCountersigner().subscribe(() => {
      this.recalling = false;
      this.waiting = false;
      this.application.activeForm.formStatus = ApplicationStatus.InProgress;
      this.service.setStepRange(1, IndependentPrescriberApplicationStep.Countersigning);
      this.validity$.next({ valid: false, messages: [], touched: undefined });
      this.prevDisabled = false;
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

  get searchByName() {
    return this.searchParams.searchBy === RegisterSearchBy.Name;
  }
  get searchByNumber() {
    return this.searchParams.searchBy === RegisterSearchBy.Number;
  }

  clearNoResults() {
    this.noResultsVisible = false;
  }

  search() {
    this.searchParams.skip = 0;
    this.searching = true;
    this.searchParams.applicationType = 'IndependentPrescriber';
    this.regService.searchRegister(this.searchParams)
      .subscribe(results => {
        this.pharmacists = results;
        this.searching = false;
        this.showLoadMore = results.length === this.searchParams.take;
        if(this.resultsListRef) {
          this.resultsListRef.nativeElement.scrollTop = 0;
        }
        // below line has to be uncommented if an error message has to be shown if user searches his/her own registration number.
        // this.searchedSelf = (results.length === 1 && results[0].registrationNumber === this.user.registrant?.registrationNumber) ? true : false;        
        this.noResultsVisible = results.length === 0 ? true : (this.searchedSelf ? true : false)
      }, error => {
        this.searching = false;
        this.showLoadMore = false;
      });
  }

  loadMore() {
    this.searchParams.skip += this.searchParams.take;
    this.loadingMore = true;
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
    this.serverErrors = undefined;
    this.touched = false;
    this.validate();
  }

  setSelectedPharmacist(pharmacist: RegisterSearchResult) {
    this.selectedPharmacist = pharmacist;
    this.validate();
  }

  populateForm(){}
}
