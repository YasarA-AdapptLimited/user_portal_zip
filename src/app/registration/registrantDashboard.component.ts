import { Component, OnInit, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { RevalidationService } from '../core/service/revalidation.service';
import { RevalidationLogic } from '../shared/service/revalidation/revalidationLogic.service';
import { RenewalService } from '../core/service/renewal.service';
import { Renewal } from '../renewal/model/Renewal';
import { Registrant } from './model/Registrant';
import { RegistrantStatus } from './model/RegistrantStatus';
import { RegistrantType } from './model/RegistrantType';
import { LogService } from '../core/service/log.service';
import { LayoutService } from '../core/service/layout.service';
import { User } from '../account/model/User';
import { ReturnToRegisterApplication } from './return-to-register/model/ReturnToRegister';
import { CaseSplitPipe } from '../shared/pipe/CaseSplit.pipe';
import { ApplicationStatus } from '../prereg/model/ApplicationStatus';


@Component({
  selector: 'app-registrant-dashboard',
  moduleId: module.id,
  templateUrl: './registrantDashboard.component.html',
  styleUrls: ['../style/dashboard.scss'],
  providers: [
    RevalidationLogic
  ]
})
export class RegistrantDashboardComponent implements OnInit {

  user: User;
  showNoticeOfEntry = false;
  registrant: Registrant;
  name: string;
  loading = false;
  loadingUser = false;
  loadingRenewal = false;
  loadingRevalidation = false;
  renewalError = false;
  revalidationError = false;
  renewal: Renewal;
  RegistrantStatus = RegistrantStatus;
  RegistrantType = RegistrantType;
  isApplicationOpen = true;
  ApplicationStatus = ApplicationStatus;
  application: ReturnToRegisterApplication;
  isApprovedPendingRestorationFee:boolean;
  applicationStatus: ApplicationStatus;
  status:any;
  constructor(private _router: Router, private auth: AuthService,
    private renewalService: RenewalService,
    private revalidationService: RevalidationService,
    public validator: RevalidationLogic,
    private log: LogService, private caseSplit: CaseSplitPipe,
  ) { }

  get isRTR(): boolean {
    // CR-356 : Second condition added to fullfill below all condition(s). RTR app/payment option(if eligible) will be displayed if this function returns false
    // 1. RTR app not available AND any RTR form status except ApprovedPendingRestorationFee, return true -> RTR app not displayed
    // 2. RTR app not available AND any RTR form status is ApprovedPendingRestorationFee, return false -> RTR app displayed (Fix for CR-356,RTR applicant who removal crossed 1 year and eligible for paying restoration fee)
    // 3. RTR app available AND any RTR form status except ApprovedPendingRestorationFee, return false -> RTR app displayed 
    // 4. RTR app available AND any RTR form status is ApprovedPendingRestorationFee, return false -> RTR app displayed 
    return this.auth.user.registrant.isRTRAppAvailable===0 && this.ApplicationStatus[this.registrant.returnToRegisterFormStatus] !='ApprovedPendingRestorationFee';
  }


  ngOnInit() {
    this.load();

    this.status = this.ApplicationStatus[this.registrant.returnToRegisterFormStatus] ?
    this.caseSplit.transform(this.ApplicationStatus[this.registrant.returnToRegisterFormStatus]) :
    this.caseSplit.transform(this.ApplicationStatus[ApplicationStatus.NotStarted]);
  }

  load() {

    this.registrant = this.auth.user.registrant;
    this.user = this.auth.user;
    this.isApprovedPendingRestorationFee = this.registrant.returnToRegisterFormStatus === ApplicationStatus.ApprovedPendingRestorationFee;
    this.renewalService.applicationStatus$.subscribe( status => this.applicationStatus = status);
    this.loadingUser = false;
    if (this.isRTR) {
      this.loadRenewal();
      this.loadRevalidation();
      this.calculateIfNoticeOfEntry(this.registrant.joinedDate);
    }
  }

  get noPendingFee() {
    if(this.applicationStatus) {
      this.status = this.caseSplit.transform(this.ApplicationStatus[this.applicationStatus]);
      return this.applicationStatus !== ApplicationStatus.ApprovedPendingRestorationFee;
    }
    return this.registrant.returnToRegisterFormStatus !== ApplicationStatus.ApprovedPendingRestorationFee;
  }

  loadRenewal() {
    this.loadingRenewal = true;
    this.renewalService.getRenewal()
      .subscribe(renewal => {
        this.renewal = renewal;
        this.loadingRenewal = false;
      }, error => {
        this.loadingRenewal = false;
        this.renewalError = error;
      });
  }

  loadRevalidation() {
    if (this.registrant.exemptFromRevalidationSubmissions) {
      return;
    }
    this.loadingRevalidation = true;
    this.revalidationService.getLatestRevalidation().subscribe(revalidation => {
      this.revalidationService.getEntries(revalidation.id).subscribe(entries => {
        this.validator.load(entries, revalidation.expectations);
        this.loadingRevalidation = false;
      }, error => {
        this.loadingRevalidation = false;
        this.revalidationError = error;
      });
    }, error => {
      this.loadingRevalidation = false;
      this.revalidationError = error;
    });

  }

  loadReturToRegister() {
    return this.isApplicationOpen = this.registrant.isRTRAppAvailable>0;
  }

  get payRestorationFee() : boolean {
    return false;
  }

  get payRestorationAndRenewalFee() : boolean {
    return false;
  }

  calculateIfNoticeOfEntry(joinedDate) {
    // if the user is of registrationType === registered, then do this, for any other status
    // we cannot show notice of entry
    if (this.auth.user.registrationStatus === RegistrantStatus.Registered) {
      const releaseDate = new Date('2018-06-25');
      const joined = new Date(joinedDate.substring(0, this.registrant.joinedDate.length - 9));
      const cutOffDate = this.calcCutOffDate(joined);
      const dateToday = new Date();
      // if joinedDate AFTER release date && date today is !==cutOffDate
      if (joined > releaseDate) {
        if (dateToday !== cutOffDate) {
          this.showNoticeOfEntry = true;
        } else {
          this.showNoticeOfEntry = false;
        }
      }
    }

  }

  calcCutOffDate(joinedDate) {
    let cutOffNoticeOfEntry: any = (joinedDate.getFullYear() + 1)
      + '-' +
      (joinedDate.getMonth() + 1 < 10 ? '0' + (joinedDate.getMonth() + 1) : joinedDate.getMonth())
      + '-' +
      (joinedDate.getDate());
    cutOffNoticeOfEntry = new Date(cutOffNoticeOfEntry);
    return cutOffNoticeOfEntry;
  }



}
