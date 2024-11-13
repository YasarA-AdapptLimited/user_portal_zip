import { RevalidationItem } from './RevalidationItem';
import { RevalidationItemType } from './RevalidationItemType';
import { IProgress } from '../../../shared/IProgress';
import { SubmissionInfo } from './SubmissionInfo';

export class RevalidationSubmission implements IProgress {
  progress = 0;
  total = 0;
  completed = false;
  invalid = false;
  error = false;
  submitted = false;
  submissionDate: string;
}
