import { Component, OnInit } from '@angular/core';
import { LogService } from './service/log.service';
import { Log } from './model/Log';
import { LogLevel } from './model/LogLevel';
import { DevService } from './service/dev.service';
import { RenewalStatus } from '../renewal/model/RenewalStatus';
import { RenewalService } from './service/renewal.service';
import { AuthService } from './service/auth.service';
import { Renewal } from '../renewal/model/Renewal';
import { RenewalPaymentMethod } from '../renewal/model/RenewalPaymentMethod';
import { environment } from '../../environments/environment';
import { Environment } from '../../environments/model/Environment';
import { ApplicationStatus } from '../prereg/model/ApplicationStatus';

import { PreregService } from './service/prereg.service';

import { UserActivity } from './model/UserActivity';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';

import { AssessmentReportService } from './service/assessmentReport.service';

@Component({
  selector: 'app-diagnostics',
  moduleId: module.id,
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.scss']
})
export class DiagnosticsComponent implements OnInit {

  loading = false;
  error = false;
  updating = false;
  RenewalStatus = RenewalStatus;
  ApplicationStatus = ApplicationStatus;

  RenewalPaymentMethod = RenewalPaymentMethod;
  renewal: Renewal;
  renewalStatus;
  applicationStatus: ApplicationStatus;

  applicationPaid: boolean;
  applicationFormId: string;
  applicationStatusJson;
  assessmentApplicationStatusJson;
  environment: Environment;

  logs: Log[] = [];
  sendingLogs = false;

  constructor(private log: LogService, private dev: DevService,
    private authService: AuthService, private renewalService: RenewalService,
    private preregService: PreregService, private dialog: MatDialog,
    private assessmentReportService: AssessmentReportService) {
    this.environment = environment;
  }

  refreshLogs() {
    this.logs = this.log.logs
      .sort((a, b) => {
        if (a.date < b.date) { return 1; }
        if (a.date > b.date) { return -1; }
        if (a.text < b.text) { return 1; }
        return -1;
      });
  }

  getOs() {
    let OSName = 'Unknown';
    if (navigator.appVersion.indexOf('Win') !== -1) { OSName = 'Windows'; }
    if (navigator.appVersion.indexOf('Mac') !== -1) { OSName = 'MacOS'; }
    if (navigator.appVersion.indexOf('X11') !== -1) { OSName = 'UNIX'; }
    if (navigator.appVersion.indexOf('Linux') !== -1) { OSName = 'Linux'; }
    return OSName;
  }

  getBrowser() {
    try {


      const nVer = navigator.appVersion;
      const nAgt = navigator.userAgent;
      let browserName = navigator.appName;
      let fullVersion = '' + parseFloat(navigator.appVersion);
      let majorVersion = parseInt(navigator.appVersion, 10);
      let nameOffset, verOffset, ix;

      // In Opera, the true version is after 'Opera' or after 'Version'
      if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
        browserName = 'Opera';
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
          fullVersion = nAgt.substring(verOffset + 8);
        }
      } else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
        // In MSIE, the true version is after 'MSIE' in userAgent
        browserName = 'Microsoft Internet Explorer';
        fullVersion = nAgt.substring(verOffset + 5);
      } else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
        // In Chrome, the true version is after 'Chrome'
        browserName = 'Chrome';
        fullVersion = nAgt.substring(verOffset + 7);
      } else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
        // In Safari, the true version is after 'Safari' or after 'Version'
        browserName = 'Safari';
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
          fullVersion = nAgt.substring(verOffset + 8);
        }
      } else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
        // In Firefox, the true version is after 'Firefox'
        browserName = 'Firefox';
        fullVersion = nAgt.substring(verOffset + 8);
      } else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        // In most other browsers, 'name/version' is at the end of userAgent
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() === browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix = fullVersion.indexOf(';')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }
      if ((ix = fullVersion.indexOf(' ')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }
      majorVersion = parseInt('' + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }

      return {
        os: this.getOs(),
        browserName,
        fullVersion,
        majorVersion,
        navigatorAppName: navigator.appName,
        navigatorUserAgent: navigator.userAgent
      };
    } catch (e) {
      this.log.error('Error getting browser details', e);
    }

  }

  sendDiagnostics() {
    this.sendingLogs = true;
    const user = this.authService.user ? this.authService.user.toJson() : undefined;
    const userDetails = { user, msalUserId: this.authService.userId };
    const browserDetails = this.getBrowser();
    this.log.postActivity(UserActivity.Unknown, 'Diagnostics', { userDetails, browserDetails, logs: this.logs }).subscribe(() => {
      this.sendingLogs = false;
      this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          allowCancel: false,
          confirmText: 'OK',
          title: `Diagnostics sent`,
          message: `<p>Diagnostics data has been sent successfully.</p><p>Thank you.</p>`
        }
      });
    }, error => {
      this.sendingLogs = false;
      this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          allowCancel: false,
          confirmText: 'OK',
          title: `Error sending diagnostics`,
          message: `<p>{{ error | json }} </p>`
        }
      });
    });
  }

  ngOnInit() {

    this.refreshLogs();

    if (this.authService.user && this.authService.user.registrant) {
      this.loading = true;
      this.renewalService.getRenewal().subscribe(renewal => {
        this.renewal = renewal;
        if (renewal) {
          this.renewalStatus = renewal.status;
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        this.error = true;
        this.log.error(error.message || error);
        this.refreshLogs();
      });
    }

    if (this.authService.user && this.authService.user.isPrereg) {
      this.getPreregApplication();
    }




  }

  getPreregApplication() {
    this.loading = true;
    this.preregService.getRegApplication(this.authService.user.registrationStatus).subscribe(application => {
      if (application) {
        this.applicationStatus = application.activeForm.formStatus;
        this.applicationPaid = !application.activeForm.requirePayment;
        this.applicationFormId = application.activeForm.id;

        this.getApplicationStatus();
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.error = true;
      this.log.error(error.message || error);
      this.refreshLogs();
    });
  }

  getAssessmentReportApplication() {
    this.loading = true;
    this.assessmentReportService.getAssessmentReportApplication(this.authService.user.registrationStatus).subscribe(application => {
      if (application) {
        this.applicationStatus = application.activeForm.formStatus;
        this.applicationFormId = application.activeForm.id;
        this.getAssessmentApplicationStatus();
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.error = true;
      this.log.error(error.message || error);
      this.refreshLogs();
    });
  }


  getApplicationStatus() {
    this.dev.getApplicationStatus(this.applicationFormId).subscribe(data => {
      this.applicationStatusJson = data;
    });
  }

  getAssessmentApplicationStatus() {
    this.dev.getAssessmentApplicationStatus(this.applicationFormId).subscribe(data => {
      this.applicationStatusJson = data;
    });
  }


  resetRevalidation() {
    this.updating = true;
    this.dev.resetRevalidation()
      .subscribe(success.bind(this), fail.bind(this));

    function success() {
      this.updating = false;
      this.getApplicationStatus();
      this.getAssessmentApplicationStatus();
    }
    function fail() {
      this.updating = false;
    }
  }

  updateRenewalStatus() {
    this.updating = true;
    this.dev.setRenewalStatus(this.renewalStatus)
      .subscribe(success.bind(this), fail.bind(this));

    function success() {
      this.updating = false;
    }
    function fail() {
      this.updating = false;
    }
  }

  updateApplicationStatus() {
    this.updating = true;
    const paymentDate = new Date();
    if (!this.applicationPaid) {
      paymentDate.setMonth(paymentDate.getMonth() - 7);
    }
    const paymentDateString = paymentDate.toISOString();
    this.dev.setApplicationStatus(this.applicationFormId, paymentDateString, this.applicationStatus)
      .subscribe(success.bind(this), fail.bind(this));

    function success() {
      this.updating = false;
      delete this.preregService.regApplication || this.assessmentReportService.assessmentReport;
      this.getPreregApplication();
      this.getAssessmentReportApplication();
    }
    function fail() {
      this.updating = false;
    }
  }

  enableSubmit() {
    this.updating = true;
    this.dev.setRevalidationSubmitDate().subscribe(
      success => {
        this.updating = false;
      },
      failure => console.error('failure')
    );
  }

}
