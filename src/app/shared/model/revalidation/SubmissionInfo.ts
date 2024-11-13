import { SubmissionExpectations } from './SubmissionExpectations';

export interface SubmissionInfo {
  expectations: SubmissionExpectations;
  submitted: boolean;
  submissionDate: string;
}
