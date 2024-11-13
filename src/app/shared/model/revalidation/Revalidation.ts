import { SubmissionExpectations } from './SubmissionExpectations';
import { RevalidationItem } from './RevalidationItem';

export interface Revalidation {
  id: string;
  earliestSubmissionDate: string;
  expectations: SubmissionExpectations;
  entries?: Array<RevalidationItem>;
  feedback?: any;
  status?: any;
  submissionDate?: string;
  submitted?: boolean;
  renewalDate;
  remediationStatus: number;
  deadline;
  submissionDeadline; // for past submissions only (current submissions us expectations.submissionDeadline)
  stage;
  hasFeedback: boolean;
  allowExceptionalCircumstances: boolean;
}

