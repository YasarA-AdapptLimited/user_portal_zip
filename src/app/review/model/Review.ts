import { RevalidationItemType } from '../../shared/model/revalidation/RevalidationItemType';
import { IProgress } from '../../shared/IProgress';
import { CpdEntry } from '../../shared/model/review/CpdEntry';
import { Feedback } from './Feedback';
import { ReviewStage } from './ReviewStage';
import { FeedbackConfirmation } from './FeedbackConfirmation';
import { PerformanceIndicator } from './PerformanceIndicator';
import { Message } from './Message';
import { RegistrantType } from '../../registration/model/RegistrantType';

export class Review  {
  id: string;
  submissionDate: string;
  reviewerConfirmation: FeedbackConfirmation;
  stage: ReviewStage;
  title: string;
  discussionStatus;
  isFeedbackEditable: boolean;
  isLeadReviewer: boolean;
  messages: Array<Message>;
  entries: CpdEntry[];
  feedback: Feedback;
  feedbacks: Array<Feedback> = [];
  currentReviewerAssessment: PerformanceIndicator;
  otherReviewerAssessment: PerformanceIndicator;
  registrantType: RegistrantType;

  constructor(data) {
    Object.assign(this, data);
    if (!this.feedbacks[0]) {
      this.feedback = { };
    } else {
      this.feedback = this.feedbacks[0];
    }

  }
  isCoreCriteriaFeedbackRequired() {
    return +this.feedback.performanceIndicator === +PerformanceIndicator.ReviewNextYear ||
      +this.feedback.performanceIndicator === +PerformanceIndicator.CoreCriteriaNotMet;
  }

  getIsCompleted() {
    return false;
  }

  getTotal() {
    switch (this.stage) {
      case ReviewStage.Annotate:
        // an annotation for each entry
        // currentReviewerAssessment
        return this.entries.length + 1;
      case ReviewStage.WriteFeedback:
        // a feedback entry for each section
        // final assessment
        return this.isLeadReviewer ? 5 : 0;
    }
  }

  getProgress() {
    switch (this.stage) {
      case ReviewStage.Annotate:
        // an annotation for each entry
        // currentReviewerAssessment
        const annotationCount = this.entries.filter(e => e.currentReviewerAnnotation).length;
        return annotationCount + (this.currentReviewerAssessment !== PerformanceIndicator.Unknown ? 1 : 0);
      case ReviewStage.WriteFeedback:

        if (!this.isLeadReviewer) { return 0; }
        // a feedback entry for each section
        // final assessment
        let completed = 0;
        if (this.feedback.peerDiscussionFeedback !== undefined &&
          this.feedback.peerDiscussionFeedback.trim() !== '') {
          completed++;
        }
        if (this.feedback.plannedCpdFeedback !== undefined &&
          this.feedback.plannedCpdFeedback.trim() !== '') {
          completed++;
        }
        if (this.feedback.unplannedCpdFeedback !== undefined &&
          this.feedback.unplannedCpdFeedback.trim() !== '') {
          completed++;
        }
        if (this.feedback.reflectiveAccountFeedback !== undefined &&
          this.feedback.reflectiveAccountFeedback.trim() !== '') {
          completed++;
        }
        if (this.feedback.performanceIndicator !== PerformanceIndicator.Unknown) {
          completed++;
        }
        return completed;
    }
    return 0;
  }
}
