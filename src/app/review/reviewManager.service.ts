import { Injectable } from '@angular/core';
import { ReviewStage } from './model/ReviewStage';
import { Review } from './model/Review';
import { FeedbackConfirmation } from './model/FeedbackConfirmation';
import { PerformanceIndicator } from './model/PerformanceIndicator';
import { BehaviorSubject, Subject } from 'rxjs';
import { DiscussionStatus } from './model/DiscussionStatus';


@Injectable()
export class ReviewManagerService {

  review: Review;
  items = [];
  title;
  stage;
  feedbackRejected;
  feedbackRejectionReason;
  readonly;
  chatAvailable = false;
  chatVisible$ = new BehaviorSubject(false);
  helpVisible$ = new BehaviorSubject(false);
  selectedEntryIndex$ = new BehaviorSubject<number>(0);
  ready$ = new Subject();
  exiting$ = new Subject();
  qa = false;
  currentReviewerCompletedDiscussion;
  otherReviewerCompletedDiscussion;

  checkFeedbackRejected() {
    const review = this.review;
    let rejections = [];
    if (review.feedback.feedbackApprovals) {
      rejections = review.feedback.feedbackApprovals
        .filter(item => item.feedbackReviewDecision === FeedbackConfirmation.Rejected);
    }

    this.feedbackRejected = rejections.length > 0;
    if (this.feedbackRejected) {
      this.feedbackRejectionReason = rejections[rejections.length - 1].feedbackReviewDecisionReason;
    }
  }

  checkDiscussionCompleted() {
    this.currentReviewerCompletedDiscussion = (!this.review.isLeadReviewer &&
      this.review.discussionStatus === DiscussionStatus.PeerReviewerCompleted) ||
      (this.review.isLeadReviewer && this.review.discussionStatus === DiscussionStatus.LeadReviewerCompleted);

    this.otherReviewerCompletedDiscussion = (this.review.isLeadReviewer &&
      this.review.discussionStatus === DiscussionStatus.PeerReviewerCompleted) ||
      (!this.review.isLeadReviewer && this.review.discussionStatus === DiscussionStatus.LeadReviewerCompleted);
  }

  get feedbackIsEmpty() {
    return this.review && Object.keys(this.review.feedback).length === 0;
  }
  get discussionIsEmpty() {
    return this.review && Object.keys(this.review.feedback).length === 0;
  }
  setReview(review: Review) {
    this.ready$.next(false);
    this.review = review;
    this.selectedEntryIndex$.next(0);
    this.checkFeedbackRejected();
    let showHelp = false;
    let showChat = false;
    switch (review.stage) {
      case ReviewStage.Annotate:
        this.title = review.title + ' - Annotate';
        this.chatAvailable = false;
        showHelp = true;
        this.items = this.review.entries.slice(0);
        this.items.push({ assessment: true, title: 'Assessment' });
        break;
      case ReviewStage.Discuss:
        this.chatAvailable = true;
        this.checkDiscussionCompleted();
        this.title = review.title + ' - Discuss';
        this.items = this.review.entries;
        showHelp = this.discussionIsEmpty || this.feedbackRejected;
        showChat = !this.currentReviewerCompletedDiscussion && !this.otherReviewerCompletedDiscussion;
        break;
      case ReviewStage.WriteFeedback:
        this.chatAvailable = true;

        this.items = review.entries;
        if (review.isLeadReviewer) {
          showHelp = this.feedbackIsEmpty || this.feedbackRejected;
          this.title = review.title + ' - Write feedback';
        } else {
          showHelp = true;
          this.title = review.title + ' - Lead reviewer is working on feedback';
          this.readonly = true;
        }
        break;
      case ReviewStage.AwaitingFeedbackApprovalByPeer:
        this.chatAvailable = true;
        showHelp = true;
        this.items = this.review.entries;
        if (review.isLeadReviewer) {
          this.title = review.title + ' - Awaiting feedback approval';
          this.readonly = true;
        } else {
          this.title = review.title + ' - Approve or reject feedback';
        }
        break;
      default:
        this.items = this.review.entries;
        this.qa = true;
        this.title = review.title;
        this.readonly = true;
        showHelp = true;

    }

    this.ready$.next(true);
    if (showHelp) {
      setTimeout(() => { this.helpVisible$.next(true); }, 100);
    }
    if (showChat && !showHelp) {
      setTimeout(() => { this.chatVisible$.next(true); }, 100);
    }

  }


  toggleHelp() {
    if (this.helpVisible$.value) {
      this.closeHelp();
    } else {
      this.openHelp();
    }

  }

  closeHelp() {
    this.helpVisible$.next(false);
    if (this.review && this.review.stage === ReviewStage.Discuss &&
      !this.currentReviewerCompletedDiscussion && !this.otherReviewerCompletedDiscussion) {
      setTimeout(() => { this.chatVisible$.next(true); }, 300);
    }
  }
  openHelp() {
    this.helpVisible$.next(true);
  }

  closeChat() {
    this.chatVisible$.next(false);
  }


  toggleChat() {

    if (!this.chatVisible$.value && this.helpVisible$.value) {
      this.closeHelp();
      setTimeout(() => { this.chatVisible$.next(true); }, 300);
    } else {
      this.chatVisible$.next(!this.chatVisible$.value);
    }

  }

}
