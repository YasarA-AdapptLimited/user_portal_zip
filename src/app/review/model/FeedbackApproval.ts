import { FeedbackConfirmation } from './FeedbackConfirmation';

export interface FeedbackApproval {
  feedbackReviewDecision: FeedbackConfirmation;
  feedbackReviewDecisionAsString: string;
  feedbackReviewDecisionReason: string;
  feedbackReviewerRole: number
  feedbackReviewerRoleAsString: string;
}
