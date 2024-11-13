import { ExtenuatingCircumstanceReviewDecision } from './ExtenuatingCircumstanceReviewDecision';
export interface ExtCircListItem {
  decision: ExtenuatingCircumstanceReviewDecision;
  id: string;
  lastDecisionDateOn: string;
  referenceNumber: number;
  renewalDate: string;
  revalidationSubmissionId: string;
  subject: string;
  submittedAt: string;
}
