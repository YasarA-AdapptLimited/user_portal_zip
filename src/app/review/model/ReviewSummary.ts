import { ReviewDeadlineGrouping } from './ReviewDeadlineGrouping';

export interface ReviewSummary {
  headers: Array<string>;
  deadlineGroupings: Array<ReviewDeadlineGrouping>;
}
