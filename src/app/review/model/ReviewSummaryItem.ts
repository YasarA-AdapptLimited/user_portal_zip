import { IProgress } from '../../shared/IProgress';
import { ReviewStage } from './ReviewStage';
import { FeedbackConfirmation } from './FeedbackConfirmation';
import { PerformanceIndicator } from './PerformanceIndicator';

export class ReviewSummaryItem {
  id: string;
  createdAt: string;
  currentGPhCId: string;
  isLead: boolean;
  isBlocking: boolean;
  leadReviewerAssessment: number;
  modifiedAt: string;
  leadReviewerId: string;
  progressPercentage: number;
  reviewDeadline: string;
  reviewerAssessment: number;
  reviewerId: string;
  stage: ReviewStage;
  submissionId: string;
  title: string;

/*
  reviewerConfirmation: FeedbackConfirmation;
  reviewAnnotations;
  reviewMessages;
  cpdReviewFeedback;
*/

  getTotal() {
    return 100;
  }
  getProgress() {
    return this.progressPercentage;
  }
  getIsCompleted() {
    return false;
  }
}
