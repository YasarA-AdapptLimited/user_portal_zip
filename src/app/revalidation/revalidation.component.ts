import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RevalidationService } from '../core/service/revalidation.service';
import { RevalidationLogic } from '../shared/service/revalidation/revalidationLogic.service';
import { RevalidationItem } from '../shared/model/revalidation/RevalidationItem';
import { Revalidation } from '../shared/model/revalidation/Revalidation';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { SubmissionPipe } from '../shared/pipe/Submission.pipe';
import { TooltipService } from '../core/tooltip/tooltip.service';
import { Tooltip } from '../core/tooltip/Tooltip';
import { LayoutService } from '../core/service/layout.service';
import { LogService } from '../core/service/log.service';
import { ExtenuatingCircumstanceReviewDecision } from '../shared/model/revalidation/ExtenuatingCircumstanceReviewDecision';
import { AuthService } from '../core/service/auth.service';
import { DatePipe } from '@angular/common';
import { RevalidationStage } from './model/RevalidationStage';
import { MaintenanceMessageService } from '../core/service/maintenanceMessage.service';
import { MatRadioChange } from '@angular/material/radio';
import { RevalidationSubmission } from './service/revalidationSubmission.service';

@Component({
  selector: 'app-revalidation',
  moduleId: module.id,
  templateUrl: './revalidation.component.html',
  styleUrls: ['./revalidation.scss', 'extCirc.scss'],
  providers: [RevalidationLogic]
})
export class RevalidationComponent implements OnInit, OnDestroy {

  revalidationItemTypes = revalidationItemTypes;
  showAcknowledgement = false;
  loading = false;
  failed = false;
  submitting = false;
  pastSubmissions: Array<Revalidation>;
  id: string;
  earliestSubmissionDate: Date;
  submissionDeadline;
  timeToSubmit = true;
  noExcludedItems = false;
  renewalDate;
  title = 'Next submission';
  isCurrentSubmission = true;
  stage;

  ExtCircDecision = ExtenuatingCircumstanceReviewDecision;

  currentSubmissionTooltip: Tooltip;
  currentSubmissionHelpTooltip: Tooltip;
  excludedTooltip: Tooltip;
  submitTooltip: Tooltip;
  progressTooltip: Tooltip;
  progressWarningTooltip: Tooltip;
  pastTooltip: Tooltip;
  pastItemTooltip: Tooltip;
  extCircTooltip: Tooltip;
  progressCompletedTooltip: Tooltip;
  sectionHelpTooltip: Tooltip;
  submittedExtCircTooltip: Tooltip;
  submittedExtCircItemTooltip: Tooltip;
  submittedExceptionalCircumstances = [];

  hideExceptionalCircumstances = false;
  deadline;
  showBanner: number;
  paststage: any;
  stageItems = [];
  nonEditable: any;
  nonEditableItems: any;
  pendingSubmissionTooltip: Tooltip;
  nonEditableSubmissions: any;

  selectSubmission: any;
  isChecked = false;

  selected = false;
  isPendingSubmission;
  isNextSubmission;
  selectedSubmission: any;
  nextRenewalDate;
  radioSelect: any = {};
  deadlineItems: any[];

  constructor (private service: RevalidationService,
    private maintenance: MaintenanceMessageService,
    public validator: RevalidationLogic, private dialog: MatDialog,
    private router: Router, private route: ActivatedRoute, private submissionPipe: SubmissionPipe,
    private tooltipService: TooltipService, private layout: LayoutService,
    private log: LogService, private auth: AuthService, private datePipe: DatePipe,
    private submisionService: RevalidationSubmission
  ) {}

  showSubmissionAcknowledgement() {
    this.layout.setOverlay(true);
    this.showAcknowledgement = true;
  }

  hideSubmissionAcknowledgement() {
    this.layout.setOverlay(false);
    this.showAcknowledgement = false;
  }

  isEditable(pastSubmission) {
    return (!pastSubmission.submitted &&
      pastSubmission.stage !== RevalidationStage.NoR &&
      pastSubmission.stage !== RevalidationStage.NoRIssued);
  }

  toggleTooltips(contextId) {
    this.tooltipService.toggleActiveContext(contextId);
  }

  ngOnInit() {
    this.selectedSubmission = this.submisionService.currentSubmission.subscribe(
      (revalSubmision) => {
        if (revalSubmision === 'static' && revalSubmision !== 'No Submission') {
          this.isNextSubmission = 0;
          this.id = revalSubmision.id;
        this.loadRevalidation();
        } else if (revalSubmision !== 'No Submission') {
          this.isPendingSubmission = 1;
          if (revalSubmision['id']) {
            this.id = revalSubmision['id'];
            this.isCurrentSubmission = false;
          }
         this.loadRevalidation();
        }
      });

    this.currentSubmissionTooltip = {
      id: 'current-submission',
      contextId: 'currentSubmission',
      content: 'Entries listed here are included in your next submission.',
      width: 290,
      placement: 'top',
      order: -1,
      notSolo: true
    };

    this.excludedTooltip = {
      id: 'excluded',
      contextId: 'excluded',
      content: `Entries listed here will not be included in your next submission.<br/>
      You can delete them, decide to include them in your next submission<br/>
       or keep them here and include them in the next submission year.`,
      width: 310,
      placement: 'top',
      order: -1,
      notSolo: true
    };

    this.progressTooltip = {
      id: 'progress',
      contextId: 'progress',
      content: `Entries you want to submit must be marked completed. This shows the total number of entries you have marked completed.`,
      width: 310,
      placement: 'bottom',
      order: 1
    };

    this.sectionHelpTooltip = {
      id: 'progress-help',
      content: 'Click for help to use this section.',
      width: 290,
      placement: 'top',
      order: -1
    };
    this.progressWarningTooltip = {
      id: 'progress-warning',
      contextId: 'progress',
      content: `You have the wrong number of entries in your next submission.
       Please refer to the next submission panel for more details.`,
      width: 310,
      placement: 'bottom',
      order: 1
    };
    this.progressCompletedTooltip = {
      id: 'progress-completed',
      contextId: 'progress',
      content: `You now have the correct number of entries and you are ready to submit.`,
      width: 310,
      placement: 'bottom',
      order: 1
    };
    this.submitTooltip = {
      id: 'submit',
      contextId: 'progress',
      content: `When you are ready, you can submit your entries by clicking the submit button.`,
      width: 310,
      placement: 'bottom',
      order: 2
    };
    this.extCircTooltip = {
      id: 'ext-circ',
      contextId: 'progress',
      content: `If you can't submit the required entries, use this form to tell us why not.`,
      width: 320,
      placement: 'bottom',
      order: 3
    };

    this.pastTooltip = {
      id: 'past',
      contextId: 'past',
      content: `Past and overdue submissions are listed here.`,
      placement: 'top',
      order: 2,
      notSolo: true
    };

    this.pastItemTooltip = {
      id: 'pastItem',
      contextId: 'past',
      content: `Click on each item to view.`,
      placement: 'bottom',
      order: 2
    };

    this.submittedExtCircTooltip = {
      id: 'submittedExtCirc',
      contextId: 'submittedExtCirc',
      content: `Previously submitted requests for exceptional circumstances<br/>are listed here.`,
      placement: 'top',
      width: 310,
      order: 2,
      notSolo: true
    };
    this.submittedExtCircItemTooltip = {
      id: 'submittedExtCircItem',
      contextId: 'submittedExtCirc',
      content: `Click on each item to view.`,
      placement: 'top',
      order: 2,
      notSolo: true
    };

    this.pendingSubmissionTooltip = {
      id: 'pendingSubmissions',
      contextId: 'pendingSubmissions',
      content: `Pending submission are listed here.`,
      placement: 'top',
      order: 1
    };
    this.failed = false;
    this.loading = true;
    this.getRevalidation();
    this.getPastRevalSubmissions();
    this.getExtCirc();

  }

  getRevalidation() {
    this.service.getFormTemplates().subscribe(() => {
      this.loadRevalidation();
    }, error => {
      this.loading = false;
      this.failed = true;
    });
  }

  getPastRevalSubmissions() {
    this.service.getPastSubmissions().subscribe(pastSubmissions => {
      this.pastSubmissions = pastSubmissions;
      this.nonEditableSubmissions = this.pastSubmissions.filter(completedSubmissions => !this.isEditable(completedSubmissions));
      this.nonEditableItems = this.nonEditableSubmissions.splice(item => item.stage === 3);
      if (this.isCurrentSubmission) {
        this.showBanner = this.pastSubmissions.filter(pendingSubmissions => this.isEditable(pendingSubmissions)).length;
        this.paststage = this.pastSubmissions.filter(submission => this.isEditable(submission));
        this.stageItems = this.paststage.splice(item => (item.stage !== 3));
        this.deadlineItems = this.stageItems.filter(item => (item.deadline === null ||
        (new Date() <= new Date(item.deadline.split('T')[0]))));

        if (this.deadlineItems.length > 0) {
          this.maintenance.header = 'You have an outstanding revalidation record to submit';
          this.maintenance.body = `As you are now in remediation you need to select the option “Pending submission” below.
          You can then update this record prior to submitting it.`;
          this.maintenance.open = true;
        }
      } else {
        this.maintenance.open = false;
      }
      if (this.isCurrentSubmission) {
        this.selected = (this.deadlineItems.length) ? true : false;
      }
    });
  }

  getExtCirc() {
    this.service.getExtenuatingCircumstancesList().subscribe(list => {
      this.submittedExceptionalCircumstances = list
        .filter(item => !!item.submittedAt)
        .sort((a, b) => {
          return new Date(a.submittedAt) > new Date(b.submittedAt) ? -1 : 1;
        });
    });
  }

  loadRevalidation() {
    const loadsub = revalidation => {
      this.id = revalidation?.id;
      this.radioSelect[this.id] = true;
      this.renewalDate = revalidation?.renewalDate;
        this.service.getEntries(this.id).subscribe(entries => {
          this.validator.load(entries, revalidation?.expectations);
          this.setNoExcluded();
          this.loading = false;
        }, () => {
          this.loading = false;
          this.failed = true;
        });
      };
    if (this.id) {
      this.service.getPastSubmissions().subscribe(submissions => {
        const revalidation: Revalidation = submissions.filter(s => s.id === this.id)[0];
        this.submissionDeadline = revalidation?.submissionDeadline;

        this.stage = revalidation?.stage;
        if (revalidation?.deadline) {
          this.deadline = new Date(revalidation.deadline.split('T')[0]);
          this.timeToSubmit = new Date() <= this.deadline;
        } else {
          this.timeToSubmit = true;
        }
        this.hideExceptionalCircumstances = !this.timeToSubmit || !revalidation?.allowExceptionalCircumstances;
        this.title = 'Submission for renewal date ' + this.datePipe.transform(revalidation?.expectations.submissionDeadline, 'dd/MM/yyyy');
        revalidation.renewalDate = revalidation?.expectations.submissionDeadline;
        this.isCurrentSubmission = true;
        loadsub(revalidation);
      });
    } else if(this.isCurrentSubmission){
      this.service.get().subscribe(revalidation => {
        if (revalidation.earliestSubmissionDate) {
          this.earliestSubmissionDate = new Date(revalidation.earliestSubmissionDate);
        }
        this.timeToSubmit = this.earliestSubmissionDate && this.earliestSubmissionDate <= new Date();
        this.nextRenewalDate = revalidation.expectations.submissionDeadline;
        this.title = 'Next Submission';
        loadsub(revalidation);
      }, error => {
        this.loading = false;
        this.failed = true;
      });
    }

  }

  getProgressTooltip() {
    if (this.validator.submission.error) {
      return this.progressWarningTooltip;
    }
    if (this.validator.submission.completed) {
      return this.progressCompletedTooltip;
    }
    return this.progressTooltip;
  }

  setNoExcluded() {
    this.noExcludedItems = this.submissionPipe.transform(this.validator.items, false).length === 0;
  }

  itemChanged(item: RevalidationItem) {
    this.service.patch(item, this.id).subscribe(() => { }, error => {

      const log = this.log.error(error);
      this.log.flag(log);
    });
    this.validator.setProgress();
    this.setNoExcluded();
  }

  itemDelete(item: RevalidationItem) {
    const itemType = this.revalidationItemTypes.filter(t => t.type === item.type)[0];
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Delete ${itemType.title}`,
        message: `Are you sure you want to permanently delete '${item.title}'?`
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(item).subscribe(() => {
          item.deleted = true;
          this.setNoExcluded();
        });
      }
    });
  }

  warnForIncomplete() {
    return new Promise<void>((resolve, reject) => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: `Incomplete submission`,
          message: `Your revalidation is not complete. If you
          choose to submit an incomplete revalidation
           you will be putting your continued registration as a pharmacy professional at risk
           unless you take the actions detailed in the "Notice of Intent to remove" letter which can
            be viewed on the registration page of myGPhC. <br/><br/>Are you sure that you wish to continue ?`
        }
      });
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  incompleteItemsPrompt() {
    return new Promise<void>((resolve, reject) => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: `Items not marked completed`,
          message: `You have some items in your submission that are not marked as completed.
          <br/><br/>Do you want to mark them as completed now ?`
        }
      });
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  trySubmit() {
    // require all entries to be marked completed
    const notCompleted = this.validator.getNotCompleted();
    if (notCompleted.length > 0) {
      this.incompleteItemsPrompt().then(() => {
        this.validator.markAllIncludedItemsAsCompleted();
        this.setNoExcluded();
        let savedCount = 0;
        notCompleted.forEach(item => {
          this.service.patch(item, this.id).subscribe(() => {
            savedCount++;
            if (savedCount === notCompleted.length) {
              this.allItemsCompletedSubmit();
            }
          });
        });
      }, () => { });
    } else {
      this.allItemsCompletedSubmit();
    }
  }

  allItemsCompletedSubmit() {
    if (!this.validator.submission.completed) {
      this.warnForIncomplete().then(() => {
        this.showSubmissionAcknowledgement();
      }, () => { });
    } else {
      this.showSubmissionAcknowledgement();
    }
  }

  submit() {
    this.submitting = true;
    this.service.submit(this.id).subscribe(success.bind(this), fail.bind(this));
    function success() {
      this.validator.submission.submitted = true;
      this.layout.setOverlay(false);
      this.showAcknowledgement = false;
      this.submitting = false;
      const isNir = this.stage === RevalidationStage.NoIR;
      if (this.validator.submission.completed || isNir) {
        // no need to show the exceptional circumstances prompt
        if (!this.isCurrentSubmission) {
          this.router.navigate(['/revalidation']);
        }
      } else {
        this.extenuatingCircumstancesPrompt();
      }
    }
    function fail(err) {
      // this.layout.setOverlay(false);
      this.submitting = false;
      this.log.flag(this.log.error(err.validationErrors[0].errors[0]));
    }

  }

  extenuatingCircumstancesPrompt() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Incomplete submission`,
        message: `As you have submitted an incomplete revalidation,
        we strongly recommend that you file for exceptional circumstances.<br/><br/>Proceed to exceptional circumstances?`
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.router.navigate(['/revalidation/exceptional-circumstances']);
      } else if (!this.isCurrentSubmission) {
        this.router.navigate(['/revalidation']);
      }

    });
  }
  exit() {
    this.router.navigate(['/revalidation']);
  }

  onItemChange(item, pathParam) {

    switch (pathParam) {
      case 'dynamic':
        this.radioSelect[item.id] = (item && item.id && this.radioSelect[item.id]) ? false : true;
        this.submisionService.changeSubmissionGroup(item);
        this.isNextSubmission = 1;
        break;
      default:
        this.submisionService.changeSubmissionGroup('static');
        this.isPendingSubmission = 0;
        break;
    }
  }

  ngOnDestroy() {
    if (this.selectSubmission) {
      this.selectedSubmission.unSubscribe();
    }

  }

}
