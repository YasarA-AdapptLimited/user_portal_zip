import { PerformanceIndicator } from './PerformanceIndicator';
import { FeedbackApproval } from './FeedbackApproval';
export interface Feedback {
  performanceIndicator?: PerformanceIndicator;
  generalComments?: string;
  plannedCpdFeedback?: string;
  unplannedCpdFeedback?: string;
  peerDiscussionFeedback?: string;
  reflectiveAccountFeedback?: string;
  feedbackApprovals?: Array<FeedbackApproval>;
  id?: string;
  createdDate?: string;
}
