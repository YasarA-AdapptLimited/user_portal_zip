import { RevalidationItemType } from './RevalidationItemType';

export interface RevalidationItemTypeConfig {
  type: RevalidationItemType;
  icon: string;
  title: string;
  max?: number;
  feedbackType: string;
  helpVisible?: boolean;
}
