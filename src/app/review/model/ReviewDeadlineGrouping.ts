import { ReviewSummaryItem } from './ReviewSummaryItem';

export interface ReviewDeadlineGrouping {
  deadline: string;
  items: Array<ReviewSummaryItem>;
  counts: Array<{ key: string, count: number, items?: Array<ReviewSummaryItem> }>;
  completed: boolean;
}
