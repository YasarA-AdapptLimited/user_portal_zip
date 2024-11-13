import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewStage } from './model/ReviewStage';
import { RevalidationItemTypeConfig } from '../shared/model/revalidation/RevalidationItemTypeConfig';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { ReviewService } from '../core/service/review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from '../core/service/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewManagerService } from './reviewManager.service';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { ReviewerRole } from './model/ReviewerRole';
import { FeedbackSectionsComponent } from './feedbackSections.component';

@Component({
  selector: 'app-feedback',
  moduleId: module.id,
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.scss'],
  animations: [
    trigger('slideInOut', [
      state('open', style({
        transform: 'translateX(60px)'
        //  opacity: '1',
        //  display: 'block'
      })),
      state('closed', style({
        transform: 'translateX(-350px)'
        //    opacity: '0',
        //    display: 'none'
      })),
      transition('open => closed', [
        animate('250ms cubic-bezier(0, 0, 0.2, 1)')
      ]),
      transition('closed => open', [
        animate('250ms cubic-bezier(0, 0, 0.2, 1)')
      ]),
    ])]
})
export class FeedbackComponent implements OnInit {
  reviewId: string;
  ReviewStage = ReviewStage;
  ReviewerRole = ReviewerRole;
  RevalidationItemTypeConfig;
  sections: Array<RevalidationItemTypeConfig>;
  revalidationItemTypes = revalidationItemTypes;
  selected: RevalidationItemTypeConfig;
  selectedFeedback;
  selectedIndex = 0;
  helpVisible = false;
  chatVisible = false;
  chatOffset = -400;
  loading = false;
  title = '';
  readonly = false;
  feedbackNotStarted = false;
  rejected = false;
  rejectionReason;

  saving = false;
  submitting = false;
  rejecting = false;
  approving = false;

  panel;

  @ViewChild(FeedbackSectionsComponent) feedbackSections: FeedbackSectionsComponent;


  constructor(private service: ReviewService,
    private route: ActivatedRoute,
    private router: Router,
    public manager: ReviewManagerService,
    private layout: LayoutService,
    private dialog: MatDialog) {
  }

  get review() { return this.manager.review; }
  @ViewChild('rejectionReasonRef') rejectionReasonRef;

  ngOnInit() {
    this.selectedFeedback = this.review.feedback;
  }
  onSelectedSection(section) {
    this.selected = section;
    if (this.selected) {
      if (section.isFeedback) {
        this.manager.items = this.review.entries.filter(entry => entry.type === section.type);
        this.selectedIndex = 0;
      } else {
        this.manager.items =  this.review.entries;
      }
    } else {
      this.manager.items =  this.review.entries;
    }

  }

  togglePanel(panel) {
    if (this.panel === panel) {
      this.panel = undefined;
    } else {
      this.panel = panel;
      if (panel === 'reject') {
        setTimeout(() => { this.rejectionReasonRef.nativeElement.focus(); });
      }
    }
  }

  exit() {
    history.back();
   // this.router.navigate(['./review']);
  }

  save() {
    this.saving = true;
    this.service.saveFeedback(this.review.id, this.review.feedback).subscribe(() => {
      this.saving = false;
      this.exit();
    }, () => { this.saving = false; });
  }

  submit() {
    if (this.review.feedback.performanceIndicator === undefined) {
      this.feedbackSections.selectAssessment();
    } else {
      this.submitting = true;
      this.service.submitFeedback(this.review.id, this.review.feedback).subscribe(() => {
        this.submitting = false;
        this.exit();
      }, () => { this.submitting = false; });
    }

  }

  approve() {
    this.approving = true;
    this.service.submitFeedbackApproval(this.review.id, true,
      this.review.feedback.id).subscribe(() => {
        this.exit();
        this.approving = false;
      }, () => { this.approving = false; });
  }
  reject() {
    this.rejecting = true;
    this.service.submitFeedbackApproval(this.review.id, false,
      this.review.feedback.id, this.rejectionReason).subscribe(() => {
        this.rejecting = false;
        this.exit();
      }, () => { this.rejecting = false; });

  }


}
